import { In, Not } from 'typeorm';
import { find, get, map, pick } from 'lodash';
import httpStatusCode from 'http-status-codes';
import FileService from './file.service';
import DataSource from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { FileProviderRequest } from '../utils/constant';
import { Student } from '../database/entity/Student.entity';
import { Achievement } from '../database/entity/Achievement.entity';
import { StudentAchievements } from '../database/entity/StudentAchievements.entity';

type AchievementResponse = {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageUrl: string;
};

type AssignedAchievementResponse = {
  id: string;
  achievementId: string;
  achievementTitle: string;
  achievementDescription: string;
  achievementImageUrl: string;
};

class LevelService {
  private studentRepository: any;
  private achievementRepository: any;
  private studentAchievementsRepository: any;

  constructor() {
    this.studentRepository = DataSource.getRepository(Student);
    this.achievementRepository = DataSource.getRepository(Achievement);
    this.studentAchievementsRepository =
      DataSource.getRepository(StudentAchievements);
  }

  public async achievement(id: string): Promise<AchievementResponse> {
    const result = await this.achievementRepository.findOne({ where: { id } });

    if (!result)
      throwErrorsHttp('Achievement is not found', httpStatusCode.NOT_FOUND);

    return {
      ...pick(result, ['id', 'title', 'description', 'image']),
      imageUrl: `${process.env.APP_URL}/api/file/${result.image}`
    };
  }

  public async achievements(): Promise<AchievementResponse[]> {
    const results = await this.achievementRepository.find();
    return map(results, (result) => ({
      ...pick(result, ['id', 'title', 'description', 'createdAt']),
      imageUrl: `${process.env.APP_URL}/api/file/${result.image}`
    }));
  }

  public async assignedAchievements(
    id: string
  ): Promise<AssignedAchievementResponse[]> {
    const assignedAchievents = await this.studentAchievementsRepository.find({
      where: { student: id },
      relations: ['achievement']
    });

    return map(assignedAchievents, (assignedAchievent) => ({
      id: assignedAchievent.id,
      achievementId: assignedAchievent.achievement.id,
      achievementTitle: assignedAchievent.achievement.title,
      achievementDescription: assignedAchievent.achievement.description,
      achievementImageUrl: `${process.env.APP_URL}/api/file/${assignedAchievent.achievement.image}`,
      achievementCreationDate: assignedAchievent.achievement.createdAt,
      issuedAt: assignedAchievent.createdAt
    }));
  }

  public async create(
    payload: { title: string; description: string },
    file: FileProviderRequest
  ): Promise<AchievementResponse> {
    const imageData = await FileService.create(file);

    const achievement = new Achievement();
    achievement.title = payload.title;
    achievement.description = payload.description;
    achievement.image = imageData.id;

    const result = await this.achievementRepository.save(achievement);
    return {
      ...pick(result, ['id', 'title', 'description']),
      imageUrl: imageData.url
    };
  }

  public async assign(
    id: string,
    achievementIds: string[]
  ): Promise<{ assigned: number; removed: number }> {
    const student = await this.studentRepository.findOne({ where: { id } });

    if (!student)
      throwErrorsHttp('Student is not found', httpStatusCode.NOT_FOUND);

    const achievements = await this.achievementRepository.find({
      where: { id: In(achievementIds) },
      select: { id: true }
    });

    const studentAchievements = await this.studentAchievementsRepository.find({
      where: { student: id }
    });

    const allAchievements = [];
    const newAchievements = [];
    for (let i = 0; i < achievements.length; i += 1) {
      const achievement = get(achievements, `[${i}].id`);
      if (!find(studentAchievements, (el) => el.achievement === achievement)) {
        newAchievements.push({
          student: id,
          achievement
        });
      }
      allAchievements.push(achievement);
    }

    await this.studentAchievementsRepository.delete({
      student: id,
      achievement: Not(In(allAchievements))
    });
    this.studentAchievementsRepository.insert(newAchievements);
    return {
      assigned: newAchievements.length,
      removed: Math.max(0, studentAchievements.length - allAchievements.length)
    };
  }

  public async update(
    id: string,
    payload: { title: string; description: string },
    file?: FileProviderRequest
  ): Promise<AchievementResponse> {
    const achievement = await this.achievement(id);

    if (file) FileService.update(achievement.image, file);

    const filterPayload = pick(payload, ['title', 'description']);
    await this.achievementRepository.update({ id }, filterPayload);

    return { ...achievement, ...filterPayload };
  }

  public async delete(id: string): Promise<boolean> {
    const achievement = await this.achievementRepository.findOne({
      where: { id }
    });
    const assignedAmount = await this.studentAchievementsRepository.find({
      where: { achievement: id }
    });
    if (assignedAmount.length > 0) {
      throwErrorsHttp(
        `Achievement is not allow to be deleted as there are ${assignedAmount.length} student assigned to this achievement`,
        httpStatusCode.BAD_REQUEST
      );
    }
    await this.achievementRepository.delete({ id });
    await FileService.delete(achievement.image);
    return true;
  }
}

export default new LevelService();

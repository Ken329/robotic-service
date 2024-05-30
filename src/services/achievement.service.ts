import { get, map, pick } from 'lodash';
import httpStatusCode from 'http-status-codes';
import FileService from './file.service';
import DataSource from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { FileProviderRequest } from '../utils/constant';
import { Student } from '../database/entity/Student.entity';
import { Achievement } from '../database/entity/Achievement.entity';
import { StudentAchievements } from '../database/entity/StudentAchievements.entity';
import { In } from 'typeorm';

type AchievementResponse = {
  id: string;
  title: string;
  description: string;
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
  private studentRepository;
  private achievementRepository;
  private studentAchievementsRepository;

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
      ...pick(result, ['id', 'title', 'description']),
      imageUrl: `${process.env.APP_URL}/api/file/${result.image}`
    };
  }

  public async achievements(): Promise<AchievementResponse[]> {
    const results = await this.achievementRepository.find();
    return map(results, (result) => ({
      ...pick(result, ['id', 'title', 'description']),
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
      achievementImageUrl: `${process.env.APP_URL}/api/file/${assignedAchievent.achievement.image}`
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
      imageUrl: `${process.env.APP_URL}/api/file/${result.image}`
    };
  }

  public async assign(id: string, achievementIds: string[]): Promise<number> {
    const student = await this.studentRepository.find({ id });

    if (!student)
      throwErrorsHttp('Student is not found', httpStatusCode.NOT_FOUND);

    const achievements = await this.achievementRepository.find({
      where: { id: In(achievementIds) },
      select: { id: true }
    });

    const assignedAchievements = [];
    for (let i = 0; i < achievements.length; i += 1) {
      assignedAchievements.push({
        student: id,
        achievement: get(achievements, `[${i}].id`)
      });
    }

    await this.studentAchievementsRepository.delete({ student: id });
    this.studentAchievementsRepository.insert(assignedAchievements);
    return assignedAchievements.length;
  }

  public async update(
    id: string,
    payload: { title: string; description: string }
  ): Promise<AchievementResponse> {
    const achievement = await this.achievement(id);

    const filterPayload = pick(payload, ['title', 'description']);
    await this.achievementRepository.update({ id }, filterPayload);

    return {
      ...achievement,
      ...filterPayload
    };
  }

  public async delete(id: string): Promise<boolean> {
    const achievement = await this.achievementRepository.findOne({
      where: { id }
    });
    await this.achievementRepository.delete({ id });
    await FileService.delete(achievement.image);
    return true;
  }
}

export default new LevelService();

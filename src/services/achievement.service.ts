import { map, pick } from 'lodash';
import httpStatusCode from 'http-status-codes';
import FileService from './file.service';
import DataSource from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { FileProviderRequest } from '../utils/constant';
import { Achievement } from '../database/entity/Achievement';

type AchievementResponse = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

class LevelService {
  private achievementRepository;

  constructor() {
    this.achievementRepository = DataSource.getRepository(Achievement);
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

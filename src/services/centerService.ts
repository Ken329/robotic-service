import { map, pick } from 'lodash';
import DataSource from '../database/dataSource';
import { Center } from '../database/entity/Center';

type CenterResponse = {
  id: string;
  name: string;
  location: string;
};

class UserService {
  private centerRepository;

  constructor() {
    this.centerRepository = DataSource.getRepository(Center);
  }

  public async center(id?: string): Promise<CenterResponse> {
    if (!id) return null;
    const results = await this.centerRepository.findOne({ where: { id } });
    return results ? pick(results, ['id', 'name', 'location']) : null;
  }

  public async centers(): Promise<CenterResponse[]> {
    const results = await this.centerRepository.find();
    return map(results, (result) => pick(result, ['id', 'name', 'location']));
  }

  public async create(payload: {
    name: string;
    location: string;
  }): Promise<CenterResponse> {
    const center = new Center();
    center.name = payload.name;
    center.location = payload.location;

    return this.centerRepository.save(center);
  }

  public async delete(id: string): Promise<boolean> {
    await this.centerRepository.delete({ id });
    return true;
  }
}

export default new UserService();

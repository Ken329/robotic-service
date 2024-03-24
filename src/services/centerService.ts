import { map, pick } from 'lodash';
import DataSource from '../database/dataSource';
import { CENTER_STATUS } from '../utils/constant';
import { Center } from '../database/entity/Center';

type CenterResponse = {
  id: string;
  name: string;
  location: string;
  status: string;
};

class UserService {
  private centerRepository;

  constructor() {
    this.centerRepository = DataSource.getRepository(Center);
  }

  public async center(id: string): Promise<CenterResponse> {
    const results = await this.centerRepository.findOne({ where: { id } });
    return pick(results, ['id', 'name', 'status', 'location']);
  }

  public async centers(query: { status?: string }): Promise<CenterResponse[]> {
    const filter = query.status ? query : {};
    const results = await this.centerRepository.find({ where: filter });
    return map(results, (result) =>
      pick(result, ['id', 'name', 'status', 'location'])
    );
  }

  public async create(payload: {
    name: string;
    location: string;
    status?: CENTER_STATUS;
  }): Promise<CenterResponse> {
    const center = new Center();
    center.name = payload.name;
    center.location = payload.location;
    center.status = payload.status;

    return this.centerRepository.save(center);
  }
}

export default new UserService();

import { get, map, pick } from 'lodash';
import httpStatusCode from 'http-status-codes';
import DataSource from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { ROLE, USER_STATUS } from '../utils/constant';
import { User } from '../database/entity/User.entity';
import { Center } from '../database/entity/Center.entity';

type CenterResponse = {
  id: string;
  name: string;
  location: string;
};

class UserService {
  private centerRepository;
  private userRepository;

  constructor() {
    this.userRepository = DataSource.getRepository(User);
    this.centerRepository = DataSource.getRepository(Center);
  }

  public async center(id?: string): Promise<CenterResponse> {
    if (!id) return null;
    const results = await this.centerRepository.findOne({ where: { id } });
    return results ? pick(results, ['id', 'name', 'location']) : null;
  }

  public async centers(): Promise<CenterResponse[]> {
    const results = await this.centerRepository.find({
      where: { user: { status: USER_STATUS.APPROVED } },
      relations: ['user']
    });
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
    const users = await this.userRepository.findAndCount({
      where: { center: id, role: ROLE.STUDENT }
    });
    const userAmount = get(users, 1);
    if (userAmount > 0) {
      throwErrorsHttp(
        `Center is not allow to be deleted as there are ${userAmount} student assigned to this center`,
        httpStatusCode.BAD_REQUEST
      );
    }
    await this.centerRepository.delete({ id });
    return true;
  }
}

export default new UserService();

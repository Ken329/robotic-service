import { get, map, pick } from 'lodash';
import httpStatusCode from 'http-status-codes';
import DataSource from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { Level } from '../database/entity/Level';
import { Student } from '../database/entity/Student';

type LevelResponse = {
  id: string;
  name: string;
};

class LevelService {
  private levelRepository;
  private studentRepository;

  constructor() {
    this.levelRepository = DataSource.getRepository(Level);
    this.studentRepository = DataSource.getRepository(Student);
  }

  public async level(id?: string): Promise<LevelResponse> {
    if (!id) return null;
    const results = await this.levelRepository.findOne({ where: { id } });
    return results ? pick(results, ['id', 'name']) : null;
  }

  public async levels(): Promise<LevelResponse[]> {
    const results = await this.levelRepository.find();
    return map(results, (result) => pick(result, ['id', 'name']));
  }

  public async create(payload: { name: string }): Promise<LevelResponse> {
    const level = new Level();
    level.name = payload.name;

    const result = await this.levelRepository.save(level);
    return pick(result, ['id', 'name']);
  }

  public async delete(id: string): Promise<boolean> {
    const students = await this.studentRepository.findAndCount({
      where: { level: id }
    });
    const studentAmount = get(students, 1);
    if (studentAmount > 0) {
      throwErrorsHttp(
        `Level is not allow to be deleted as there are ${studentAmount} student assigned to this level`,
        httpStatusCode.BAD_REQUEST
      );
    }

    await this.levelRepository.delete({ id });
    return true;
  }
}

export default new LevelService();

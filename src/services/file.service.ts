import { get, pick, map } from 'lodash';
import ExcelJs from 'exceljs';
import httpStatusCode from 'http-status-codes';
import UserService from './user.service';
import DataSource from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { FileProviderRequest, ROLE } from '../utils/constant';
import { File } from '../database/entity/File.entity';
import { Achievement } from '../database/entity/Achievement.entity';

type FileResponse = {
  id?: string;
  name?: string;
  type?: string;
  size?: string;
  file?: string;
  url?: string;
};

class LevelService {
  private fileRepository: any;
  private achievementRepository: any;

  constructor() {
    this.fileRepository = DataSource.getRepository(File);
    this.achievementRepository = DataSource.getRepository(Achievement);
  }

  public async find(
    id: string,
    attributes = ['id', 'name', 'type', 'size', 'file']
  ): Promise<FileResponse> {
    const result = await this.fileRepository.findOne({ where: { id } });

    if (!result) throwErrorsHttp('File is not found', httpStatusCode.NOT_FOUND);

    return pick(result, attributes);
  }

  public async findAll(): Promise<FileResponse[]> {
    const result = await this.fileRepository.find();

    return map(result, (el) => ({
      ...pick(el, ['id', 'name', 'type', 'size']),
      url: `${process.env.APP_URL}/api/file/${el.id}`
    }));
  }

  public async create(payload: FileProviderRequest): Promise<FileResponse> {
    const file = new File();
    file.name = payload.originalname;
    file.type = payload.mimetype;
    file.size = payload.size;
    file.file = Buffer.from(payload.buffer).toString('base64');

    const result = await this.fileRepository.save(file);
    return {
      ...pick(result, ['id', 'name', 'type', 'size']),
      url: `${process.env.APP_URL}/api/file/${result.id}`
    };
  }

  public async update(
    id: string,
    payload: FileProviderRequest
  ): Promise<FileResponse> {
    const updatedFile = {
      name: payload.originalname,
      type: payload.mimetype,
      size: payload.size,
      file: Buffer.from(payload.buffer).toString('base64')
    };

    const result = await this.fileRepository.update({ id }, updatedFile);
    return {
      ...pick(result, ['id', 'name', 'type', 'size']),
      url: `${process.env.APP_URL}/api/file/${result.id}`
    };
  }

  public async delete(id: string): Promise<boolean> {
    const achievement = await this.achievementRepository.findAndCount({
      where: { image: id }
    });
    const achievementAmount = get(achievement, 1);
    if (achievementAmount > 0) {
      throwErrorsHttp(
        `File is not allow to be deleted as there are ${achievementAmount} achievement assigned to this file`,
        httpStatusCode.BAD_REQUEST
      );
    }

    await this.fileRepository.delete({ id });
    return true;
  }

  public async generateExcel(): Promise<any> {
    const workbook = new ExcelJs.Workbook();
    workbook.creator = 'Robotic SteamCup';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 0,
        visibility: 'visible'
      }
    ];

    const worksheet = workbook.addWorksheet('Students');
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 40 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'email', key: 'email', width: 32 },
      { header: 'Robotic ID', key: 'roboticId', width: 32 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Center', key: 'centerName', width: 20 }
    ];

    const { data } = await UserService.users(ROLE.STUDENT, {});

    for (let i = 0; i < data.length; i += 1) {
      worksheet.addRow(
        pick(get(data, i), [
          'id',
          'email',
          'status',
          'name',
          'roboticId',
          'centerName'
        ])
      );
    }

    return workbook.xlsx.writeBuffer();
  }
}

export default new LevelService();

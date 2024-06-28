import { get, pick, map } from 'lodash';
import ExcelJs from 'exceljs';
import httpStatusCode from 'http-status-codes';
import DataSource from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { FileProviderRequest, ROLE } from '../utils/constant';
import { File } from '../database/entity/File.entity';
import { User } from '../database/entity/User.entity';
import { Blog } from '../database/entity/Blog.entity';
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
  private userRepository: any;
  private blogRepository: any;
  private achievementRepository: any;

  constructor() {
    this.fileRepository = DataSource.getRepository(File);
    this.userRepository = DataSource.getRepository(User);
    this.blogRepository = DataSource.getRepository(Blog);
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

    const blog = await this.blogRepository.findAndCount({
      where: { coverImage: id }
    });
    const blogAmount = get(blog, 1);
    if (blogAmount > 0) {
      throwErrorsHttp(
        `File is not allow to be deleted as there are ${blogAmount} blog assigned to this file`,
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
      { header: 'Email', key: 'email', width: 32 },
      { header: 'Level', key: 'level', width: 20 },
      { header: 'Robotic ID', key: 'roboticId', width: 32 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Center', key: 'centerName', width: 20 },
      { header: 'Location', key: 'centerLocation', width: 20 },
      { header: 'Nric', key: 'nric', width: 20 },
      { header: 'Passport', key: 'passport', width: 20 },
      { header: 'Personal Email', key: 'personalEmail', width: 32 },
      { header: 'Contact', key: 'contact', width: 20 },
      { header: 'Size', key: 'size', width: 20 },
      { header: 'Moe Email', key: 'moeEmail', width: 32 },
      { header: 'Gender', key: 'gender', width: 20 },
      { header: 'Date Of Birth', key: 'dob', width: 20 },
      { header: 'Race', key: 'race', width: 20 },
      { header: 'School', key: 'school', width: 20 },
      { header: 'Nationality', key: 'nationality', width: 20 },
      { header: 'Parent Name', key: 'parentName', width: 20 },
      { header: 'Relationship', key: 'relationship', width: 20 },
      { header: 'Parent Email', key: 'parentEmail', width: 32 },
      { header: 'Parent Contact', key: 'parentContact', width: 20 },
      { header: 'Parent Consent', key: 'parentConsent', width: 20 },
      { header: 'Expiry Date', key: 'expiryDate', width: 20 }
    ];

    const users = await this.userRepository.find({
      where: { role: ROLE.STUDENT },
      relations: ['center', 'student', 'student.level']
    });

    const mappedUsers = map(users, (user) => ({
      id: user.id,
      name: get(user, 'student.fullName', null),
      email: user.email,
      status: user.status,
      level: get(user, 'student.level.name', null),
      centerName: get(user, 'center.name', null),
      centerLocation: get(user, 'center.location', null),
      roboticId: get(user, 'student.roboticId', null),
      nric: get(user, 'student.nric', null),
      passport: get(user, 'student.passport', null),
      personalEmail: get(user, 'student.personalEmail', null),
      contact: get(user, 'student.contact', null),
      size: get(user, 'student.size', null),
      moeEmail: get(user, 'student.moeEmail', null),
      gender: get(user, 'student.gender', null),
      dob: get(user, 'student.dob', null),
      race: get(user, 'student.race', null),
      school: get(user, 'student.school', null),
      nationality: get(user, 'student.nationality', null),
      parentName: get(user, 'student.parentName', null),
      relationship: get(user, 'student.relationship', null),
      parentEmail: get(user, 'student.parentEmail', null),
      parentContact: get(user, 'student.parentContact', null),
      parentConsent: get(user, 'student.parentConsent', null),
      expiryDate: get(user, 'student.expiryDate', null)
    }));

    worksheet.addRows(mappedUsers);
    return workbook.xlsx.writeBuffer();
  }
}

export default new LevelService();

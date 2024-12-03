import { get, pick, map, set } from 'lodash';
import ExcelJs from 'exceljs';
import httpStatusCode from 'http-status-codes';
import {
  FileRepository,
  UserRepository,
  BlogRepository,
  AchievementRepository
} from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { FileProviderRequest, ROLE } from '../utils/constant';
import ParticipantService from '../services/participants.service';
import { File } from '../database/entity/File.entity';

type FileResponse = {
  id?: string;
  name?: string;
  type?: string;
  size?: string;
  file?: string;
  url?: string;
};

class FileService {
  private fileRepository: any;
  private userRepository: any;
  private blogRepository: any;
  private achievementRepository: any;

  constructor() {
    this.fileRepository = FileRepository;
    this.userRepository = UserRepository;
    this.blogRepository = BlogRepository;
    this.achievementRepository = AchievementRepository;
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

  public async generateStudentsExcel(userInfo: {
    role?: ROLE;
    centerId?: string;
  }): Promise<any> {
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
      { header: 'Expiry Date', key: 'expiryDate', width: 20 },
      { header: 'Status Updated At', key: 'statusUpdatedAt', width: 20 }
    ];

    const where = { role: ROLE.STUDENT };
    if (userInfo.role === ROLE.CENTER) set(where, 'center', userInfo.centerId);

    const users = await this.userRepository.find({
      where,
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
      expiryDate: get(user, 'student.expiryDate', null),
      statusUpdatedAt: get(user, 'student.statusChangeAt', null)
    }));

    worksheet.addRows(mappedUsers);
    return workbook.xlsx.writeBuffer();
  }

  public async generateCompetitionExcel(id: string): Promise<any> {
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

    const participants = await ParticipantService.findAllById(id);
    if (participants.length < 1)
      throwErrorsHttp('Wrong blog id', httpStatusCode.BAD_REQUEST);

    const worksheet = workbook.addWorksheet(participants[0].title);
    const columns = [
      { header: 'Id', key: 'id', width: 40 },
      { header: 'Student ID', key: 'studentId', width: 40 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'Contact', key: 'contact', width: 32 },
      { header: 'Level', key: 'level', width: 20 },
      { header: 'Center', key: 'center', width: 20 },
      { header: 'Join Date', key: 'createdAt', width: 20 }
    ];
    const attributes = get(participants, '0.attributes', []);
    for (let i = 0; i < attributes.length; i += 1) {
      const category = get(attributes, `${i}.category`);
      columns.push({ header: category, key: category, width: 40 });
    }
    worksheet.columns = columns;

    const mappedUsers = map(participants, (participant) => {
      const attributes = Object.assign(
        {},
        ...map(participant.attributes, (attribute) => {
          return {
            [get(attribute, 'category', 'Category')]: get(
              attribute,
              'value',
              'Value'
            )
          };
        })
      );
      return {
        id: participant.id,
        studentId: participant.studentId,
        email: participant.email,
        contact: participant.contact,
        level: participant.levelName,
        center: participant.centerName,
        createdAt: participant.createdAt,
        ...attributes
      };
    });

    worksheet.addRows(mappedUsers);
    return workbook.xlsx.writeBuffer();
  }
}

export default new FileService();

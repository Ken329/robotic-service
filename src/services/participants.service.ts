import { isEmpty, pick } from 'lodash';
import httpStatusCode from 'http-status-codes';
import BlogService from './blog.service';
import { BLOG_CATEGORY, BLOG_TYPE } from '../utils/constant';
import { throwErrorsHttp } from '../utils/helpers';
import { ParticipantsRepository } from '../database/dataSource';
import { Participants } from '../database/entity/Participants.entity';

type ParticipantsResponse = {
  id: string;
  blogId: string;
  studentId: string;
  attributes?: object;
};

class ParticipantsService {
  private participantsRepository: any;

  constructor() {
    this.participantsRepository = ParticipantsRepository;
  }

  public async find(
    blogId: string,
    studentId: string
  ): Promise<ParticipantsResponse> {
    const result = await this.participantsRepository.findOne({
      where: { blogId, studentId }
    });

    if (!result) return null;

    return {
      ...pick(result, ['id', 'blogId', 'studentId']),
      attributes: JSON.parse(result.attributes)
    };
  }

  public async findAll(studentId: string): Promise<
    {
      id: string;
      title: string;
      category: BLOG_CATEGORY;
      type: BLOG_TYPE;
      description: string;
      assigned: string;
      views: string;
      url: string;
      createdAt: string;
    }[]
  > {
    const result = await this.participantsRepository.find({
      where: { studentId },
      relations: ['blogId']
    });

    return result.map(({ blogId: el }) => ({
      ...pick(el, [
        'id',
        'title',
        'category',
        'type',
        'description',
        'assigned',
        'views'
      ]),
      url: `${process.env.APP_URL}/api/file/${el.coverImage}`,
      createdAt: el.createdAt
    }));
  }

  public async findAllById(
    blogId: String,
    centerId?: String
  ): Promise<
    {
      title: string;
      id: string;
      participantId: string;
      studentId: string;
      fullName: string;
      nric: string;
      passport: string;
      school: string;
      email: string;
      contact: string;
      levelName: string;
      centerName: string;
      createdAt: string;
      attributes: object;
    }[]
  > {
    const where = { blogId };
    const result = await this.participantsRepository.find({
      where,
      relations: ['blogId', 'studentId.level', 'studentId.user.center'],
      select: {
        id: true,
        blogId: {
          title: true
        },
        studentId: {
          id: true,
          nric: true,
          school: true,
          contact: true,
          passport: true,
          fullName: true,
          user: {
            id: true,
            email: true,
            center: {
              id: true,
              name: true
            }
          },
          level: {
            name: true
          }
        },
        attributes: true,
        createdAt: true
      }
    });

    const mappedParticipants = [];
    for (let i = 0; i < result.length; i++) {
      const el = result[i];
      if (isEmpty(centerId) || el.studentId.user.center.id === centerId) {
        mappedParticipants.push({
          participantId: el.id,
          title: el.blogId.title,
          id: el.studentId.user.id,
          studentId: el.studentId.id,
          nric: el.studentId.nric,
          passport: el.studentId.passport,
          school: el.studentId.school,
          contact: el.studentId.contact,
          email: el.studentId.user.email,
          fullName: el.studentId.fullName,
          levelName: el.studentId.level.name,
          centerName: el.studentId.user.center.name,
          attributes: JSON.parse(el.attributes),
          createdAt: el.createdAt
        });
      }
    }
    return mappedParticipants;
  }

  public async create(
    blogId: string,
    studentId: string,
    attributes: object
  ): Promise<ParticipantsResponse> {
    const blog = await BlogService.find(blogId);

    if (blog.category !== BLOG_CATEGORY.COMPETITION) {
      throwErrorsHttp(
        'Only competition blog post are allow to join',
        httpStatusCode.BAD_REQUEST
      );
    }

    const existingResult = await this.find(blogId, studentId);

    if (existingResult) {
      throwErrorsHttp(
        'You have signed up for this competition, please refresh your browser for the updated post',
        httpStatusCode.BAD_REQUEST
      );
    }

    const participants = new Participants();
    participants.blogId = blogId;
    participants.studentId = studentId;
    participants.attributes = JSON.stringify(attributes);

    const result = await this.participantsRepository.save(participants);
    return {
      ...pick(result, ['id', 'blogId', 'studentId']),
      attributes: JSON.parse(result.attributes)
    };
  }

  public async delete(id: string): Promise<Boolean> {
    await this.participantsRepository.delete({ id });
    return true;
  }
}

export default new ParticipantsService();

import { pick } from 'lodash';
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

    return pick(result, ['id', 'blogId', 'studentId']);
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

  public async findAllById(blogId: String): Promise<
    {
      title: string;
      id: string;
      studentId: string;
      email: string;
      contact: string;
      levelName: string;
      centerName: string;
      createdAt: string;
    }[]
  > {
    const result = await this.participantsRepository.find({
      where: { blogId },
      relations: ['blogId', 'studentId.level', 'studentId.user.center'],
      select: {
        blogId: {
          title: true
        },
        studentId: {
          id: true,
          contact: true,
          user: {
            id: true,
            email: true,
            center: {
              name: true
            }
          },
          level: {
            name: true
          }
        },
        createdAt: true
      }
    });

    return result.map(
      (el: {
        blogId: { title: string };
        studentId: {
          id: string;
          contact: string;
          level: { name: string };
          user: { id: string; email: string; center: { name: string } };
        };
        createdAt: string;
      }) => ({
        title: el.blogId.title,
        id: el.studentId.user.id,
        studentId: el.studentId.id,
        contact: el.studentId.contact,
        email: el.studentId.user.email,
        levelName: el.studentId.level.name,
        centerName: el.studentId.user.center.name,
        createdAt: el.createdAt
      })
    );
  }

  public async create(
    blogId: string,
    studentId: string
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

    const result = await this.participantsRepository.save(participants);
    return pick(result, ['id', 'blogId', 'studentId']);
  }
}

export default new ParticipantsService();

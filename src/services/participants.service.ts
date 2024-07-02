import { pick } from 'lodash';
import httpStatusCode from 'http-status-codes';
import BlogService from './blog.service';
import DataSource from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { Participants } from '../database/entity/Participants.entity';
import { BLOG_CATEGORY } from '../utils/constant';

type ParticipantsResponse = {
  id: string;
  blogId: string;
  studentId: string;
};

class ParticipantsService {
  private participantsRepository: any;

  constructor() {
    this.participantsRepository = DataSource.getRepository(Participants);
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

  //   public async findAll(options?: {
  //     role?: ROLE;
  //     levelName?: string;
  //   }): Promise<any[]> {
  //     const result = await this.blogRepository.find();

  //     const mappedResult = map(result, (el) => {
  //       if (
  //         get(options, 'role', null) !== ROLE.STUDENT ||
  //         el.assigned === 'All' ||
  //         el.assigned.includes(
  //           get(options, 'levelName', null).replaceAll(' ', '')
  //         )
  //       ) {
  //         return {
  //           ...pick(el, [
  //             'id',
  //             'title',
  //             'category',
  //             'type',
  //             'description',
  //             'assigned',
  //             'views'
  //           ]),
  //           url: `${process.env.APP_URL}/api/file/${el.coverImage}`,
  //           createdAt: el.createdAt
  //         };
  //       }
  //       return null;
  //     });

  //     return compact(mappedResult);
  //   }

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

  //   public async delete(id: string): Promise<boolean> {
  //     await this.find(id);
  //     await this.blogRepository.delete({ id });
  //     return true;
  //   }
}

export default new ParticipantsService();

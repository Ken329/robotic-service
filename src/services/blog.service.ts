import { get, set, pick, map, compact } from 'lodash';
import httpStatusCode from 'http-status-codes';
import DataSource from '../database/dataSource';
import { throwErrorsHttp } from '../utils/helpers';
import { BLOG_TYPE, BLOG_CATEGORY, ROLE } from '../utils/constant';
import { Blog } from '../database/entity/Blog.entity';

type BlogResponse = {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  assigned: string;
  views: number;
  url: string;
  createdAt: string;
  content?: string;
};

class BlogService {
  private blogRepository: any;

  constructor() {
    this.blogRepository = DataSource.getRepository(Blog);
  }

  public async find(
    id: string,
    options?: { track?: boolean; role?: ROLE; levelName?: string }
  ): Promise<BlogResponse> {
    const result = await this.blogRepository.findOne({ where: { id } });

    if (!result) throwErrorsHttp('Blog is not found', httpStatusCode.NOT_FOUND);

    if (get(options, 'track', false)) {
      const views = (result.views += 1);
      set(result, 'views', views);
    }

    const filteredResult = {
      ...pick(result, [
        'id',
        'title',
        'category',
        'type',
        'description',
        'assigned',
        'content',
        'views',
        'createdAt'
      ]),
      url: `${process.env.APP_URL}/api/file/${result.coverImage}`
    };

    if (
      get(options, 'role', null) !== ROLE.STUDENT ||
      result.assigned === 'All'
    ) {
      this.blogRepository.update(id, { views: result.views });
      return filteredResult;
    }

    if (
      !result.assigned.includes(
        get(options, 'levelName', null).replaceAll(' ', '')
      )
    ) {
      throwErrorsHttp(
        'Blog is not allow to be viewed',
        httpStatusCode.NOT_FOUND
      );
    }

    this.blogRepository.update(id, { views: result.views });
    return filteredResult;
  }

  public async findAll(options?: {
    role?: ROLE;
    levelName?: string;
  }): Promise<any[]> {
    const result = await this.blogRepository.find();

    const mappedResult = map(result, (el) => {
      if (
        get(options, 'role', null) !== ROLE.STUDENT ||
        el.assigned === 'All' ||
        el.assigned.includes(
          get(options, 'levelName', null).replaceAll(' ', '')
        )
      ) {
        return {
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
        };
      }
      return null;
    });

    return compact(mappedResult);
  }

  public async create(payload: {
    title: string;
    category: BLOG_CATEGORY;
    type: BLOG_TYPE;
    description: string;
    assigned: string;
    coverImage: string;
    content: string;
  }): Promise<BlogResponse> {
    const blog = new Blog();
    blog.title = payload.title;
    blog.category = payload.category;
    blog.type = payload.type;
    blog.description = payload.description;
    blog.assigned = payload.assigned.replaceAll(' ', '');
    blog.coverImage = payload.coverImage;
    blog.content = payload.content;

    const result = await this.blogRepository.save(blog);
    return {
      ...pick(result, [
        'id',
        'title',
        'category',
        'type',
        'description',
        'assigned',
        'views'
      ]),
      url: `${process.env.APP_URL}/api/file/${result.coverImage}`,
      createdAt: result.createdAt
    };
  }

  public async update(
    id: string,
    payload: {
      title?: string;
      category?: BLOG_CATEGORY;
      type?: BLOG_TYPE;
      description?: string;
      assigned?: string;
      coverImage?: string;
      content?: string;
      views?: number;
    }
  ): Promise<BlogResponse> {
    const blog = await this.find(id);

    const updatedPayload = pick(payload, [
      'title',
      'category',
      'type',
      'description',
      'assigned',
      'content',
      'coverImage',
      'views',
      'createdAt'
    ]);
    if (updatedPayload.assigned)
      set(
        updatedPayload,
        'assigned',
        updatedPayload.assigned.replaceAll(' ', '')
      );

    await this.blogRepository.update({ id: blog.id }, updatedPayload);

    return {
      ...blog,
      ...updatedPayload
    };
  }

  public async delete(id: string): Promise<boolean> {
    await this.find(id);
    await this.blogRepository.delete({ id });
    return true;
  }
}

export default new BlogService();

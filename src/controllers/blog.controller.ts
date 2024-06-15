import { Request, Response } from 'express';
import { BLOG_CATEGORY, BLOG_TYPE } from '../utils/constant';
import BlogService from '../services/blog.service';
import { successApiResponse, errorApiResponse } from '../utils/helpers';

const type = async (req: Request, res: Response) =>
  successApiResponse(res, 'Successfully get blog types', [
    BLOG_TYPE.NORMAL,
    BLOG_TYPE.PRIORITY
  ]);

const category = async (req: Request, res: Response) =>
  successApiResponse(res, 'Successfully get blog categories', [
    BLOG_CATEGORY.GENERAL,
    BLOG_CATEGORY.EXERCISE,
    BLOG_CATEGORY.COMPETITION
  ]);

const find = async (req: Request, res: Response) =>
  BlogService.find(req.params.id, { ...req.user, track: true })
    .then((data) => successApiResponse(res, 'Successfully get blog', data))
    .catch((error) => errorApiResponse(res, error.message));

const findAll = async (req: Request, res: Response) =>
  BlogService.findAll(req.user)
    .then((data) => successApiResponse(res, 'Successfully get blogs', data))
    .catch((error) => errorApiResponse(res, error.message));

const create = async (req: Request, res: Response) =>
  BlogService.create(req.body)
    .then((data) => successApiResponse(res, 'Successfully create blog', data))
    .catch((error) => errorApiResponse(res, error.message));

const update = async (req: Request, res: Response) =>
  BlogService.update(req.params.id, req.body)
    .then((data) => successApiResponse(res, 'Successfully update blog', data))
    .catch((error) => errorApiResponse(res, error.message));

const remove = async (req: Request, res: Response) =>
  BlogService.delete(req.params.id)
    .then((data) => successApiResponse(res, 'Successfully remove blog', data))
    .catch((error) => errorApiResponse(res, error.message));

export default { type, category, find, findAll, create, update, remove };

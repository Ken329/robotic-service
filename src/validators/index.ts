import { get, map } from 'lodash';
import { z, AnyZodObject } from 'zod';
import httpStatusCode from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import authValidators from './authValidators';
import userValidators from './userValidators';
import levelValidators from './levelValidators';
import achievementValidators from './achievementValidators';
import { errorApiResponse } from '../utils/helpers';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      return next();
    } catch (error) {
      const errors = get(error, 'errors', []);
      const message = map(errors, (error) => {
        let errorPath = error.path.join('.');
        if (errorPath.includes('extNameValidator')) {
          errorPath = 'data.fileType';
        }
        if (errorPath.includes('mimeTypeValidator')) {
          errorPath = 'data.fileMimeType';
        }

        return `${errorPath}: ${error.message}`;
      });
      return errorApiResponse(res, message, httpStatusCode.BAD_REQUEST);
    }
  };

export const fileValidator = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err && err.message === 'File too large') {
    return errorApiResponse(
      res,
      'File is limit to 1MB only',
      httpStatusCode.BAD_REQUEST
    );
  }

  if (err) {
    return errorApiResponse(res, err, httpStatusCode.BAD_REQUEST);
  }

  return next();
};

const paramsId = z.object({
  params: z.object({
    id: z.string({ required_error: 'Id is required' }).uuid('Id is not valid')
  })
});

const paramsStudentId = z.object({
  params: z.object({
    studentId: z
      .string({ required_error: 'Student Id is required' })
      .uuid('Student Id is not valid')
  })
});

export default {
  paramsId,
  paramsStudentId,
  authValidators,
  userValidators,
  levelValidators,
  achievementValidators
};

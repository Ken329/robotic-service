import { get, map } from 'lodash';
import { AnyZodObject } from 'zod';
import httpStatusCode from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import UserValidators from './userValidators';
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
      const message = map(
        errors,
        (error) => `${error.path.join('.')}: ${error.message}`
      );
      return errorApiResponse(
        res,
        message,
        'Validation',
        'Request Validation',
        'Validation Error',
        httpStatusCode.BAD_REQUEST
      );
    }
  };

export default { UserValidators };

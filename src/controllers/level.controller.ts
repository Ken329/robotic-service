import { Request, Response } from 'express';
import LevelService from '../services/Level.service';
import { errorApiResponse, successApiResponse } from '../utils/helpers';

const levels = async (req: Request, res: Response) =>
  LevelService.levels()
    .then((data) => successApiResponse(res, 'Successfully get levels', data))
    .catch((error) => errorApiResponse(res, error.message));

const create = async (req: Request, res: Response) =>
  LevelService.create(req.body)
    .then((data) => successApiResponse(res, 'Successfully create level', data))
    .catch((error) => errorApiResponse(res, error.message));

const remove = async (req: Request, res: Response) =>
  LevelService.delete(req.params.id)
    .then((data) => successApiResponse(res, 'Successfully delete level', data))
    .catch((error) => errorApiResponse(res, error.message));

export default { levels, create, remove };

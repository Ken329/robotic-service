import { Request, Response } from 'express';
import AchievementService from '../services/achievement.service';
import { errorApiResponse, successApiResponse } from '../utils/helpers';

const achievement = async (req: Request, res: Response) =>
  AchievementService.achievement(req.params.id)
    .then((data) =>
      successApiResponse(res, 'Successfully get achievement', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const achievements = async (req: Request, res: Response) =>
  AchievementService.achievements()
    .then((data) =>
      successApiResponse(res, 'Successfully get achievements', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const create = async (req: Request, res: Response) =>
  AchievementService.create(req.body, req.file)
    .then((data) =>
      successApiResponse(res, 'Successfully create achievement', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const remove = async (req: Request, res: Response) =>
  AchievementService.delete(req.params.id)
    .then((data) =>
      successApiResponse(res, 'Successfully delete achievement', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

export default { achievement, achievements, create, remove };

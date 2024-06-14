import { get } from 'lodash';
import { Request, Response } from 'express';
import AchievementService from '../services/achievement.service';
import { errorApiResponse, successApiResponse } from '../utils/helpers';
import { ROLE } from '../utils/constant';

const achievement = async (req: Request, res: Response) =>
  AchievementService.achievement(req.params.id)
    .then((data) =>
      successApiResponse(res, 'Successfully get achievement', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const achievements = async (req: Request, res: Response) =>
  get(req, 'user.role') === ROLE.ADMIN
    ? AchievementService.achievements()
        .then((data) =>
          successApiResponse(res, 'Successfully get achievements', data)
        )
        .catch((error) => errorApiResponse(res, error.message))
    : AchievementService.assignedAchievements(get(req, 'user.studentId'))
        .then((data) =>
          successApiResponse(
            res,
            'Successfully get assigned achievements for student',
            data
          )
        )
        .catch((error) => errorApiResponse(res, error.message));

const assignedAchievements = async (req: Request, res: Response) =>
  AchievementService.assignedAchievements(req.params.studentId)
    .then((data) =>
      successApiResponse(res, 'Successfully get assigned achievements', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const create = async (req: Request, res: Response) =>
  AchievementService.create(req.body, req.file)
    .then((data) =>
      successApiResponse(res, 'Successfully create achievement', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const assign = async (req: Request, res: Response) =>
  AchievementService.assign(req.params.studentId, req.body.achievementIds)
    .then((data) =>
      successApiResponse(
        res,
        `Successfully assign ${data.assigned} achievements and remove ${data.removed} achievements for student`
      )
    )
    .catch((error) => errorApiResponse(res, error.message));

const update = async (req: Request, res: Response) =>
  AchievementService.update(req.params.id, req.body, req.file)
    .then((data) =>
      successApiResponse(res, 'Successfully update achievement', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const remove = async (req: Request, res: Response) =>
  AchievementService.delete(req.params.id)
    .then((data) =>
      successApiResponse(res, 'Successfully delete achievement', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

export default {
  achievement,
  achievements,
  assignedAchievements,
  create,
  assign,
  update,
  remove
};

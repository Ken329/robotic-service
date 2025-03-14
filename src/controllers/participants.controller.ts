import { get } from 'lodash';
import { Request, Response } from 'express';
import ParticipantService from '../services/participants.service';
import { successApiResponse, errorApiResponse } from '../utils/helpers';
import { ROLE } from '../utils/constant';

const find = async (req: Request, res: Response) =>
  ParticipantService.find(req.params.id, get(req, 'user.studentId'))
    .then((data) =>
      successApiResponse(res, 'Successfully get participant', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const findAll = async (req: Request, res: Response) =>
  ParticipantService.findAll(get(req, 'user.studentId'))
    .then((data) =>
      successApiResponse(
        res,
        'Successfully get participanted competition',
        data
      )
    )
    .catch((error) => errorApiResponse(res, error.message));

const findAllById = async (req: Request, res: Response) =>
  ParticipantService.findAllById(req.params.id, get(req, 'user.role') === ROLE.CENTER ? get(req, 'user.centerId') : null)
    .then((data) =>
      successApiResponse(res, 'Successfully get all participants', data)
    )
    .catch((error) => {
      console.log(error.message)
      return errorApiResponse(res, error.message)
    });

const create = async (req: Request, res: Response) =>
  ParticipantService.create(
    req.params.id,
    get(req, 'user.studentId'),
    get(req, 'body.attributes', [])
  )
    .then((data) =>
      successApiResponse(res, 'Successfully join competition', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

export default { find, findAll, findAllById, create };

import { pick } from 'lodash';
import { Request, Response } from 'express';
import { CENTER_STATUS } from '../utils/constant';
import CenterService from '../services/centerService';
import { errorApiResponse, successApiResponse } from '../utils/helpers';

const centers = async (req: Request, res: Response) =>
  CenterService.centers(req.query)
    .then((data) => successApiResponse(res, 'Successfully get centers', data))
    .catch((error) => errorApiResponse(res, error.message));

const createCenter = async (req: Request, res: Response) =>
  CenterService.create({
    ...req.body,
    status: CENTER_STATUS.NOT_ASSIGN
  })
    .then((data) =>
      successApiResponse(
        res,
        'Successfully create center',
        pick(data, ['id', 'name', 'location', 'status'])
      )
    )
    .catch((error) => errorApiResponse(res, error.message));

export default { centers, createCenter };

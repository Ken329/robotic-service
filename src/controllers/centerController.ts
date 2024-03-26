import { pick } from 'lodash';
import { Request, Response } from 'express';
import { CENTER_STATUS } from '../utils/constant';
import CenterService from '../services/centerService';
import { errorApiResponse, successApiResponse } from '../utils/helpers';

const centers = async (req: Request, res: Response) => {
  try {
    const data = await CenterService.centers(req.query);

    return successApiResponse(
      res,
      'Successfully get centers',
      'Center Controller',
      'Centers',
      data
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed to get centers',
      'Center Controller',
      'Centers',
      error.message
    );
  }
};

const createCenter = async (req: Request, res: Response) => {
  try {
    const data = await CenterService.create({
      ...req.body,
      status: CENTER_STATUS.NOT_ASSIGN
    });

    return successApiResponse(
      res,
      'Successfully create center',
      'Center Controller',
      'Create Center',
      pick(data, ['id', 'name', 'location', 'status'])
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed to create center',
      'Center Controller',
      'Create Center',
      error.message
    );
  }
};

export default { centers, createCenter };

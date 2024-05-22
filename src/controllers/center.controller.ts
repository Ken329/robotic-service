import { Request, Response } from 'express';
import CenterService from '../services/center.service';
import { errorApiResponse, successApiResponse } from '../utils/helpers';

const centers = async (req: Request, res: Response) =>
  CenterService.centers()
    .then((data) => successApiResponse(res, 'Successfully get centers', data))
    .catch((error) => errorApiResponse(res, error.message));

export default { centers };

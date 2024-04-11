import { Request, Response } from 'express';
import {
  getPublicKey,
  errorApiResponse,
  successApiResponse
} from '../utils/helpers';

const generatePublicKey = (req: Request, res: Response) => {
  try {
    const publicKey = getPublicKey();
    return successApiResponse(res, 'Successfully generate public key', {
      publicKey
    });
  } catch (error) {
    return errorApiResponse(res, error.message);
  }
};

export default { generatePublicKey };

import { Request, Response } from 'express';
import {
  getPublicKey,
  errorApiResponse,
  successApiResponse
} from '../utils/helpers';
import Service from '../services/authService';

const generatePublicKey = (req: Request, res: Response) => {
  try {
    const publicKey = getPublicKey();
    return successApiResponse(
      res,
      'Successfully generate public key',
      'Auth Controller',
      'Generate Public Key',
      { publicKey }
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed generate public key',
      'Auth Controller',
      'Generate Public Key',
      error.message
    );
  }
};

const verifyUser = async (req: Request, res: Response) => {
  try {
    const data = await Service.verifyUser(req.body.email, req.body.password);
    return successApiResponse(
      res,
      'Successfully verified user',
      'Auth Controller',
      'Verify User',
      data
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed to verify user',
      'Auth Controller',
      'Verify user',
      error.message
    );
  }
};

export default { generatePublicKey, verifyUser };

import { Request, Response } from 'express';
import {
  getPublicKey,
  errorApiResponse,
  successApiResponse
} from '../utils/helpers';
import AuthService from '../services/Auth.service';

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

const generateToken = (req: Request, res: Response) =>
  AuthService.generateToken(req.body.accessToken)
    .then((data) =>
      successApiResponse(res, 'Successfully generate token', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const verifyOtp = async (req: Request, res: Response) =>
  AuthService.verifyOtp(req.body.id, req.body.code)
    .then(() => successApiResponse(res, 'Successfully verify otp'))
    .catch((error) => errorApiResponse(res, error.message));

const refreshToken = (req: Request, res: Response) =>
  AuthService.refreshToken(req.body.refreshToken)
    .then((data) => successApiResponse(res, 'Successfully refresh token', data))
    .catch((error) => errorApiResponse(res, error.message));

const logout = (req: Request, res: Response) =>
  AuthService.logout(req.get('Authorization'))
    .then((data) => successApiResponse(res, 'Successfully logout', data))
    .catch((error) => errorApiResponse(res, error.message));

export default {
  generatePublicKey,
  generateToken,
  verifyOtp,
  refreshToken,
  logout
};

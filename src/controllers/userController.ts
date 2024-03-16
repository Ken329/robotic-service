import { Request, Response } from 'express';
import { errorApiResponse, successApiResponse } from '../utils/helpers';
import Service from '../services/userService';

const signUp = async (req: Request, res: Response) => {
  try {
    const data = await Service.signUp(req.body);

    return successApiResponse(
      res,
      'Successfully signed up',
      'User Controller',
      'Sign Up',
      data
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed to signed up',
      'User Controller',
      'Sign Up',
      error.message
    );
  }
};

export default { signUp };

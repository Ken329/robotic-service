import { pick } from 'lodash';
import { Request, Response } from 'express';
import UserService from '../services/userService';
import AwsCognitoService from '../services/awsCognitoService';
import { errorApiResponse, successApiResponse } from '../utils/helpers';

const user = async (req: Request, res: Response) => {
  try {
    // const data = await AwsCognitoService.getUserAttributes(req.params.email);

    return successApiResponse(
      res,
      'Successfully get user',
      'User Controller',
      'Get user',
      {}
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed to get user',
      'User Controller',
      'Get user',
      error.message
    );
  }
};

const signUp = async (req: Request, res: Response) => {
  try {
    const data = await AwsCognitoService.signUp(
      req.body.email,
      req.body.password
    );

    const user = await UserService.create(data.id, req.body);

    return successApiResponse(
      res,
      'Successfully signed up',
      'User Controller',
      'Sign Up',
      { ...data, ...pick(user, ['status', 'center', 'role']) }
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

const confirmSignUp = async (req: Request, res: Response) => {
  try {
    const data = await AwsCognitoService.confirmedSignUp(
      req.body.email,
      req.body.code
    );

    return successApiResponse(
      res,
      'Successfully confirm signed up',
      'User Controller',
      'Confirm Signed Up',
      data
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed to confirm signed up',
      'User Controller',
      'Confirm Signed Up',
      error.message
    );
  }
};

export default { user, signUp, confirmSignUp };

import { Request, Response } from 'express';
import UserService from '../services/userService';
import { ROLE, USER_STATUS } from '../utils/constant';
import AwsCognitoService from '../services/awsCognitoService';
import { errorApiResponse, successApiResponse } from '../utils/helpers';

const user = async (req: Request, res: Response) =>
  successApiResponse(
    res,
    'Successfully get user',
    'User Controller',
    'Get user',
    req.user
  );

const signUp = async (req: Request, res: Response) => {
  try {
    const user = await UserService.create(req.body.email, req.body.password, {
      ...req.body,
      role: ROLE.STUDENT
    });

    return successApiResponse(
      res,
      'Successfully signed up',
      'User Controller',
      'Sign Up',
      {
        id: user.id,
        email: req.body.email,
        status: user.status,
        center: user.center,
        role: user.role
      }
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

const createCenter = async (req: Request, res: Response) => {
  try {
    const user = await UserService.create(req.body.email, req.body.password, {
      role: ROLE.CENTER,
      status: USER_STATUS.APPROVED,
      center: req.body.center
    });

    return successApiResponse(
      res,
      'Successfully confirm signed up',
      'User Controller',
      'Confirm Signed Up',
      {
        id: user.id,
        email: req.body.email,
        status: user.status,
        center: user.center,
        role: user.role
      }
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

const createAdmin = async (req: Request, res: Response) => {
  try {
    const user = await UserService.create(req.body.email, req.body.password, {
      role: ROLE.ADMIN,
      status: USER_STATUS.APPROVED
    });

    return successApiResponse(
      res,
      'Successfully confirm signed up',
      'User Controller',
      'Confirm Signed Up',
      {
        id: user.id,
        email: req.body.email,
        status: user.status,
        role: user.role
      }
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

export default { user, signUp, createCenter, createAdmin, confirmSignUp };

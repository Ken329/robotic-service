import { Request, Response } from 'express';
import UserService from '../services/userService';
import { ROLE, USER_STATUS } from '../utils/constant';
import AwsCognitoService from '../services/awsCognitoService';
import { errorApiResponse, successApiResponse } from '../utils/helpers';
import { get } from 'lodash';

const user = async (req: Request, res: Response) =>
  successApiResponse(
    res,
    'Successfully get user',
    'User Controller',
    'Get user',
    req.user
  );

const students = async (req: Request, res: Response) => {
  try {
    const students = await UserService.users(req.query);

    return successApiResponse(
      res,
      'Successfully get list of students',
      'User Controller',
      'Students',
      students
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed to get list of students',
      'User Controller',
      'Students',
      error.message
    );
  }
};

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
      'Successfully create center',
      'User Controller',
      'Create center',
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
      'Failed to create center',
      'User Controller',
      'Create center',
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
      'Successfully create admin',
      'User Controller',
      'Create admin',
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
      'Failed to create admin',
      'User Controller',
      'Create admin',
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

const signUpApproval = async (req: Request, res: Response) => {
  try {
    const role = get(req, 'user.role');
    const data = await UserService.approve(req.params.id, role, req.body);

    return successApiResponse(
      res,
      `Successfully approve sign up by ${role}`,
      'User Controller',
      'Sign Up Approval',
      data
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed to approve sign up',
      'User Controller',
      'Sign Up Approval',
      error.message
    );
  }
};

const signUpReject = async (req: Request, res: Response) => {
  try {
    const role = get(req, 'user.role');
    const data = await UserService.reject(req.params.id, role);

    return successApiResponse(
      res,
      `Successfully reject sign up by ${role}`,
      'User Controller',
      'Sign Up Approval',
      data
    );
  } catch (error) {
    return errorApiResponse(
      res,
      'Failed to reject sign up',
      'User Controller',
      'Sign Up Approval',
      error.message
    );
  }
};

export default {
  user,
  students,
  signUp,
  createCenter,
  createAdmin,
  confirmSignUp,
  signUpApproval,
  signUpReject
};

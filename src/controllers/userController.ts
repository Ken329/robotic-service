import { Request, Response } from 'express';
import UserService from '../services/userService';
import { ROLE, USER_STATUS } from '../utils/constant';
import AwsCognitoService from '../services/awsCognitoService';
import { errorApiResponse, successApiResponse } from '../utils/helpers';
import { get } from 'lodash';

const user = async (req: Request, res: Response) =>
  successApiResponse(res, 'Successfully get user', req.user);

const users = async (req: Request, res: Response) =>
  UserService.users(req.query)
    .then((data) =>
      successApiResponse(res, 'Successfully get list of users', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const signUp = async (req: Request, res: Response) =>
  UserService.create(req.body.email, req.body.password, {
    ...req.body,
    role: ROLE.STUDENT
  })
    .then((data) =>
      successApiResponse(res, 'Successfully signed up', {
        id: data.id,
        email: req.body.email,
        status: data.status,
        center: data.center,
        role: data.role
      })
    )
    .catch((error) => {
      return errorApiResponse(res, error.message);
    });

const createCenter = async (req: Request, res: Response) =>
  UserService.create(req.body.email, req.body.password, {
    role: ROLE.CENTER,
    status: USER_STATUS.APPROVED,
    center: req.body.center
  })
    .then((data) =>
      successApiResponse(res, 'Successfully create center', {
        id: data.id,
        email: req.body.email,
        status: data.status,
        center: data.center,
        role: data.role
      })
    )
    .catch((error) => errorApiResponse(res, error.message));

const createAdmin = async (req: Request, res: Response) =>
  UserService.create(req.body.email, req.body.password, {
    role: ROLE.ADMIN,
    status: USER_STATUS.APPROVED
  })
    .then((data) =>
      successApiResponse(res, 'Successfully create admin', {
        id: data.id,
        email: req.body.email,
        status: data.status,
        role: data.role
      })
    )
    .catch((error) => errorApiResponse(res, error.message));

const confirmSignUp = async (req: Request, res: Response) =>
  AwsCognitoService.confirmedSignUp(req.body.email, req.body.code)
    .then((data) =>
      successApiResponse(res, 'Successfully confirm signed up', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const signUpApproval = async (req: Request, res: Response) =>
  UserService.approve(req.params.id, get(req, 'user.role'), req.body)
    .then((data) =>
      successApiResponse(
        res,
        `Successfully approve sign up by ${get(req, 'user.role')}`,
        data
      )
    )
    .catch((error) => errorApiResponse(res, error.message));

const signUpReject = async (req: Request, res: Response) =>
  UserService.reject(req.params.id, get(req, 'user.role'))
    .then((data) =>
      successApiResponse(
        res,
        `Successfully reject sign up by ${get(req, 'user.role')}`,
        data
      )
    )
    .catch((error) => errorApiResponse(res, error.message));

export default {
  user,
  users,
  signUp,
  createCenter,
  createAdmin,
  confirmSignUp,
  signUpApproval,
  signUpReject
};

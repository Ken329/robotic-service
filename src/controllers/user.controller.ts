import { get, pick } from 'lodash';
import { Request, Response } from 'express';
import { ROLE } from '../utils/constant';
import UserService from '../services/user.service';
import CenterService from '../services/center.service';
import { errorApiResponse, successApiResponse } from '../utils/helpers';

const user = async (req: Request, res: Response) =>
  successApiResponse(res, 'Successfully get user', req.user);

const getUser = async (req: Request, res: Response) =>
  UserService.user(req.params.id, pick(req.user, ['centerId']))
    .then((data) => successApiResponse(res, 'Successfully get user info', data))
    .catch((error) => errorApiResponse(res, error.message));

const getStudents = async (req: Request, res: Response) =>
  UserService.users(ROLE.STUDENT, req.query, {
    role: get(req.user, 'role'),
    centerId: get(req.user, 'centerId')
  })
    .then((data) =>
      successApiResponse(res, 'Successfully get list of students', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const getCenters = async (req: Request, res: Response) =>
  UserService.users(ROLE.CENTER, req.query)
    .then((data) =>
      successApiResponse(res, 'Successfully get list of centers', data)
    )
    .catch((error) => errorApiResponse(res, error.message));

const createStudent = async (req: Request, res: Response) =>
  UserService.create(req.body.email, req.body.password, ROLE.STUDENT, req.body)
    .then((data) =>
      successApiResponse(res, 'Successfully signed up', {
        id: data.id,
        role: data.role,
        status: data.status,
        email: req.body.email,
        centerId: data.centerId,
        centerName: data.centerName,
        centerLocation: data.centerLocation
      })
    )
    .catch((error) => {
      return errorApiResponse(res, error.message);
    });

const createCenter = async (req: Request, res: Response) => {
  try {
    const center = await CenterService.create(req.body);
    const data = await UserService.create(
      req.body.email,
      req.body.password,
      ROLE.CENTER,
      {
        center: center.id
      }
    );
    return successApiResponse(res, 'Successfully create center', {
      id: data.id,
      role: data.role,
      status: data.status,
      email: req.body.email,
      centerId: data.centerId,
      centerName: data.centerName,
      centerLocation: data.centerLocation
    });
  } catch (error) {
    return errorApiResponse(res, error.message);
  }
};

const createAdmin = async (req: Request, res: Response) =>
  UserService.create(req.body.email, req.body.password, ROLE.ADMIN)
    .then((data) =>
      successApiResponse(res, 'Successfully create admin', {
        id: data.id,
        email: req.body.email,
        status: data.status,
        role: data.role
      })
    )
    .catch((error) => errorApiResponse(res, error.message));

const signUpApproval = async (req: Request, res: Response) =>
  UserService.approve(req.params.id, req.body, req.user)
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
  getUser,
  getStudents,
  createStudent,
  getCenters,
  createCenter,
  createAdmin,
  signUpApproval,
  signUpReject
};

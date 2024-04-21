import Express, { Application } from 'express';
import Validators, { validate } from '../validators';
import UserController from '../controllers/userController';
import { authenticate, AUTH_STRATEGY } from '../providers/auth.provider';

const route: Application = Express();

route.get(
  '/api/user',
  authenticate([
    AUTH_STRATEGY.STUDENT,
    AUTH_STRATEGY.ADMIN,
    AUTH_STRATEGY.CENTER
  ]),
  UserController.user
);

route.get(
  '/api/user/students',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.UserValidators.getUsers),
  UserController.getStudents
);

route.get(
  '/api/user/centers',
  authenticate([AUTH_STRATEGY.ADMIN]),
  validate(Validators.UserValidators.getUsers),
  UserController.getCenters
);

route.get(
  '/api/user/:id',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.ParamsId),
  UserController.getUser
);

route.post(
  '/api/user/student',
  validate(Validators.UserValidators.studentCreation),
  UserController.createStudent
);

route.post(
  '/api/user/center',
  authenticate(AUTH_STRATEGY.ADMIN),
  validate(Validators.UserValidators.centerCreation),
  UserController.createCenter
);

/**
 * Internal Route For Admin Creation
 */
route.post(
  '/api/user/admin',
  authenticate(AUTH_STRATEGY.APIKEY),
  validate(Validators.UserValidators.adminCreation),
  UserController.createAdmin
);

/**
 * Approval management routes
 */
route.post(
  '/api/user/:id/approve',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.ParamsId),
  validate(Validators.UserValidators.approval),
  UserController.signUpApproval
);

route.post(
  '/api/user/:id/reject',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.ParamsId),
  UserController.signUpReject
);

export default route;

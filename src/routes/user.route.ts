import Express, { Application } from 'express';
import Validators, { validate } from '../validators';
import UserController from '../controllers/userController';
import { authenticate, AUTH_STRATEGY } from '../providers/auth.provider';

const route: Application = Express();

route.get(
  '/api/user',
  authenticate([
    AUTH_STRATEGY.PROSPECT,
    AUTH_STRATEGY.ADMIN,
    AUTH_STRATEGY.CENTER
  ]),
  UserController.user
);

route.post(
  '/api/user/sign-up',
  validate(Validators.UserValidators.signUp),
  UserController.signUp
);

route.post(
  '/api/user/confirm-sign-up',
  validate(Validators.UserValidators.confirmSignUp),
  UserController.confirmSignUp
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

export default route;

import Express, { Application } from 'express';
import { authenticate, AUTH_STRATEGY } from '../providers/auth.provider';
import Validators, { validate } from '../validators';
import UserController from '../controllers/userController';

const route: Application = Express();

route.get(
  '/api/user/:email',
  // validate(Validators.confirmSignUp),
  UserController.user
);

route.post(
  '/api/user/sign-up',
  authenticate(AUTH_STRATEGY.PROSPECT),
  validate(Validators.UserValidators.signUp),
  UserController.signUp
);

route.post(
  '/api/user/confirm-sign-up',
  authenticate(AUTH_STRATEGY.PROSPECT),
  validate(Validators.UserValidators.confirmSignUp),
  UserController.confirmSignUp
);

export default route;

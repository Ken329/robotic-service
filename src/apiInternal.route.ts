import Express, { Application } from 'express';
import Validators, { validate } from './validators';
import UserController from './controllers/user.controller';
import { authenticate, AUTH_STRATEGY } from './providers/auth.provider';

const route: Application = Express();

route.post(
  '/api-internal/user/admin',
  authenticate(AUTH_STRATEGY.APIKEY),
  validate(Validators.userValidators.adminCreation),
  UserController.createAdmin
);

export default route;

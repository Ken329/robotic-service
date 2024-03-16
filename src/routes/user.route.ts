import Express, { Application } from 'express';
import Validators, { validate } from '../validators';
import UserController from '../controllers/userController';

const route: Application = Express();

route.post(
  '/api/user/sign-up',
  validate(Validators.signUp),
  UserController.signUp
);

export default route;

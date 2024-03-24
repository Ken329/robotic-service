import Express, { Application } from 'express';
import Validators, { validate } from '../validators';
import CenterController from '../controllers/centerController';
import { authenticate, AUTH_STRATEGY } from '../providers/auth.provider';

const route: Application = Express();

route.get(
  '/api/center',
  validate(Validators.CenterValidators.getCenters),
  CenterController.centers
);

route.post(
  '/api/center',
  authenticate(AUTH_STRATEGY.ADMIN),
  validate(Validators.CenterValidators.createCenter),
  CenterController.createCenter
);

export default route;

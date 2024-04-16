import Express, { Application } from 'express';
import Validators, { validate } from '../validators';
import AuthController from '../controllers/authController';

const route: Application = Express();

route.get('/api/auth/generate-public-key', AuthController.generatePublicKey);

route.post(
  '/api/auth/verify-otp',
  validate(Validators.AuthValidators.verifyOtp),
  AuthController.verifyOtp
);

export default route;

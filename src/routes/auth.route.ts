import Express, { Application } from 'express';
import Validators, { validate } from '../validators';
import AuthController from '../controllers/authController';

const route: Application = Express();

route.get('/api/auth/generate-public-key', AuthController.generatePublicKey);

route.post(
  '/api/auth/generate-token',
  validate(Validators.AuthValidators.generateToken),
  AuthController.generateToken
);

route.post(
  '/api/auth/verify-otp',
  validate(Validators.AuthValidators.verifyOtp),
  AuthController.verifyOtp
);

route.post(
  '/api/auth/refresh-token',
  validate(Validators.AuthValidators.refreshToken),
  AuthController.refreshToken
);

route.post('/api/auth/logout', AuthController.logout);

export default route;

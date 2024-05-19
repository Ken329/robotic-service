import Express, { Application } from 'express';
import Validators, { validate } from './validators';
import centerController from './controllers/center.controller';
import authController from './controllers/auth.controller';
import userController from './controllers/user.controller';
import { authenticate, AUTH_STRATEGY } from './providers/auth.provider';

const route: Application = Express();

/**
 * Authentication Routes
 */
route.get('/api/auth/generate-public-key', authController.generatePublicKey);

route.post(
  '/api/auth/generate-token',
  validate(Validators.AuthValidators.generateToken),
  authController.generateToken
);

route.post(
  '/api/auth/verify-otp',
  validate(Validators.AuthValidators.verifyOtp),
  authController.verifyOtp
);

route.post(
  '/api/auth/refresh-token',
  validate(Validators.AuthValidators.refreshToken),
  authController.refreshToken
);

route.post('/api/auth/logout', authController.logout);

/**
 * User Routes
 */
route.get(
  '/api/user',
  authenticate([
    AUTH_STRATEGY.STUDENT,
    AUTH_STRATEGY.ADMIN,
    AUTH_STRATEGY.CENTER
  ]),
  userController.user
);

route.get(
  '/api/user/students',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.UserValidators.getUsers),
  userController.getStudents
);

route.get(
  '/api/user/centers',
  authenticate([AUTH_STRATEGY.ADMIN]),
  validate(Validators.UserValidators.getUsers),
  userController.getCenters
);

route.get(
  '/api/user/:id',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.ParamsId),
  userController.getUser
);

route.post(
  '/api/user/student',
  validate(Validators.UserValidators.studentCreation),
  userController.createStudent
);

route.post(
  '/api/user/center',
  authenticate(AUTH_STRATEGY.ADMIN),
  validate(Validators.UserValidators.centerCreation),
  userController.createCenter
);

route.post(
  '/api/user/:id/approve',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.ParamsId),
  validate(Validators.UserValidators.approval),
  userController.signUpApproval
);

route.post(
  '/api/user/:id/reject',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.ParamsId),
  userController.signUpReject
);

/**
 * Center Routes
 */
route.get('/api/center', centerController.centers);

export default route;

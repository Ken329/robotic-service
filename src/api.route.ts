import Express, { Application } from 'express';
import Validators, { validate } from './validators';
import authController from './controllers/auth.controller';
import userController from './controllers/user.controller';
import levelController from './controllers/level.controller';
import centerController from './controllers/center.controller';
import { authenticate, AUTH_STRATEGY } from './providers/auth.provider';

const route: Application = Express();

/**
 * Authentication Routes
 */
route.get('/api/auth/generate-public-key', authController.generatePublicKey);

route.post(
  '/api/auth/generate-token',
  validate(Validators.authValidators.generateToken),
  authController.generateToken
);

route.post(
  '/api/auth/verify-otp',
  validate(Validators.authValidators.verifyOtp),
  authController.verifyOtp
);

route.post(
  '/api/auth/refresh-token',
  validate(Validators.authValidators.refreshToken),
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
  validate(Validators.userValidators.getUsers),
  userController.getStudents
);

route.get(
  '/api/user/centers',
  authenticate([AUTH_STRATEGY.ADMIN]),
  validate(Validators.userValidators.getUsers),
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
  validate(Validators.userValidators.studentCreation),
  userController.createStudent
);

route.put(
  '/api/user/student/:id',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.ParamsId),
  validate(Validators.userValidators.studentUpdate),
  userController.updateStudent
);

route.delete(
  '/api/user/student/:id',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.ParamsId),
  userController.deleteStudent
);

route.post(
  '/api/user/center',
  authenticate(AUTH_STRATEGY.ADMIN),
  validate(Validators.userValidators.centerCreation),
  userController.createCenter
);

route.delete(
  '/api/user/center/:id',
  authenticate(AUTH_STRATEGY.ADMIN),
  validate(Validators.ParamsId),
  userController.deleteCenter
);

route.post(
  '/api/user/:id/approve',
  authenticate([AUTH_STRATEGY.ADMIN, AUTH_STRATEGY.CENTER]),
  validate(Validators.ParamsId),
  validate(Validators.userValidators.studentUpdate),
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

/**
 * Level Routes
 */
route.get('/api/level', levelController.levels);

route.post(
  '/api/level',
  authenticate(AUTH_STRATEGY.ADMIN),
  validate(Validators.levelValidators.create),
  levelController.create
);

route.delete(
  '/api/level/:id',
  authenticate(AUTH_STRATEGY.ADMIN),
  validate(Validators.ParamsId),
  levelController.remove
);

export default route;

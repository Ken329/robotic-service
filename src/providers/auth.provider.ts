import passport from 'passport';
import { isEmpty } from 'lodash';
import passportCustom from 'passport-custom';
import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';
import { throwErrorsHttp } from '../utils/helpers';
import { ROLE, USER_STATUS } from '../utils/constant';

export const AUTH_STRATEGY = {
  APIKEY: 'apiKey',
  STUDENT: 'student',
  ADMIN: 'admin',
  CENTER: 'center',
  APPROVED_STUDENT: 'approved_student'
};

const CustomStrategy = passportCustom.Strategy;

export const authenticate =
  (guard: string | string[]) =>
  (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate(guard, (error: any, user: string) => {
      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      return next();
    })(req, res, next);

const verifyApiKey = async (req: Request, done: any) => {
  const apiKey = req.get('x-api-key');

  if (isEmpty(apiKey) || apiKey !== process.env.APP_KEY)
    return done(null, false);

  req.user = {
    role: ROLE.ADMIN
  };
  return done(null, req.user);
};

const verifyStudent = async (req: Request, done: any) => {
  const token = req.get('Authorization');

  if (isEmpty(token)) return done(null, false);

  try {
    const user = await AuthService.verifyToken(token);

    if (user.role !== ROLE.STUDENT) throwErrorsHttp('Role is not matched');

    req.user = user;
    return done(null, req.user);
  } catch (error) {
    return done(null, false);
  }
};

const verifyApprovedStudent = async (req: Request, done: any) => {
  const token = req.get('Authorization');

  if (isEmpty(token)) return done(null, false);

  try {
    const user = await AuthService.verifyToken(token, {
      status: USER_STATUS.APPROVED
    });

    if (user.role !== ROLE.STUDENT) throwErrorsHttp('Role is not matched');

    req.user = user;
    return done(null, req.user);
  } catch (error) {
    return done(null, false);
  }
};

const verifyCenter = async (req: Request, done: any) => {
  const token = req.get('Authorization');

  if (isEmpty(token)) return done(null, false);

  try {
    const user = await AuthService.verifyToken(token);

    if (user.role !== ROLE.CENTER) throwErrorsHttp('Role is not matched');

    req.user = user;
    return done(null, req.user);
  } catch (error) {
    return done(null, false);
  }
};

const verifyAdmin = async (req: Request, done: any) => {
  const token = req.get('Authorization');

  if (isEmpty(token)) return done(null, false);

  try {
    const user = await AuthService.verifyToken(token);

    if (user.role !== ROLE.ADMIN) throwErrorsHttp('Role is not matched');

    req.user = user;
    return done(null, req.user);
  } catch (error) {
    return done(null, false);
  }
};

const registerPassportPolicies = () => {
  /**
   * Register all the strategy here
   */
  passport.use(AUTH_STRATEGY.APIKEY, new CustomStrategy(verifyApiKey));
  passport.use(AUTH_STRATEGY.STUDENT, new CustomStrategy(verifyStudent));
  passport.use(AUTH_STRATEGY.ADMIN, new CustomStrategy(verifyAdmin));
  passport.use(AUTH_STRATEGY.CENTER, new CustomStrategy(verifyCenter));
  passport.use(
    AUTH_STRATEGY.APPROVED_STUDENT,
    new CustomStrategy(verifyApprovedStudent)
  );

  return passport.initialize();
};

export default { registerPassportPolicies };

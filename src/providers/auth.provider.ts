import passport from 'passport';
import { isEmpty } from 'lodash';
import passportCustom from 'passport-custom';
import { Request, Response, NextFunction } from 'express';
import { ROLE } from '../utils/constant';
import AuthService from '../services/authService';
import UserService from '../services/userService';
import { throwErrorsHttp } from '../utils/helpers';

export const AUTH_STRATEGY = {
  APIKEY: 'apiKey',
  PROSPECT: 'prospect',
  ADMIN: 'admin',
  CENTER: 'center'
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

  if (isEmpty(apiKey) || apiKey !== process.env.API_KEY)
    return done(null, false);

  req.user = {
    role: ROLE.ADMIN
  };
  return done(null, req.user);
};

const verifyProspect = async (req: Request, done: any) => {
  const token = req.get('Authorization');

  if (isEmpty(token)) return done(null, false);

  try {
    const session = await AuthService.verifyUser(token);
    const user = await UserService.user(session.sub);

    if (user.role !== ROLE.STUDENT) throwErrorsHttp('Role is not matched');

    req.user = user;
    return done(null, req.user);
  } catch (error) {
    console.log(error.message);
    return done(null, false);
  }
};

const verifyCenter = async (req: Request, done: any) => {
  const token = req.get('Authorization');

  if (isEmpty(token)) return done(null, false);

  try {
    const session = await AuthService.verifyUser(token);
    const user = await UserService.user(session.sub);

    if (user.role !== ROLE.CENTER) throwErrorsHttp('Role is not matched');

    req.user = user;
    return done(null, req.user);
  } catch (error) {
    console.log(error.message);
    return done(null, false);
  }
};

const verifyAdmin = async (req: Request, done: any) => {
  const token = req.get('Authorization');

  if (isEmpty(token)) return done(null, false);

  try {
    const session = await AuthService.verifyUser(token);
    const user = await UserService.user(session.sub);

    if (user.role !== ROLE.ADMIN) throwErrorsHttp('Role is not matched');

    req.user = user;
    return done(null, req.user);
  } catch (error) {
    console.log(error.message);
    return done(null, false);
  }
};

const registerPassportPolicies = () => {
  /**
   * Register all the strategy here
   */
  passport.use(AUTH_STRATEGY.APIKEY, new CustomStrategy(verifyApiKey));
  passport.use(AUTH_STRATEGY.PROSPECT, new CustomStrategy(verifyProspect));
  passport.use(AUTH_STRATEGY.ADMIN, new CustomStrategy(verifyAdmin));
  passport.use(AUTH_STRATEGY.CENTER, new CustomStrategy(verifyCenter));

  return passport.initialize();
};

export default { registerPassportPolicies };

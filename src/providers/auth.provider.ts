import passport from 'passport';
import passportCustom from 'passport-custom';
import { Request, Response, NextFunction } from 'express';

export const AUTH_STRATEGY = {
  PROSPECT: 'prospect'
};

const CustomStrategy = passportCustom.Strategy;

export const authenticate =
  (guard: string) => (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate(guard, (error: any, user: string) => {
      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      return next();
    })(req, res, next);

const prospect = async (req: Request, done: any) => {
  req.user = {
    id: 'test'
  };

  return done(null, req.user);
};

const registerPassportPolicies = () => {
  passport.use(AUTH_STRATEGY.PROSPECT, new CustomStrategy(prospect));

  return passport.initialize();
};

export default { registerPassportPolicies };

import { Passport } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import { Request } from 'express';
import Settings from '@configs/settings';
import { getConsoleLogger } from '@libs/consoleLogger';
const errorLogger = getConsoleLogger('errorLogging');
errorLogger.addContext('requestType', 'HttpLogging');

const jwtOptionsForUser = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: Settings.jwtSecret,
  passReqToCallback: true,
};

const jwtStrategyForUser = new JwtStrategy(jwtOptionsForUser, async (req: Request, payload: any, next: any) => {
  try {
    req.currentUser = payload;
    const isValidUser = true;
    if (!isValidUser) return next(null, false);
    next(null, payload);
  } catch (error) {
    console.log(error);
  }
});

const userPassport = new Passport();
const optionalUserPassport = new Passport();

userPassport.use(jwtStrategyForUser);
optionalUserPassport.use(jwtStrategyForUser);
optionalUserPassport.use(new AnonymousStrategy());

export {
  userPassport,
  optionalUserPassport,
};

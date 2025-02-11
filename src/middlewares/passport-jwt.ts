import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PassportStatic } from 'passport';
import Settings from '@configs/settings';
import { Request } from 'express';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Settings.jwtSecret,
  passReqToCallback: true, 
};

export default (passport: PassportStatic) => {
  passport.use(
    new Strategy(opts, async (req: Request, payload: any, done: any) => {
      try {
        req.currentUser = payload; 
        return done(null, payload);
      } catch (err) {
        console.error('Error in JWT strategy:', err);
        return done(err, false);
      }
    })
  );
};

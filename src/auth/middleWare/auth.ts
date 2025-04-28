import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import getConfig from '../../common/config/config';

export const jwtStrategy = () => {
  const { SECRET_KEY } = getConfig();
  const option = {
    jwtFromRequest: ExtractJwt.fromHeader('token'),
    secretOrKey: SECRET_KEY,
  };

  passport.use(
    new Strategy(option, (payload, done) => {
      return done(null, payload);
    }),
  );

  return {
    authenticate: () => {
      return passport.authenticate('jwt', { session: false });
    },
  };
};

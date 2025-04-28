import express from 'express';
import passport from 'passport';
import { getCustomLogger } from '../common/utils/Logger';
import { samlCallback } from '../samlStrategy';

const logger = getCustomLogger('samlAuth::routes');

const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  samlCallback
);

router.post('/', passport.authenticate('saml', { failureRedirect: '/login/fail' }), samlCallback);

router.get('/login/fail', (req, res) => {
  res.status(401).send('Login failed');
});


export default router;

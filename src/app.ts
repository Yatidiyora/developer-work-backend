import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import lusca from 'lusca';
import morgan from 'morgan';
import passport from 'passport';
import getConfig from './common/config/config';
import { initAuroraDB } from './common/models/pg';
import { loadSystemConfiguration } from './common/repository/ConfigurationRepository';
import { getCustomLogger } from './common/utils/Logger';
import route from './routes';
import { samlStrategy } from './samlStrategy';

const logger = getCustomLogger('app');

const { SECRET_KEY } = getConfig();

const app = express();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user ?? null);
});

passport.use(samlStrategy);

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(helmet());
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true, // Also enabled by default
  }),
);
app.use((req, res, next) => {
  // eslint-disable-next-line quotes
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  res.setHeader('x-frame-options', 'SAMEORIGIN');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  return next();
});
const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(morgan('combined'));
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', route);
app.get('/restart/eks', () => {
  process.exit(1);
});

app.use(async (req, res, next) => {
  // After successful login, redirect back to the intended page
  res.status(200).end('developer work app is running');
  res.end();
  next();
});

(async () => {
  initAuroraDB();
  await new Promise((resolve) => setTimeout(resolve, 10000));
  loadSystemConfiguration().then(() => {
    try {
      setTimeout(() => {}, 5000);
    } catch (error) {
      logger.info('Error while initializing the application: ', error);
    }
  });
})();

export default app;

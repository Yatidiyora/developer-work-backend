import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import moment from 'moment';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import getConfig from './common/config/config';
import { UserDetailsModel } from './common/models/pg/UserDetailsModel';
import { commonDbExecution } from './common/service/DbService';
import { fetchExistingDataFromTableObject } from './common/types/constants/DbObjectConstants';
import { DB_MODELS, SIGNUP_TYPE } from './common/types/enums/CommonEnums';
import { GetDataResponse } from './common/types/interfaces/CommonDbTypes';
import logger from './common/utils/Logger';
import { addUserMethod } from './lib/users/service/UserService';

const {
  SAML: { CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET },
} = getConfig();

export const samlStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL || '/api/auth/google/callback',
  },
  (_, __, profile, done) => {
    // Save user profile information to the session
    done(null, profile);
  },
);

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  else return res.redirect('/api/login');
};

export const samlCallback = async (
  req: Request & {
    user: {
      displayName: string;
      emails: { value: string; verified: boolean }[];
      photos: { values: string }[];
      name: { familyName: string; givenName: string };
      saml: {
        nameID: string;
      };
    };
  },
  res: Response,
) => {
  // Generate user and jwt token
  try {
    const {
      TOKEN_MAX_AGE_VALUE_IN_HOURS,
      FRONTEND: { AUTH_REDIRECT_URL },
      SECRET_KEY,
      TOKEN_EXPIRATION,
      SIGN_UP_ROLE_ID,
    } = getConfig();
    const { type } = req.query;
    const {
      emails,
      name: { familyName, givenName },
    } = req.user;
    const userName = emails[0].verified && emails[0].value;
    fetchExistingDataFromTableObject.modelName = DB_MODELS.UserDetailsModel;
    fetchExistingDataFromTableObject.requiredWhereFields[0].conditionValue = { email: userName };
    const { dataObject } = (await commonDbExecution(fetchExistingDataFromTableObject)) as GetDataResponse;
    const user = dataObject as UserDetailsModel;
    if (!user && type === SIGNUP_TYPE.SIGN_UP) {
      const userObject = {
        userName: familyName.slice(0, 1) + givenName,
        firstName: givenName,
        lastName: familyName,
        email: userName,
        roleIds: [SIGN_UP_ROLE_ID],
      };
      await addUserMethod(userObject);
    }
    const tokenMaxAge = new Date().getTime() + (TOKEN_MAX_AGE_VALUE_IN_HOURS as unknown as number) * 60 * 60 * 1000;
    const tokenNewMaxAgeDate = moment(tokenMaxAge).utc().toDate();
    if (!user) {
      logger.debug('User details not found  so redirect to fail page');
      return res.redirect('/login/fail');
    } else {
      user.tokenMaxAge = tokenNewMaxAgeDate;
      await user.save();
    }

    const token = jwt.sign({ id: user?.id, userName: user?.userName, email: user?.email }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRATION,
    });

    const relayState = req.body.RelayState || AUTH_REDIRECT_URL;
    const parsedUrl = new URL(relayState);
    const hashedHostname = md5(parsedUrl.hostname);

    res.cookie(`${hashedHostname}_token`, token, {
      maxAge: 3600 * 1000 * Number(TOKEN_MAX_AGE_VALUE_IN_HOURS),
      domain: '',
    });
    if (/localhost/.test(relayState)) {
      res.setHeader('Cache-Control', 'no-cache, no store');
      res.redirect(relayState);
    } else {
      res.setHeader('Cache-Control', 'no-cache, no store');
      res.redirect(relayState);
    }
  } catch (error) {
    logger.error('Error while executing saml callback', error.message || error.stack || error);
    res.redirect('/login/fail');
  }
};

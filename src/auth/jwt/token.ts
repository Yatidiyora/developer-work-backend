import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { validateUser } from '../../auth/middleWare/UserValidator';
import getConfig from '../../common/config/config';
import { STATUS_CODE, STATUS_MESSAGE } from '../../common/types/enums/CommonEnums';
import { localUserDetailsArray } from '../../common/utils/localUserDetails';
import logger from '../../common/utils/Logger';

export const getToken = async (req: Request, res: Response) => {
  const { SECRET_KEY, TOKEN_EXPIRATION, AUTHENTICATION_KEY } = getConfig();
  const api_key = req.header('authorization-key');
  console.log('api_key: ', api_key, 'AUTHENTICATION_KEY: ', AUTHENTICATION_KEY, api_key === AUTHENTICATION_KEY);

  if (api_key === AUTHENTICATION_KEY) {
    const user = await validateUser(req);
    console.log('user: ', user);

    if (user === STATUS_CODE.NOT_FOUND) {
      res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_MESSAGE.USER_NOT_FOUND, status: STATUS_MESSAGE.ERROR });
      return;
    }
    res.status(200).json({
      token: jwt.sign({ id: user.id, userName: user.userName, email: user.email }, SECRET_KEY, {
        expiresIn: TOKEN_EXPIRATION,
      }),
      tokenMaxAge: user.tokenMaxAge,
    });
  } else {
    res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_MESSAGE.UNAUTHORIZED, status: STATUS_MESSAGE.ERROR });
    return;
  }
};

export const getLocalLoginToken = async (req: Request, res: Response) => {
  try {
    const { SECRET_KEY } = getConfig();
    const tokenMaxAge = new Date().getTime() + 24 * 60 * 60 * 1000;
    const tokenNewMaxAgeDate = moment(tokenMaxAge).utc().format();
    if (req.hostname === 'localhost') {
      const { email, password } = req.body;

      const user = localUserDetailsArray.find(
        (user) => user.email === email.toLowerCase() && user.password === password,
      );

      if (!user) {
        res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: STATUS_MESSAGE.USER_NOT_FOUND, status: STATUS_MESSAGE.ERROR });
        return;
      }
      res.status(200).json({
        token: jwt.sign({ id: user.id, userName: user.userName, email: user.email }, SECRET_KEY, {
          expiresIn: '1d',
        }),
        tokenMaxAge: tokenNewMaxAgeDate,
      });
    }
    return;
  } catch (error) {
    logger.error('Failed to fetch local token', error.message || error);
    res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_MESSAGE.UNAUTHORIZED, status: STATUS_MESSAGE.ERROR });
  }
};

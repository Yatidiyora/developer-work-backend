import express from 'express';
import { getLocalLoginToken, getToken } from '../auth/jwt/token';

const router = express.Router();

router.post('/', getToken);
router.post('/local', getLocalLoginToken);

export default router;

import express from 'express';
import User from './user';
import checkToken from '@middlewares/checkTokens';
import { requireAuth } from '@middlewares/authorizations';
const router = express.Router();

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);


router.use('/users', checkToken, requireAuth, User);
export default router;

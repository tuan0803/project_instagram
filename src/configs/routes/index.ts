import express from 'express';
import Register from './Register';
import Login from './Login';
import User from './User';
import checkToken from '@middlewares/checkTokens';
import { requireAuth } from '@middlewares/authorizations';
const router = express.Router();

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);

router.use('/login', Login);
router.use('/signup', Register);
router.use('/users', checkToken, requireAuth, User);
export default router;

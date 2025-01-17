import { Router } from 'express';
// import UserRoute from './Users';
import Register from './Register';
import Login from './Login';
import User from './User';
import checkToken from '@middlewares/checkTokens';
import { requireAuth } from '@middlewares/authorizations';


const router = Router();

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/login', Login);
router.use('/users', checkToken, requireAuth, User);

export default router;

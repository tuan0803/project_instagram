import { Router } from 'express';
// import UserRoute from './Users';
import Register from './Register';
import Login from './Login';

const router = Router();

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/login', Login);

export default router;

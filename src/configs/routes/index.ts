import { Router } from 'express';
// import UserRoute from './Users';
import Register from './Register';
const router = Router();
import Active from './Activation';
import Login from './Login';

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/active', Active);
router.use('/login', Login);
export default router;

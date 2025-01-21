import { Router } from 'express';
// import UserRoute from './Users';
import Register from './Register';
const router = Router();
import Active from './Activation';

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/active', Active);
export default router;

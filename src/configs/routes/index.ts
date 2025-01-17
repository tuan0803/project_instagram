import { Router } from 'express';
// import UserRoute from './Users';
import Register from './Register';

const router = Router();

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);

export default router;

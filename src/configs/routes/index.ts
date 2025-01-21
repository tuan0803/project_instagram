import { Router } from 'express';
// import UserRoute from './Users';
import Register from './Register';
import FollowerRoutes from './FollowerRoutes';
const router = Router();

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/follow', FollowerRoutes);
export default router;

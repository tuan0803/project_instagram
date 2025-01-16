import { Router } from 'express';
// import UserRoute from './Users';
import FollowerRoutes from './FollowerRoutes';
const router = Router();

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/follow', FollowerRoutes);
export default router;

import { Router } from 'express';
import postRoutes from './Posts';
import commentRoutes from './comments';
import Register from './Register';
import FollowerRoutes from './FollowerRoutes';
import Active from './Activation';
import Login from './Login';
const router = Router();

router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/followers', FollowerRoutes);
router.use('/active', Active);
router.use('/login', Login);
export default router;

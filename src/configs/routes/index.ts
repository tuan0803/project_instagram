import { Router } from 'express';
import postRoutes from './posts';
import commentRoutes from './comments';
const router = Router();

router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
export default router;
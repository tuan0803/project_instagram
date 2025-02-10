import { Router } from 'express';
import postRoutes from './posts';
import commentRoutes from './comments';

const router = Router();

router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

export default router;

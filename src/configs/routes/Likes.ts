import { Router } from 'express';
import LikeController from '@controllers/api/Comments';

const router = Router();

router.get('/posts/:postId', LikeController.get);
router.post('/posts/:postId', LikeController.create);

export default router;
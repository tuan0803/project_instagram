import { Router } from 'express';
import LikeController from '@controllers/api/Likes';

const router = Router();

router.get('/posts/:postId/likes', LikeController.get);
router.post('/posts/:postId/likes', LikeController.toggleLike);

export default router;
import { Router } from 'express';
import LikeController from '@controllers/api/Reactions';

const router = Router();

router.get('/post/:postId/likes', LikeController.get);
router.post('/post/:postId/likes', LikeController.toggleLike);

export default router;
import { Router } from 'express';
import LikeController from '@controllers/api/Reactions';

const router = Router();

router.get('/post/:postId/reactions ', LikeController.get);
router.post('/post/:postId/reactions', LikeController.toggleLike);

export default router;
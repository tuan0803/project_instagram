import { Router } from 'express';
import PostReactionController from '@controllers/api/PostReactions';

const router = Router();

router.get('/post/:postId/postreactions ', PostReactionController.get);
router.post('/post/:postId/postreactions', PostReactionController.toggleLike);

export default router;
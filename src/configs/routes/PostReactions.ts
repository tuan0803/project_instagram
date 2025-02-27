import { Router } from 'express';
import PostReactionController from '@controllers/api/PostReactions';

const router = Router();

router.get('/comment/:commentId/commentreactions', PostReactionController.get);
router.post('/comment/:commentId/commentreactions', PostReactionController.toggleLike);

export default router;
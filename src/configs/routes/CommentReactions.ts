import { Router } from 'express';
import CommentReactionController from '@controllers/api/CommentReactions';

const router = Router();

router.get('/comment/:commentId/commentreactions', CommentReactionController.get);
router.post('/comment/:commentId/commentreactions', CommentReactionController.toggleLike);

export default router;
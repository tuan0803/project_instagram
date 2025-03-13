import { Router } from 'express';
import CommentController from '@controllers/api/Comment';

const router = Router();

router.post('/comments', CommentController.addComment);
router.get('/comments', CommentController.getComments);
router.delete('/comments/:commentId', CommentController.deleteComment);

export default router;
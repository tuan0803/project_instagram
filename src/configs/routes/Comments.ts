import { Router } from 'express';
import CommentController from '@controllers/api/Comments';

const router = Router();

router.post('/posts/:postId/comments', CommentController.create);
router.get('/posts/:postId/comments', CommentController.get);
router.put('/comments/:id', CommentController.update);
router.delete('/comments/:id', CommentController.delete);

export default router;
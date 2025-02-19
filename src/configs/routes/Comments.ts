import { Router } from 'express';
import CommentController from '@controllers/api/Comments';

const router = Router();

router.post('/post/:postId/comments', CommentController.create);
router.get('/post/:postId/comments', CommentController.get);
router.put('/:id', CommentController.update);
router.delete('/:id', CommentController.delete);

export default router;
import { Router } from 'express';
import CommentController from '@controllers/Comments';

const router = Router();

router.post('/create/:postId/:userId/:parentId?', CommentController.create);
router.get('/get/:postId', CommentController.get);
router.put('/update/:id', CommentController.update);
router.delete('/delete/:id', CommentController.delete);

export default router;
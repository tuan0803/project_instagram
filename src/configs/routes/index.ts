import { Router } from 'express';
import PostRouter from '@controllers/Posts';

const router = Router();

router.get('/posts/userId/:userId', PostRouter.getAllPosts);
router.post('/posts', PostRouter.create);
router.put('/posts/update/userId/:id', PostRouter.update);
router.delete('/posts/delete/:id', PostRouter.delete);

export default router;
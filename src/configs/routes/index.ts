import { Router } from 'express';
import PostRouter from '@controllers/api/Posts';

const router = Router();

router.get('/posts', PostRouter.getAllPosts);
router.post('/posts', PostRouter.create);
router.put('/posts/:id', PostRouter.update);
router.delete('/posts/:id', PostRouter.delete);

export default router;

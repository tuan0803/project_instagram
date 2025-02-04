import { Router } from 'express';
import PostRouter from '@controllers/Posts';

const router = Router();

router.post('/posts/create/:userId', PostRouter.create);

export default router;
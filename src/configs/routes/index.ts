import { Router } from 'express';
import PostRouter from '@controllers/api/Posts';

const router = Router();

router.post('/posts', PostRouter.create);

export default router;
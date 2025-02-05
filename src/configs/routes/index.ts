import { Router } from 'express';
import PostController from '@controllers/Posts';
import strongParams from '@middlewares/parameters';
const router = Router();

router.post('/posts/create/:userId', strongParams(), PostController.create);

export default router;

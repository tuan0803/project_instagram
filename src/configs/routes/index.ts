import { Router } from 'express';
import PostController from '@controllers/Posts';
const router = Router();


router.post('/posts/create/:userId', PostController.create);


export default router;

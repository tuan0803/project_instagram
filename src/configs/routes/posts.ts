import { Router } from 'express';
import PostController from '@controllers/Posts';

const router = Router();

router.post('/create/:userId', PostController.create); 

export default router;

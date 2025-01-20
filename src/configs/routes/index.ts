import { Router } from 'express';
import PostRouter from '@controllers/api/Posts';
// import UserRoute from './Users';

const router = Router();

router.post('/posts', PostRouter.create);

export default router;

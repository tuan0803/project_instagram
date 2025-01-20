import { Router } from 'express';
import FollowerController from '@controllers/api/Follower';

const router = Router();

router.post('/users/:userId/follow', FollowerController.follow);

export default router;

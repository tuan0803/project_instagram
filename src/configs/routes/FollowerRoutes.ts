import { Router } from 'express';
import FollowerController from '@controllers/api/Follower';

const router = Router();

router.post('/users/:userId/follow', FollowerController.follow);
router.delete('/users/:userId/unfollow', FollowerController.follow); 
router.get('/followers/', FollowerController.getFollowers);
export default router;
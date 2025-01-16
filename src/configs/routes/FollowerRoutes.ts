import { Router } from 'express';
import FollowerController from '@controllers/api/Follower';

const router = Router();

router.post('/follow1', FollowerController.follow);

router.post('/approveFollow/:followId', FollowerController.approveFollow);

router.delete('/unfollow/:followeeId', FollowerController.unfollow);

router.get('/followers', FollowerController.followersList);

router.get('/following', FollowerController.followingList);

export default router;

import { Router } from 'express';
<<<<<<< HEAD
import LikeController from '@controllers/api/Likes';

const router = Router();

router.get('/posts/:postId/likes', LikeController.get);
router.post('/posts/:postId/likes', LikeController.toggleLike);
=======
import LikeController from '@controllers/api/Comments';

const router = Router();

router.get('/posts/:postId', LikeController.get);
router.post('/posts/:postId', LikeController.create);
>>>>>>> 1e54a5d (fix comment)

export default router;
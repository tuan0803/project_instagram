import { Router } from 'express';
import Posts from '@controllers/api/Posts';
const router = Router();

router.post('/', Posts.create);
router.get('/', Posts.index);

export default router;

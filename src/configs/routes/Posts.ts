import { Router } from 'express';
import Posts from '@controllers/api/Posts';
const router = Router();

router.post('/', Posts.create);
router.get('/', Posts.index);
router.get('/:id', Posts.show);
router.put('/:id', Posts.update);

export default router;

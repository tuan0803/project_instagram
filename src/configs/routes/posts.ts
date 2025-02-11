import { Router } from 'express';
import PostController from '@controllers/Posts';
import { optionalUserPassport } from '@middlewares/passport';

const router = Router();

router.post('/create', optionalUserPassport.authenticate('jwt', { session: false }), PostController.create);

export default router;
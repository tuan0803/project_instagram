import { Router } from 'express';
import UserController from '@controllers/api/Users';
const router = Router();

router.get('/', UserController.index);

export default router;

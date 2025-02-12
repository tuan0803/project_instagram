import { Router } from 'express';
import User from '@controllers/api/Users';
const router = Router();

router.get('/', User.index);

export default router;

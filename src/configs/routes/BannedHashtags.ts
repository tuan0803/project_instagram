import { Router } from 'express';
import BannedHashtagController from '@controllers/api/BannedHashtags';

const router = Router();

router.post('/', BannedHashtagController.create);

export default router;
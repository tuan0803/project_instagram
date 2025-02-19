import { Router } from 'express';
import BannedHashtagController from '@controllers/api/BannedHashtags';

const router = Router();

router.get('/', BannedHashtagController.get);
router.get('/:id', BannedHashtagController.get);
router.post('/', BannedHashtagController.create);
router.delete('/:id', BannedHashtagController.delete);

export default router;
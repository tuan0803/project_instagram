import { Router } from 'express';
import BannedWordControllers from '@controllers/api/BannedWords';

const router = Router();

router.get('/', BannedWordControllers.get);
router.get('/:id', BannedWordControllers.get);
router.post('/', BannedWordControllers.create);
router.delete('/:id', BannedWordControllers.delete);

export default router;
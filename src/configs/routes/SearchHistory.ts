import { Router } from 'express';
import SearchHistoryController from '@controllers/api/SearchHistoryController';

const router = Router();
router.get('/history', SearchHistoryController.getSearchHistory);

export default router;

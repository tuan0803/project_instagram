import { Router } from 'express';
import SearchHistoryController from '@controllers/api/SearchHistoryController';

const router = Router();
router.get('/search_histories', SearchHistoryController.getSearchHistory);

export default router;

import { Router } from 'express';
import SearchController from '@controllers/api/searchController';

const router = Router();
router.get('/search', SearchController.searchUsers);
router.get('/history', SearchController.getSearchHistory);

export default router;

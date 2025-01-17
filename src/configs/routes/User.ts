import express from 'express';
import Users from '@controllers/api/Users';

const router = express.Router();

router.get('/', Users.index);
router.get('/:id', Users.show);
router.put('/update', Users.update);
router.delete('/delete', Users.delete);

export default router;
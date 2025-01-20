import express from 'express';
import registerController from '@controllers/auth/Register';

const router = express.Router();
router.post('/', registerController.register);
export default router;
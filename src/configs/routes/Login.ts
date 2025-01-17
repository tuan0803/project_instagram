import express from 'express';
import loginController from '@controllers/auth/Login';

const router = express.Router();

router.post('/', loginController.login);

export default router;
import express from 'express';
import ActiveController from '@controllers/auth/Active';

const router = express.Router();


router.post('/send', ActiveController.create);
router.post('/verify', ActiveController.verify);

export default router;
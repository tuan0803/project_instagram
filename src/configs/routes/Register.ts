import express from 'express';
import registerController from '@controllers/auth/Register';
import strongParams from '@middlewares/parameters'; 

const router = express.Router();

router.post('/', strongParams(), registerController.register);

export default router;
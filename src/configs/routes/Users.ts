import { Router } from 'express';
import UserController from '@controllers/api/Users';
const route = Router();

route.put('/update', UserController.update);
route.get('/', UserController.index);
route.get('/:id', UserController.show);
route.get('/me', UserController.show);
route.delete('/', UserController.delete);
export default route;

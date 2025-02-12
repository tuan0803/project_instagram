import { Router } from 'express';
import ProfileController from '@controllers/api/Profiles';
const route = Router();

route.put('/update', ProfileController.update);
route.get('/', ProfileController.index);
route.get('/:id', ProfileController.show);
route.get('/me', ProfileController.show);
route.delete('/', ProfileController.delete);
export default route;

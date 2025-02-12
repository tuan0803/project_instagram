import { Router } from 'express';
import ProfileController from '@controllers/api/Profiles';
const route = Router();

route.put('/', ProfileController.update);
route.get('/', ProfileController.show);
route.delete('/', ProfileController.delete);
export default route;

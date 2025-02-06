import { Router } from 'express';
// import UserRoute from './Users';
import Register from './Register';
import FollowerRoutes from './FollowerRoutes';
const router = Router();
import Active from './Activation';
import Login from './Login';
import User from './User';
import passport from 'passport';
import passportJwt from '@middlewares/passport-jwt';
passportJwt(passport);

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/followers', FollowerRoutes);
router.use('/active', Active);
router.use('/login', Login);
router.use('/users', passport.authenticate('jwt', { session: false }), User);

export default router;

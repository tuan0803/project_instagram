import { Router } from 'express';
// import UserRoute from './Users';
import Register from './Register';
import FollowerRoutes from './FollowerRoutes';
const router = Router();
import Active from './Activation';
import Login from './Login';
import passport from 'passport';
import passportJwt from '@middlewares/passport-jwt';
import Passwords from './Passwords';
passportJwt(passport);
import Profiles from './Profiles'
import Users from './Users'
import Posts from './Posts';
import searchRoutes from './searchRoutes';

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/followers', passport.authenticate('jwt', { session: false}) ,FollowerRoutes);
router.use('/active', Active);
router.use('/login', Login);
router.use('/passwords', passport.authenticate('jwt', { session: false}), Passwords)
router.use('/me', passport.authenticate('jwt', { session: false }), Profiles);
router.use('/users', passport.authenticate('jwt', { session: false }), Users);
router.use('/posts', passport.authenticate('jwt', { session: false }), Posts);
router.use('/search', passport.authenticate('jwt', { session: false }), searchRoutes);
export default router;

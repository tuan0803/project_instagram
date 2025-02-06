import { Router } from 'express';
// import UserRoute from './Users';
import Register from './Register';
const router = Router();
import Active from './Activation';
import Login from './Login';
import passport from 'passport';
import passportJwt from '@middlewares/passport-jwt';
import Passwords from './Passwords';
passportJwt(passport);

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/active', Active);
router.use('/login', Login);
router.use('/passwords', passport.authenticate('jwt', { session: false}), Passwords)
export default router;

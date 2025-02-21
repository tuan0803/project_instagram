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
import Comments from './Comments'
import PostReactions from './PostReactions';
import BannedHashtags from './BannedHashtags';
import BannedWords from './BannedWords';
import CommentReactions from './CommentReactions';

// router.use('/users', userPassport.authenticate('jwt', { session: false }), UserRoute);
router.use('/register', Register);
router.use('/active', Active);
router.use('/login', Login);
router.use('/me', passport.authenticate('jwt', { session: false }), Profiles);

router.use('/followers', passport.authenticate('jwt', { session: false }), FollowerRoutes);
router.use('/passwords', passport.authenticate('jwt', { session: false }), Passwords)

router.use('/users', passport.authenticate('jwt', { session: false }), Users);
router.use('/comments', passport.authenticate('jwt', { session: false }), Comments);
router.use('/postreactions', passport.authenticate('jwt', { session: false }), PostReactions);
router.use('/commentreactions', passport.authenticate('jwt', { session: false }), CommentReactions);

router.use('/bannedhashtags', passport.authenticate('jwt', { session: false }), BannedHashtags);
router.use('/bannedwords', passport.authenticate('jwt', { session: false }), BannedWords);


export default router;

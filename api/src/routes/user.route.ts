import {Request, Response, Router} from 'express';
import { registration, login, getUserByEmail, createUser, updateUser, deleteUser, getAllUsers, getUserById } from '../controllers/user.controller';
import passport from 'passport';
import {UserType} from '../models/user.model';
import {validateUser} from '../middleware/user.middleware';

const userRouter = Router();

userRouter.get('/:id', passport.authenticate('jwt', { session: false }), getUserById);

// TODO remove?
userRouter.post('/', validateUser, createUser);

userRouter.put('/:id', validateUser, updateUser);

userRouter.delete('/:id', passport.authenticate('jwt', {session:false}), deleteUser);

userRouter.get('/', passport.authenticate('jwt', {session: false}), getAllUsers);

export default userRouter;

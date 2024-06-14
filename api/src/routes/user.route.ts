import {Request, Response, Router} from 'express';
import { updateUser, deleteUser, getAllUsers, getUserById, createUser } from '../controllers/user.controller';
import passport from 'passport';
import {UserType} from '../models/user.model';
import {validateUser} from '../middleware/user.middleware';

const userRouter = Router();

userRouter.get('/:id', passport.authenticate('jwt', { session: false }), getUserById);

userRouter.put('/:id', validateUser, updateUser);

userRouter.delete('/:id', passport.authenticate('jwt', {session:false}), deleteUser);

userRouter.get('/', passport.authenticate('jwt', {session: false}), getAllUsers);

export default userRouter;
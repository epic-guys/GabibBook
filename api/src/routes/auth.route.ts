import {Request, Response, Router} from 'express';
import { UserType } from '../models/user.model';
import { register, login } from '../controllers/auth.controller';
import argon2 from 'argon2';
import passport from 'passport';
import jwt  from 'jsonwebtoken';
import {HydratedDocument} from 'mongoose';
import config from '../config';
import {validateUser} from '../middleware/user.middleware';


const authRouter = Router();

authRouter.post('/register',validateUser, register);

authRouter.get('/login', passport.authenticate('basic', {session: false}), async (req: Request, res: Response) => {
    try{
        return login(req, res);
    }
    catch(e){
        res.status(500).json({message: 'Internal Server Error'});
    }
});

export default authRouter;

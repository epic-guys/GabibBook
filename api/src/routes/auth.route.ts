import {Request, Response, Router} from 'express';
import { UserType } from '../models/user.model';
import { register } from '../controllers/auth.controller';
import argon2 from 'argon2';
import passport from 'passport';
import jwt  from 'jsonwebtoken';
import {HydratedDocument} from 'mongoose';
import config from '../config';


const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
    try {
        let passwordHash = await argon2.hash(req.body.password);
        const user: UserType = {
            name: req.body.name,
            surname: req.body.surname,
            nickname: req.body.nickname,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            nation: req.body.nation,
            paymentMethods: [],
            role: req.body.role,
            passwordHash: passwordHash
        };
        
        await register(user);

        return res.status(201).json({ message: 'User added' });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});


authRouter.get('/login',
               passport.authenticate('basic', {session: false}),
               (req: Request, res: Response) => {                  
                   let user = req.user as HydratedDocument<UserType>;
                   let payload = {
                        _id: user._id,
                        role: user.role,
                        nickname: user.nickname,
                        name: user.name,
                        surname: user.surname
                    };
                    let newJwt = jwt.sign(payload, config.jwtSecret, { expiresIn: '6 hours', issuer: 'epic-guys.org' });
                    res.status(200).json({jwt: newJwt});
                }
);

export default authRouter;

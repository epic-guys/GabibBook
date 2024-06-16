import jwt from "jsonwebtoken";
import argon2 from "argon2";

import { User, UserType } from "../models/user.model";
import { Request, Response } from "express";
import mongoose, { HydratedDocument } from "mongoose";
import config from "../config";

export async function register(req: Request, res: Response) {
    let passwordHash = await argon2.hash(req.body.password);
    delete req.body.password;
    let role = 'user';

    if(req.body.accesscode){
        role = 'moderator';
    }

    let user: UserType = { ...req.body, role: role, enabled: true, passwordHash: passwordHash, _id: new mongoose.Types.ObjectId() };
    try {
        user = await User.create(user);
        res.status(201).json({ message: 'User added' });
    } catch (e: any) {
        if (e.code === 11000) {
            res.status(409).json({ message: 'Email already in use' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    //not good
    return res.send(user);
}

export async function login(req: Request, res: Response) {
    let user = req.user as HydratedDocument<UserType>;
    let payload = {
        _id: user._id,
        role: user.role,
        nickname: user.nickname,
        name: user.name,
        surname: user.surname
    };
    let newJwt = jwt.sign(payload, config.jwtSecret, { expiresIn: '6 hours', issuer: 'epic-guys.org' });
    res.status(200).json({ jwt: newJwt });
}

export async function requestPasswordReset(req: Request, res: Response) {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
        //this is to prevent user enumeration and oracle attacks
        return res.status(200).json({ message: 'Reset token sent' });
    }
    else {
        let resetToken = jwt.sign(
            { email: user.email, _id: user._id },
            config.jwtSecret,
            { expiresIn: '1 hour', issuer: 'epic-guys.org' }
        );

        /**
         * this is just a mockup, in a real application you would send an email with a link containing the reset token
         */
        console.log(resetToken);
        return res.status(200).json({ message: 'Reset token sent' });
    }
}

export async function resetPassword(req: Request, res: Response) {
    let user = req.user as UserType;
    let passwordHash = await argon2.hash(req.body.password);

    await User.findByIdAndUpdate(user._id, { passwordHash: passwordHash });
    return res.status(200).json({ message: 'Password reset' });
}
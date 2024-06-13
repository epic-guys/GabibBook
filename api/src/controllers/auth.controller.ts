import jwt from "jsonwebtoken";
import argon2 from "argon2";
import cors from "cors";

import { User, UserType } from "../models/user.model";
import passport from "passport";
import {Request, Response} from "express";
import mongoose, {HydratedDocument} from "mongoose";
import config from "../config";

export async function register(req: Request, res: Response, next: any) {
    let passwordHash = await argon2.hash(req.body.password);
    delete req.body.password;
    let user: UserType = {...req.body, passwordHash: passwordHash, _id: new mongoose.Types.ObjectId()};
    try {
        await User.create(user);
        res.status(201).json({ message: 'User added' });
    } catch (e) {
        next(e);
    }
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
    res.status(200).json({jwt: newJwt});
}


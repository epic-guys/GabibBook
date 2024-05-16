import jsonwebtoken from "jsonwebtoken";
import { expressjwt as jwt } from "express-jwt";
import argon2 from "argon2";
import cors from "cors";

import { User, UserType } from "../models/user.model";
import passport from "passport";

export async function register(user: UserType) {
    let newUser = new User(user);
    return newUser.save();
}

export async function login(email: string, password: string) {
    
}

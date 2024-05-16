import { Request, Response } from 'express'
import {HydratedDocument} from 'mongoose'
import { User, UserType } from '../models/user.model'

export async function registration(req: Request, res: Response) {
    //TODO
}

export async function login(req: Request, res: Response) {
    //TODO
}


/**
 * @returns The User if it exists, null otherwise
 */
export async function getUserByEmail(email: string): Promise<HydratedDocument<UserType>> {
    let user = await User.findOne({'email': email}).exec();
    if (user == null) throw "User not found";
    else return user;
}


export async function getUserById(id: string): Promise<HydratedDocument<UserType>> {
    let user = await User.findById(id).exec();
    if (user == null) throw "User not found";
    else return user;
}


export async function createUser(user: UserType): Promise<HydratedDocument<UserType>> {
    let newUser = new User(user);
    return newUser.save();
}


export async function updateUser(req: Request, res: Response) {
    try {
        // TODO
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

export async function getAllUsers(req: Request, res: Response) {
     try {
        const users = await User.find();
        return res.status(200).json(users);
     } catch (error) {
        return res.status(500).json({ message: error });
     }
}

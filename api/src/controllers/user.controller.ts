import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { User } from '../models/user.model'

export async function registration(req: Request, res: Response) {
    //TODO
}

export async function login(req: Request, res: Response) {
    //TODO
}

export async function getUser(req: Request, res: Response) {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            surname: req.body.surname,
            nickname: req.body.nickname,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        });
        const newUser = await user.save();
        return res.status(201).json({ message: 'User added' });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
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
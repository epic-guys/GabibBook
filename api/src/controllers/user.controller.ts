import { Request, Response } from 'express'
import { User } from '../models/user.model'
import logger from '../logger';
import mongoose from 'mongoose';

export async function registration(req: Request, res: Response) {
    //TODO
}

export async function login(req: Request, res: Response) {
    //TODO
}

export async function getUserByEmail(req: Request, res: Response) {
    let user = await User.findOne({'email': req.params.email}).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });
    else return res.status(200).json(user);
}


export async function getUserById(req: Request, res: Response) {
    let user = await User.findById(req.params.id).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });
    else return res.status(200).json(user);
}


export async function createUser(req: Request, res: Response) {
    const user = new User({...req.body, _id: new mongoose.Types.ObjectId()});
    logger.info(user);
    user.save()
        .then(() => {
            return res.status(200).json(user);
        })
        .catch((err) => {
            logger.error(err.message);
            return res.status(400).json({ message: err.message });
        });
}


export async function updateUser(req: Request, res: Response) {
    //TODO
}

export async function deleteUser(req: Request, res: Response) {
    let user = await User.findByIdAndDelete(req.params.id).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });
    else return res.status(200).json({ message: 'User deleted' });
}

export async function getAllUsers(req: Request, res: Response) {
    let users= await User.find().exec();
    if (!users) return res.status(404).json({ message: 'Error in query' });
    else return res.status(200).json(users);
}

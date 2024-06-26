import { Request, Response } from 'express'
import { User } from '../models/user.model'
import logger from '../logger';
import mongoose from 'mongoose';
import { PaymentMethod } from '../models/user.model';

export async function getUserByEmail(req: Request, res: Response) {
    let user = await User.findOne({ 'email': req.params.email }).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });
    else return res.status(200).json(user);
}

export async function getUserById(req: Request, res: Response) {
    let user = await User.findById(req.params.id).exec();

    if (!user) return res.status(404).json({ message: 'User not found' });

    delete user.passwordHash;
    user.paymentMethods.forEach((paymentMethod: PaymentMethod) => {
        paymentMethod.number = paymentMethod.number.slice(-4);
    });
    return res.status(200).json(user);
}

export async function createUser(req: Request, res: Response) {
    const user = new User({ ...req.body, _id: new mongoose.Types.ObjectId() });
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
    let user = await User.findById(req.params.id).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });
    else {
        user.set(req.body);
        user.save()
            .then(() => {
                return res.status(200).json(user);
            })
            .catch((err) => {
                logger.error(err.message);
                return res.status(400).json({ message: err.message });
            });
    }
}

export async function deleteUser(req: Request, res: Response) {
    let user = await User.findById(req.params.id).where('enabled').equals(true).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.enabled = false;
    await user.save();
    return res.status(200).json({ message: 'User deleted' });
}

export async function getLastUsers(req: Request, res: Response) {
    let filter = req.query.filter || '';
    filter = (filter as string).replace(/[^a-zA-Z0-9]/g, '');
    
    let users = await User.find({ role: { $ne: 'moderator' }, enabled: true, nickname: { $regex: filter, $options: 'i' } }).limit(10).select('_id nickname').exec();

    if(!users) {users = []}
    return res.status(200).json(users);
}

import { Request, Response } from 'express';
import { Invite } from '../models/invite.model';
import logger from '../logger';
import { UserType } from '../models/user.model';
import mongoose from 'mongoose';


export async function createInvite(req: Request, res: Response) {
    let user = req.user as UserType;
    let invite = new Invite({
        _id: new mongoose.Types.ObjectId(),
        id_mod: user._id,
        expiresDate: new Date(new Date().getTime() + 24 * 60 * 60 * 7 * 1000),
    });

    try {
        await invite.save();
        res.status(200).json(invite);
    } catch (err: any) {
        logger.error(err.message);
        res.status(400).json({ message: err.message });
    }
}

export async function getInvites(req: Request, res: Response) {
    let user = req.user as UserType;
    try {
        const now = new Date();
        let invites = await Invite.find({ id_mod: user._id, expiresDate: { $gte: now }}).exec();
        res.status(200).json(invites);
    } catch (err: any) {
        logger.error(err.message);
        res.status(400).json({ message: err.message });
    }
}

export async function deleteInvite(req: Request, res: Response) {
    let inviteId = req.body.inviteId;
    try {
        await Invite.deleteOne({ _id: inviteId }).exec();
        res.status(200).json({ message: 'Invite deleted' });
    }
    catch (err: any) {
        logger.error(err.message);
        res.status(400).json({ message: err.message });
    }
}
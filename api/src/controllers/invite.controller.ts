
import { Request, Response } from 'express';
import { Invite } from '../models/invite.model';
import logger from '../logger';
import { UserType } from '../models/user.model';


export async function createInvite(req: Request, res: Response) {
    let user = req.user as UserType;
    let invite = new Invite({
        user: user._id,
        timestamp: new Date(new Date().getTime() + 24 * 60 * 60 * 7),
    });

    try {
        await invite.save();
        res.status(200).json(invite);
    } catch (err: any) {
        logger.error(err.message);
        res.status(400).json({ message: err.message });
    }
}
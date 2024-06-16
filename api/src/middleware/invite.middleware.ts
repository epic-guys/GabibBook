import { Request, Response } from 'express';
import { Invite } from '../models/invite.model';

export async function useCode(req: Request, res: Response, next: Function) {
    let accessCode = (req.body as any).accessCode;
    
    if(!accessCode){
        return next();
    }

    const now = new Date();
    let invite = await Invite.findOne({ code: accessCode, expiryDate: { $gte: now } }).exec();

    if (!invite) {
        return res.status(400).json({ message: 'Invalid access code' });
    }

    invite.expiresDate = now;
    await invite.save();

    return next();
}
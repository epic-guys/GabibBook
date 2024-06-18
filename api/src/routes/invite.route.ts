import { Request, Response, Router } from 'express';
import { createInvite, getInvites, deleteInvite } from '../controllers/invite.controller';
import passport from 'passport';
import { authorize } from '../middleware/authorization.middleware';
import { Role } from '../models/user.model';
import config from '../config';


const inviteRouter = Router();

inviteRouter.get('/', passport.authenticate('jwt', config.passportOptions), authorize([Role.Moderator]), (req: Request, res: Response) => {
    try {
        return getInvites(req, res);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

inviteRouter.post('/', passport.authenticate('jwt', config.passportOptions), authorize([Role.Moderator]), (req: Request, res: Response) => {
    try {
        return createInvite(req, res);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

inviteRouter.delete('/', passport.authenticate('jwt', config.passportOptions), authorize([Role.Moderator]), (req: Request, res: Response) => {
    try {
        return deleteInvite(req, res);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
export default inviteRouter;

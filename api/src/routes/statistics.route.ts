import { Request, Response, Router } from 'express';
import { getAllOffers, getSuccessfulAuctions } from '../controllers/statistics.controller';
import passport from 'passport';
import config from '../config';
import { Role } from '../models/user.model';
import { authorize } from '../middleware/authorization.middleware';
import { isSameUser } from '../middleware/user.middleware';


const statsRouter = Router();

statsRouter.get('/offers', passport.authenticate('jwt', config.passportOptions), authorize([Role.Student]), isSameUser,
    async (req: Request, res: Response) => {
        try {
            return getAllOffers(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

statsRouter.get('/auctions', passport.authenticate('jwt', config.passportOptions), authorize([Role.Moderator]),
    async (req: Request, res: Response) => {
        try {
            return getSuccessfulAuctions(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

export default statsRouter;
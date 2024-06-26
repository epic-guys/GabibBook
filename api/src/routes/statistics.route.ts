import { Request, Response, Router } from 'express';
import { getAllOffers, getAuctions } from '../controllers/statistics.controller';
import passport from 'passport';
import config from '../config';
import { Role } from '../models/user.model';
import { authorize } from '../middleware/authorization.middleware';


const statsRouter = Router();

statsRouter.get('/offers', passport.authenticate('jwt', config.passportOptions), authorize([Role.Student]),
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
            return getAuctions(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

export default statsRouter;
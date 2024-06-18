
import { Request, Response, Router } from 'express';
import passport from 'passport';
import config from '../config';
import { isSameUser } from '../middleware/user.middleware';
import { getPurchasesByBuyerId, getPurchasesBySellerId, changePurchaseStatus } from '../controllers/purchase.controller';


const purchaseRouter = Router();

//TODO: check if the user is the same as the one being requested
purchaseRouter.get('/', passport.authenticate('jwt', config.passportOptions), (req: Request, res: Response) => {
    try {
        if (req.query.buyer_id) return getPurchasesByBuyerId(req, res);
        else if (req.query.seller_id) return getPurchasesBySellerId(req, res);
        else res.status(404).json({ message: 'Bad Request' });
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

purchaseRouter.put('/:id', passport.authenticate('jwt', config.passportOptions), (req: Request, res: Response) => {
    try {
        return changePurchaseStatus(req, res);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default purchaseRouter;

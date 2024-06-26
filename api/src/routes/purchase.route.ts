import { Request, Response, Router } from 'express';
import passport from 'passport';
import config from '../config';
import { getPurchasesByBuyerId, getPurchasesBySellerId, changePurchaseStatus } from '../controllers/purchase.controller';
import { UserType } from '../models/user.model';
const purchaseRouter = Router();

purchaseRouter.get('/', passport.authenticate('jwt', config.passportOptions),
    async (req: Request, res: Response) => {
        try {
            const user = req.user as UserType;
            if (req.query.buyer_id && req.query.buyer_id === user._id!.toString()) {
                return getPurchasesByBuyerId(req, res);
            }
            else if (req.query.seller_id && req.query.seller_id === user._id!.toString()) {
                return getPurchasesBySellerId(req, res);
            }
            else res.status(404).json({ message: 'Bad Request' });
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

purchaseRouter.put('/:id', passport.authenticate('jwt', config.passportOptions),
    async (req: Request, res: Response) => {
        try {
            return changePurchaseStatus(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

export default purchaseRouter;
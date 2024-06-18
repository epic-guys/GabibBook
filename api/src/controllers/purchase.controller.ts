
import { Request, Response } from 'express';
import logger from '../logger';
import { Purchase, Status } from '../models/purchase.model';


export async function getPurchasesByBuyerId(req: Request, res: Response) {
    let buyer_id = req.query.buyer_id;
    logger.info("buyer_id: " + buyer_id);
    try {
        let purchases = await Purchase.find({ buyer: buyer_id }).exec();
        res.status(200).json(purchases);
    } catch (err: any) {
        logger.error(err.message);
        res.status(400).json({ message: err.message });
    }
}

export async function getPurchasesBySellerId(req: Request, res: Response) {
    let seller_id = req.query.seller_id;
    logger.info("seller_id: " + seller_id);
    try {
        let purchases = await Purchase.find({ seller: seller_id }).exec();
        res.status(200).json(purchases);
    } catch (err: any) {
        logger.error(err.message);
        res.status(400).json({ message: err.message });
    }
}

export async function changePurchaseStatus(req: Request, res: Response) {
    let purchase = await Purchase.findById(req.params.id).exec();
    let status = req.body.status;
    logger.info("status: " + status);
    if(!status) return res.status(400).json({ message: 'Bad request' });
    else {
        if(purchase) {
            purchase.status = status;
            try {
                await purchase.save();
                res.status(200).json(purchase);
            } catch (err: any) {
                logger.error(err.message);
                res.status(400).json({ message: err.message });
            }
        }
        else res.status(404).json({ message: 'Purchase not found' });
    }
}
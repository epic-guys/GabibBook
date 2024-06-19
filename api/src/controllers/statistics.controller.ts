import { Request, Response } from 'express';
import { Book } from '../models/book.model';
import { Purchase } from '../models/purchase.model';
import { UserType } from '../models/user.model';

export async function getAllOffers(req: Request, res: Response) {
    let user = req.user as UserType;
    if (!user) return res.status(404).json({ message: 'Bad Request' });
    try {
        const auctionsParticipatedIn = await Book.find({ 'offers.user': user._id });
        res.status(200).json(auctionsParticipatedIn);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getSuccessfulAuctions(req: Request, res: Response) {
    try {
        let result = req.query.result;
        if(result && (result == "successful" || result == "unsuccessful")) {

            let count = req.query.count;
            if (!count || count == "false") return res.status(500).json({ message: 'Not implemented' });

            let whereCondition = {};
            if(result == "successful") whereCondition = { status: { $ne: "reserve_price_not_met" } };
            else whereCondition = { status: "reserve_price_not_met" };

            const auctions_count = await Purchase.find(whereCondition).countDocuments();
            return res.status(200).json({ count: auctions_count });
        }
        else return res.status(404).json({ message: 'Bad Request' });
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

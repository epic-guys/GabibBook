import { Request, Response } from 'express';
import { Book } from '../models/book.model';

export async function getAllOffers(req: Request, res: Response) {
    let from = req.query.from;
    if (!from) return res.status(404).json({ message: 'Bad Request' });
    try {
        const offers = await Book.find({ 'offers.user': from }, { offers: { $elemMatch: { user: from } } });
        res.status(200).json(offers);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getSuccessfulAuctions(req: Request, res: Response) {
    try {
        if(req.query.result && (req.query.result == "successful" || req.query.result == "unsuccessful")) {
            //
        }
        else return res.status(404).json({ message: 'Bad Request' });
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

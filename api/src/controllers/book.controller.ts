import { Request, Response } from 'express';
import { Book } from '../models/book.model';
import logger from '../logger';
import { User, UserType } from '../models/user.model';
import { bookSocket } from '../socket';
import { Chat } from '../models/chat.model';

export async function getBook(req: Request, res: Response) {
    let book = await Book.findById(req.params.id).select('-reserve_price').where({ banned: false }).exec();
    if (!book) return res.status(404).json({ message: 'Book not found' });
    else return res.status(200).json(book);
}

export async function getBookList(req: Request, res: Response) {
    const size = Number(req.query.size ?? 50);
    const page = Number(req.query.page ?? 1)
    let skip = size * (page - 1);

    if (skip < 0) { skip = 0; }

    let owner_id = req.query.owner_id?.toString();

    let search = req.query.search?.toString();
    if (!search) search = "";

    // Search filtering
    const isbnRegex = /ISBN::(?<isbn>\d*);?/;
    const minRegex = /MIN::(?<min>\d*);?/;
    const maxRegex = /MAX::(?<max>\d*);?/;
    const authorRegex = /AUTHOR::(?<author>[^;]*);?/;
    const ownerRegex = /OWNER::(?<owner>[^;]*);?/;

    const isbnMatch = search.match(isbnRegex);
    const minMatch = search.match(minRegex);
    const maxMatch = search.match(maxRegex);
    const authorMatch = search.match(authorRegex);
    const ownerMatch = search.match(ownerRegex);

    const isbn = isbnMatch ? isbnMatch.groups?.isbn : undefined;
    const min = minMatch ? minMatch.groups?.min : undefined;
    const max = maxMatch ? maxMatch.groups?.max : undefined;
    const author = authorMatch ? authorMatch.groups?.author : undefined;
    const owner = ownerMatch ? ownerMatch.groups?.owner : undefined;

    search = search.replace(isbnRegex, "");
    search = search.replace(minRegex, "");
    search = search.replace(maxRegex, "");
    search = search.replace(authorRegex, "");
    search = search.replace(ownerRegex, "");


    // Search owner by nickname
    let ownerObject = undefined;
    if (owner) {
        ownerObject = await User.findOne({ nickname: owner }).exec();
    }


    let whereConditions: any = {
        ...(isbn && { isbn: isbn }),
        ...((min || max) && { price: { $gte: min, $lte: max } }),
        ...(author && { author: { $regex: '.*' + author + '.*', $options: 'i' } }),
        ...(search && { title: { $regex: '.*' + search + '.*', $options: 'i' } }),
        ...(owner && { owner: ownerObject?._id }),
        close_date: { $gt: new Date() },
        banned: false
    };

    if (owner_id) whereConditions.owner = owner_id;

    logger.info("Searching books with following where conditions: " + JSON.stringify(whereConditions));

    const books = await Book.find({}).
        select({
            reserve_price: 0,
            offers: { $slice: -1 } //this will return only the last element of the array
        }
        ).
        skip(skip).
        populate<{ owner: UserType }>('owner', 'nickname').
        where(whereConditions).limit(size).exec();
    // Response building
    let totalPages;
    logger.info("Books length: " + books.length + ", size: " + size + ", page: " + page);
    if (books.length < size) {
        totalPages = page;
    }
    else {
        const totalBooks = await Book.find({}).where(whereConditions).countDocuments().exec();
        totalPages = Math.ceil(totalBooks / size);
    }
    logger.info("Found books: " + books.length);
    if (!books) return res.status(404).json({ message: 'Books not found' });
    else return res.status(200).json({ data: books, totalPages: totalPages, page: page });
}

export async function createBook(req: Request, res: Response) {
    const book = new Book({ ...req.body, owner: (req.user as UserType)._id });
    book.save()
        .then(() => {
            return res.status(200).json(book);
        })
        .catch((err) => {
            logger.error(err.message);
            return res.status(400).json({ message: err.message });
        });
}

export async function createOffer(req: Request<{ id: string }, any, { value: number }>, res: Response) {
    let now = new Date();
    let book = await Book.findById(req.params.id).where({ banned: false }).exec();
    let user = req.user as UserType;
    if (book == null) {
        res.status(404).send({ message: 'Book not found' })
        return;
    }

    if (book.owner._id!.toString() === user._id!.toString()) {
        res.status(400).json({ message: 'Owner cannot offer' });
        return;
    }

    if (book.close_date < new Date()) {
        res.status(400).json({ message: 'Book auction has ended' });
        return;
    }

    let lastOffer = book.offers[book.offers.length - 1]?.value;
    if ((!lastOffer || lastOffer < req.body.value)) {
        let nf = {
            value: req.body.value,
            user: user._id,
            timestamp: new Date()
        }

        book.offers.push(nf);

        await book.save();
        bookSocket.notifyBook(book._id.toHexString(), nf);
        res.status(200).json({ message: 'Successfully offered' });
    }
    else {
        res.status(400).json({ message: 'Offer lower than current one' });
    }
}

export async function updateBook(req: Request, res: Response) {
    let now = new Date();
    let book = await Book.findById(req.params.id).where({ banned: false }).exec();
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.close_date < now) return res.status(400).json({ message: 'Book auction has ended' });

    else {
        book.set(req.body);
        book.save()
            .then(() => {
                return res.status(200).json(book);
            })
            .catch((err) => {
                logger.error(err.message);
                return res.status(400).json({ message: err.message });
            });
    }
}

export async function deleteBook(req: Request, res: Response) {
    let book = await Book.findById(req.params.id).exec();
    if (!book) return res.status(404).json({ message: 'Book not found' });
    else {
        book.banned = true;
        await book.save();
        return res.status(200).json({ message: 'Book deleted' });
    }
}


export async function getChatByBook(req: Request<{ id: string }, any, any, { buyerId?: string }>, res: Response) {
    try {
        let bookId = req.params.id;
        let buyerId = req.query.buyerId;
        let chat = await Chat.findOne({
            book: bookId,
            // If buyerId is not set, we look for the public chat
            buyer: buyerId
        }, '-messages').exec();
        // If chat does not exist, create a new one
        if (!chat) {
            let book = await Book.findById(bookId).exec();
            // We create it only if the book exists
            if (!book) {
                res.status(404).json({ message: 'Book not found' });
                return;
            }

            // We check if the buyer is the owner
            if (book.owner._id.toString() === buyerId) {
                res.status(400).json({ message: 'Owner cannot chat with himself' });
                return;
            }

            // We check if the buyer exists
            if (buyerId) {
                let buyer = await User.findById(buyerId).exec();
                if (!buyer) {
                    res.status(404).json({ message: 'Buyer not found' });
                    return;
                }
            }

            // We create the chat
            chat = new Chat({
                book: bookId,
                buyer: buyerId,
                messages: []
            });
            await chat.save();
        }
        res.status(200).json(chat);

    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}

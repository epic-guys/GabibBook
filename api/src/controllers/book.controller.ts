import { Request, Response } from 'express';
import { Book } from '../models/book.model';
import logger from '../logger';
import {User, UserType} from '../models/user.model';
import { bookSocket } from '../socket';

export async function getBook(req: Request, res: Response) {
     let book = await Book.findById(req.params.id).exec();
     if (!book) return res.status(404).json({ message: 'Book not found' });
     else return res.status(200).json(book);
}

export async function getBookList(req: Request, res: Response) {
     const size = Number(req.query.size);
     const page = Number(req.query.page);
     const skip = size * (page - 1);

     const books = await Book.find().skip(skip).limit(size).exec();
     if (!books) return res.status(404).json({ message: 'Books not found' });
     else return res.status(200).json(books);
}

export async function createBook(req: Request, res: Response) {
     const book = new Book(req.body);
     book.save()
          .then(() => {
               return res.status(200).json(book);
          })
           .catch((err) => {
               logger.error(err.message);
               return res.status(400).json({ message: err.message });
          });
}

export async function createOffer(req:Request<{id: string}, any, {value: number}>, res: Response) {
    let book = await Book.findById(req.params.id);
    let user = req.user as UserType;
    if (book == null) {
        res.status(404).send({message: 'Book not found'})
        return;
    }
    if (!book.current_offer || book!.current_offer.value < req.body.value) {
        let offer = {
            value: req.body.value,
            user: user._id,
            timestamp: new Date()
        }

        book.current_offer = offer;

        await book.save();
        bookSocket.notifyBook(book._id.toHexString(), offer);
        res.status(200).json({message: 'Successfully offered'});
    }
    else {
        res.status(400).json({message: 'Offer lower than current one'});
    }
}

export async function updateBook(req: Request, res: Response) {
     //TODO
}

export async function deleteBook(req: Request, res: Response) {
     //TODO
}

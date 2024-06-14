import { Request, Response } from 'express';
import { Book } from '../models/book.model';
import logger from '../logger';
import {User, UserType} from '../models/user.model';
import { bookSocket } from '../socket';
import mongoose from 'mongoose';

export async function getBook(req: Request, res: Response) {
     let book = await Book.findById(req.params.id).exec();
     if (!book) return res.status(404).json({ message: 'Book not found' });
     else return res.status(200).json(book);
}

export async function getBookList(req: Request, res: Response) {
     const size = Number(req.query.size ?? 50);
     const page = Number(req.query.page ?? 1)
     const skip = size * (page - 1);

     let search = req.query.search?.toString();
     if (!search) search = "";

     const isbnRegex = /ISBN::(?<isbn>\d*);?/;
     const minRegex = /MIN::(?<min>\d*);?/;
     const maxRegex = /MAX::(?<max>\d*);?/;
     const authorRegex = /AUTHOR::(?<author>[^;]*);?/;
 
     const isbnMatch = search.match(isbnRegex);
     const minMatch = search.match(minRegex);
     const maxMatch = search.match(maxRegex);
     const authorMatch = search.match(authorRegex);

     const isbn = isbnMatch ? isbnMatch.groups?.isbn : undefined;
     const min = minMatch ? minMatch.groups?.min : undefined;
     const max = maxMatch ? maxMatch.groups?.max : undefined;
     const author = authorMatch ? authorMatch.groups?.author : undefined;

     search = search.replace(isbnRegex, "");
     search = search.replace(minRegex, "");
     search = search.replace(maxRegex, "");
     search = search.replace(authorRegex, "");

     let whereConditions: any = {
         ...(isbn && {isbn: isbn}),
         ...((min || max) && {price: { $gte: min, $lte: max }}),
         ...(author && {author: {$regex: '.*' + author + '.*', $options: 'i'}}),
         ...(search && {title: {$regex: '.*' + search + '.*', $options: 'i'}})
     };

     logger.info("Searching books with following where conditions: " + JSON.stringify(whereConditions));
     
     const books = await Book.find({}).skip(skip).where(whereConditions).limit(size).exec();
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
     else return res.status(200).json({data: books, totalPages: totalPages, page: page});
}

export async function createBook(req: Request, res: Response) {
     const book = new Book({...req.body, owner: (req.user as UserType)._id});
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

    if (book.close_date < new Date()) {
        res.status(400).json({message: 'Book auction has ended'});
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
     console.log(req.body);
}

export async function deleteBook(req: Request, res: Response) {
     let book = await Book.findById(req.params.id).exec();
     if (!book) return res.status(404).json({ message: 'Book not found' });
     else {
          book.deleteOne();
          return res.status(200).json({ message: 'Book deleted' });
     }
}

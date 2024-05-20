import { Request, Response } from 'express';
import { Book } from '../models/book.model';
import logger from '../logger';

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

export async function updateBook(req: Request, res: Response) {
     //TODO
}

export async function deleteBook(req: Request, res: Response) {
     //TODO
}
import { Request, Response } from 'express';
import { Book } from '../models/book.model';

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
     const book = new Book({
          owner: req.body.owner,
          title: req.body.title,
          isbn: req.body.isbn,
          author: req.body.author,
          current_offer: req.body.current_offer,
          start_price: req.body.start_price,
          reserve_price: req.body.reserve_price,
          cover: req.body.cover,
          degree_course: req.body.degree_course,
          open_date: req.body.open_date,
          close_date: req.body.close_date
     });

     try {
          await book.save();
     } catch (err: any) {
          return res.status(400).json({ message: err.message });
     }

     return res.status(201).json(book);
}

export async function updateBook(req: Request, res: Response) {
     //TODO
}

export async function deleteBook(req: Request, res: Response) {
     //TODO
}
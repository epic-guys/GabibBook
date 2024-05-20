import mongoose from 'mongoose';
import logger from '../logger'
import { Book, BookType } from '../models/book.model'

export async function seedBooks(): Promise<void> {

     await Book.deleteMany();
     logger.info('🗑️ Book collection deleted');

     const books: BookType[] = [
          { owner: new mongoose.Types.ObjectId('111111111111111111111111'), title: 'Book1', isbn: 's', author: 'Author1', current_offer: 0, start_price: 10, reserve_price: 20, cover: 'cover1.jpg', degree_course: 'Degree1', open_date: new Date(), close_date: new Date(new Date().setDate(new Date().getDate() + 30)) },
          { owner: new mongoose.Types.ObjectId('111111111111111111111111'), title: 'Book2', isbn: '1234567890124', author: 'Author2', current_offer: 0, start_price: 15, reserve_price: 25, cover: 'cover2.jpg', degree_course: 'Degree2', open_date: new Date(), close_date: new Date(new Date().setDate(new Date().getDate() + 30)) },
     ];

     await Book.insertMany(books);
     logger.info('📚 Book collection seeded');
}

import mongoose from 'mongoose';
import logger from '../logger'
import { Book, BookType } from '../models/book.model'

export async function seedBooks(): Promise<void> {

     await Book.deleteMany();
     logger.info('🗑️ Book collection deleted');

     const books: BookType[] = [
         { _id: new mongoose.Types.ObjectId('696969696969696969696969'), owner: new mongoose.Types.ObjectId('111111111111111111111111'), title: 'Book1', isbn: 's', author: 'Author1', current_offer: { value: 0 }, start_price: 10, reserve_price: 20, cover: 'cover1.jpg', degree_course: 'Degree1', open_date: new Date(), close_date: new Date(new Date().setDate(new Date().getDate() + 30)) },
         { _id: new mongoose.Types.ObjectId('420420420420420420420420'), owner: new mongoose.Types.ObjectId('111111111111111111111111'), title: 'Book2', isbn: '1234567890124', author: 'Author2', current_offer: { value: 0 }, start_price: 15, reserve_price: 25, cover: 'cover2.jpg', degree_course: 'Degree2', open_date: new Date(), close_date: new Date(new Date().setDate(new Date().getDate() + 30)) },
         {
             owner: new mongoose.Types.ObjectId("111111111111111111111111"),
             title: "La sacra bibbia",
             isbn: "05406703057823",
             author: "Dio Santissimo in Cielo",
             current_offer: {
                 value: 0,
             },
             start_price: 10,
             reserve_price: 20,
             cover: "cover1.jpg",
             degree_course: "Teologia",
             open_date: new Date("2024-06-12T13:30:38.399Z"),
             close_date: new Date("2024-07-12T13:30:38.399Z"),
         },
        {
            owner: new mongoose.Types.ObjectId('111111111111111111111111'),
            title: 'Il Libro della Genesi',
            isbn: 'ISBN-0001-2345',
            author: 'Dio',
            current_offer: { value: 0 },
            start_price: 100,
            reserve_price: 200,
            cover: 'genesi_cover.jpg',
            degree_course: 'Teologia',
            open_date: new Date(),
            close_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 giorni dopo
        }
     ];

     await Book.insertMany(books);
     logger.info('📚 Book collection seeded');
}

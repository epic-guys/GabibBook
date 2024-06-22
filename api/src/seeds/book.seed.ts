import mongoose from 'mongoose';
import logger from '../logger'
import { Book } from '../models/book.model'
import fs from 'fs';

export async function seedBooks(): Promise<void> {

    await Book.deleteMany();
    logger.info('🗑️ Book collection deleted');

    let books = JSON.parse(fs.readFileSync('seed-data/books/books.json', 'utf8'));

    for (let i = 0; i < books.length; i++) {

        let coverImage = null;
        try {
            coverImage = fs.readFileSync(`seed-data/books/covers/${books[i].cover}`);
            //generate a base64 string
            books[i].cover = 'data:image/format;base64,' + Buffer.from(coverImage).toString('base64');
        } catch (err) {
            logger.error(`🚫 Could not find cover image for book ${books[i].title}`);
        }

        let owner = await mongoose.connection.db.collection('users').findOne({ nickname: books[i].owner });
        
        if(books[i].offers) {
            for (let j = 0; j < books[i].offers.length; j++) {
                let offerer = await mongoose.connection.db.collection('users').findOne({ nickname: books[i].offers[j].user });
                if (offerer) {
                    books[i].offers[j].user = offerer._id;
                } else {
                    logger.error(`🚫 Could not find user with nickname ${books[i].offers[j].user}`);
                }
            }
        }

        if (owner) {
            books[i].owner = owner._id;
        } else {
            logger.error(`🚫 Could not find user with nickname ${books[i].owner}`);
        }

    }

    await Book.insertMany(books);
    logger.info('📚 Book collection seeded');
}

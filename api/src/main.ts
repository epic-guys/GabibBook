import express, { Request, Response } from 'express';
import logger from './logger';
import mongoose from 'mongoose';
import { seedUsers } from './seeds/user.seed';
import userRouter from './routes/user.route';
import bookRouter from './routes/book.route';
import authRouter from './routes/auth.route';
import inviteRouter from './routes/invite.route';
import config from './config';
import { seedBooks } from './seeds/book.seed';
import { io } from './socket';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { UserType, User } from './models/user.model';
import argon2 from 'argon2';
import { seedChats } from './seeds/chat.seed';
import purchaseRouter from './routes/purchase.route';
import { Book } from './models/book.model';
import { Purchase } from './models/purchase.model';
import statsRouter from './routes/statistics.route';
import { seedPurchases } from './seeds/purchase.seed';
import { WebError } from './error';
import notify from './notification';

const cron = require('node-cron');
const moment = require('moment');

const app = express();

app.use(express.json());

app.use((req: any, res: { header: (arg0: string, arg1: string) => void; }, next: () => void) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

mongoose.connect(config.mongodbUri).then(async () => {
    logger.info('🟢 The database is connected.');
    //await seedUsers();
    //await seedBooks(); //this has to be synchronous now
    //await seedChats();
    //await seedPurchases();
    //no need to seed purchases, they are created by the cron job
    mongoose.set('debug', true);
}).catch((err: Error) => {
    logger.error(config.mongodbUri);
    logger.error(`🔴 Unable to connect to the database: ${err}`);
    process.exit(1);
});

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/auth', authRouter);
app.use('/invites', inviteRouter);
app.use('/purchases', purchaseRouter);
app.use('/stats', statsRouter);

app.use((err: any, req: Request, res: Response, next: Function) => {
    res.status(err.status ?? 500).
        json({ message: err.message ?? 'Internal Server Error'});
});

passport.use(new BasicStrategy(
    async (email: string, password: string, done: (error: any, user?: UserType) => void) => {
        try {
            let user = await User.findOne({ email: email }, '+passwordHash').exec();
            if (user == null || !user.enabled) {
                done(null, undefined);
                return;
            }
            let valid = await argon2.verify(user.passwordHash!, password);
            if (valid) {
                delete user.passwordHash;
                done(null, user);
            }
            else done(null, undefined);
        } catch (e) {
            done(e);
        }
    }));


let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
    issuer: config.jwtIssuer
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload: JwtPayload, done: (error: any, user?: UserType) => void) => {
    try {
        let user = await User.findById(jwtPayload._id).select('-passwordHash').exec();

        if (user == null || user.enabled == false) {
            done(new WebError(401, 'Unauthorized'));
            return;
        }
        done(null, user);
    } catch (e) {
        done(e);
    }
}));

let httpServer = app.listen(process.env.API_PORT, () => {
    logger.info('🔴 API server started');
});

io.attach(httpServer);

logger.info('Cron job starting');

cron.schedule('* * * * *', async () => { // This will run every minute
    logger.info('Cron job running');
    const now = moment().toDate();
    const books = await Book.find({ close_date: { $lte: now }, is_order: false , banned: false}).exec();

    const promises = books.map(async (book) => {
        logger.info('Book found');
        
        try {
            const purchase =
                await Purchase.create({
                    buyer: book.offers.length == 0 ? null : book.offers[book.offers.length - 1].user,
                    seller: book.owner,
                    seller_notified: false,
                    buyer_notified: false,
                    auction: book._id,
                    title: book.title,
                    isbn: book.isbn,
                    price: book.offers.length == 0 ? book.reserve_price : book.offers[book.offers.length - 1].value,
                    status: book.offers.length == 0 ? 'reserve_price_not_met' :  book.offers[book.offers.length - 1].value >= book.reserve_price ? 'sold' : 'reserve_price_not_met'
                });
        }
        catch (e) {
            logger.error(e);
            console.error(e);
        }
        
        logger.info('Book sold');
        book.is_order = true;
        await book.save();

        // Notify book owner that the book has been sold
        if (book.offers.length > 0 && book.offers[book.offers.length - 1].value >= book.reserve_price) {
            notify({
                id_user: book.owner,
                message: `The book ${book.title} has been sold!`,
                action: ''
            });

            // Notify the buyer that he was sold the book
            notify({
                id_user: book.offers[book.offers.length - 1].user!._id!,
                message: `You have bought the book ${book.title} for ${book.offers[book.offers.length - 1].value}`,
                action: ''
            });
        }
        else {
            notify({
                id_user: book.owner,
                message: `The book ${book.title} has not been sold!`,
                action: ''
            });

            if (book.offers.length > 0) {
                // Notify the buyer that he was not sold the book
                notify({
                    id_user: book.offers[book.offers.length - 1].user!._id!,
                    message: `Reserve price not met for the book ${book.title}!`,
                    action: ''
                });
            }
        }

    });
    await Promise.all(promises);
});

logger.info('Cron job started');

export default app;

import express from 'express';
import logger from './logger';
import mongoose  from 'mongoose';
import { seedUsers } from './seeds/user.seed';
import userRouter from './routes/user.route';
import bookRouter from './routes/book.route';
import chatRouter from './routes/chat.route';
import authRouter from './routes/auth.route'
import config from './config';
import { seedBooks } from './seeds/book.seed';
import { io } from './socket';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { UserType, User } from './models/user.model';
import argon2 from 'argon2';

const app = express();

app.use(express.json());


mongoose.connect(config.mongodbUri).then(async () => {
    logger.info('🟢 The database is connected.');
    seedUsers();
    seedBooks();
 }).catch((err: Error) => {
    logger.error(`🔴 Unable to connect to the database: ${err}`);
    process.exit(1);
 });

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/chats', chatRouter);
app.use('/auth', authRouter);

passport.use(new BasicStrategy(
    async (email: string, password: string, done: (error: any, user?: UserType) => void) => {
        try {
            let user = await User.findOne({ email: email }).exec();
            if (user == null) {
                throw "User not found";
            }
            let valid = await argon2.verify(user.passwordHash!, password);
            if (valid) {
                delete user.passwordHash;
                done(null, user);
            }
            else done("Password not correct");
        } catch (e) {
            done(e);
        }
}));

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
    issuer: 'epic-guys.org',
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload: JwtPayload, done: (error: any, user?: UserType) => void) => {
    try {
        let user = await User.findById(jwtPayload._id).select('-passwordHash').exec();
        if (user == null) {
            throw "User not found";
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
mongoose.set('debug', true);

export default app;


import express, {Request, Response} from 'express';
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

app.use((req: any, res: { header: (arg0: string, arg1: string) => void; }, next: () => void) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

mongoose.connect(config.mongodbUri).then(async () => {
    logger.info('🟢 The database is connected.');
    await seedUsers();
    await seedBooks(); //this has to be synchronous now
 }).catch((err: Error) => {
    logger.error(config.mongodbUri);
    logger.error(`🔴 Unable to connect to the database: ${err}`);
    process.exit(1);
 });

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/chats', chatRouter);
app.use('/auth', authRouter);

// Only for debugging
// In production it's better to not return the whole error object
app.use((err: Error, req: Request, res: Response, next: any) => {
    logger.error(err);
    res.status(500).json({ message: err });
});

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
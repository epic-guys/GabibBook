import express from 'express';
import logger from './logger';
import mongoose, {HydratedDocument} from 'mongoose';
import { seedUsers } from './seeds/user.seed';
import userRouter from './routes/user.route';
import bookRouter from './routes/book.route';
import chatRouter from './routes/chat.route';
import authRouter from './routes/auth.route'
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserType } from './models/user.model';
import { getUserByEmail } from './controllers/user.controller';
import argon2 from 'argon2';
import { JwtPayload } from 'jsonwebtoken';
import config from './config';
import { getUserById } from './controllers/user.controller';
import { seedBooks } from './seeds/book.seed';

const app = express();

app.use(express.json());

mongoose.connect(config.mongodbUri).then(() => {
    logger.info('🟢 The database is connected.');
    seedUsers();
    seedBooks();
 }).catch((err: Error) => {
    logger.error(`🔴 Unable to connect to the database: ${err}`);
    process.exit(1);
 });

app.use('/user', userRouter);
app.use('/book', bookRouter);
app.use('/chat', chatRouter);
app.use('/auth', authRouter);

//TODO controllare come gestire la nuova chiamata a getUserByEmail
// passport.use(new BasicStrategy(
//     async (email: string, password: string, done: (error: any, user?: UserType) => void) => {
//         let user: HydratedDocument<UserType>;
//         try {
//             user = await getUserByEmail(email);
//             let valid = await argon2.verify(user.password_hash, password);
//             if (valid) done(null, user);
//             else done("Password not correct");
//         } catch (e) {
//             done(e);
//         }
// }));

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
    issuer: 'epic-guys.org',
};

//TODO controllare come gestire la nuova chiamata di getUserById
// passport.use(new JwtStrategy(jwtOptions, async (jwtPayload: JwtPayload, done: (error: any, user?: UserType) => void) => {
//     // TODO assicurarsi che sia in millisecondi (vero, Java?)
//     // Se non c'è la data di scadenza, si fa coalesce con 0, che è sempre minore dell'epoch attuale
//     if (jwtPayload.exp ?? 0 < Date.now()) done("Expired JWT");
//     try {
//         let user = await getUserById(jwtPayload._id);
//         done(null, user);
//     } catch (e) {
//         done(e);
//     }
// }));

app.listen(process.env.API_PORT, () => {
    logger.info('🔴 API server started');
});

export default app;

import express from 'express';
import logger from './logger';
import mongoose from 'mongoose';
import { seedUsers } from './seeds/user.seed';
import userRouter from './routes/user.route';
import bookRouter from './routes/book.route';
import chatRouter from './routes/chat.route';

const app = express();

if(!process.env.PORT) {
     logger.error('No port specified');
     process.exit(1);
}

if(!process.env.MONGODB_URI) {
     logger.error('No MongoDB URI specified');
     process.exit(1);
}

if(!process.env.JWT_PRIVATE_KEY) {
     logger.error('No JWT private key specified');
     process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI).then(() => {
     logger.info('🟢 The database is connected.');
     seedUsers();
 }).catch((err: Error) => {
     logger.error(`🔴 Unable to connect to the database: ${err}`);
     process.exit(1);
 });

app.use('/user', userRouter);
app.use('/book', bookRouter);
app.use('/chat', chatRouter);

export default app;
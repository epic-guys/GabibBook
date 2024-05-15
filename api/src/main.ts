import express from 'express';
import logger from './logger';
import mongoose from 'mongoose';
import { seedUser } from './seeds/user.seed';

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
     logger.info('✅ Connected to MongoDB');
     seedUser();
 }).catch((err: Error) => {
     logger.error('❌ MongoDB connection error: [' + err + ']')
     process.exit(1)
 })
import logger from '../logger'
import { Purchase, PurchaseType } from '../models/purchase.model';
import argon2 from 'argon2'
import fs from 'fs';

export async function seedPurchases(): Promise<void> {

    await Purchase.deleteMany();
    logger.info('🗑️ User collection deleted'); 
    /*
    const purchases: PurchaseType[] = JSON.parse(fs.readFileSync('seed-data/purchases/purchases.json', 'utf8'));

    //missing logic to find user by nickname
    //missing logic to find book by isbn and owner nickname
    //etc...

    await Purchase.insertMany(purchases);
    logger.info('👥 User collection seeded'); */
}

import mongoose from 'mongoose';

export enum Status {
    Reserve_Price_Not_Met = "reserve_price_not_met",
    Sold = "sold",
    Shipped = "shipped",
    Received = "received"
}

export interface PurchaseType {
    _id?: mongoose.Types.ObjectId,
    buyer: mongoose.Types.ObjectId,
    seller: mongoose.Types.ObjectId,
    seller_notified: boolean,
    buyer_notified: boolean,
    auction: mongoose.Types.ObjectId,
    title: string,
    isbn: string,
    price: number,
    status: Status,
}

const purchaseSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller_notified: { type: Boolean, required: true, default: false },
    buyer_notified: { type: Boolean, required: true, default: false },
    auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    title: { type: String, required: true },
    isbn: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true, enum: Object.values(Status) }
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);
import mongoose, { Schema, Model, model } from "mongoose"

export interface OfferType {
    user?: mongoose.Types.ObjectId,
    value: number,
    timestamp?: Date
}


export interface BookType  {
     _id?: mongoose.Types.ObjectId
     owner: mongoose.Types.ObjectId
     title: string
     isbn: string
     author: string
     current_offer: OfferType
     start_price: number
     reserve_price: number
     cover: string
     degree_course: string
     open_date: Date
     close_date: Date
     banned: boolean
}

const bookSchema = new Schema<BookType>({
     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     title: { type: String, required: true },
     isbn: { type: String, required: true },
     author: { type: String, required: true },
     current_offer: new Schema<OfferType>({
         user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
         value: { type: Number, required: true },
         timestamp: { type: Date}
     }),
     start_price: { type: Number, required: true },
     reserve_price: { type: Number, required: true },
     cover: { type: String, required: true },
     degree_course: { type: String, required: true },
     open_date: { type: Date, required: true },
     close_date: { type: Date, required: true },
     banned: { type: Boolean, required: true, default: false}
})


export const Book: Model<BookType> = model("Book", bookSchema)

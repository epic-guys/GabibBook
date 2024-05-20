import mongoose, { Schema, Model, model } from "mongoose"

export interface BookType  {
     owner: mongoose.Types.ObjectId
     title: string
     isbn: string
     author: string
     current_offer: number
     start_price: number
     reserve_price: number
     cover: string
     degree_course: string
     open_date: Date
     close_date: Date
}

const bookSchema = new Schema<BookType>({
     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     title: { type: String, required: true },
     isbn: { type: String, required: true },
     author: { type: String, required: true },
     current_offer: { type: Number, required: true },
     start_price: { type: Number, required: true },
     reserve_price: { type: Number, required: true },
     cover: { type: String, required: true },
     degree_course: { type: String, required: true },
     open_date: { type: Date, required: true },
     close_date: { type: Date, required: true },
})

export const Book: Model<BookType> = model("BookType", bookSchema)
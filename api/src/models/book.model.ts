import mongoose, { Schema, Model, model } from "mongoose"

export interface BookType  {
     id: mongoose.Schema.Types.UUID
     owner: mongoose.Schema.Types.UUID
     title: string
     isbn: string
     author: string
     max_offer: number
     min_offer: number
     reserve_price: number
     cover: string
     degree_course: string
     open_date: Date
     close_date: Date
}

const bookSchema = new Schema<BookType>({
     id: { type: mongoose.Schema.Types.UUID, required: true, unique: true},
     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     title: { type: String, required: true },
     isbn: { type: String, required: true },
     author: { type: String, required: true },
     max_offer: { type: Number, required: true },
     min_offer: { type: Number, required: true },
     reserve_price: { type: Number, required: true },
     cover: { type: String, required: true },
     degree_course: { type: String, required: true },
     open_date: { type: Date, required: true },
     close_date: { type: Date, required: true },
})

export const User: Model<BookType> = model("BookType", bookSchema)
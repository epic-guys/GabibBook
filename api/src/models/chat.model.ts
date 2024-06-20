import mongoose, { Schema, Model, model } from "mongoose"
import {BookType} from "./book.model"
import {UserType} from "./user.model"

export interface Message {
     sender: mongoose.Types.ObjectId
     text: string
     date: Date
}

export interface ChatType {
     book: mongoose.Types.ObjectId
     buyer: mongoose.Types.ObjectId | null
     messages: Array<Message>
}

export interface PopulatedChatType {
    book: BookType,
    buyer: UserType | null,
    messages: Array<Message>
}

const chatSchema = new Schema<ChatType>({
     book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
     buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
     messages: [{ type: new Schema<Message>({
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        date: { type: Date, required: true }
     }), required: true }]
})

export const Chat: Model<ChatType> = model("Chat", chatSchema)

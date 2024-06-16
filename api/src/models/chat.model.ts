import mongoose, { Schema, Model, model } from "mongoose"

interface Message {
     sender: mongoose.Schema.Types.UUID
     text: string
     date: Date
}

export interface ChatType {
     book: mongoose.Schema.Types.UUID
     buyer: mongoose.Schema.Types.UUID | null
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

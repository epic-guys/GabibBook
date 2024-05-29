import mongoose, { Schema, Model, model } from "mongoose"

interface Message {
     id: mongoose.Schema.Types.UUID
     sender: mongoose.Schema.Types.UUID
     text: string
     date: Date
}

export interface ChatType {
     id: mongoose.Schema.Types.UUID
     book: mongoose.Schema.Types.UUID
     owner: mongoose.Schema.Types.UUID
     buyer: mongoose.Schema.Types.UUID | null
     messages: Array<Message>
}

const chatSchema = new Schema<ChatType>({
     id: { type: mongoose.Schema.Types.UUID, required: true, unique: true},
     book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
     messages: [{ type: new Schema<Message>({
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        date: { type: Date, required: true }
     }), required: true }]
})

export const Chat: Model<ChatType> = model("Chat", chatSchema)

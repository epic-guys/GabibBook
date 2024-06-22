import mongoose, { Schema, Model, model } from "mongoose"

export interface InviteType {
    _id?: mongoose.Types.ObjectId,
    expiresDate: Date,
    id_mod: mongoose.Types.ObjectId
}

const inviteSchema = new Schema<InviteType>({
    _id: { type: mongoose.Types.ObjectId, required: true},
    expiresDate: { type: Date, required: true },
    id_mod: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export const Invite: Model<InviteType> = model("Invite", inviteSchema)


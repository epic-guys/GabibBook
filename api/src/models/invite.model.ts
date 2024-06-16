import mongoose, { Schema, Model, model } from "mongoose"

export interface InviteType {
    _id?: mongoose.Schema.Types.UUID,
    expiresDate: Date,
    id_mod: mongoose.Schema.Types.UUID
}

const inviteSchema = new Schema<InviteType>({
    _id: { type: mongoose.Schema.Types.UUID, required: true, unique: true},
    expiresDate: { type: Date, required: true },
    id_mod: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export const Invite: Model<InviteType> = model("Invite", inviteSchema)


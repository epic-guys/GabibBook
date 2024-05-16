import mongoose, { Schema, Model, model } from "mongoose"

export enum Role {
     Student = "student",
     Moderator = "moderator"
}

export interface UserType {
     name: string
     surname: string
     nickname: string
     email: string
     password_hash: string
     role: Role
}

const userSchema = new Schema<UserType>({
     name: { type: String, required: true },
     surname: { type: String, required: true },
     nickname: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     password_hash: { type: String, required: true },
     role: { type: String, enum: Object.values(Role), required: true }
})

export const User: Model<UserType> = model("User", userSchema)


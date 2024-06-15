import { required } from "joi"
import mongoose, { Schema, Model, model } from "mongoose"

export enum Role {
     Student = "student",
     Moderator = "moderator"
}

export interface PaymentMethod {
     name: string
     fullName: string
     number: string
     expiration: string
     type: string
}

export interface UserType {
     _id?: mongoose.Types.ObjectId
     name: string
     surname: string
     nickname: string
     email: string
     passwordHash?: string
     address: string
     city: string
     nation: string
     role: Role
     enabled?: boolean
     paymentMethods: PaymentMethod[] | []
}

const userSchema = new Schema<UserType>({
     _id: { type: mongoose.Schema.Types.ObjectId, auto: false },
     name: { type: String, required: true },
     surname: { type: String, required: true },
     nickname: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     passwordHash: { type: String, required: true },
     address: { type: String, required: true },
     city: { type: String, required: true },
     nation: { type: String, required: true },
     role: { type: String, enum: Object.values(Role), required: true },
     enabled: { type: Boolean, default: false },
     paymentMethods: [new Schema<PaymentMethod>({
          name: { type: String, required: true },
          fullName: { type: String, required: true },
          number: { type: String, required: true },
          expiration: { type: String, required: true },
          type: { type: String, required: true }
     })]
})

export const User: Model<UserType> = model("User", userSchema)


import mongoose from "mongoose";

export interface NotificationType {
    _id?: mongoose.Types.ObjectId,
    id_user: mongoose.Types.ObjectId,
    message: string,
    action: string,
}


const notificationSchema = new mongoose.Schema<NotificationType>({
    _id: { type: mongoose.Types.ObjectId, required: true},
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    action: { type: String, required: true }
});

export const Notification = mongoose.model("Notification", notificationSchema);

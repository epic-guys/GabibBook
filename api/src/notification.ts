import {NotificationType} from "./models/notification.model";
import { notificationSocket } from "./socket";

export default async function notify(notification: NotificationType) {
    await notificationSocket.notifyUser(notification);
}

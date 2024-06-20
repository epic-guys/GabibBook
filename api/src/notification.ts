import {NotificationType} from "./models/notification.model";
import { notificationSocket } from "./socket";

export default function notify(notification: NotificationType) {
    notificationSocket.notifyUser(notification);
}

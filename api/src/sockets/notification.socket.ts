
import { DisconnectReason, Namespace, Server, Socket } from "socket.io";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../config";
import { User, UserType } from "../models/user.model";
import {Notification, NotificationType} from "../models/notification.model";
import logger from "../logger";


export class NotificationSocket {
    io: Server;
    notificationIO: Namespace;
    private connectedUsers: { [userId: string]: Socket } = {};

    constructor(io: Server) {
        this.io = io;
        this.notificationIO = this.io.of('/notifications');

        this.notificationIO.on('connection', async (socket: Socket<any, any, any, {user?: UserType}>) => {
            socket.on('auth', async (event: any) => {
                try {
                    if (socket.data.user) {
                        throw new Error('Already authenticated');
                    }

                    let jwt: string = event?.jwt;
                    if (!jwt) {
                        throw new Error('JWT missing');
                    }
                    // Tocca usare any perché nel tipo payload non c'è _id
                    let payload: any = verify(jwt, config.jwtSecret, { issuer: config.jwtIssuer });
                    let user = await User.findById(payload!._id).exec();
                    if (!user) {
                        throw new Error('User not found');
                    }

                    socket.emit('auth', { 'message': 'Successfully authenticated' });
                    this.connectedUsers[user._id!.toString()] = socket;
                    socket.data.user = user;

                    let notifications = await Notification.find({ id_user: user._id }).exec();
                    notifications.forEach((notification) => {
                        socket.emit('notification', notification);
                    });
                    let ids = notifications.map((n) => n._id);
                    await Notification.deleteMany({ _id: { $in: ids } }).exec();

                    
                } catch (e: any) {
                    socket.emit('error', { 'message': e.message});
                    socket.disconnect();
                }

            });

            socket.on('disconnect', (reason: DisconnectReason) => {
                if (socket.data.user) {
                    delete this.connectedUsers[socket.data.user._id!.toString()];
                }
            });

        });

    }

    private isUserConnected(userId: string): boolean {
        return userId in this.connectedUsers;
    }

    public async notifyUser(notification: NotificationType) {
        let userId = notification.id_user.toString();
        if (this.isUserConnected(userId)) {
            logger.info(`Sending notification to user ${userId}`);
            this.connectedUsers[userId].emit('notification', notification);
        }
        else {
            logger.info(`User ${userId} is not connected, saving notification to database`);
            await new Notification(notification).save();
        }
    }
}


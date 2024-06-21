import { Server, Socket } from 'socket.io';
import {BookSocket} from './sockets/book.socket';
import {ChatSocket} from './sockets/chat.socket';
import {NotificationSocket} from './sockets/notification.socket';


export const io = new Server(
    {cors: {origin: '*'}}
);

export const bookSocket = new BookSocket(io);
export const chatSocket = new ChatSocket(io);
export const notificationSocket = new NotificationSocket(io);

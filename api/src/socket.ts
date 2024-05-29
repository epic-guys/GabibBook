import { Server, Socket } from 'socket.io';
import {BookSocket} from './sockets/book.socket';
import {ChatSocket} from './sockets/chat.socket';


export const io = new Server();

export const bookSocket = new BookSocket(io);
export const chatSocket = new ChatSocket(io);

import { Server, Socket } from 'socket.io';

export const io = new Server();

export const bookIO = io.of('/book');
export const chatIO = io.of('/chat');


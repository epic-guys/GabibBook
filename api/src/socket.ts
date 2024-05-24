import { Server, Socket } from 'socket.io';

export const io = new Server();

export const bookIO = io.of('/book');

bookIO.on('connection', (socket: Socket) => {

    socket.emit('hello', 'world!');

    socket.on('message', (message) => {
        // message = JSON.parse(message);
        socket.join('book:' + message.book);
        socket.emit('message', 'sottoscritto a ' + message.book);
    });
});



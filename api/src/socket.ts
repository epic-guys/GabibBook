import { Server, Socket } from 'socket.io';

export const io = new Server();

io.on('connection', (socket: Socket) => {

    socket.emit('hello', 'world!');

    socket.on('message', (message) => {
        message = JSON.parse(message);
        socket.join('book:' + message.book);
        socket.emit('message', 'sottoscritto a ' + message.book);
    });
});

export function notifyBook(book: string, price: number) {
    io.to('book:' + book).emit('priceUpdate', price);
}


import {Socket} from 'socket.io';
import { bookIO } from '../socket';

function bookRoom(bookId: string): string {
    return 'book:' + bookId;
}

export function notifyBookIO(bookId: string, price: number) {
    bookIO.to(bookRoom(bookId)).emit('priceUpdate', price);
}

bookIO.on('connection', (socket: Socket) => {

    socket.emit('hello', 'world!');

    socket.on('message', (message) => {
        // message = JSON.parse(message);
        socket.join('book:' + message.book);
        socket.emit('message', 'sottoscritto a ' + message.book);
    });
});


import {Namespace, Server, Socket} from 'socket.io';
import {OfferType} from '../models/book.model';


export class BookSocket {
    private io: Server;
    private bookIO: Namespace;

    constructor(io: Server) {
        this.io = io;
        this.bookIO = this.io.of('/book');

        this.bookIO.on('connection', (socket: Socket) => {
            socket.on('trackPrice', (message) => {
                socket.join('book:' + message.book);
                socket.emit('trackPrice', 'sottoscritto a ' + message.book);
            });
        });
    }

    private bookRoom(bookId: string): string {
        return 'book:' + bookId;
    }

    notifyBook(bookId: string, offer: OfferType) {
        this.bookIO.to(this.bookRoom(bookId)).emit('priceUpdate', offer);
    }
}


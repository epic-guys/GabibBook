import {Namespace, Server, Socket} from 'socket.io';
import {Book, OfferType} from '../models/book.model';


export class BookSocket {
    private io: Server;
    private bookIO: Namespace;

    constructor(io: Server) {
        this.io = io;
        this.bookIO = this.io.of('/book');

        this.bookIO.on('connection', (socket: Socket) => {
            socket.on('trackPrice', async (message) => {
                let bookId = message?.book;
                if (!bookId) {
                    socket.emit('error', 'Book not specified');
                    return;
                }

                let book = await Book.findById(bookId).exec();
                if (!book) {
                    socket.emit('error', 'Book not found');
                    return;
                }

                socket.join('book:' + bookId);
                socket.emit('trackPrice', 'sottoscritto a ' + bookId);
                this.notifyBook(bookId, book.current_offer);
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


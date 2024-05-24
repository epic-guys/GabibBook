import { bookIO } from '../socket';

function bookRoom(bookId: string): string {
    return 'book:' + bookId;
}

export function notifyBookIO(bookId: string, price: number) {
    bookIO.to(bookRoom(bookId)).emit('priceUpdate', price);
}


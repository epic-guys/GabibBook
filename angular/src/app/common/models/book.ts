export interface Book {
    uuid: string;
    title: string;
    isbn: string;
    author: string;
    current_offer: {
        value: number;
        currency: string;
    }
    cover: string;

    [key: string]: any;
}
export interface Book {
    uuid: string;
    title: string;
    isbn: string;
    author: string;
    price: string;
    cover: string;

    [key: string]: string;
}
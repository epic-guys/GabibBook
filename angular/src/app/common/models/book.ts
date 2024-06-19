export interface Book {
    uuid: string;
    title: string;
    isbn: string;
    author: string;
    start_price: number;
    offers: any[];
    cover: string;
    degree_course: string;
    close_date: string;
    owner: {
        _id: string;
        name: string;
    }

    [key: string]: any;
}
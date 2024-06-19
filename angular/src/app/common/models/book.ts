export interface Book {
    uuid: string;
    title: string;
    isbn: string;
    author: string;
    current_offer: {
        value: number;
        id: string;
    }
    cover: string;
    degree_course: string;
    close_date: string;
    owner: {
        _id: string;
        name: string;
    }

    [key: string]: any;
}
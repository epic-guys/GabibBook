export interface Message {
    _id: string;
    sender: string;
    text: string;
    date: string;

    [key: string]: any;
}
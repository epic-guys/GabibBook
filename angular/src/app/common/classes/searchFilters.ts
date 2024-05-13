export interface searchFilters {
    isbn: string;
    min: string;
    max: string;
    author: string;

    [key: string]: string;
}
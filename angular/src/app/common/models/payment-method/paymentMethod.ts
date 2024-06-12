export interface PaymentMethod {
    id?: number;
    name: string;
    fullName: string;
    type: string;
    number: string;
    expiration: string;

    [key: string]: string | number | undefined;
}
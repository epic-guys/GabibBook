import { environment } from "src/environments/environment";

export class Auth {
    accessToken: string;
    expirationTimestamp: number;

    constructor(jwt: string) {
        const now = new Date().getTime();

        this.accessToken = jwt;
        this.expirationTimestamp = now + environment.TOKEN_LIFETIME * 1000;
    }
}


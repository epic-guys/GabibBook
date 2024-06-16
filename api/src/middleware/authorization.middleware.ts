import {Request, Response} from "express";
import {Role, UserType} from "../models/user.model";

export function authorize(roles: Role[]) {
    return (req: Request, res: Response, next: Function) => {
        if (!req.user || !(roles.includes((req.user as UserType).role))) {
            res.status(403).send({error: "Unauthorized"});
        } else {
            next();
        }
    }
}


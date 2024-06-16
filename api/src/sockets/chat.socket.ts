import {Namespace, Server, Socket} from "socket.io";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../config";
import {User, UserType} from "../models/user.model";
import {Book} from "../models/book.model";
import {Chat} from "../models/chat.model";
import {Request, Response} from "express";
import passport from "passport";


export class ChatSocket {
    io: Server;
    chatIO: Namespace;

    constructor(io: Server) {
        this.io = io;
        this.chatIO = this.io.of('/chat');
        // disable authentication for now
        // this.chatIO.use(this.authenticateMiddleware);


        this.chatIO.on('connection', (socket: Socket) => {
            let user: UserType;
            try {
            }
            catch (err: any) {
                socket.emit('error', 'Authentication failed');
            }   


            socket.on('subscribeChat', async (event: any) => {
                try {
                   let chat = await Chat.findOne({ book: event.bookId }).exec();
                   // receiveMessage is from the perspective of the client, it's the client that receives the messages
                   socket.emit('receiveMessage', chat!.messages);
                } catch (err: any) {
                    socket.emit('error', err);
                }
            });
        });
    }

    private chatRoom(bookId: string): string {
        return 'chat:' + bookId;
    }

    private async authenticateMiddleware(socket: Socket, next: Function) {
        let token: string | undefined = socket.handshake.auth.token;
        console.log(JSON.stringify(socket.handshake.auth));
        if (!token) return next(new Error('Token not provided'));
        try {
            let payload = verify(token, config.jwtSecret, {issuer: config.jwtIssuer}) as JwtPayload;
            let user = await User.findById(payload._id).exec();
            if (user) {
                socket.data['user'] = user;
                next();
            }
            else {
                throw new Error('User not found');
            }
        } catch (err: any) {
            next(err);
        }
    }
}


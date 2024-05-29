import {Namespace, Server, Socket} from "socket.io";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../config";
import {User, UserType} from "../models/user.model";
import {Book} from "../models/book.model";
import {Chat} from "../models/chat.model";


export class ChatSocket {
    io: Server;
    chatIO: Namespace;

    constructor(io: Server) {
        this.io = io;
        this.chatIO = this.io.of('/chat');

        this.chatIO.on('connection', (socket: Socket) => {
            
            let user: UserType | undefined;

            socket.on('auth', async (event: any) => {
                try {
                    let v = verify(event.jwt, config.jwtSecret) as JwtPayload;
                    user = (await User.findById(v._id).exec())!;
                    socket.emit('auth', 'Benvenuto, ' + user.name);
                }
                catch (err: any) {
                    socket.emit('error', 'Authentication failed');
                }   
            });


            socket.on('subscribeChat', async (event: any) => {
                try {
                   let chat = await Chat.findOne({ book: event.bookId }).exec();
                   socket.emit('newMessage', chat!.messages);
                } catch (err: any) {
                    socket.emit('error', err);
                }
            });

            socket.on('newMessage', (event: any) => {
                try {
                    if (!user) {
                        throw 'Unauthenticated';
                    }

                    
                } catch (err: any) {
                    socket.emit('error', err);
                }
            });
        });
    }

    private chatRoom(bookId: string): string {
        return 'chat:' + bookId;
    }
}


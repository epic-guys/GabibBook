import { Namespace, Server, Socket } from "socket.io";
import { JwtPayload, verify } from "jsonwebtoken";
import config from "../config";
import { User, UserType } from "../models/user.model";
import { Book, BookType } from "../models/book.model";
import { Chat, ChatType, Message, PopulatedChatType } from "../models/chat.model";
import { Request, Response } from "express";
import passport from "passport";
import { HydratedDocument } from "mongoose";


export class ChatSocket {
    io: Server;
    chatIO: Namespace;

    constructor(io: Server) {
        this.io = io;
        this.chatIO = this.io.of('/chats');


        this.chatIO.on('connection', async (socket: Socket) => {
            let user: UserType | null = null;
            let openChats: {[chatId: string]: HydratedDocument<PopulatedChatType>} = {}

            socket.on('auth', async (event: any) => {
                try {
                    let jwt: string = event?.jwt;
                    if (!jwt) {
                        throw new Error('JWT missing');
                    }
                    // Tocca usare any perché nel tipo payload non c'è _id
                    let payload: any = verify(jwt, config.jwtSecret, { issuer: config.jwtIssuer });
                    user = await User.findById(payload!._id).exec();
                    if (!user) {
                        throw new Error('User not found');
                    }

                    socket.emit('auth', { 'message': 'Successfully authenticated' });
                } catch (e: any) {
                    socket.emit('error', { 'message': e.message});
                    socket.disconnect();
                }

            });

            socket.on('subscribeChat', async (event: any) => {
                try {
                    if (!user) {
                        throw new Error('Not authenticated');
                    }
                    let chat = await Chat.
                        findById(event.chatId).
                        populate<Pick<PopulatedChatType, 'book' | 'buyer'>>('book').exec();
                    if (!chat) {
                        throw new Error('Chat not found');
                    }

                    // If 'buyer' is not set, then the chat is public
                    // If 'buyer' is set, then only the buyer and the owner can access the chat
                    if (!chat?.buyer || chat?.buyer === socket.data['user']._id || chat?.book.owner === socket.data['user']._id) {
                        socket.join(this.chatRoom(chat));
                        openChats[chat!._id.toString()] = chat;
                        // receiveMessage is from the perspective of the client, it's the client that receives the messages
                        this.newMessages(chat);
                    }
                    else {
                        throw new Error('Forbidden');
                    }

                } catch (e: any) {
                    socket.emit('error', {'message': e.message});
                }
            });

            socket.on('message', async (event: any) => {
                try {
                    if (!user) {
                        throw new Error('Not authenticated');
                    }

                    if (!(event!.chatId in openChats)) {
                        throw new Error('Chat not subscribed');
                    }

                    let chat = openChats[event.chatId];
                    let message: Message = {
                        sender: user._id!,
                        text: event!.text,
                        date: new Date()
                    }
                    chat.messages.push(message);
                    await chat.save();
                    this.newMessages(chat, [message]);
                } catch (e: any) {
                    socket.emit('error', {'message': e.message});
                }
            })
        });
    }

    /**
     * Broadcasts the new messages to subscribed users.
     * If no messages parameter is specified, all the old messages are sent.
     * Instead, if it is specified, it sends only these messages.
     */
    public newMessages(chat: PopulatedChatType, messages?: Message[]) {
        let event = {
            _id: chat._id,
            messages: (messages ?? chat.messages)
        };

        this.chatIO.to(this.chatRoom(chat)).emit('message', event);
    }

    private chatRoom(chat: PopulatedChatType): string {
        // Chat rooms have the following format:
        // chat:<book_id>:[<buyer_id>]
        // where buyer_id is set only if the chat is private
        return 'chat:' + chat.book._id!.toString() + ':' + (chat.buyer?._id!.toString() ?? '');
    }
}


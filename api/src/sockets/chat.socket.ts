import { DisconnectReason, Namespace, Server, Socket } from "socket.io";
import { verify } from "jsonwebtoken";
import config from "../config";
import { User, UserType } from "../models/user.model";
import { Book, BookType } from "../models/book.model";
import { Chat, ChatType, Message, PopulatedChatType } from "../models/chat.model";
import { HydratedDocument } from "mongoose";
import logger from "../logger";


type ChatSocketType = Socket<any, any, any, {user?: UserType, book: BookType}>;

export class ChatSocket {
    io: Server;
    chatIO: Namespace;
    bookSockets: {[bookId: string]: Set<ChatSocketType>} = {};

    constructor(io: Server) {
        this.io = io;
        this.chatIO = this.io.of('/chats');

        this.chatIO.on('connection', async (socket: ChatSocketType) => {
            logger.log('info', 'New connection to chat socket');

            // Authentication
            socket.on('auth', async (event: any) => {
                logger.info('Authenticating socket ' + socket.id);
                try {
                    let jwt: string = event?.jwt;
                    if (!jwt) {
                        throw new Error('JWT missing');
                    }
                    // Tocca usare any perché nel tipo payload non c'è _id
                    let payload: any = verify(jwt, config.jwtSecret, { issuer: config.jwtIssuer });
                    let user = await User.findById(payload!._id).exec();
                    if (!user) {
                        throw new Error('User not found');
                    }
                    socket.data.user = user;
                    socket.emit('auth', { 'message': 'Successfully authenticated' });
                } catch (e: any) {
                    socket.emit('error', { 'message': e.message});
                    socket.disconnect();
                }

            });

            socket.on('subscribeBook', async (event: any) => {
                logger.info('Subscribing to book ' + event.bookId);
                try {
                    if (!socket.data.user) {
                        throw new Error('Not authenticated');
                    }
                    let book = await Book.findById(event.bookId).exec();
                    if (!book) {
                        throw new Error('Book not found');
                    }

                    let chats: ChatType[];

                    // The user is the owner of the book
                    if (book.owner.toString() === socket.data.user!._id!.toString()) {
                        chats = await Chat.find({book: event.bookId}).exec();
                        // If there are no chats, create only the public chat
                        if (chats.length === 0) {
                            let chat = new Chat({
                                book: book._id,
                                buyer: null,
                                messages: []
                            });
                            await chat.save();
                            chats.push(chat);
                        }

                    }
                    // The user is a buyer, we need only the public chat and the chat with the buyer
                    else {
                        let publicChat = await Chat.findOne({book: event.bookId, buyer: null}).exec();
                        let buyerChat = await Chat.findOne({book: event.bookId, buyer: socket.data.user!._id!}).exec();
                        if (!publicChat) {
                            publicChat = new Chat({
                                book: book._id,
                                buyer: null,
                                messages: []
                            });
                            await publicChat.save();
                        }
                        if (!buyerChat) {
                            buyerChat = new Chat({
                                book: book._id,
                                buyer: socket.data.user!._id!,
                                messages: []
                            });
                            await buyerChat.save();
                        }

                        chats = [publicChat, buyerChat];
                    }

                    // If the user is the first to subscribe to the book, create the set
                    if (this.bookSockets[event.bookId] === undefined) {
                        this.bookSockets[event.bookId] = new Set();
                    }

                    for (let chat of chats) {
                        let event = {
                            _id: chat._id,
                            book: chat.book,
                            buyer: chat.buyer,
                            messages: chat.messages
                        }
                        socket.emit('message', event);
                    }

                    // I put this here to ensure that any other message is sent after the whole chat
                    this.bookSockets[event.bookId].add(socket);
                    socket.data.book = book;

                } catch (e: any) {
                    socket.emit('error', {'message': e.message});
                    logger.error(e.message);
                }
            });
            
            socket.on('disconnect', (reason: DisconnectReason) => {
                if (socket.data.book) {
                    this.bookSockets[socket.data.book._id!.toString()].delete(socket);
                }
            });

            socket.on('message', async (event: any) => {
                try {
                    if (!socket.data.user) {
                        throw new Error('Not authenticated');
                    }

                    let chat = await Chat.findById(event.chatId).populate<Pick<PopulatedChatType, 'book' | 'buyer'>>('book buyer').exec();

                    if (!chat) {
                        throw new Error('Chat not found');
                    }

                    if (!this.canAccessChat(chat, socket.data.user)) {
                        throw new Error('Forbidden');
                    }
                    
                    let message: Message = {
                        sender: socket.data.user._id!,
                        text: event.text,
                        date: new Date()
                    };

                    chat.messages.push(message);
                    await chat.save();

                    this.sendMessages(chat, [message]);

                } catch (e: any) {
                    socket.emit('error', {'message': e.message});
                }
            });
        });
    }

    public sendMessages(chat: PopulatedChatType, messages: Message[], socket?: ChatSocketType) {
        let event = {
            _id: chat._id,
            book: chat.book._id,
            buyer: chat.buyer?._id ?? null,
            messages: messages
        }

        if (socket) {
            socket.emit('message', event);
        }
        else {
            this.bookSockets[chat.book._id!.toString()].forEach(socket => {
                socket.emit('message', event);
            });
        }
    }

    public canAccessChat(chat: PopulatedChatType, user: UserType): boolean {
        // Is the chat public?
        return !chat.buyer
            // Is the user the buyer?
            || chat.buyer._id!.toString() === user._id?.toString()
            // Is the user the owner of the book?
            || chat.book.owner.toString() === user._id?.toString();
    }
}


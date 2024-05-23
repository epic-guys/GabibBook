import { Request, Response, Router } from 'express';
import { getBook, updateBook, deleteBook, getBookList, createBook } from '../controllers/book.controller';
import { validateBook } from '../middleware/book.middleware';
import { Server as IOServer } from 'socket.io';
import {Book} from '../models/book.model';
import {User} from '../models/user.model';
import {io, notifyBook} from '../socket';
const paginator = require('../paginator');

const router = Router();

const socket = new IOServer();

router.get('/', paginator, async (req: Request, res: Response) => {
     try {
          return await getBookList(req, res);
     }
     catch (err: any) {
          res.status(500).json({ message: 'Internal Server Error' });
     }
});

router.get('/:id', async (req: Request, res: Response) => {
     try {
          return await getBook(req, res);
     }
     catch (err: any) {
          res.status(500).json({ message: 'Internal Server Error' });
     }
});

router.put('/:id', validateBook, async (req: Request, res: Response) => {
     try {
          return await updateBook(req, res);
     } catch(err: any) {
          res.status(500).json({ message: 'Internal Server Error' });
     }
});

router.delete('/:id', async (req: Request, res: Response) => {
     try {
          return await deleteBook(req, res);
     }
     catch (err: any) {
          res.status(500).json({ message: 'Internal Server Error' });
     }
});

router.post('/', validateBook, async (req: Request, res: Response) => {
     try {
          return await createBook(req, res);
     }
     catch (err: any) {
          res.status(500).json({ message: 'Internal Server Error' });
     }
});

router.post('/:id/offer', async (req: Request<{id: string}, any, { value: number }>, res: Response) => {
    let book = await Book.findById(req.params.id);
    // TODO Ovviamente cambiare con id utente autenticato
    let sampleUser = (await User.findOne({ email: 'stud@gmail.com' }).exec())!._id;
    if (book == null) {
        res.status(404).send({message: 'Book not found'})
        return;
    }
    if (!book.current_offer || book!.current_offer.value < req.body.value) {
        let offer = {
            value: req.body.value,
            user: sampleUser,
            timestamp: new Date()
        }

        book.current_offer = offer;

        await book.save();
        notifyBook(book._id.toHexString(), offer.value);
        res.status(200).json({message: 'Successfully offered'});
    }
    else {
        res.status(400).json({message: 'Offer lower than current one'});
    }
});

interface BookConnection {
    [id: string]: string
}

let bookConnections: BookConnection = {};


export default router;
module.exports = router;

import { Request, Response, Router } from 'express';
import { getBook, updateBook, deleteBook, getBookList, createBook, createOffer } from '../controllers/book.controller';
import { validateBook, validateOffer } from '../middleware/book.middleware';
import { Server as IOServer } from 'socket.io';
import passport from 'passport';
import config from '../config';
import {authorize} from '../middleware/authorization.middleware';
import {Role} from '../models/user.model';
const paginator = require('../paginator');

const router = Router();

const socket = new IOServer();

router.get('/', paginator, async (req: Request, res: Response) => {
    try {
        return getBookList(req, res);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:id', async (req: Request<{ id: string }, any, any>, res: Response) => {
    try {
        return getBook(req, res);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/:id',
    passport.authenticate('jwt', config.passportOptions),
    authorize([Role.Moderator]),
    validateBook,
    (req: Request<{ id: string }, any, any>, res: Response) => {
        try {
            return updateBook(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
});

router.delete('/:id',
    passport.authenticate('jwt', config.passportOptions),
    authorize([Role.Moderator]),
    async (req: Request<{ id: string }, any, any>, res: Response) => {
        try {
            return deleteBook(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
});

router.post('/',
    passport.authenticate('jwt', config.passportOptions),
    authorize([Role.Student]),
    validateBook,
    async (req: Request, res: Response) => {
        try {
            return createBook(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
});

router.post('/:id/offer',
     passport.authenticate('jwt', config.passportOptions),
     authorize([Role.Student]),
     validateOffer,
     async (req: Request<{ id: string }, any, { value: number }>, res: Response) => {
          try {
               return createOffer(req, res);
          } catch (err: any) {
               res.status(500).json({ message: 'Internal Server Error' });
          }
     }
);

export default router;
module.exports = router;

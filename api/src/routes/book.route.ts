import { Request, Response, Router } from 'express';
import { getBook, updateBook, deleteBook, getBookList, createBook, createOffer } from '../controllers/book.controller';
import { validateBook } from '../middleware/book.middleware';
import { Server as IOServer } from 'socket.io';
import passport from 'passport';
const paginator = require('../paginator');

const router = Router();

const socket = new IOServer();

router.get('/', paginator, getBookList);

router.get('/:id', getBook);

router.put('/:id', passport.authenticate('jwt', { session: false }), validateBook, updateBook);

router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteBook);

router.post('/', validateBook, passport.authenticate('jwt', { session: false }), createBook);

router.post('/:id/offer',
     passport.authenticate('jwt', { session: false }),
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

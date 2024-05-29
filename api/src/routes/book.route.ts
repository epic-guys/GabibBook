import { Request, Response, Router } from 'express';
import { getBook, updateBook, deleteBook, getBookList, createBook, createOffer } from '../controllers/book.controller';
import { validateBook } from '../middleware/book.middleware';
import { Server as IOServer } from 'socket.io';
import passport from 'passport';
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

router.post('/:id/offer', passport.authenticate('jwt', {session: false}), async (req: Request<{id: string}, any, { value: number }>, res: Response) => {
    try {
        return createOffer(req, res);
    } catch (err: any) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
module.exports = router;

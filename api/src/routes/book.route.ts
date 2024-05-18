import { Request, Response, Router } from 'express'
import { getBook, updateBook, deleteBook, getBookList, createBook } from '../controllers/book.controller';
import { validateBook } from '../middleware/book.middleware';
import mongoose from 'mongoose';

const paginator = require('../paginator');

const router = Router();

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

router.post('/create', validateBook, async (req: Request, res: Response) => {
     try {
          return await createBook(req, res);
     }
     catch (err: any) {
          res.status(500).json({ message: 'Internal Server Error' });
     }
});

export default router;
module.exports = router;
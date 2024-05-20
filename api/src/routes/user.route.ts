import {Request, Response, Router} from 'express';
import { registration, login, getUserByEmail, createUser, updateUser, deleteUser, getAllUsers } from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/registration', registration);

userRouter.post('/login', login);

userRouter.get('/:email', async (req: Request, res: Response) => {
    try {
        return await getUserByEmail(req, res);
   } catch(err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
   }
});

userRouter.post('/', async (req: Request, res: Response) => {
    try {
        return await createUser(req, res);
    }
    catch(err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

userRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        return await updateUser(req, res);
    }
    catch(err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

userRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        return await deleteUser(req, res);
    }
    catch(err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

userRouter.get('/', async (req: Request, res: Response) => {
    try {
        return await getAllUsers(req, res);
    }
    catch(err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default userRouter;

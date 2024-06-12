import {Request, Response, Router} from 'express';
import { registration, login, getUserByEmail, createUser, updateUser, deleteUser, getAllUsers, getUserById } from '../controllers/user.controller';
import passport from 'passport';
import {UserType} from '../models/user.model';

const userRouter = Router();

userRouter.post('/registration', registration);

userRouter.post('/login', login);

userRouter.get('/:id',
               passport.authenticate('jwt', { session: false }),
               async (req: Request<{id: string}, any, any>, res: Response) => {
                   try {
                       // if (!req.user._id || req.user._id !== req.params.id) {
                       //     res.status(403).json({ message: 'Forbidden' });
                       // }
                       return await getUserById(req, res);
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

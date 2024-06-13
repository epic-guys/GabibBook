import {Request, Response, Router} from 'express';
import { updateUser, deleteUser, getAllUsers, getUserById } from '../controllers/user.controller';
import passport from 'passport';

const userRouter = Router();

userRouter.get('/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: Request<{id: string}, any, any>, res: Response) => {
        try {
            // if (!req.user._id || req.user._id !== req.params.id) {
            //     res.status(403).json({ message: 'Forbidden' });
            // }
            return await getUserById(req, res);
        } 
        catch(err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

userRouter.put('/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            return await updateUser(req, res);
        }
        catch(err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

userRouter.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            return await deleteUser(req, res);
        }
        catch(err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

userRouter.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            return await getAllUsers(req, res);
        }
        catch(err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

export default userRouter;

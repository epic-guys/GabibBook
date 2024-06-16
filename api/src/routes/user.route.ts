import { Request, Response, Router } from 'express';
import { updateUser, deleteUser, getUserById } from '../controllers/user.controller';
import passport from 'passport';
import { validateUser, isSameUser, isSameUserOrModerator } from '../middleware/user.middleware';

const userRouter = Router();

userRouter.get('/:id', passport.authenticate('jwt', { session: false }),
    isSameUser,
    async (req: Request<{ id: string }, any, any>, res: Response) => {
        try {
            return await getUserById(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

userRouter.put('/:id', passport.authenticate('jwt', { session: false }),
    isSameUser, validateUser,
    async (req: Request<{ id: string }, any, any>, res: Response) => {
        try {
            return await updateUser(req,res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);
userRouter.delete('/:id', passport.authenticate('jwt', { session: false }),
    isSameUserOrModerator,
    async (req: Request<{ id: string }, any, any>, res: Response) => {
        try {
            return await deleteUser(req,res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

export default userRouter;
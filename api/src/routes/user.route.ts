import { Request, Response, Router } from 'express';
import { updateUser, deleteUser, getUserById } from '../controllers/user.controller';
import passport from 'passport';
import { validateUser, isSameUser, isSameUserOrModerator } from '../middleware/user.middleware';
import config from '../config';

const userRouter = Router();

userRouter.get('/:id', passport.authenticate('jwt', config.passportOptions), isSameUser, (req: Request, res: Response) => {
    try {
        return getUserById(req, res);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

userRouter.put('/:id', passport.authenticate('jwt', config.passportOptions), isSameUser, validateUser, (req: Request, res: Response) => {
    try {
        return updateUser(req, res);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

userRouter.delete('/:id', passport.authenticate('jwt', config.passportOptions), isSameUserOrModerator, (req: Request, res: Response) => {
    try {
        return deleteUser(req, res);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default userRouter;

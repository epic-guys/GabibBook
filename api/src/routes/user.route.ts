import { Request, Response, Router } from 'express';
import { updateUser, deleteUser, getUserById, getLastUsers } from '../controllers/user.controller';
import passport from 'passport';
import { validateUser, isSameUser, isSameUserOrModerator } from '../middleware/user.middleware';
import config from '../config';
import { Role } from '../models/user.model';
import { authorize } from '../middleware/authorization.middleware';


const userRouter = Router();

userRouter.get('/', passport.authenticate('jwt', config.passportOptions), authorize([Role.Moderator]),
    async (req: Request, res: Response) => {
        try {
            return getLastUsers(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

userRouter.get('/:id', passport.authenticate('jwt', config.passportOptions), isSameUser,
    async (req: Request, res: Response) => {
        try {
            return getUserById(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

userRouter.put('/:id', passport.authenticate('jwt', config.passportOptions), isSameUser, validateUser,
    async (req: Request, res: Response) => {
        try {
            return updateUser(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

userRouter.delete('/:id', passport.authenticate('jwt', config.passportOptions), isSameUserOrModerator,
    async (req: Request, res: Response) => {
        try {
            return deleteUser(req, res);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

export default userRouter;
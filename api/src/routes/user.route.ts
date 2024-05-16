import {Request, Response, Router} from 'express';
import { registration, login, getUserByEmail, updateUser, deleteUser, getAllUsers } from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/login', login);

userRouter.get('/:email', async (req: Request, res: Response) => {
    let user = await getUserByEmail(req.params.email);
    if (user == null) {
        return res.status(200).json(user);
    }
    else {
        return res.status(404).json({ message: 'User not found' });
    }
});

userRouter.put('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

userRouter.get('/', getAllUsers);

export default userRouter;

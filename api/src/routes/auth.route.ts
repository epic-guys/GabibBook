import { Request, Response, Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import passport from 'passport';
import { validateUser } from '../middleware/user.middleware';


const authRouter = Router();

authRouter.post('/register', validateUser, register);

authRouter.get('/login', passport.authenticate('basic', { session: false }), async (req: Request, res: Response) => {
    try {
        return login(req, res);
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default authRouter;

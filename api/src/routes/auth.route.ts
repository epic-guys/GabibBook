import { Request, Response, Router } from 'express';
import { register, login, requestPasswordReset, resetPassword } from '../controllers/auth.controller';
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

authRouter.post('/request-reset-password', async (req: Request, res: Response) => {
    try{
        return requestPasswordReset(req, res);
    }
    catch(e){
        res.status(500).json({message: 'Internal Server Error'});
    }
});

authRouter.post('/reset-password', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try{
        return resetPassword(req, res);
    }
    catch(e){
        res.status(500).json({message: 'Internal Server Error'});
    }
});

export default authRouter;

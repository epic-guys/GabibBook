import { Router } from 'express';
import { createInvite, getInvites, deleteInvite } from '../controllers/invite.controller';
import passport from 'passport';
import { authorize } from '../middleware/authorization.middleware';
import { Role } from '../models/user.model';


const inviteRouter = Router();

inviteRouter.get('/', passport.authenticate('jwt', { session: false }), authorize([Role.Moderator]), getInvites);

inviteRouter.post('/', passport.authenticate('jwt', { session: false }), authorize([Role.Moderator]), createInvite);

inviteRouter.delete('/', passport.authenticate('jwt', { session: false }), authorize([Role.Moderator]), deleteInvite);

export default inviteRouter;
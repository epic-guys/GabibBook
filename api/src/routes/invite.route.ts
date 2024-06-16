import { Router } from 'express';
import { createInvite } from '../controllers/invite.controller';


const inviteRoute = Router();

inviteRoute.get('/');

inviteRoute.post('/', createInvite);

inviteRoute.delete('/');

export default inviteRoute;
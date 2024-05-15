import { registration, login, getUser, updateUser, deleteUser, getAllUsers } from '../controllers/user.controller';

const router = require('express')();

router.post('/register', registration);

router.post('/login', login);

router.get('/:id', getUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.get('/', getAllUsers);

export default router;
module.exports = router;
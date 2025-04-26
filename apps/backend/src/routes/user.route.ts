import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeAdmin } from '../middlewares/authorize';

const router = Router();

router.get('/:id', getUserById);
router.get('/', authenticate, authorizeAdmin, getUsers);

export default router;

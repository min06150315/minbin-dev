import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/user.controller';

const router = Router();

router.get('/:id', getUserById);
router.get('/', getUsers);

export default router;

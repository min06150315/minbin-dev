import { Router } from 'express';
import { toggleLike, getLikes } from '../controllers/like.controller';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.post('/:postId', authenticate, toggleLike);
router.get('/:postId', getLikes);

export default router;

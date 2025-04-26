import { Router } from 'express';
import { toggleLike, getLikes } from '../controllers/like.controller';

const router = Router();

router.post('/', toggleLike);
router.get('/:postId', getLikes);

export default router;

import express from 'express';
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeCommentOwner } from '../middlewares/authorize';

const router = express.Router();

router.post('/', authenticate, createComment);
router.get('/:postId', getCommentsByPost);
router.put('/:commentId', authenticate, authorizeCommentOwner, updateComment);
router.delete(
  '/:commentId',
  authenticate,
  authorizeCommentOwner,
  deleteComment,
);

export default router;

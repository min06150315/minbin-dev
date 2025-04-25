import express from 'express';
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';

const router = express.Router();

router.post('/', createComment);
router.get('/:postId', getCommentsByPost);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router;

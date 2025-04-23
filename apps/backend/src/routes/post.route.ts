import express, { RequestHandler } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller';

const router = express.Router();

router.get('/', getPosts as RequestHandler);
router.get('/:id', getPostById as RequestHandler);
router.post('/', createPost as RequestHandler);
router.put('/:id', updatePost as RequestHandler);
router.delete('/:id', deletePost as RequestHandler);

export default router;

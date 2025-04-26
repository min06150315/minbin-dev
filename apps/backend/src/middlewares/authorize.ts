import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User } from '../generated/prisma';
import { AuthenticatedRequest } from '../middlewares/authenticate';

const prisma = new PrismaClient();

export const authorizePostOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const postId = Number(req.params.id);
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: '인증되지 않은 요청입니다.' });
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
      return;
    }

    if (post.userId !== userId) {
      res.status(403).json({ message: '권한이 없습니다.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: '포스트 권한 검사 중 오류 발생' });
    return;
  }
};

export const authorizeCommentOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const commentId = Number(req.params.commentId);
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: '인증되지 않은 요청입니다.' });
    return;
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
      return;
    }

    if (comment.userId !== userId) {
      res.status(403).json({ message: '권한이 없습니다.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: '댓글 권한 검사 중 오류 발생' });
    return;
  }
};

export const authorizeAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ message: '권한이 없습니다.' });
    return;
  }

  next();
};

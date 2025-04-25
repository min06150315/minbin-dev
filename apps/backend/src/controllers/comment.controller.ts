import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const createComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { postId, content, parentId } = req.body;

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      // 부모 댓글이 존재하지 않을 경우
      if (!parentComment) {
        res.status(404).json({ error: '부모 댓글이 존재하지 않습니다.' });
        return;
      }

      // 대댓글의 대댓글 방지
      if (parentComment?.parentId) {
        res.status(400).json({ error: '대댓글의 대댓글은 허용되지 않습니다.' });
        return;
      }

      // 부모 댓글과 다른 게시물에 대댓글 작성 방지
      if (parentComment.postId !== postId) {
        res.status(400).json({
          error: '부모 댓글과 다른 게시물에 대댓글을 작성할 수 없습니다.',
        });
        return;
      }
    }

    const newComment = await prisma.comment.create({
      data: { postId, content, parentId },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: '댓글 작성 실패' });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
        parentId: null,
      },
      include: {
        replies: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: '댓글 조회 실패' });
  }
};

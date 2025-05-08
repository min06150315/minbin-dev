import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { AuthenticatedRequest } from '../middlewares/authenticate';

const prisma = new PrismaClient();

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { postId, content, parentId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: '인증이 필요합니다.' });
      return;
    }

    // 포스트 존재 여부 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ error: '포스트가 존재하지 않습니다.' });
      return;
    }

    // parentId가 있는 경우 (대댓글인 경우)
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
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
        content,
        ...(parentId ? { parent: { connect: { id: parentId } } } : {}),
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 작성 실패' });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ error: '포스트가 존재하지 않습니다.' });
      return;
    }

    // 댓글 조회
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
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

export const updateComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    // 댓글 조회
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    // 댓글이 존재하지 않을 경우
    if (!comment) {
      res.status(404).json({ error: '댓글이 존재하지 않습니다.' });
      return;
    }

    // 댓글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: '댓글 수정 실패' });
  }
};

export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const commentId = Number(req.params.commentId);

    // 댓글 조회
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    // 댓글이 존재하지 않을 경우
    if (!comment) {
      res.status(404).json({ error: '댓글이 존재하지 않습니다.' });
      return;
    }

    // 댓글 & 대댓글 삭제
    await prisma.comment.deleteMany({
      where: {
        OR: [{ id: commentId }, { parentId: commentId }],
      },
    });

    res.status(200).json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '댓글 삭제 실패' });
  }
};

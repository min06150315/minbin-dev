import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { AuthenticatedRequest } from '../middlewares/authenticate';

const prisma = new PrismaClient();

// 포스트에 좋아요 추가 또는 취소
export const toggleLike = async (req: AuthenticatedRequest, res: Response) => {
  const postId = Number(req.params.postId);

  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: '인증이 필요합니다.' });
      return;
    }

    // 이미 좋아요가 있는지 확인
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    // 이미 좋아요가 있으면 삭제
    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      res.status(200).json({ liked: false, message: '좋아요 취소' });
    } else {
      // 좋아요가 없으면 생성
      await prisma.like.create({
        data: { userId, postId },
      });
      res.status(201).json({ liked: true, message: '좋아요 추가' });
    }
  } catch (error) {
    console.error('좋아요 처리 오류:', error);
    res.status(500).json({ error: '좋아요 처리 오류' });
  }
};

// 특정 포스트의 좋아요 조회
export const getLikes = async (req: AuthenticatedRequest, res: Response) => {
  const postId = Number(req.params.postId);

  try {
    const likes = await prisma.like.findMany({
      where: { postId },
    });
    res.status(200).json(likes);
  } catch (error) {
    console.error('좋아요 조회 오류:', error);
    res.status(500).json({ error: '좋아요 조회 오류' });
  }
};

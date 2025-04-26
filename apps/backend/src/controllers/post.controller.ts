import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import _ from 'lodash';
import { AuthenticatedRequest } from '../middlewares/authenticate';

const prisma = new PrismaClient();

const examplePosts = [
  {
    id: 1,
    title: '첫 번째 포스트',
    content: '첫 번째 포스트 내용',
    category: 'ReactJS',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    // 필터링 조건
    const filter: any = {};

    // 카테고리 필터링
    if (category && typeof category == 'string') {
      filter.category = category;
    }

    // 검색 필터링 (insensitive 사용해서 대소문자 구분 없이 검색)
    if (search && typeof search == 'string') {
      filter.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: '포스트 가져오기 실패' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          where: { parentId: null },
          include: {
            replies: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) res.status(404).json({ message: '포스트 Not Found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '포스트 가져오기 실패' });
  }
};

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        category,
        userId,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '포스트 생성 실패' });
  }
};

export const updatePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content, category } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    // 포스트 존재 여부와 소유자 확인
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
      return;
    }

    if (post.userId !== userId) {
      res.status(403).json({ message: '권한이 없습니다.' });
      return;
    }

    // 업데이트할 데이터 생성
    const updateData = _.pickBy(
      {
        title,
        content,
        category,
      },
      _.identity,
    );

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '포스트 수정 실패' });
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    // 게시물 삭제 시 댓글 먼저 삭제
    await prisma.comment.deleteMany({
      where: {
        postId: id,
      },
    });

    // 게시물 삭제
    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '포스트 삭제 실패' });
  }
};

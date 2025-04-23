import { Request, Response } from 'express';

const examplePosts = [
  {
    id: 1,
    title: '첫 번째 포스트',
    content: '첫 번째 포스트 내용',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getPosts = async (req: Request, res: Response) => {
  try {
    res.status(200).json(examplePosts);
  } catch (error) {
    res.status(500).json({ message: '포스트 가져오기 실패' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = examplePosts.find((p) => p.id === Number(req.params.id));
    if (!post) {
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '포스트 가져오기 실패' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const newPost = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    examplePosts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: '포스트 생성 실패' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id, title, content } = req.body;
    const post = examplePosts.find((p) => p.id === Number(id));
    if (!post) {
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }
    post.title = title;
    post.content = content;
    post.updatedAt = new Date();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '포스트 수정 실패' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = examplePosts.findIndex((p) => p.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }
    examplePosts.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: '포스트 삭제 실패' });
  }
};

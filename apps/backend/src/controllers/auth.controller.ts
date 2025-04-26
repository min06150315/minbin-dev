import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    // 이메일 중복 체크
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
      return;
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 회원가입
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res.status(201).json({ message: '회원가입 성공', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: '회원가입 실패' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // 이메일 존재 여부 확인
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
      return;
    }

    // 비밀번호 비교
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    // 토큰 생성
    const token = generateToken(user.id);

    // 로그인 성공 및 토큰 반환
    res.status(200).json({ message: '로그인 성공', token });
  } catch (error) {
    res.status(500).json({ message: '로그인 실패' });
  }
};

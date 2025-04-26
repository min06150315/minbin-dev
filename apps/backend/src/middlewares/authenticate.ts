import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '../generated/prisma';

const prisma = new PrismaClient();

// JWT 시크릿 키 설정
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// 인증된 요청에 대한 타입 정의
interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  // 인증 헤더 확인
  const authHeader = req.headers.authorization;

  // 인증 헤더가 없거나 Bearer 토큰이 아닌 경우
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: '인증 헤더가 없습니다.' });
    return;
  }

  // 토큰 추출
  const token = authHeader.split(' ')[1];

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    // 사용자가 존재하지 않는 경우
    if (!user) {
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    // 사용자 정보 저장
    req.user = user;
    // 다음 미들웨어로 전달
    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

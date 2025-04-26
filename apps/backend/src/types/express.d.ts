import { User } from '../generated/prisma';

// 인증된 요청에 대한 타입 정의
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

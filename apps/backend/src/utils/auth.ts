import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 비밀번호 해싱 반복 횟수
const SALT_ROUNDS = 10;

// 토큰 시크릿 키
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// 비밀번호 해싱
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// 비밀번호 비교
export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};

// 토큰 생성
export const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { swaggerUi, swaggerSpec } from './config/swagger';
import postRouter from './routes/post.route';
import projectRouter from './routes/project.route';
import commentRouter from './routes/comment.route';
import likeRouter from './routes/like.route';

// 환경변수 설정
dotenv.config();

// Express 앱 인스턴스 생성 및 서버 포트 설정
const app = express();

// 다른 도메인에서 오는 요청 허용 (CORS 설정)
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 라우터 설정
app.use('/api/posts', postRouter);
app.use('/api/projects', projectRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);

// Swagger 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 서버 포트 설정
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

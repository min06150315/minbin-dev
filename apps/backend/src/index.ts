import express from 'express';
import dotenv from 'dotenv';
// import cors from "cors";
import postRouter from './routes/post.route';

// 환경변수 설정
dotenv.config();

// Express 앱 인스턴스 생성 및 서버 포트 설정
const app = express();
const port = process.env.PORT || 4000;

// 다른 도메인에서 오는 요청 허용 (CORS 설정)
// app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 라우터 설정
app.get('/', (req, res) => {
  res.send('Hello, Minbin!');
});

app.use('/posts', postRouter);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

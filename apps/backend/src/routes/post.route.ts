import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller';
import { authenticate } from '../middlewares/authenticate';

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: 모든 포스트 가져오기
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 카테고리로 필터링
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 제목 또는 내용으로 검색
 *     responses:
 *       200:
 *         description: 포스트 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: 서버 오류
 */
router.get('/', getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: ID로 포스트 가져오기
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 포스트 ID
 *     responses:
 *       200:
 *         description: 포스트 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: 포스트를 찾을 수 없음
 */
router.get('/:id', getPostById);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: 새 포스트 생성
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: 생성된 포스트
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: 잘못된 요청
 */
router.post('/', authenticate, createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: 포스트 수정
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 포스트 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: 수정된 포스트
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: 포스트를 찾을 수 없음
 */
router.put('/:id', authenticate, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: 포스트 삭제
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 포스트 ID
 *     responses:
 *       200:
 *         description: 포스트가 성공적으로 삭제됨
 *       404:
 *         description: 포스트를 찾을 수 없음
 */
router.delete('/:id', authenticate, deletePost);

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         category:
 *           type: string
 *           enum: [ReactJS, NextJS, TailwindCSS, Typescript, NodeJS]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PostInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - category
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         category:
 *           type: string
 *           enum: [ReactJS, NextJS, TailwindCSS, Typescript, NodeJS]
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

export default router;

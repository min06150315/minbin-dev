import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minbin API',
      version: '1.0.0',
      description: 'Minbin API 문서',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '개발 서버',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // API 라우트 파일들의 경로
};

export const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi };

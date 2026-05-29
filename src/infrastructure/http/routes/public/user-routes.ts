import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers';

const userController = new UserController();

export async function publicUserRoutes(app: FastifyInstance) {
  app.post('/register', {
    schema: {
      tags: ['Usuários'],
      summary: 'Cadastrar novo usuário',
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
        400: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  }, userController.register);
}

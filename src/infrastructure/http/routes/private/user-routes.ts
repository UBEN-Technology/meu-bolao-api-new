import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const userController = new UserController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function privateUserRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/me', {
    schema: {
      tags: ['Usuários'],
      summary: 'Obter perfil do usuário autenticado',
      security: bearerAuth,
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            document: { type: 'string' },
            isAdmin: { type: 'boolean' },
            role: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        400: errorSchema,
      },
    },
  }, userController.getMe);

  app.patch('/me', {
    schema: {
      tags: ['Usuários'],
      summary: 'Atualizar perfil do usuário autenticado',
      security: bearerAuth,
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
        400: errorSchema,
      },
    },
  }, userController.updateMe);
}

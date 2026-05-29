import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';

const userController = new UserController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function adminUserRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.get('/', {
    schema: {
      tags: ['Admin — Usuários'],
      summary: 'Listar todos os usuários',
      security: bearerAuth,
      response: {
        200: { type: 'array', items: { type: 'object' } },
        403: errorSchema,
      },
    },
  }, userController.listUsers);

  app.post('/promote', {
    schema: {
      tags: ['Admin — Usuários'],
      summary: 'Promover usuário para admin',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
        },
      },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        400: errorSchema,
        403: errorSchema,
      },
    },
  }, userController.promoteUser);

  app.patch('/status', {
    schema: {
      tags: ['Admin — Usuários'],
      summary: 'Ativar / desativar conta de usuário',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
        },
      },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        400: errorSchema,
        403: errorSchema,
      },
    },
  }, userController.toggleUserStatus);
}

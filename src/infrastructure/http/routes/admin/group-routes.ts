import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { GroupController } from '../../controllers';

const groupController = new GroupController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function adminGroupRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.get('/', {
    schema: {
      tags: ['Admin — Grupos'],
      summary: 'Listar todos os grupos',
      security: bearerAuth,
      response: {
        200: { type: 'array', items: { type: 'object' } },
        403: errorSchema,
      },
    },
  }, groupController.listGroups);

  app.patch('/status', {
    schema: {
      tags: ['Admin — Grupos'],
      summary: 'Ativar / desativar grupo',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['groupId'],
        properties: {
          groupId: { type: 'string' },
        },
      },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        400: errorSchema,
        403: errorSchema,
      },
    },
  }, groupController.toggleGroupStatus);
}

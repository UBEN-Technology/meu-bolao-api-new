import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/auth-middleware';
import { TeamController } from '../../controllers';

const teamController = new TeamController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function privateTeamRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/:championshipId', {
    schema: {
      tags: ['Times'],
      summary: 'Listar times de um campeonato',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['championshipId'],
        properties: { championshipId: { type: 'number' } },
      },
      response: {
        200: { type: 'array', items: { type: 'object' } },
        400: errorSchema,
      },
    },
  }, teamController.listTeamsByChampionship);
}

import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/auth-middleware';
import { ChampionshipController } from '../../controllers';

const championshipController = new ChampionshipController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function privateChampionshipRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/', {
    schema: {
      tags: ['Campeonatos'],
      summary: 'Listar campeonatos disponíveis',
      security: bearerAuth,
      response: {
        200: { type: 'array', items: { type: 'object' } },
        400: errorSchema,
      },
    },
  }, championshipController.listChampionships);
}

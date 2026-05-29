import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/auth-middleware';
import { MatchController } from '../../controllers';

const matchController = new MatchController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function privateMatchRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/:championshipId', {
    schema: {
      tags: ['Partidas'],
      summary: 'Listar partidas de um campeonato',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['championshipId'],
        properties: { championshipId: { type: 'number' } },
      },
      response: {
        200: { type: 'array', items: { type: 'object', properties: { 
          id: { type: 'string' },
          homeTeamId: { type: 'number' },
          awayTeamId: { type: 'number' },
          matchDate: { type: 'string', format: 'date-time' },
          homeScore: { type: 'number' },
          awayScore: { type: 'number' },
          status: { type: 'string' },
        } } },
        400: errorSchema,
      },
    },
  }, matchController.listMatches);
}

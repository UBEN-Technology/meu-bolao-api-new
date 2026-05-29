import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { MatchController } from '../../controllers';

const matchController = new MatchController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function adminMatchRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.post('/', {
    schema: {
      tags: ['Admin — Partidas'],
      summary: 'Criar partida',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['championshipId', 'homeTeamId', 'awayTeamId', 'matchDate'],
        properties: {
          championshipId: { type: 'number' },
          homeTeamId: { type: 'number' },
          awayTeamId: { type: 'number' },
          matchDate: { type: 'string', format: 'date-time' },
          round: { type: 'string' },
        },
      },
      response: {
        201: { type: 'object' },
        400: errorSchema,
        403: errorSchema,
      },
    },
  }, matchController.createMatch);

  app.patch('/:matchId/result', {
    schema: {
      tags: ['Admin — Partidas'],
      summary: 'Registrar resultado de uma partida',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['matchId'],
        properties: { matchId: { type: 'number' } },
      },
      body: {
        type: 'object',
        required: ['homeScore', 'awayScore'],
        properties: {
          homeScore: { type: 'number', minimum: 0 },
          awayScore: { type: 'number', minimum: 0 },
        },
      },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        400: errorSchema,
        403: errorSchema,
      },
    },
  }, matchController.update);
}

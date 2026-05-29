import { FastifyInstance } from 'fastify';
import { PredictionController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const predictionController = new PredictionController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function privatePredictionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.post('/', {
    schema: {
      tags: ['Palpites'],
      summary: 'Criar palpite para uma partida',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['groupId', 'matchId', 'homeScore', 'awayScore'],
        properties: {
          groupId: { type: 'string' },
          matchId: { type: 'number' },
          homeScore: { type: 'number', minimum: 0 },
          awayScore: { type: 'number', minimum: 0 },
        },
      },
      response: {
        201: { type: 'object', properties: { message: { type: 'string' }, prediction: { type: 'object' } } },
        400: errorSchema,
      },
    },
  }, predictionController.create);

  app.put('/:id', {
    schema: {
      tags: ['Palpites'],
      summary: 'Atualizar palpite existente',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
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
      },
    },
  }, predictionController.update);
}

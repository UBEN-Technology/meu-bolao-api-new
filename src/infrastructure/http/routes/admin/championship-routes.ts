import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { ChampionshipController } from '../../controllers';

const championshipController = new ChampionshipController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function adminChampionshipRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.post('/', {
    schema: {
      tags: ['Admin — Campeonatos'],
      summary: 'Criar campeonato',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['name', 'season'],
        properties: {
          name: { type: 'string' },
          season: { type: 'string' },
          country: { type: 'string' },
          logoUrl: { type: 'string' },
        },
      },
      response: {
        201: { type: 'object' },
        400: errorSchema,
        403: errorSchema,
      },
    },
  }, championshipController.createChampionship);

  app.get('/:id', {
    schema: {
      tags: ['Admin — Campeonatos'],
      summary: 'Buscar campeonato por ID',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'number' } },
      },
      response: {
        200: { type: 'object' },
        404: errorSchema,
        403: errorSchema,
      },
    },
  }, championshipController.findChampionship);

  app.post('/:id/finish', {
    schema: {
      tags: ['Admin — Campeonatos'],
      summary: 'Finalizar campeonato e distribuir prêmios',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'number' }, tittle: { type: 'string' }, description: { type: 'string' }, status: { type: 'string' } },
      },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        400: errorSchema,
        403: errorSchema,
      },
    },
  }, championshipController.finishChampionship);
}

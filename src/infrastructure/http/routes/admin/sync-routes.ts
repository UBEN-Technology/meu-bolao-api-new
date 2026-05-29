import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { AdminSyncController } from '../../controllers';

const adminSyncController = new AdminSyncController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };
const syncResponse = {
  200: { type: 'object', properties: { message: { type: 'string' }, synced: { type: 'number' } } },
  400: errorSchema,
  403: errorSchema,
};

export async function adminSyncRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.post('/championships', {
    schema: {
      tags: ['Admin — Sync'],
      summary: 'Sincronizar campeonatos externos',
      security: bearerAuth,
      response: syncResponse,
    },
  }, adminSyncController.syncChampionships);

  app.post('/teams/:championshipId', {
    schema: {
      tags: ['Admin — Sync'],
      summary: 'Sincronizar times de um campeonato',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['championshipId'],
        properties: { championshipId: { type: 'number' } },
      },
      response: syncResponse,
    },
  }, adminSyncController.syncTeams);

  app.post('/matches/:championshipId', {
    schema: {
      tags: ['Admin — Sync'],
      summary: 'Sincronizar partidas de um campeonato',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['championshipId'],
        properties: { championshipId: { type: 'number' } },
      },
      response: syncResponse,
    },
  }, adminSyncController.syncMatches);

  app.post('/results/:championshipId', {
    schema: {
      tags: ['Admin — Sync'],
      summary: 'Sincronizar resultados de um campeonato',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['championshipId'],
        properties: { championshipId: { type: 'number' } },
      },
      response: syncResponse,
    },
  }, adminSyncController.syncResults);
}

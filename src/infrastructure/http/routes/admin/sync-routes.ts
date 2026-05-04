import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { AdminSyncController } from '../../controllers';

const adminSyncController = new AdminSyncController();

export async function adminSyncRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.post('/championships', adminSyncController.syncChampionships);
  app.post('/teams/:championshipId', adminSyncController.syncTeams);
  app.post('/matches/:championshipId', adminSyncController.syncMatches);
  app.post('/results/:championshipId', adminSyncController.syncResults);
}

import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { ChampionshipController } from '../../controllers';

const championshipController = new ChampionshipController();

export async function adminChampionshipRoutes(app: FastifyInstance) {
  // Todas as rotas aqui requerem autenticação e privilégio de admin
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.post('/', championshipController.createChampionship);
  app.get('/:id', championshipController.findChampionship);
  app.post('/:id/finish', championshipController.finishChampionship);
}
import { FastifyInstance } from 'fastify';
import { WalletController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const walletController = new WalletController();

export async function privateWalletRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/balance', walletController.getBalance);
  app.post('/deposit', walletController.deposit);
  app.post('/withdraw', walletController.withdraw);
}

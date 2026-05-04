import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const userController = new UserController();

export async function privateUserRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/me', userController.getMe);
  app.patch('/me', userController.updateMe);
}

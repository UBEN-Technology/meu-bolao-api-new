import { FastifyInstance } from 'fastify';
import { PaymentController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const paymentController = new PaymentController();

export async function privatePaymentRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.post('/pix', paymentController.createPix);
  app.post('/card', paymentController.createCard);
  app.get('/status/:transactionId', paymentController.getStatus);
}

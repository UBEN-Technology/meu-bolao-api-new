import { FastifyInstance } from 'fastify';
import { PaymentController } from '../../controllers';

const paymentController = new PaymentController();

export async function webhookRoutes(app: FastifyInstance) {
  app.post('/pagarme', paymentController.processWebhook);
}

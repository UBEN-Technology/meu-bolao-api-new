import { FastifyInstance } from 'fastify';
import { AuthController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const authController = new AuthController();

export async function publicAuthRoutes(app: FastifyInstance) {
  app.post('/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes',
      }
    }
  }, authController.login);

  app.post('/refresh', authController.refresh);
  app.post('/logout', authController.logout);
  app.post('/forgot-password', authController.forgotPassword);
  app.post('/reset-password', authController.resetPassword);
  app.get('/confirm-email', authController.confirmEmail);
  app.post('/resend-confirmation', authController.resendConfirmation);
  app.post('/change-password', { preHandler: authenticate }, authController.changePassword);
}

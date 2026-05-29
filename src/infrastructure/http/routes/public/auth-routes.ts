import { FastifyInstance } from 'fastify';
import { AuthController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const authController = new AuthController();

const bearerAuth = [{ bearerAuth: [] }];

const errorSchema = {
  type: 'object',
  properties: { message: { type: 'string' } },
};

export async function publicAuthRoutes(app: FastifyInstance) {
  app.post('/login', {
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    schema: {
      tags: ['Auth'],
      summary: 'Login do usuário',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                document: { type: 'string' },
                isAdmin: { type: 'boolean' },
                role: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        401: errorSchema,
      },
    },
  }, authController.login);

  app.post('/refresh', {
    schema: {
      tags: ['Auth'],
      summary: 'Renovar access token',
      body: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        401: errorSchema,
      },
    },
  }, authController.refresh);

  app.post('/logout', {
    schema: {
      tags: ['Auth'],
      summary: 'Logout (invalida o token)',
      security: bearerAuth,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
        401: errorSchema,
      },
    },
  }, authController.logout);

  app.post('/forgot-password', {
    schema: {
      tags: ['Auth'],
      summary: 'Solicitar redefinição de senha',
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
        400: errorSchema,
      },
    },
  }, authController.forgotPassword);

  app.post('/reset-password', {
    schema: {
      tags: ['Auth'],
      summary: 'Redefinir senha com token',
      body: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string' },
          password: { type: 'string', minLength: 8 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
        400: errorSchema,
      },
    },
  }, authController.resetPassword);

  app.get('/confirm-email', {
    schema: {
      tags: ['Auth'],
      summary: 'Confirmar e-mail via token',
      querystring: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
        400: errorSchema,
      },
    },
  }, authController.confirmEmail);

  app.post('/resend-confirmation', {
    schema: {
      tags: ['Auth'],
      summary: 'Reenviar e-mail de confirmação',
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
        400: errorSchema,
      },
    },
  }, authController.resendConfirmation);

  app.post('/change-password', {
    schema: {
      tags: ['Auth'],
      summary: 'Alterar senha (autenticado)',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['oldPassword', 'newPassword'],
        properties: {
          oldPassword: { type: 'string' },
          newPassword: { type: 'string', minLength: 8 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
        400: errorSchema,
      },
    },
    preHandler: authenticate,
  }, authController.changePassword);
}

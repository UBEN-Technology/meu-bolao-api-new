import { FastifyInstance } from 'fastify';
import { AuditLogsController } from '../../controllers';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';

const auditLogsController = new AuditLogsController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function adminAuditLogsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.get('/', {
    schema: {
      tags: ['Admin — Auditoria'],
      summary: 'Listar logs de auditoria',
      security: bearerAuth,
      querystring: {
        type: 'object',
        properties: {
          userId: { type: 'string', description: 'Filtrar por usuário' },
          action: { type: 'string', description: 'Filtrar por ação' },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            logs: { type: 'array', items: { type: 'object', properties: { 
              id: { type: 'string' },
              userId: { type: 'string' },
              action: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' }
            } } },
            total: { type: 'number' },
          },
        },
        403: errorSchema,
      },
    },
  }, auditLogsController.listAuditLogs);
}

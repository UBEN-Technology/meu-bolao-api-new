import { FastifyInstance } from 'fastify';
import { authenticate, checkAdmin } from '../../middlewares/auth-middleware';
import { TeamController } from '../../controllers';

const teamController = new TeamController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function adminTeamRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', checkAdmin);

  app.post('/', {
    schema: {
      tags: ['Admin — Times'],
      summary: 'Criar time',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['name', 'championshipId'],
        properties: {
          name: { type: 'string' },
          shortName: { type: 'string' },
          logoUrl: { type: 'string' },
          championshipId: { type: 'number' },
        },
      },
      response: {
        201: { type: 'object' },
        400: errorSchema,
        403: errorSchema,
      },
    },
  }, teamController.createTeam);
}

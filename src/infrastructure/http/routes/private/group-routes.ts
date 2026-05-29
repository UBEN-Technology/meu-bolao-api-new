import { FastifyInstance } from 'fastify';
import { GroupController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const groupController = new GroupController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function privateGroupRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.post('/', {
    schema: {
      tags: ['Grupos'],
      summary: 'Criar grupo de bolão',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['championshipId', 'title'],
        properties: {
          championshipId: { type: 'number' },
          title: { type: 'string' },
          description: { type: 'string' },
          isPublic: { type: 'boolean' },
          maxMembers: { type: 'number' },
          entryFee: { type: 'number' },
          hasPrize: { type: 'boolean' },
          prizes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                position: { type: 'number' },
                percentage: { type: 'number' },
              },
            },
          },
        },
      },
      response: {
        201: { type: 'object', properties: { message: { type: 'string' }, group: { type: 'object' } } },
        400: errorSchema,
      },
    },
  }, groupController.create);

  app.get('/public', {
    schema: {
      tags: ['Grupos'],
      summary: 'Listar grupos públicos disponíveis',
      security: bearerAuth,
      response: {
        200: { 
          type: 'array', 
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              ownerId: { type: 'string' },
              championshipId: { type: 'number' },
              title: { type: 'string' },
              inviteCode: { type: 'string' },
              privacyType: { type: 'string' },
              entryDeadline: { type: 'string', format: 'date-time' },
              maxMembers: { type: 'number' },
              entryFee: { type: 'number' },
              hasPrize: { type: 'boolean' },
              isActive: { type: 'boolean' }
            }
          } 
        },
        400: errorSchema,
      },
    },
  }, groupController.listPublic);

  app.get('/me', {
    schema: {
      tags: ['Grupos'],
      summary: 'Listar meus grupos',
      security: bearerAuth,
      response: {
        200: { 
          type: 'array', 
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              ownerId: { type: 'string' },
              championshipId: { type: 'number' },
              title: { type: 'string' },
              inviteCode: { type: 'string' },
              privacyType: { type: 'string' },
              entryDeadline: { type: 'string', format: 'date-time' },
              maxMembers: { type: 'number' },
              entryFee: { type: 'number' },
              hasPrize: { type: 'boolean' },
              isActive: { type: 'boolean' }
            }
          } 
        },
        400: errorSchema,
      },
    },
  }, groupController.listMyGroups);

  app.get('/mine', { schema: { hide: true } }, groupController.listMyGroups);

  app.post('/join', {
    schema: {
      tags: ['Grupos'],
      summary: 'Entrar em um grupo',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['groupId'],
        properties: {
          groupId: { type: 'string' },
          inviteCode: { type: 'string' },
        },
      },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        400: errorSchema,
      },
    },
  }, groupController.join);

  app.get('/:groupId/ranking', {
    schema: {
      tags: ['Grupos'],
      summary: 'Ranking do grupo',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['groupId'],
        properties: { groupId: { type: 'string' } },
      },
      response: {
        200: { type: 'array', items: { 
          type: 'object',
          properties: {
            userId: { type: 'string' },
            userName: { type: 'string' },
            points: { type: 'number' },
            position: { type: 'number' }
          }
        } },
        400: errorSchema,
      },
    },
  }, groupController.getRanking);

  app.get('/:groupId/matches', {
    schema: {
      tags: ['Grupos'],
      summary: 'Partidas do grupo',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['groupId'],
        properties: { groupId: { type: 'string' } },
      },
      response: {
        200: { type: 'array', items: { type: 'object', properties: { 
          matchId: { type: 'number' },
          homeTeam: { type: 'string' },
          awayTeam: { type: 'string' },
          matchDate: { type: 'string', format: 'date-time' },
          userPrediction: { type: 'object', properties: {
            homeScore: { type: 'number' },
            awayScore: { type: 'number' }
          } }
        } } },
        400: errorSchema,
      },
    },
  }, groupController.getMatches);

  app.get('/:groupId/members', {
    schema: {
      tags: ['Grupos'],
      summary: 'Membros do grupo',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['groupId'],
        properties: { groupId: { type: 'string' } },
      },
      response: {
        200: { type: 'array', items: { type: 'object', properties: { 
          userId: { type: 'string' },
          userName: { type: 'string' }
        } } },
        400: errorSchema,
      },
    },
  }, groupController.listMembers);

  app.get('/:groupId/prize-pool', {
    schema: {
      tags: ['Grupos'],
      summary: 'Pool de premiação do grupo',
      security: bearerAuth,
      params: {
        type: 'object',
        required: ['groupId'],
        properties: { groupId: { type: 'string' } },
      },
      response: {
        200: { type: 'object' },
        400: errorSchema,
      },
    },
  }, groupController.getPrizePool);
}

import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { ENVS } from '@/utils';
import {
  adminAuditLogsRoutes,
  adminChampionshipRoutes,
  adminGroupRoutes,
  adminMatchRoutes,
  adminSyncRoutes,
  adminTeamRoutes,
  adminUserRoutes,
  privateChampionshipRoutes,
  privateGroupRoutes,
  privateMatchRoutes,
  // privatePaymentRoutes,
  privatePredictionRoutes,
  privateTeamRoutes,
  privateUserRoutes,
  privateWalletRoutes,
  publicAuthRoutes,
  publicUserRoutes,
} from './routes';

const app = fastify({ logger: true });

app.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Palpite Arena API',
      description: 'API para o sistema de palpites Palpite Arena — gerenciamento de grupos, palpites, carteira e administração.',
      version: '1.0.0',
    },
    servers: [
      { url: 'http://localhost:3333', description: 'Local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Autenticação e gerenciamento de sessão' },
      { name: 'Usuários', description: 'Cadastro e perfil do usuário' },
      { name: 'Grupos', description: 'Criação, listagem e participação em grupos de bolão' },
      { name: 'Palpites', description: 'Registro e atualização de palpites' },
      { name: 'Partidas', description: 'Consulta de partidas' },
      { name: 'Times', description: 'Consulta de times' },
      { name: 'Campeonatos', description: 'Consulta de campeonatos' },
      { name: 'Carteira', description: 'Saldo, depósito, saque e extrato de transações' },
      { name: 'Admin — Usuários', description: 'Gestão de usuários (requer admin)' },
      { name: 'Admin — Campeonatos', description: 'Gestão de campeonatos (requer admin)' },
      { name: 'Admin — Times', description: 'Gestão de times (requer admin)' },
      { name: 'Admin — Partidas', description: 'Gestão de partidas (requer admin)' },
      { name: 'Admin — Grupos', description: 'Gestão de grupos (requer admin)' },
      { name: 'Admin — Auditoria', description: 'Logs de auditoria (requer admin)' },
      { name: 'Admin — Sync', description: 'Sincronização de dados externos (requer admin)' },
    ],
  },
});

app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
    persistAuthorization: true,
  },
});

app.register(cors, {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

app.register(jwt, {
  secret: ENVS.CONFIG.JWT_SECRET
});

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: (_req, context) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Limite de ${context.max} requisições por ${context.after}. Tente novamente mais tarde.`,
    retryAfter: context.after
  })
});

// Helmet-like security headers (skipped for Swagger UI)
app.addHook('onSend', async (request, reply, payload) => {
  if (request.url.startsWith('/docs')) return payload;

  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('X-XSS-Protection', '1; mode=block');
  reply.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  reply.header('Content-Security-Policy', "default-src 'self'");
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  reply.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  return payload;
});

// PUBLIC ROUTES
app.register(publicAuthRoutes, { prefix: '/auth' });
app.register(publicUserRoutes, { prefix: '/users' });

// PRIVATE ROUTES
app.register(privateGroupRoutes, { prefix: '/groups' });
app.register(privatePredictionRoutes, { prefix: '/predictions' });
app.register(privateMatchRoutes, { prefix: '/matches' });
app.register(privateTeamRoutes, { prefix: '/teams' });
app.register(privateChampionshipRoutes, { prefix: '/championships' });
app.register(privateUserRoutes, { prefix: '/users' });
app.register(privateWalletRoutes, { prefix: '/wallet' });
// app.register(privatePaymentRoutes, { prefix: '/payments' });

// ADMIN ROUTES
app.register(adminUserRoutes, { prefix: '/admin/users' });
app.register(adminChampionshipRoutes, { prefix: '/admin/championships' });
app.register(adminTeamRoutes, { prefix: '/admin/teams' });
app.register(adminMatchRoutes, { prefix: '/admin/matches' });
app.register(adminGroupRoutes, { prefix: '/admin/groups' });
app.register(adminAuditLogsRoutes, { prefix: '/admin/audit-logs' });
app.register(adminSyncRoutes, { prefix: '/admin/sync' });

app.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

app.get('/webhooks/pagarme', async (_request, reply) => {
  return reply.status(200).send({ message: 'Webhook endpoint disponível para POST.' });
});

export { app };

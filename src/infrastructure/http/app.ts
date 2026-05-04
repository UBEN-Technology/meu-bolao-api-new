import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
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
  privatePaymentRoutes,
  privatePredictionRoutes,
  privateTeamRoutes,
  privateUserRoutes,
  privateWalletRoutes,
  publicAuthRoutes,
  publicUserRoutes,
} from './routes';

const app = fastify({ logger: true });

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

// Helmet-like security headers
app.addHook('onSend', async (_request, reply, payload) => {
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
app.register(privatePaymentRoutes, { prefix: '/payments' });

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

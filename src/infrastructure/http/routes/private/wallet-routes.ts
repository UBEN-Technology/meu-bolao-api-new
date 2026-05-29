import { FastifyInstance } from 'fastify';
import { WalletController } from '../../controllers';
import { authenticate } from '../../middlewares/auth-middleware';

const walletController = new WalletController();

const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = { type: 'object', properties: { message: { type: 'string' } } };

export async function privateWalletRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/balance', {
    schema: {
      tags: ['Carteira'],
      summary: 'Consultar saldo da carteira',
      security: bearerAuth,
      response: {
        200: {
          type: 'object',
          properties: { balance: { type: 'number', nullable: true } },
        },
        400: errorSchema,
      },
    },
  }, walletController.getBalance);

  app.get('/transactions', {
    schema: {
      tags: ['Carteira'],
      summary: 'Extrato de transações',
      security: bearerAuth,
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['credit', 'debit'], description: 'Filtrar por tipo' },
          category: { type: 'string', enum: ['deposit', 'withdraw', 'prize', 'entry_fee'], description: 'Filtrar por categoria' },
          page: { type: 'number', default: 1, description: 'Página (começa em 1)' },
          limit: { type: 'number', default: 20, maximum: 100, description: 'Itens por página' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  userId: { type: 'string' },
                  amount: { type: 'number' },
                  type: { type: 'string', enum: ['credit', 'debit'] },
                  category: { type: 'string', enum: ['deposit', 'withdraw', 'prize', 'entry_fee'] },
                  description: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
        400: errorSchema,
      },
    },
  }, walletController.listTransactions);

  app.post('/deposit', {
    schema: {
      tags: ['Carteira'],
      summary: 'Depositar via PIX ou cartão',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['amount', 'paymentMethod'],
        properties: {
          amount: { type: 'number', exclusiveMinimum: 0 },
          paymentMethod: { type: 'string', enum: ['pix', 'card'] },
          cardData: {
            type: 'object',
            description: 'Obrigatório quando paymentMethod = card',
            properties: {
              number: { type: 'string' },
              holderName: { type: 'string' },
              expiryMonth: { type: 'string' },
              expiryYear: { type: 'string' },
              cvv: { type: 'string' },
            },
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' },
            balance: { type: 'number' },
            transactionId: { type: 'string' },
          },
        },
        400: errorSchema,
      },
    },
  }, walletController.deposit);

  app.post('/confirm-pix', {
    schema: {
      tags: ['Carteira'],
      summary: 'Confirmar pagamento PIX pendente',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['amount', 'transactionId'],
        properties: {
          amount: { type: 'number', exclusiveMinimum: 0 },
          transactionId: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' },
            balance: { type: 'number' },
            transactionId: { type: 'string' },
          },
        },
        400: errorSchema,
      },
    },
  }, walletController.confirmPix);

  app.post('/withdraw', {
    schema: {
      tags: ['Carteira'],
      summary: 'Solicitar saque via PIX',
      security: bearerAuth,
      body: {
        type: 'object',
        required: ['amount', 'pixKey'],
        properties: {
          amount: { type: 'number', exclusiveMinimum: 0 },
          pixKey: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' },
            balance: { type: 'number' },
          },
        },
        400: errorSchema,
      },
    },
  }, walletController.withdraw);
}

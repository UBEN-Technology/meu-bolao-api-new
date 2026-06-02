import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PagarMeService } from '@/infrastructure/services/pagarme-service';

const pixPaymentSchema = z.object({
  amount: z.number().positive('O valor deve ser positivo'),
  description: z.string().min(1, 'A descrição é obrigatória'),
});

const cardPaymentSchema = z.object({
  amount: z.number().positive('O valor deve ser positivo'),
  cardData: z.object({
    number: z.string().min(13, 'Número do cartão inválido'),
    holderName: z.string().min(1, 'Nome do titular é obrigatório'),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Mês de expiração inválido'),
    expiryYear: z.string().regex(/^\d{4}$/, 'Ano de expiração inválido'),
    cvv: z.string().min(3, 'CVV inválido'),
  }),
});

const getStatusSchema = z.object({
  transactionId: z.string().min(1, 'ID da transação é obrigatório'),
});

const webhookSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  status: z.enum(['paid', 'pending', 'failed']),
  amount: z.number().positive(),
  paymentMethod: z.enum(['pix', 'card']),
});

export class PaymentController {
  // private pagarMeService = new PagarMeMockService();

  async createPix(request: FastifyRequest, reply: FastifyReply) {
    try {
      const pagarMeService = new PagarMeService();
      const authUser = request.user as { id: string };
      const userRepository = new (await import('@/infrastructure/database/mysql/user-repository')).UserRepository(
        (await import('../../database/connection')).db
      );
      const user = await userRepository.findById(authUser.id);
      if (!user) {
        return reply.status(401).send({ message: 'Utilizador não encontrado.' });
      }

      const { amount, description } = pixPaymentSchema.parse(request.body);
      const transaction = await pagarMeService.createTransactionPIX(amount, description, {
        name: user.name,
        email: user.email,
        document: user.document || '00000000000',
      });

      const paymentTransactionRepo = new (await import('@/infrastructure/database/mysql/payment-transaction-repository')).PaymentTransactionRepository(
        (await import('../../database/connection')).db
      );

      await paymentTransactionRepo.create({
        id: transaction.transactionId,
        user_id: user.id,
        provider_order_id: transaction.providerOrderId || transaction.transactionId,
        amount,
        status: 'pending',
        payment_method: 'pix',
        metadata: {
          qr_code: transaction.pixQrCode,
          copy_paste: transaction.pixCopyPaste,
          description,
        },
      });

      return reply.status(201).send({
        success: true,
        message: 'Transação PIX criada com sucesso.',
        transaction: {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          status: transaction.status,
          pixQrCode: transaction.pixQrCode,
          pixCopyPaste: transaction.pixCopyPaste,
          expiresAt: transaction.expiresAt,
        },
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }

  async createCard(request: FastifyRequest, reply: FastifyReply) {
    try {
      const pagarMeService = new PagarMeService();
      const authUser = request.user as { id: string };
      const userRepository = new (await import('@/infrastructure/database/mysql/user-repository')).UserRepository(
        (await import('../../database/connection')).db
      );
      const user = await userRepository.findById(authUser.id);
      if (!user) {
        return reply.status(401).send({ message: 'Utilizador não encontrado.' });
      }

      const { amount, cardData } = cardPaymentSchema.parse(request.body);
      const transaction = await pagarMeService.createTransactionCard(amount, cardData, {
        name: user.name,
        email: user.email,
        document: user.document || '00000000000',
      });

      const paymentTransactionRepo = new (await import('@/infrastructure/database/mysql/payment-transaction-repository')).PaymentTransactionRepository(
        (await import('../../database/connection')).db
      );

      await paymentTransactionRepo.create({
        id: transaction.transactionId,
        user_id: user.id,
        provider_order_id: transaction.providerOrderId || transaction.transactionId,
        amount,
        status: transaction.status,
        payment_method: 'card',
        metadata: {
          card_last_four: transaction.cardLastFour,
        },
      });

      // Se cartão aprovado, credita wallet imediatamente
      if (transaction.status === 'paid') {
        const walletRepo = new (await import('@/infrastructure/database/mysql/wallet-repository')).WalletRepository(
          (await import('../../database/connection')).db
        );
        await walletRepo.updateBalance(user.id, amount, 'credit');
        await walletRepo.createTransaction({
          userId: user.id,
          amount,
          type: 'credit',
          category: 'deposit',
          description: `Depósito via CARTÃO - TX ${transaction.transactionId}`,
        });
      }

      return reply.status(201).send({
        success: true,
        message: transaction.status === 'paid'
          ? 'Pagamento com cartão aprovado.'
          : 'Pagamento com cartão recusado.',
        transaction: {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          status: transaction.status,
          cardLastFour: transaction.cardLastFour,
          processedAt: transaction.processedAt,
        },
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }

  async getStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const pagarMeService = new PagarMeService();

      const { transactionId } = getStatusSchema.parse(request.params);

      const paymentTransactionRepo = new (await import('@/infrastructure/database/mysql/payment-transaction-repository')).PaymentTransactionRepository(
        (await import('../../database/connection')).db
      );

      const tx = await paymentTransactionRepo.findById(transactionId);
      if (!tx) {
        return reply.status(404).send({ message: 'Transação não encontrada.' });
      }

      const status = await pagarMeService.getTransactionStatus(tx.provider_order_id);

      return reply.status(200).send({
        success: true,
        transaction: status,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }

  async processWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const pagarMeService = new PagarMeService();
      const signatureHeader = request.headers['x-hub-signature'] as string | undefined;

      const payload = webhookSchema.parse(request.body);
      const validation = await pagarMeService.processWebhook(payload, signatureHeader);

      if (!validation.success) {
        return reply.status(401).send(validation);
      }

      const paymentTransactionRepo = new (await import('@/infrastructure/database/mysql/payment-transaction-repository')).PaymentTransactionRepository(
        (await import('../../database/connection')).db
      );
      const walletRepo = new (await import('@/infrastructure/database/mysql/wallet-repository')).WalletRepository(
        (await import('../../database/connection')).db
      );
      const userRepo = new (await import('@/infrastructure/database/mysql/user-repository')).UserRepository(
        (await import('../../database/connection')).db
      );
      const emailService = new (await import('@/infrastructure/services/resend-email-service')).ResendEmailService();

      const tx = await paymentTransactionRepo.findByProviderOrderId(payload.id);
      if (!tx) {
        console.warn(`[WEBHOOK] Transação não encontrada para order ${payload.id}`);
        return reply.status(200).send({ success: true, message: 'Order não rastreado localmente.' });
      }

      if (tx.status === 'paid') {
        return reply.status(200).send({ success: true, message: 'Transação já processada.' });
      }

      if (payload.status === 'paid') {
        await walletRepo.updateBalance(tx.user_id, tx.amount, 'credit');
        await walletRepo.createTransaction({
          userId: tx.user_id,
          amount: tx.amount,
          type: 'credit',
          category: 'deposit',
          description: `Depósito via ${tx.payment_method.toUpperCase()} - Order ${payload.id}`,
        });
        await paymentTransactionRepo.updateStatus(tx.id, 'paid');

        const user = await userRepo.findById(tx.user_id);
        if (user) {
          try {
            const balance = await walletRepo.getBalance(tx.user_id);
            await emailService.sendDepositReceipt(user.email, {
              amount: tx.amount,
              transactionId: tx.id,
              balance,
              date: new Date(),
            });
          } catch (emailErr) {
            console.error('[WEBHOOK] Falha ao enviar email de recibo:', emailErr);
          }
        }
      } else if (payload.status === 'failed') {
        await paymentTransactionRepo.updateStatus(tx.id, 'failed');
      }

      return reply.status(200).send({ success: true, message: 'Webhook processado.' });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      console.error('[WEBHOOK] Erro:', error);
      return reply.status(400).send({ message: error.message });
    }
  }
}

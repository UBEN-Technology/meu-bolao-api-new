import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { WalletRepository } from '@/infrastructure/database/mysql';
import { PagarMeService } from '@/infrastructure/services/pagarme-service';
import { PaymentTransactionRepository } from '@/infrastructure/database/mysql/payment-transaction-repository';
import { ResendEmailService } from '@/infrastructure/services/resend-email-service';
import { ListTransactionsUseCase } from '@/application/use-cases';

const depositSchema = z.object({
  amount: z.number().positive('O valor deve ser positivo'),
  paymentMethod: z.enum(['pix', 'card']),
  cardData: z.object({
    number: z.string().min(13),
    holderName: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
    cvv: z.string(),
  }).optional(),
});

const confirmPixSchema = z.object({
  amount: z.number().positive('O valor deve ser positivo'),
  transactionId: z.string().min(1, 'ID da transação é obrigatório'),});

const withdrawSchema = z.object({
  amount: z.number().positive('O valor deve ser positivo'),
  pixKey: z.string().min(1, 'Chave PIX é obrigatória'),
});

const listTransactionsQuerySchema = z.object({
  type: z.enum(['credit', 'debit']).optional(),
  category: z.enum(['deposit', 'withdraw', 'prize', 'entry_fee']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export class WalletController {
  async getBalance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const walletRepo = new WalletRepository(db);
      const balance = await walletRepo.getBalance(user.id);

      return reply.status(200).send({ balance });
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async deposit(request: FastifyRequest, reply: FastifyReply) {
    const pagarMeService = new PagarMeService();

    try {
      const authUser = request.user as { id: string };
      const userRepository = new (await import('@/infrastructure/database/mysql/user-repository')).UserRepository(db);
      const user = await userRepository.findById(authUser.id);
      if (!user) {
        return reply.status(401).send({ message: 'Utilizador não encontrado.' });
      }

      const { amount, paymentMethod, cardData } = depositSchema.parse(request.body);

      let transactionResult;
      const customer = {
        name: user.name,
        email: user.email,
        document: user.document || '00000000000',
      };

      if (paymentMethod === 'pix') {
        transactionResult = await pagarMeService.createTransactionPIX(
          amount,
          'Depósito na carteira Palpite Arena',
          customer
        );
      } else if (paymentMethod === 'card') {
        if (!cardData) {
          return reply.status(400).send({ message: 'Dados do cartão são obrigatórios para pagamento com cartão.' });
        }
        transactionResult = await pagarMeService.createTransactionCard(amount, cardData, customer);
      } else {
        return reply.status(400).send({ message: 'Método de pagamento inválido.' });
      }

      const paymentTransactionRepo = new PaymentTransactionRepository(db);
      await paymentTransactionRepo.create({
        id: transactionResult.transactionId,
        user_id: user.id,
        provider_order_id: transactionResult.providerOrderId || transactionResult.transactionId,
        amount,
        status: transactionResult.status === 'paid' ? 'paid' : 'pending',
        payment_method: paymentMethod as 'pix' | 'card',
        metadata: paymentMethod === 'pix'
          ? { qr_code: transactionResult.pixQrCode, copy_paste: transactionResult.pixCopyPaste }
          : { card_last_four: (transactionResult as any).cardLastFour },
      });

      // Credit wallet if card was approved immediately
      if (transactionResult.status === 'paid') {
        const walletRepo = new WalletRepository(db);
        await walletRepo.updateBalance(user.id, amount, 'credit');
        await walletRepo.createTransaction({
          userId: user.id,
          amount,
          type: 'credit',
          category: 'deposit',
          description: `Depósito via ${paymentMethod.toUpperCase()} - TX ${transactionResult.transactionId}`,
        });
        const balance = await walletRepo.getBalance(user.id);

        return reply.status(200).send({
          message: 'Depósito realizado com sucesso.',
          balance,
          success: true,
          transactionId: transactionResult.transactionId,
        });
      } else if (transactionResult.status === 'pending') {
        return reply.status(200).send({
          message: 'Pagamento pendente. A carteira será atualizada assim que o pagamento for confirmado.',
          success: true,
          transactionId: transactionResult.transactionId,
          transaction: transactionResult,
        });
      }

      return reply.status(400).send({
        message: 'Pagamento não aprovado.',
        success: false,
        transactionId: transactionResult.transactionId,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }

  async confirmPix(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authUser = request.user as { id: string };
      const userRepository = new (await import('@/infrastructure/database/mysql/user-repository')).UserRepository(db);
      const user = await userRepository.findById(authUser.id);
      if (!user) {
        return reply.status(401).send({ message: 'Utilizador não encontrado.' });
      }

      const { amount, transactionId } = confirmPixSchema.parse(request.body);

      const paymentTransactionRepo = new PaymentTransactionRepository(db);
      const tx = await paymentTransactionRepo.findPendingByUserAndId(user.id, transactionId);

      if (!tx) {
        return reply.status(400).send({ message: 'Transação não encontrada ou já processada.' });
      }

      if (tx.status === 'paid') {
        return reply.status(400).send({ message: 'Transação já foi confirmada anteriormente.' });
      }

      const walletRepo = new WalletRepository(db);
      await walletRepo.updateBalance(user.id, amount, 'credit');
      await walletRepo.createTransaction({
        userId: user.id,
        amount,
        type: 'credit',
        category: 'deposit',
        description: `Depósito via PIX - TX ${transactionId}`,
      });

      await paymentTransactionRepo.updateStatus(transactionId, 'paid');

      // Enviar recibo de depósito
      const emailService = new ResendEmailService();
      try {
        const balance = await walletRepo.getBalance(user.id);
        await emailService.sendDepositReceipt(user.email, {
          amount,
          transactionId,
          balance,
          date: new Date(),
        });
      } catch (err) {
        console.error('[confirmPix] Falha ao enviar email:', err);
      }

      const balance = await walletRepo.getBalance(user.id);

      return reply.status(200).send({
        message: 'Depósito realizado com sucesso.',
        balance,
        success: true,
        transactionId: transactionId,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }

  async listTransactions(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const { type, category, page, limit } = listTransactionsQuerySchema.parse(request.query);

      const walletRepo = new WalletRepository(db);
      const useCase = new ListTransactionsUseCase(walletRepo);

      const result = await useCase.execute({ userId: user.id, type, category, page, limit });

      return reply.status(200).send({
        ...result,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }

  async withdraw(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authUser = request.user as { id: string };
      const userRepository = new (await import('@/infrastructure/database/mysql/user-repository')).UserRepository(db);
      const user = await userRepository.findById(authUser.id);
      if (!user) {
        return reply.status(401).send({ message: 'Utilizador não encontrado.' });
      }

      const { amount, pixKey } = withdrawSchema.parse(request.body);

      const walletRepo = new WalletRepository(db);
      const currentBalance = await walletRepo.getBalance(user.id);

      if (currentBalance && currentBalance < amount) {
        return reply.status(400).send({ message: 'Saldo insuficiente para saque.' });
      }

      await walletRepo.updateBalance(user.id, amount, 'debit');
      await walletRepo.createTransaction({
        userId: user.id,
        amount,
        type: 'debit',
        category: 'withdraw',
        description: `Saque para PIX: ${pixKey}`,
      });

      const balance = await walletRepo.getBalance(user.id);

      // Enviar recibo de saque
      const emailService = new ResendEmailService();
      try {
        await emailService.sendWithdrawalReceipt(user.email, {
          amount,
          pixKey,
          balance,
          date: new Date(),
        });
      } catch (err) {
        console.error('[withdraw] Falha ao enviar email:', err);
      }

      return reply.status(200).send({
        message: 'Saque solicitado com sucesso.',
        balance,
        success: true,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }
}

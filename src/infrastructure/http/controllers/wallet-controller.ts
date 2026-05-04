import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { WalletRepository } from '@/infrastructure/database/mysql';
import { PagarMeMockService } from '@/infrastructure/services/pagarme-mock-service';

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

const withdrawSchema = z.object({
  amount: z.number().positive('O valor deve ser positivo'),
  pixKey: z.string().min(1, 'Chave PIX é obrigatória'),
});

export class WalletController {
  private pagarMeService = new PagarMeMockService();

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
    try {
      const user = request.user as { id: string };
      const { amount, paymentMethod, cardData } = depositSchema.parse(request.body);

      let transactionResult;

      if (paymentMethod === 'pix') {
        transactionResult = await this.pagarMeService.createTransactionPIX(
          amount,
          'Depósito na carteira Meu Bolão'
        );

        // For mock purposes, auto-approve PIX after creation
        await this.pagarMeService.processWebhook({
          id: transactionResult.transactionId,
          status: 'paid',
          amount,
          paymentMethod: 'pix',
        });
      } else if (paymentMethod === 'card') {
        if (!cardData) {
          return reply.status(400).send({ message: 'Dados do cartão são obrigatórios para pagamento com cartão.' });
        }
        transactionResult = await this.pagarMeService.createTransactionCard(amount, cardData);
      } else {
        return reply.status(400).send({ message: 'Método de pagamento inválido.' });
      }

      // Only credit wallet if payment was successful
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

  async withdraw(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const { amount, pixKey } = withdrawSchema.parse(request.body);

      const walletRepo = new WalletRepository(db);
      const currentBalance = await walletRepo.getBalance(user.id);

      if (currentBalance < amount) {
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

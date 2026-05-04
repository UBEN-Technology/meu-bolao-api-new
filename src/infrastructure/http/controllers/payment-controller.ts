import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PagarMeMockService } from '@/infrastructure/services/pagarme-mock-service';

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
  private pagarMeService = new PagarMeMockService();

  async createPix(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { amount, description } = pixPaymentSchema.parse(request.body);
      const transaction = await this.pagarMeService.createTransactionPIX(amount, description);

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
      const { amount, cardData } = cardPaymentSchema.parse(request.body);
      const transaction = await this.pagarMeService.createTransactionCard(amount, cardData);

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
      const { transactionId } = getStatusSchema.parse(request.params);
      const status = await this.pagarMeService.getTransactionStatus(transactionId);

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
      const payload = webhookSchema.parse(request.body);
      const result = await this.pagarMeService.processWebhook(payload);

      return reply.status(200).send(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }
}

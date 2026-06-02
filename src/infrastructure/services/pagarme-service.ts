import { createHash, createHmac, randomUUID } from 'crypto';
import { ENVS } from '@/utils';
import {
  IPagarMeService,
  CardData,
  PixTransaction,
  CardTransaction,
  TransactionStatus,
  WebhookPayload,
} from './pagarme-mock-service';

const PAGARME_BASE_URL = 'https://api.pagar.me/core/v5';

function getAuthHeader(): string {
  const apiKey = ENVS.PAGARME.API_KEY;
  if (!apiKey) {
    throw new Error('PAGARME_API_KEY não configurada.');
  }
  return 'Basic ' + Buffer.from(apiKey + ':').toString('base64');
}

async function pagarmeFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${PAGARME_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = (data as any)?.message || response.statusText;
    throw new Error(`Pagar.me API error: ${response.status} - ${message}`);
  }

  return data as T;
}

export class PagarMeService implements IPagarMeService {
  async createTransactionPIX(
    amount: number,
    description: string,
    customer?: { name: string; email: string; document: string }
  ): Promise<PixTransaction> {
    const transactionId = randomUUID();
    const body: any = {
      code: transactionId,
      items: [
        {
          amount: Math.round(amount * 100),
          description,
          quantity: 1,
          code: 'deposit',
        },
      ],
      payments: [
        {
          payment_method: 'pix',
          pix: {
            expires_in: 900,
          },
        },
      ],
    };

    if (customer) {
      body.customer = {
        name: customer.name,
        email: customer.email,
        document: customer.document.replace(/\D/g, ''),
        type: customer.document.replace(/\D/g, '').length > 11 ? 'company' : 'individual',
      };
    }

    const order = await pagarmeFetch<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const pixPayment = order.charges?.[0]?.last_transaction || {};

    return {
      transactionId,
      amount,
      description,
      status: 'pending',
      pixQrCode: pixPayment.qr_code || '',
      pixCopyPaste: pixPayment.qr_code || pixPayment.copy_paste || '',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      providerOrderId: order.id,
    };
  }

  async createTransactionCard(
    amount: number,
    cardData: CardData,
    customer?: { name: string; email: string; document: string }
  ): Promise<CardTransaction> {
    const transactionId = randomUUID();
    const body: any = {
      code: transactionId,
      items: [
        {
          amount: Math.round(amount * 100),
          description: 'Pagamento com cartão',
          quantity: 1,
          code: 'card-payment',
        },
      ],
      payments: [
        {
          payment_method: 'credit_card',
          credit_card: {
            installments: 1,
            statement_descriptor: 'MEUBOLAO',
            card: {
              number: cardData.number.replace(/\s/g, ''),
              holder_name: cardData.holderName,
              exp_month: Number(cardData.expiryMonth),
              exp_year: Number(cardData.expiryYear),
              cvv: cardData.cvv,
            },
          },
        },
      ],
    };

    if (customer) {
      body.customer = {
        name: customer.name,
        email: customer.email,
        document: customer.document.replace(/\D/g, ''),
        type: customer.document.replace(/\D/g, '').length > 11 ? 'company' : 'individual',
      };
    }

    const order = await pagarmeFetch<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const charge = order.charges?.[0] || {};
    const lastTx = charge.last_transaction || {};
    const isPaid = charge.status === 'paid' || order.status === 'paid';

    return {
      transactionId,
      amount,
      status: isPaid ? 'paid' : 'failed',
      cardLastFour: lastTx.card?.last_four_digits || cardData.number.slice(-4),
      processedAt: new Date(),
      providerOrderId: order.id,
    };
  }

  async getTransactionStatus(providerOrderId: string): Promise<TransactionStatus> {
    const order = await pagarmeFetch<any>(`/orders/${providerOrderId}`);

    const charge = order.charges?.[0] || {};
    const paymentMethod = charge.payment_method || 'pix';
    const orderStatus = order.status;
    const chargeStatus = charge.status;

    let status: 'pending' | 'paid' | 'failed' = 'pending';
    if (orderStatus === 'paid' || chargeStatus === 'paid') {
      status = 'paid';
    } else if (orderStatus === 'canceled' || chargeStatus === 'failed') {
      status = 'failed';
    }

    return {
      transactionId: order.code || providerOrderId,
      status,
      amount: (order.amount || 0) / 100,
      paymentMethod,
      updatedAt: new Date(),
    };
  }

  async processWebhook(
    payload: WebhookPayload,
    signatureHeader?: string
  ): Promise<{ success: boolean; message: string }> {
    const secret = ENVS.PAGARME.WEBHOOK_SECRET;

    if (secret && signatureHeader) {
      const expected = createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      const provided = signatureHeader.replace('sha256=', '');

      if (!timingSafeCompare(expected, provided)) {
        return { success: false, message: 'Assinatura do webhook inválida.' };
      }
    }

    return {
      success: true,
      message: `Webhook processado para order ${payload.id}.`,
    };
  }
}

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

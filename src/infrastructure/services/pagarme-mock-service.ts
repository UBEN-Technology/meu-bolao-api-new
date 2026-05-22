export interface CardData {
  number: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PixTransaction {
  transactionId: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'failed';
  pixQrCode: string;
  pixCopyPaste: string;
  expiresAt: Date;
}

export interface CardTransaction {
  transactionId: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  cardLastFour: string;
  processedAt: Date;
}

export interface TransactionStatus {
  transactionId: string;
  status: 'pending' | 'paid' | 'failed';
  amount: number;
  paymentMethod: 'pix' | 'card';
  updatedAt: Date;
}

export interface WebhookPayload {
  id: string;
  status: 'paid' | 'pending' | 'failed';
  amount: number;
  paymentMethod: 'pix' | 'card';
}

export interface IPagarMeService {
  createTransactionPIX(amount: number, description: string): Promise<PixTransaction>;
  createTransactionCard(amount: number, cardData: CardData): Promise<CardTransaction>;
  getTransactionStatus(transactionId: string): Promise<TransactionStatus>;
  processWebhook(payload: WebhookPayload): Promise<{ success: boolean; message: string }>;
}

// In-memory store for mock transactions
const transactionsStore = new Map<string, PixTransaction | CardTransaction>();

function generateTransactionId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generatePixQrCode(transactionId: string, amount: number): string {
  const value = amount.toFixed(2);
  return `00020126580014BR.GOV.BCB.PIX2560api.pagarme.com/pix/v2/${transactionId}5204000053039865404${value}5802BR5925Meu Bolao6009SAO PAULO62070503***6304`;
}

function maskCardNumber(number: string): string {
  return number.slice(-4).padStart(number.length, '*');
}

export class PagarMeMockService implements IPagarMeService {
  async createTransactionPIX(amount: number, description: string): Promise<PixTransaction> {
    const transactionId = generateTransactionId();
    const pixQrCode = generatePixQrCode(transactionId, amount);
    const pixCopyPaste = pixQrCode;

    console.log(`Criando transação PIX: ${transactionId}, valor: ${amount}, descrição: ${description}`);

    const transaction: PixTransaction = {
      transactionId,
      amount,
      description,
      status: 'pending',
      pixQrCode,
      pixCopyPaste,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };

    transactionsStore.set(transactionId, transaction);
    return transaction;
  }

  async createTransactionCard(amount: number, cardData: CardData): Promise<CardTransaction> {
    const transactionId = generateTransactionId();

    // Simulate card validation
    if (cardData.number.length < 13 || cardData.cvv.length < 3) {
      throw new Error('Dados do cartão inválidos.');
    }

    // Simulate 90% success rate for cards
    const isSuccess = Math.random() > 0.1;

    const transaction: CardTransaction = {
      transactionId,
      amount,
      status: isSuccess ? 'paid' : 'failed',
      cardLastFour: cardData.number.slice(-4),
      processedAt: new Date(),
    };

    transactionsStore.set(transactionId, transaction);
    return transaction;
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    const transaction = transactionsStore.get(transactionId);

    if (!transaction) {
      throw new Error('Transação não encontrada.');
    }

    const paymentMethod: 'pix' | 'card' = 'pixQrCode' in transaction ? 'pix' : 'card';

    return {
      transactionId: transaction.transactionId,
      status: transaction.status,
      amount: transaction.amount,
      paymentMethod,
      updatedAt: new Date(),
    };
  }

  async processWebhook(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
    const transaction = transactionsStore.get(payload.id);

    if (!transaction) {
      return { success: false, message: 'Transação não encontrada.' };
    }

    if (transaction.amount !== payload.amount) {
      return { success: false, message: 'Valor da transação não corresponde.' };
    }

    transaction.status = payload.status;
    transactionsStore.set(payload.id, transaction);

    return {
      success: true,
      message: `Pagamento ${payload.id} atualizado para ${payload.status}.`,
    };
  }
}

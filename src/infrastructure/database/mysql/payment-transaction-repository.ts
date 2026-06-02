import { Knex } from 'knex';

export interface PaymentTransaction {
  id: string;
  user_id: string;
  provider_order_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  payment_method: 'pix' | 'card';
  metadata?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

export class PaymentTransactionRepository {
  constructor(private db: Knex) {}

  async create(data: Omit<PaymentTransaction, 'created_at' | 'updated_at'>): Promise<void> {
    await this.db('payment_transactions').insert({
      ...data,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    });
  }

  async findById(id: string): Promise<PaymentTransaction | undefined> {
    const row = await this.db('payment_transactions').where({ id }).first();
    if (!row) return undefined;
    return this.mapRow(row);
  }

  async findByProviderOrderId(providerOrderId: string): Promise<PaymentTransaction | undefined> {
    const row = await this.db('payment_transactions').where({ provider_order_id: providerOrderId }).first();
    if (!row) return undefined;
    return this.mapRow(row);
  }

  async findPendingByUserAndId(userId: string, id: string): Promise<PaymentTransaction | undefined> {
    const row = await this.db('payment_transactions')
      .where({ id, user_id: userId, status: 'pending' })
      .first();
    if (!row) return undefined;
    return this.mapRow(row);
  }

  async updateStatus(id: string, status: 'pending' | 'paid' | 'failed'): Promise<void> {
    await this.db('payment_transactions').where({ id }).update({ status, updated_at: new Date() });
  }

  async updateStatusByProviderOrderId(providerOrderId: string, status: 'pending' | 'paid' | 'failed'): Promise<void> {
    await this.db('payment_transactions').where({ provider_order_id: providerOrderId }).update({ status, updated_at: new Date() });
  }

  private mapRow(row: any): PaymentTransaction {
    return {
      ...row,
      metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : undefined,
    };
  }
}

import { IWalletRepository, ListTransactionsFilter, Transaction } from "@/domain/repositories";
import { Knex } from "knex";

export class WalletRepository implements IWalletRepository {
  constructor(private db: Knex) {}

  async getBalance(userId: string): Promise<number | null> {
    const row = await this.db("wallets").where({ user_id: userId }).first();
    return row ? Number(row.balance) : null;
  }

  async updateBalance(userId: string, amount: number, type: 'credit' | 'debit'): Promise<void> {
    const currentBalance = await this.getBalance(userId);

    if (currentBalance !== null) {
      const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount;
  
      await this.db("wallets")
        .where({ user_id: userId })
        .update({ balance: newBalance });
    } else {
      await this.db("wallets").insert({
        user_id: userId,
        balance: amount,
      });
    }
  }

  async createTransaction(data: any): Promise<void> {
    await this.db("wallet_transactions").insert({
      wallet_id: data.userId,
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description
    });
  }

  async listTransactions(userId: string, filters: ListTransactionsFilter = {}): Promise<{ transactions: Transaction[]; total: number }> {
    const { type, category, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    const query = this.db("wallet_transactions").where({ wallet_id: userId });

    if (type) query.andWhere({ type });
    if (category) query.andWhere({ category });

    const [{ count }] = await query.clone().count("id as count");
    const total = Number(count);

    const rows = await query
      .select("id", "wallet_id", "amount", "type", "category", "description", "created_at")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    const transactions: Transaction[] = rows.map((row: any) => ({
      id: row.id,
      userId: row.wallet_id,
      amount: Number(row.amount),
      type: row.type,
      category: row.category,
      description: row.description,
      createdAt: row.created_at,
    }));

    return { transactions, total };
  }
}
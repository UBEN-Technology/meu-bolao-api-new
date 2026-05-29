export interface Transaction {
  id: number;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  category: 'deposit' | 'withdraw' | 'prize' | 'entry_fee';
  description: string;
  createdAt: Date;
}

export interface ListTransactionsFilter {
  type?: 'credit' | 'debit';
  category?: 'deposit' | 'withdraw' | 'prize' | 'entry_fee';
  page?: number;
  limit?: number;
}

export interface IWalletRepository {
  getBalance(userId: string): Promise<number | null>;
  updateBalance(userId: string, amount: number, type: 'credit' | 'debit'): Promise<void>;
  createTransaction(data: {
    userId: string;
    amount: number;
    type: 'credit' | 'debit';
    category: 'deposit' | 'withdraw' | 'prize' | 'entry_fee';
    description: string;
  }): Promise<void>;
  listTransactions(userId: string, filters?: ListTransactionsFilter): Promise<{ transactions: Transaction[]; total: number }>;
}
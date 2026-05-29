import { IWalletRepository, ListTransactionsFilter } from "@/domain/repositories";

interface ListTransactionsRequest extends ListTransactionsFilter {
  userId: string;
}

export class ListTransactionsUseCase {
  constructor(private walletRepository: IWalletRepository) {}

  async execute({ userId, type, category, page, limit }: ListTransactionsRequest) {
    return await this.walletRepository.listTransactions(userId, { type, category, page, limit });
  }
}

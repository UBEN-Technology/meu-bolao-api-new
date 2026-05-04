import { ITokenBlacklistRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class TokenBlacklistRepository implements ITokenBlacklistRepository {
  constructor(private db: Knex) {}

  async add(tokenHash: string, expiresAt: Date): Promise<void> {
    await this.db("token_blacklist").insert({
      token_hash: tokenHash,
      expires_at: expiresAt,
    });
  }

  async isBlacklisted(tokenHash: string): Promise<boolean> {
    const row = await this.db("token_blacklist")
      .where({ token_hash: tokenHash })
      .andWhere("expires_at", ">", new Date())
      .first();
    return !!row;
  }
}

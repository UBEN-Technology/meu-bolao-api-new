import { IEmailConfirmationTokenRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class EmailConfirmationTokenRepository implements IEmailConfirmationTokenRepository {
  constructor(private db: Knex) {}

  async create(userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.db("email_confirmation_tokens").insert({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });
  }

  async findByToken(token: string): Promise<{ userId: string; expiresAt: Date } | null> {
    const row = await this.db("email_confirmation_tokens")
      .where({ token })
      .first();
    if (!row) return null;
    return {
      userId: row.user_id,
      expiresAt: new Date(row.expires_at),
    };
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.db("email_confirmation_tokens").where({ user_id: userId }).delete();
  }
}

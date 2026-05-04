export interface IPasswordResetTokenRepository {
  create(userId: string, token: string, expiresAt: Date): Promise<void>;
  findByToken(token: string): Promise<{ userId: string; expiresAt: Date } | null>;
  deleteByUserId(userId: string): Promise<void>;
}

export interface ITokenBlacklistRepository {
  add(tokenHash: string, expiresAt: Date): Promise<void>;
  isBlacklisted(tokenHash: string): Promise<boolean>;
}

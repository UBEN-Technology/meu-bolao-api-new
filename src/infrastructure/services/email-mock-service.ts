export interface IEmailService {
  sendPasswordReset(email: string, token: string): Promise<void>;
  sendConfirmation(email: string, token: string): Promise<void>;
}

export class EmailMockService implements IEmailService {
  async sendPasswordReset(email: string, token: string): Promise<void> {
    console.log(`[MOCK EMAIL] Password reset for ${email}: token=${token}`);
  }

  async sendConfirmation(email: string, token: string): Promise<void> {
    console.log(`[MOCK EMAIL] Email confirmation for ${email}: token=${token}`);
  }
}

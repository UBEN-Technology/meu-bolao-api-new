import { Resend } from 'resend';
import { ENVS } from '@/utils';
import { IEmailService } from './email-mock-service';
import {
  passwordResetTemplate,
  emailConfirmationTemplate,
  depositReceiptTemplate,
  withdrawalReceiptTemplate,
} from '../email/templates';

export interface DepositReceiptData {
  amount: number;
  transactionId: string;
  balance: number;
  date: Date;
}

export interface WithdrawalReceiptData {
  amount: number;
  pixKey: string;
  balance: number;
  date: Date;
}

export class ResendEmailService implements IEmailService {
  private resend: Resend | null = null;

  constructor() {
    const apiKey = ENVS.RESEND.API_KEY;
    if (apiKey && apiKey !== 're_placeholder') {
      this.resend = new Resend(apiKey);
    } else {
      console.warn('[EMAIL] RESEND_API_KEY não configurada. Emails serão logados no console.');
    }
  }

  private getFrom(): string {
    return ENVS.RESEND.FROM_EMAIL;
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) {
      console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
      return;
    }

    try {
      const { error } = await this.resend.emails.send({
        from: this.getFrom(),
        to,
        subject,
        html,
      });

      if (error) {
        console.error('[EMAIL] Erro ao enviar email:', error);
      }
    } catch (err) {
      console.error('[EMAIL] Erro inesperado ao enviar email:', err);
    }
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const resetUrl = `${ENVS.FRONTEND_URL}/auth/reset-password?token=${token}`;
    const html = passwordResetTemplate(resetUrl);
    await this.sendEmail(email, 'Redefinição de Senha - Meu Bolão', html);
  }

  async sendConfirmation(email: string, token: string): Promise<void> {
    const confirmUrl = `${ENVS.FRONTEND_URL}/auth/confirm-email?token=${token}`;
    const html = emailConfirmationTemplate(confirmUrl);
    await this.sendEmail(email, 'Confirme sua Conta - Meu Bolão', html);
  }

  async sendDepositReceipt(email: string, data: DepositReceiptData): Promise<void> {
    const html = depositReceiptTemplate(data);
    await this.sendEmail(email, 'Depósito Confirmado - Meu Bolão', html);
  }

  async sendWithdrawalReceipt(email: string, data: WithdrawalReceiptData): Promise<void> {
    const html = withdrawalReceiptTemplate(data);
    await this.sendEmail(email, 'Saque Solicitado - Meu Bolão', html);
  }
}

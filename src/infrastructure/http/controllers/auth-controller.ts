import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import crypto from 'crypto';
import { db } from '../../database/connection';
import { UserRepository, TokenBlacklistRepository, PasswordResetTokenRepository, EmailConfirmationTokenRepository } from '@/infrastructure/database/mysql';
import { LoginUserUseCase } from '@/application/use-cases';
import { loginSchema } from '@/application/schemas';
import { EmailMockService } from '@/infrastructure/services/email-mock-service';

const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.email('E-mail inválido'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

const confirmEmailSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
});

const resendConfirmationSchema = z.object({
  email: z.email('E-mail inválido'),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
});

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const userRepository = new UserRepository(db);
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    try {
      const validatedData = loginSchema.parse(request.body);
      const user = await loginUserUseCase.execute(validatedData);

      const token = await (reply as any).jwtSign(
        { id: user.id },
        { expiresIn: '7d' }
      );

      return reply.status(200).send({ user, accessToken: token, refreshToken: token });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(401).send({ errors: JSON.parse(error.message) });

      return reply.status(401).send({ message: error.message });
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { refreshToken } = refreshSchema.parse(request.body);
      const tokenToVerify = refreshToken || (request.headers.authorization?.replace('Bearer ', '') ?? '');

      if (!tokenToVerify) {
        return reply.status(401).send({ message: 'Token não fornecido.' });
      }

      // Verificar se o token está na blacklist
      const tokenBlacklistRepo = new TokenBlacklistRepository(db);
      const tokenHash = hashToken(tokenToVerify);
      if (await tokenBlacklistRepo.isBlacklisted(tokenHash)) {
        return reply.status(401).send({ message: 'Token inválido.' });
      }

      const payload = await (request.server as any).jwt.verify(tokenToVerify);
      const userId = payload.id;

      const accessToken = await (reply as any).jwtSign(
        { id: userId },
        { expiresIn: '7d' }
      );

      const newRefreshToken = await (reply as any).jwtSign(
        { id: userId },
        { expiresIn: '30d' }
      );

      return reply.status(200).send({ accessToken, refreshToken: newRefreshToken });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(401).send({ message: 'Token inválido.' });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '') ?? '';
      if (!token) {
        return reply.status(401).send({ message: 'Token não fornecido.' });
      }

      const tokenBlacklistRepo = new TokenBlacklistRepository(db);
      const tokenHash = hashToken(token);

      const payload = request.user as any;
      const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await tokenBlacklistRepo.add(tokenHash, expiresAt);

      return reply.status(200).send({ message: 'Logout realizado com sucesso.', success: true });
    } catch (error: any) {
      return reply.status(401).send({ message: error.message || 'Não autorizado.' });
    }
  }

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = forgotPasswordSchema.parse(request.body);
      const userRepository = new UserRepository(db);
      const resetTokenRepo = new PasswordResetTokenRepository(db);
      const emailService = new EmailMockService();

      const user = await userRepository.findByEmail(email);
      if (!user) {
        // Retornar sucesso mesmo se o utilizador não existir para evitar enumeração de e-mails
        return reply.status(200).send({ message: 'E-mail de recuperação enviado.', success: true });
      }

      // Eliminar tokens existentes para este utilizador
      await resetTokenRepo.deleteByUserId(user.id);

      const resetToken = await (reply as any).jwtSign(
        { id: user.id, type: 'password_reset' },
        { expiresIn: '1h' }
      );

      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
      await resetTokenRepo.create(user.id, resetToken, expiresAt);

      await emailService.sendPasswordReset(email, resetToken);

      return reply.status(200).send({ message: 'E-mail de recuperação enviado.', success: true });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { token, password } = resetPasswordSchema.parse(request.body);
      const userRepository = new UserRepository(db);
      const resetTokenRepo = new PasswordResetTokenRepository(db);

      // Verificar JWT
      let payload: any;
      try {
        payload = await (request.server as any).jwt.verify(token);
      } catch {
        return reply.status(400).send({ message: 'Token inválido ou expirado.' });
      }

      if (payload.type !== 'password_reset') {
        return reply.status(400).send({ message: 'Token inválido.' });
      }

      const storedToken = await resetTokenRepo.findByToken(token);
      if (!storedToken) {
        return reply.status(400).send({ message: 'Token inválido ou expirado.' });
      }

      if (storedToken.expiresAt < new Date()) {
        return reply.status(400).send({ message: 'Token expirado.' });
      }

      const userId = payload.id;
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      await userRepository.updatePassword(userId, hashedPassword);

      // Limpar token utilizado
      await resetTokenRepo.deleteByUserId(userId);

      return reply.status(200).send({ message: 'Senha redefinida com sucesso.', success: true });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async confirmEmail(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { token } = confirmEmailSchema.parse(request.query);
      const userRepository = new UserRepository(db);
      const confirmationRepo = new EmailConfirmationTokenRepository(db);

      const storedToken = await confirmationRepo.findByToken(token);
      if (!storedToken) {
        return reply.status(400).send({ message: 'Token inválido ou expirado.' });
      }

      if (storedToken.expiresAt < new Date()) {
        return reply.status(400).send({ message: 'Token expirado.' });
      }

      await userRepository.updateEmailConfirmed(storedToken.userId, true);
      await confirmationRepo.deleteByUserId(storedToken.userId);

      return reply.status(200).send({ message: 'E-mail confirmado com sucesso.', success: true });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async resendConfirmation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = resendConfirmationSchema.parse(request.body);
      const userRepository = new UserRepository(db);
      const confirmationRepo = new EmailConfirmationTokenRepository(db);
      const emailService = new EmailMockService();

      const user = await userRepository.findByEmail(email);
      if (!user) {
        return reply.status(200).send({ message: 'E-mail de confirmação reenviado.', success: true });
      }

      // Eliminar tokens existentes para este utilizador
      await confirmationRepo.deleteByUserId(user.id);

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
      await confirmationRepo.create(user.id, token, expiresAt);

      await emailService.sendConfirmation(email, token);

      return reply.status(200).send({ message: 'E-mail de confirmação reenviado.', success: true });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { oldPassword, newPassword } = changePasswordSchema.parse(request.body);
      const user = request.user as { id: string };
      const userRepository = new UserRepository(db);

      const userData = await userRepository.findById(user.id);
      if (!userData) {
        return reply.status(404).send({ message: 'Utilizador não encontrado.' });
      }

      const bcrypt = await import('bcryptjs');
      const passwordMatch = await bcrypt.compare(oldPassword, userData.passwordHash);
      if (!passwordMatch) {
        return reply.status(400).send({ message: 'Senha atual incorreta.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userRepository.updatePassword(user.id, hashedPassword);

      return reply.status(200).send({ message: 'Senha alterada com sucesso.', success: true });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }
}

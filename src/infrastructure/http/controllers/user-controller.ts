import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import { UserRepository } from '@/infrastructure/database/mysql';
import { ListUsersUseCase, PromoteUserToAdminUseCase, RegisterUserUseCase, ToggleUserStatusUseCase } from '@/application/use-cases';
import { createUserSchema, promoteUserSchema, toggleUserStatusSchema, updateMeSchema } from '@/application/schemas';
import { logAction } from '../middlewares/log-action-middleware';

export class UserController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const userRepository = new UserRepository(db);
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

    try {
      const validatedData = createUserSchema.parse(request.body);
  
      const data = validatedData;
      const user = await registerUserUseCase.execute(data);
      return reply.status(201).send(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async promoteUser(request: FastifyRequest, reply: FastifyReply) {
    const repo = new UserRepository(db);
    const useCase = new PromoteUserToAdminUseCase(repo);

    try {
      const validatedData = promoteUserSchema.parse(request.body);
  
      const { userId, level } = validatedData;
      await useCase.execute({ userId, level });

      const user = request.user as { id: string };
      await logAction(user.id, `Promoveu o utilizador de ID ${userId} ao nível ${level}`);      

      return reply.status(200).send({ message: "Utilizador promovido com sucesso." });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  } 

  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    const repo = new UserRepository(db);
    const useCase = new ListUsersUseCase(repo);

    try {
      const users = await useCase.execute();
      return reply.status(200).send(users);
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async toggleUserStatus(request: FastifyRequest, reply: FastifyReply) {
    const repo = new UserRepository(db);
    const useCase = new ToggleUserStatusUseCase(repo);

    try {
      const data = toggleUserStatusSchema.parse(request.body);
      await useCase.execute(data);
          
      const statusMessage = data.isActive ? "ativada" : "desativada";

      const user = request.user as { id: string };
      await logAction(user.id, `Atualizou o status do utilizador de ID ${data.userId} para ${statusMessage}`);      

      return reply.status(200).send({ 
        message: `Conta de utilizador ${statusMessage} com sucesso.` 
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const repo = new UserRepository(db);

    try {
      const user = request.user as { id: string };
      const userData = await repo.findById(user.id);

      if (!userData) {
        return reply.status(404).send({ message: "Utilizador não encontrado." });
      }

      const isAdmin = await repo.isAdmin(user.id);
      const role = await repo.getRoleAdmin(user.id);

      return reply.status(200).send({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        document: userData.document,
        isAdmin,
        role
      });
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async updateMe(request: FastifyRequest, reply: FastifyReply) {
    const repo = new UserRepository(db);

    try {
      const user = request.user as { id: string };
      const validatedData = updateMeSchema.parse(request.body);

      await repo.update(user.id, validatedData);

      const userData = await repo.findById(user.id);
      const isAdmin = await repo.isAdmin(user.id);

      if (!userData) {
        return reply.status(404).send({ message: "Utilizador não encontrado." });
      }

      return reply.status(200).send({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });

      return reply.status(400).send({ message: error.message });
    }
  }
}

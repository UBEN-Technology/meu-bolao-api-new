import { FastifyReply, FastifyRequest } from "fastify";
import crypto from "crypto";
import { db } from "../../database/connection";
import { UserRepository, TokenBlacklistRepository } from "@/infrastructure/database/mysql";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();

    const token = request.headers.authorization?.replace('Bearer ', '') ?? '';
    if (token) {
      const tokenBlacklistRepo = new TokenBlacklistRepository(db);
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const isBlacklisted = await tokenBlacklistRepo.isBlacklisted(tokenHash);
      if (isBlacklisted) {
        return reply.status(401).send({ message: "Não autorizado." });
      }
    }
  } catch (err) {
    return reply.status(401).send({ message: "Não autorizado." });
  }
}

export async function checkAdmin(request: FastifyRequest, reply: FastifyReply) {
  const userRepository = new UserRepository(db);
  const user = request.user as { id: string };

  const isAdmin = await userRepository.isAdmin(user.id);

  if (!isAdmin) {
    return reply.status(403).send({ message: "Acesso restrito a administradores." });
  }
}

import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email('E-mail inválido'),
  phone: z.string().regex(/^(?:55)?(?:\(?\d{2}\)?\s?)?\d{5}-?\d{4}$/, 'Telefone inválido'),
  document: z.string().regex(/^\d{11}$/, 'Documento inválido'),
  password: z.string().min(8, "Senha muito curta"),
});

export const promoteUserSchema = z.object({
  userId: z.uuid(),
  level: z.enum(['moderator', 'super_admin'], "Nível inválido"),
});

export const toggleUserStatusSchema = z.object({
  userId: z.uuid("ID de utilizador inválido"),
  isActive: z.boolean("O estado (isActive) é obrigatório"),
});

export const updateMeSchema = z.object({
  name: z.string().optional(),
  pictureUrl: z.string().optional(),
});
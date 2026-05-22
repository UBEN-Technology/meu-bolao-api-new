import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string(),
  code: z.string().max(5, 'O código deve ter no máximo 5 caracteres'),
  nacionality: z.string(),
  badgeUrl: z.url('URL inválida'),
  championshipId: z.coerce.number().positive(),
});

export const listTeamSchema = z.object({
  championshipId: z.coerce.number().positive(),
});
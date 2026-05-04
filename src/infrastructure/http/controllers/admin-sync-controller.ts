import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../../database/connection';
import {
  ChampionshipRepository,
  TeamRepository,
  MatchRepository,
} from '@/infrastructure/database/mysql';
import { OneFootballMockService } from '@/infrastructure/services/onefootball-mock-service';
import { Championship, Team, Match } from '@/domain/entities';
import { logAction } from '../middlewares/log-action-middleware';

const syncChampionshipsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number).optional(),
});

const syncByChampionshipIdSchema = z.object({
  championshipId: z.string().regex(/^\d+$/).transform(Number),
});

export class AdminSyncController {
  private mockService = new OneFootballMockService();

  syncChampionships = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const championshipRepo = new ChampionshipRepository(db);
      const mockChampionships = this.mockService.getChampionships();

      let created = 0;
      let updated = 0;

      for (const mockChamp of mockChampionships) {
        const existing = await championshipRepo.findById(mockChamp.id);

        if (!existing) {
          const championship = new Championship({
            title: mockChamp.title,
            description: mockChamp.description,
            isActive: mockChamp.isActive,
            status: mockChamp.status,
          }, mockChamp.id);

          await championshipRepo.create(championship);
          created++;
        } else {
          await championshipRepo.updateStatus(mockChamp.id, mockChamp.status);
          updated++;
        }
      }

      const user = request.user as { id: string };
      await logAction(user.id, `Sincronizou campeonatos: ${created} criados, ${updated} atualizados.`);

      return reply.status(200).send({
        message: 'Campeonatos sincronizados com sucesso.',
        created,
        updated,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }

  syncTeams = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { championshipId } = syncByChampionshipIdSchema.parse(request.params);
      const teamRepo = new TeamRepository(db);
      const championshipRepo = new ChampionshipRepository(db);

      const championship = await championshipRepo.findById(championshipId);
      if (!championship) {
        return reply.status(404).send({ message: 'Campeonato não encontrado.' });
      }

      const mockTeams = this.mockService.getTeams(championshipId);
      let created = 0;

      for (const mockTeam of mockTeams) {
        const existingTeams = await teamRepo.listByChampionship(championshipId);
        const alreadyExists = existingTeams.some(t => t.name === mockTeam.name);

        if (!alreadyExists) {
          const team = new Team({
            name: mockTeam.name,
            badgeUrl: mockTeam.badgeUrl,
          }, mockTeam.id);

          await teamRepo.create(team, championshipId);
          created++;
        }
      }

      const user = request.user as { id: string };
      await logAction(user.id, `Sincronizou equipes do campeonato ${championshipId}: ${created} criadas.`);

      return reply.status(200).send({
        message: 'Equipes sincronizadas com sucesso.',
        championshipId,
        created,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }

  syncMatches = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { championshipId } = syncByChampionshipIdSchema.parse(request.params);
      const matchRepo = new MatchRepository(db);
      const championshipRepo = new ChampionshipRepository(db);

      const championship = await championshipRepo.findById(championshipId);
      if (!championship) {
        return reply.status(404).send({ message: 'Campeonato não encontrado.' });
      }

      const mockMatches = this.mockService.getMatches(championshipId);
      let created = 0;

      for (const mockMatch of mockMatches) {
        const existingMatches = await matchRepo.listByChampionship(championshipId);
        const alreadyExists = existingMatches.some(
          m =>
            m.homeTeamId === mockMatch.homeTeamId &&
            m.awayTeamId === mockMatch.awayTeamId &&
            new Date(m.matchDate).toISOString() === new Date(mockMatch.matchDate).toISOString()
        );

        if (!alreadyExists) {
          const match = new Match({
            championshipId: mockMatch.championshipId,
            homeTeamId: mockMatch.homeTeamId,
            awayTeamId: mockMatch.awayTeamId,
            matchDate: new Date(mockMatch.matchDate),
            homeScore: mockMatch.homeScore,
            awayScore: mockMatch.awayScore,
            status: mockMatch.status,
          });

          await matchRepo.create(match);
          created++;
        }
      }

      const user = request.user as { id: string };
      await logAction(user.id, `Sincronizou partidas do campeonato ${championshipId}: ${created} criadas.`);

      return reply.status(200).send({
        message: 'Partidas sincronizadas com sucesso.',
        championshipId,
        created,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }

  syncResults = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { championshipId } = syncByChampionshipIdSchema.parse(request.params);
      const matchRepo = new MatchRepository(db);
      const championshipRepo = new ChampionshipRepository(db);

      const championship = await championshipRepo.findById(championshipId);
      if (!championship) {
        return reply.status(404).send({ message: 'Campeonato não encontrado.' });
      }

      const mockMatches = this.mockService.getMatches(championshipId);
      let updated = 0;

      for (const mockMatch of mockMatches) {
        if (mockMatch.status === 'finished' && mockMatch.homeScore !== undefined && mockMatch.awayScore !== undefined) {
          const existingMatches = await matchRepo.listByChampionship(championshipId);
          const dbMatch = existingMatches.find(
            m =>
              m.homeTeamId === mockMatch.homeTeamId &&
              m.awayTeamId === mockMatch.awayTeamId &&
              new Date(m.matchDate).toISOString() === new Date(mockMatch.matchDate).toISOString()
          );

          if (dbMatch && dbMatch.id && (dbMatch.status !== 'finished' || dbMatch.homeScore !== mockMatch.homeScore || dbMatch.awayScore !== mockMatch.awayScore)) {
            await matchRepo.updateResult(dbMatch.id, mockMatch.homeScore, mockMatch.awayScore);
            updated++;
          }
        }
      }

      const user = request.user as { id: string };
      await logAction(user.id, `Sincronizou resultados do campeonato ${championshipId}: ${updated} atualizados.`);

      return reply.status(200).send({
        message: 'Resultados sincronizados com sucesso.',
        championshipId,
        updated,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) return reply.status(400).send({ errors: JSON.parse(error.message) });
      return reply.status(400).send({ message: error.message });
    }
  }
}

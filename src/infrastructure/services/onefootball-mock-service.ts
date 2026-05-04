export interface MockChampionship {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  status: 'active' | 'finished';
}

export interface MockTeam {
  id: number;
  name: string;
  badgeUrl: string;
}

export interface MockMatch {
  id: number;
  championshipId: number;
  homeTeamId: number;
  awayTeamId: number;
  matchDate: Date;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'ongoing' | 'finished';
}

export interface MockStanding {
  teamId: number;
  position: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface IOneFootballService {
  getChampionships(): MockChampionship[];
  getTeams(championshipId: number): MockTeam[];
  getMatches(championshipId: number): MockMatch[];
  getStandings(championshipId: number): MockStanding[];
}

const CHAMPIONSHIPS: MockChampionship[] = [
  { id: 1, title: 'Brasileirão 2025', description: 'Campeonato Brasileiro de Futebol 2025', isActive: true, status: 'active' },
  { id: 2, title: 'Copa do Brasil 2025', description: 'Copa do Brasil de Futebol 2025', isActive: true, status: 'active' },
  { id: 3, title: 'Champions League 2024/25', description: 'UEFA Champions League 2024/25', isActive: true, status: 'active' },
];

const TEAMS: Record<number, MockTeam[]> = {
  1: [
    { id: 1, name: 'Flamengo', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/orE554NToSkH6nuwofeUSQ_96x96.png' },
    { id: 2, name: 'Palmeiras', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/7spurne-xDt2p6C0mYSm8Q_96x96.png' },
    { id: 3, name: 'São Paulo', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/4w2Zcp-zPZ9UBNr3vBfnmg_96x96.png' },
    { id: 4, name: 'Corinthians', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/tCMSqgXVHROpdCpQhzTo1g_96x96.png' },
    { id: 5, name: 'Fluminense', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/OWVFKuHrQuf4q2Wk0hEmSA_96x96.png' },
    { id: 6, name: 'Vasco', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/gOEJrjUWfTVMRPoJxPZNrw_96x96.png' },
    { id: 7, name: 'Grêmio', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/Ku-73v_TW9kpe-EfaLr8Hw_96x96.png' },
    { id: 8, name: 'Internacional', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/OWVFKuHrQuf4q2Wk0hEmSA_96x96.png' },
    { id: 9, name: 'Atlético Mineiro', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/q9fhEsgpuyRq58sK1eDotw_96x96.png' },
    { id: 10, name: 'Botafogo', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/KLDWYp-H8CAe6WZVf-l1pA_96x96.png' },
    { id: 11, name: 'Red Bull Bragantino', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/lMyq4KVLKp83P7dS3WnFlw_96x96.png' },
    { id: 12, name: 'Fortaleza', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/me10epZeRCh3sT1E0dZgkQ_96x96.png' },
    { id: 13, name: 'Athletico Paranaense', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/-FNcXz_xUO1uIwDqN9Bqhw_96x96.png' },
    { id: 14, name: 'Cruzeiro', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/5nDWf7kPkmN2qOYrTezQ5Q_96x96.png' },
    { id: 15, name: 'Bahia', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/nIdbR6qIUDyZUBO9vGAqSg_96x96.png' },
    { id: 16, name: 'Santos', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/VHdNa6DpQEa1oEO8U2E1uw_96x96.png' },
    { id: 17, name: 'Ceará', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/88vGdJUYeU4zHxE-_05SMA_96x96.png' },
    { id: 18, name: 'Coritiba', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/LtpA9v-FA8K2aL9Z7YXqMg_96x96.png' },
    { id: 19, name: 'Goiás', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/3JmF7a0vMmChvS-I2CpeDw_96x96.png' },
    { id: 20, name: 'Cuiabá', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/j6NqKbX6_J_GnAqkaEOyHg_96x96.png' },
  ],
  2: [
    { id: 1, name: 'Flamengo', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/orE554NToSkH6nuwofeUSQ_96x96.png' },
    { id: 2, name: 'Palmeiras', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/7spurne-xDt2p6C0mYSm8Q_96x96.png' },
    { id: 3, name: 'São Paulo', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/4w2Zcp-zPZ9UBNr3vBfnmg_96x96.png' },
    { id: 4, name: 'Corinthians', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/tCMSqgXVHROpdCpQhzTo1g_96x96.png' },
    { id: 5, name: 'Fluminense', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/OWVFKuHrQuf4q2Wk0hEmSA_96x96.png' },
    { id: 6, name: 'Vasco', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/gOEJrjUWfTVMRPoJxPZNrw_96x96.png' },
    { id: 7, name: 'Grêmio', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/Ku-73v_TW9kpe-EfaLr8Hw_96x96.png' },
    { id: 8, name: 'Internacional', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/OWVFKuHrQuf4q2Wk0hEmSA_96x96.png' },
    { id: 9, name: 'Atlético Mineiro', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/q9fhEsgpuyRq58sK1eDotw_96x96.png' },
    { id: 10, name: 'Botafogo', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/KLDWYp-H8CAe6WZVf-l1pA_96x96.png' },
    { id: 11, name: 'Red Bull Bragantino', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/lMyq4KVLKp83P7dS3WnFlw_96x96.png' },
    { id: 12, name: 'Fortaleza', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/me10epZeRCh3sT1E0dZgkQ_96x96.png' },
    { id: 13, name: 'Athletico Paranaense', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/-FNcXz_xUO1uIwDqN9Bqhw_96x96.png' },
    { id: 14, name: 'Cruzeiro', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/5nDWf7kPkmN2qOYrTezQ5Q_96x96.png' },
    { id: 15, name: 'Bahia', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/nIdbR6qIUDyZUBO9vGAqSg_96x96.png' },
    { id: 16, name: 'Santos', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/VHdNa6DpQEa1oEO8U2E1uw_96x96.png' },
    { id: 21, name: 'River Plate', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/7000eva_SbDccHMnBKG1_w_96x96.png' },
    { id: 22, name: 'Boca Juniors', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/97KTTLsO9Ua5yLn1frU2Wg_96x96.png' },
    { id: 23, name: 'Racing', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/wL5XFXUDbJQuFNP1CwJLrw_96x96.png' },
    { id: 24, name: 'Independiente', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/8kiTdQqdv8t3yQ6t0NggfQ_96x96.png' },
  ],
  3: [
    { id: 101, name: 'Real Madrid', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/Th4fAVAZeCJWRcKoLWIfko_96x96.png' },
    { id: 102, name: 'Barcelona', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/paYnEE8hcrP96neHRNofhQ_96x96.png' },
    { id: 103, name: 'Manchester City', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/z44l-a0W1v5FmgPnemV6Xw_96x96.png' },
    { id: 104, name: 'Bayern Munich', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/-_cmntP3q7JLHVX6vQ9Tmg_96x96.png' },
    { id: 105, name: 'Arsenal', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/4us2nCgl6kgZc0t3hpW75Q_96x96.png' },
    { id: 106, name: 'Liverpool', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/0iShHhASp5q1SL4JhtwJiw_96x96.png' },
    { id: 107, name: 'Paris Saint-Germain', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/mSlMYqq2bTJenhfRgpEkbQ_96x96.png' },
    { id: 108, name: 'Inter Milan', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/l2-icjsMh7Av5Hn_4x6ZWg_96x96.png' },
    { id: 109, name: 'Borussia Dortmund', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/FZnTSH2rbHFos4BnlWAItw_96x96.png' },
    { id: 110, name: 'Atlético Madrid', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/srAAE0bMug1lHEFbiTpO0w_96x96.png' },
    { id: 111, name: 'AC Milan', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/1XH1dJUFxP4TQ8_7mL3IGA_96x96.png' },
    { id: 112, name: 'Napoli', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/PWAD33ut9x4gq1UBhdmX5w_96x96.png' },
    { id: 113, name: 'RB Leipzig', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/05A_ikEn8x3sia4bWvr-Gw_96x96.png' },
    { id: 114, name: 'Porto', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/QPbjv1b0a3iPZM0pRp2Z3Q_96x96.png' },
    { id: 115, name: 'Benfica', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/3hU5gG4xHqOnUFj1M0SKZQ_96x96.png' },
    { id: 116, name: 'Juventus', badgeUrl: 'https://ssl.gstatic.com/onebox/media/sports/logos/LIv6hb3Y_6CCAq6HR0sQ7w_96x96.png' },
  ],
};

const MATCHES: Record<number, MockMatch[]> = {
  1: [
    { id: 1, championshipId: 1, homeTeamId: 1, awayTeamId: 2, matchDate: new Date('2025-04-05T16:00:00'), homeScore: 2, awayScore: 1, status: 'finished' },
    { id: 2, championshipId: 1, homeTeamId: 3, awayTeamId: 4, matchDate: new Date('2025-04-05T18:30:00'), homeScore: 0, awayScore: 0, status: 'finished' },
    { id: 3, championshipId: 1, homeTeamId: 5, awayTeamId: 6, matchDate: new Date('2025-04-06T16:00:00'), homeScore: 3, awayScore: 2, status: 'finished' },
    { id: 4, championshipId: 1, homeTeamId: 7, awayTeamId: 8, matchDate: new Date('2025-04-06T18:30:00'), homeScore: 1, awayScore: 1, status: 'finished' },
    { id: 5, championshipId: 1, homeTeamId: 9, awayTeamId: 10, matchDate: new Date('2025-04-12T16:00:00'), homeScore: 2, awayScore: 0, status: 'finished' },
    { id: 6, championshipId: 1, homeTeamId: 11, awayTeamId: 12, matchDate: new Date('2025-04-12T18:30:00'), homeScore: 1, awayScore: 2, status: 'finished' },
    { id: 7, championshipId: 1, homeTeamId: 13, awayTeamId: 14, matchDate: new Date('2025-04-13T16:00:00'), homeScore: 0, awayScore: 1, status: 'finished' },
    { id: 8, championshipId: 1, homeTeamId: 15, awayTeamId: 16, matchDate: new Date('2025-04-13T18:30:00'), homeScore: 2, awayScore: 2, status: 'finished' },
    { id: 9, championshipId: 1, homeTeamId: 2, awayTeamId: 5, matchDate: new Date('2025-04-19T16:00:00'), homeScore: 1, awayScore: 0, status: 'finished' },
    { id: 10, championshipId: 1, homeTeamId: 4, awayTeamId: 1, matchDate: new Date('2025-04-19T18:30:00'), homeScore: 1, awayScore: 3, status: 'finished' },
    { id: 11, championshipId: 1, homeTeamId: 6, awayTeamId: 7, matchDate: new Date('2025-04-20T16:00:00'), homeScore: 0, awayScore: 2, status: 'finished' },
    { id: 12, championshipId: 1, homeTeamId: 8, awayTeamId: 3, matchDate: new Date('2025-04-20T18:30:00'), homeScore: 1, awayScore: 1, status: 'finished' },
    { id: 13, championshipId: 1, homeTeamId: 10, awayTeamId: 11, matchDate: new Date('2025-04-26T16:00:00'), homeScore: 2, awayScore: 1, status: 'finished' },
    { id: 14, championshipId: 1, homeTeamId: 12, awayTeamId: 9, matchDate: new Date('2025-04-26T18:30:00'), homeScore: 1, awayScore: 1, status: 'finished' },
    { id: 15, championshipId: 1, homeTeamId: 14, awayTeamId: 15, matchDate: new Date('2025-04-27T16:00:00'), homeScore: 2, awayScore: 0, status: 'finished' },
    { id: 16, championshipId: 1, homeTeamId: 16, awayTeamId: 13, matchDate: new Date('2025-04-27T18:30:00'), homeScore: 0, awayScore: 1, status: 'finished' },
    { id: 17, championshipId: 1, homeTeamId: 1, awayTeamId: 6, matchDate: new Date('2025-05-03T16:00:00'), homeScore: 3, awayScore: 1, status: 'finished' },
    { id: 18, championshipId: 1, homeTeamId: 3, awayTeamId: 5, matchDate: new Date('2025-05-03T18:30:00'), homeScore: 2, awayScore: 2, status: 'finished' },
    { id: 19, championshipId: 1, homeTeamId: 2, awayTeamId: 7, matchDate: new Date('2025-05-04T16:00:00'), homeScore: 1, awayScore: 0, status: 'finished' },
    { id: 20, championshipId: 1, homeTeamId: 4, awayTeamId: 8, matchDate: new Date('2025-05-04T18:30:00'), homeScore: 0, awayScore: 0, status: 'finished' },
    { id: 21, championshipId: 1, homeTeamId: 9, awayTeamId: 16, matchDate: new Date('2025-05-10T16:00:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 22, championshipId: 1, homeTeamId: 11, awayTeamId: 14, matchDate: new Date('2025-05-10T18:30:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 23, championshipId: 1, homeTeamId: 13, awayTeamId: 12, matchDate: new Date('2025-05-11T16:00:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 24, championshipId: 1, homeTeamId: 15, awayTeamId: 10, matchDate: new Date('2025-05-11T18:30:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 25, championshipId: 1, homeTeamId: 1, awayTeamId: 9, matchDate: new Date('2025-05-17T16:00:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 26, championshipId: 1, homeTeamId: 3, awayTeamId: 11, matchDate: new Date('2025-05-17T18:30:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 27, championshipId: 1, homeTeamId: 5, awayTeamId: 13, matchDate: new Date('2025-05-18T16:00:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 28, championshipId: 1, homeTeamId: 7, awayTeamId: 15, matchDate: new Date('2025-05-18T18:30:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
  ],
  2: [
    { id: 101, championshipId: 2, homeTeamId: 1, awayTeamId: 3, matchDate: new Date('2025-03-01T21:30:00'), homeScore: 2, awayScore: 1, status: 'finished' },
    { id: 102, championshipId: 2, homeTeamId: 2, awayTeamId: 4, matchDate: new Date('2025-03-02T21:30:00'), homeScore: 1, awayScore: 0, status: 'finished' },
    { id: 103, championshipId: 2, homeTeamId: 5, awayTeamId: 7, matchDate: new Date('2025-03-05T21:30:00'), homeScore: 0, awayScore: 0, status: 'finished' },
    { id: 104, championshipId: 2, homeTeamId: 6, awayTeamId: 8, matchDate: new Date('2025-03-06T21:30:00'), homeScore: 1, awayScore: 2, status: 'finished' },
    { id: 105, championshipId: 2, homeTeamId: 9, awayTeamId: 11, matchDate: new Date('2025-03-12T21:30:00'), homeScore: 2, awayScore: 2, status: 'finished' },
    { id: 106, championshipId: 2, homeTeamId: 10, awayTeamId: 12, matchDate: new Date('2025-03-13T21:30:00'), homeScore: 1, awayScore: 0, status: 'finished' },
    { id: 107, championshipId: 2, homeTeamId: 13, awayTeamId: 15, matchDate: new Date('2025-03-19T21:30:00'), homeScore: 3, awayScore: 1, status: 'finished' },
    { id: 108, championshipId: 2, homeTeamId: 14, awayTeamId: 16, matchDate: new Date('2025-03-20T21:30:00'), homeScore: 0, awayScore: 1, status: 'finished' },
    { id: 109, championshipId: 2, homeTeamId: 3, awayTeamId: 1, matchDate: new Date('2025-04-02T21:30:00'), homeScore: 1, awayScore: 1, status: 'finished' },
    { id: 110, championshipId: 2, homeTeamId: 4, awayTeamId: 2, matchDate: new Date('2025-04-03T21:30:00'), homeScore: 0, awayScore: 2, status: 'finished' },
    { id: 111, championshipId: 2, homeTeamId: 21, awayTeamId: 22, matchDate: new Date('2025-04-09T21:30:00'), homeScore: 2, awayScore: 0, status: 'finished' },
    { id: 112, championshipId: 2, homeTeamId: 23, awayTeamId: 24, matchDate: new Date('2025-04-10T21:30:00'), homeScore: 1, awayScore: 1, status: 'finished' },
    { id: 113, championshipId: 2, homeTeamId: 1, awayTeamId: 21, matchDate: new Date('2025-05-14T21:30:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 114, championshipId: 2, homeTeamId: 2, awayTeamId: 23, matchDate: new Date('2025-05-15T21:30:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 115, championshipId: 2, homeTeamId: 5, awayTeamId: 9, matchDate: new Date('2025-05-21T21:30:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 116, championshipId: 2, homeTeamId: 10, awayTeamId: 14, matchDate: new Date('2025-05-22T21:30:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
  ],
  3: [
    { id: 201, championshipId: 3, homeTeamId: 101, awayTeamId: 102, matchDate: new Date('2024-10-26T16:00:00'), homeScore: 2, awayScore: 5, status: 'finished' },
    { id: 202, championshipId: 3, homeTeamId: 103, awayTeamId: 104, matchDate: new Date('2024-10-26T16:00:00'), homeScore: 1, awayScore: 4, status: 'finished' },
    { id: 203, championshipId: 3, homeTeamId: 105, awayTeamId: 106, matchDate: new Date('2024-10-23T16:00:00'), homeScore: 2, awayScore: 2, status: 'finished' },
    { id: 204, championshipId: 3, homeTeamId: 107, awayTeamId: 108, matchDate: new Date('2024-10-23T16:00:00'), homeScore: 0, awayScore: 1, status: 'finished' },
    { id: 205, championshipId: 3, homeTeamId: 109, awayTeamId: 110, matchDate: new Date('2024-10-22T16:00:00'), homeScore: 1, awayScore: 2, status: 'finished' },
    { id: 206, championshipId: 3, homeTeamId: 111, awayTeamId: 112, matchDate: new Date('2024-10-22T16:00:00'), homeScore: 0, awayScore: 0, status: 'finished' },
    { id: 207, championshipId: 3, homeTeamId: 113, awayTeamId: 114, matchDate: new Date('2024-10-23T16:00:00'), homeScore: 3, awayScore: 2, status: 'finished' },
    { id: 208, championshipId: 3, homeTeamId: 115, awayTeamId: 116, matchDate: new Date('2024-10-22T16:00:00'), homeScore: 4, awayScore: 3, status: 'finished' },
    { id: 209, championshipId: 3, homeTeamId: 102, awayTeamId: 101, matchDate: new Date('2024-11-05T16:00:00'), homeScore: 1, awayScore: 2, status: 'finished' },
    { id: 210, championshipId: 3, homeTeamId: 104, awayTeamId: 103, matchDate: new Date('2024-11-06T16:00:00'), homeScore: 1, awayScore: 0, status: 'finished' },
    { id: 211, championshipId: 3, homeTeamId: 106, awayTeamId: 105, matchDate: new Date('2024-11-05T16:00:00'), homeScore: 2, awayScore: 0, status: 'finished' },
    { id: 212, championshipId: 3, homeTeamId: 108, awayTeamId: 107, matchDate: new Date('2024-11-06T16:00:00'), homeScore: 3, awayScore: 3, status: 'finished' },
    { id: 213, championshipId: 3, homeTeamId: 110, awayTeamId: 109, matchDate: new Date('2024-11-05T16:00:00'), homeScore: 2, awayScore: 1, status: 'finished' },
    { id: 214, championshipId: 3, homeTeamId: 112, awayTeamId: 111, matchDate: new Date('2024-11-06T16:00:00'), homeScore: 1, awayScore: 1, status: 'finished' },
    { id: 215, championshipId: 3, homeTeamId: 114, awayTeamId: 113, matchDate: new Date('2024-11-05T16:00:00'), homeScore: 0, awayScore: 0, status: 'finished' },
    { id: 216, championshipId: 3, homeTeamId: 116, awayTeamId: 115, matchDate: new Date('2024-11-06T16:00:00'), homeScore: 2, awayScore: 3, status: 'finished' },
    { id: 217, championshipId: 3, homeTeamId: 101, awayTeamId: 103, matchDate: new Date('2025-02-19T16:00:00'), homeScore: 2, awayScore: 1, status: 'finished' },
    { id: 218, championshipId: 3, homeTeamId: 104, awayTeamId: 105, matchDate: new Date('2025-02-19T16:00:00'), homeScore: 3, awayScore: 0, status: 'finished' },
    { id: 219, championshipId: 3, homeTeamId: 108, awayTeamId: 102, matchDate: new Date('2025-02-18T16:00:00'), homeScore: 1, awayScore: 0, status: 'finished' },
    { id: 220, championshipId: 3, homeTeamId: 106, awayTeamId: 110, matchDate: new Date('2025-02-18T16:00:00'), homeScore: 2, awayScore: 2, status: 'finished' },
    { id: 221, championshipId: 3, homeTeamId: 111, awayTeamId: 114, matchDate: new Date('2025-05-28T16:00:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
    { id: 222, championshipId: 3, homeTeamId: 115, awayTeamId: 113, matchDate: new Date('2025-05-28T16:00:00'), homeScore: undefined, awayScore: undefined, status: 'scheduled' },
  ],
};

const STANDINGS: Record<number, MockStanding[]> = {
  1: [
    { teamId: 1, position: 1, points: 22, played: 10, wins: 7, draws: 1, losses: 2, goalsFor: 19, goalsAgainst: 9, goalDifference: 10 },
    { teamId: 2, position: 2, points: 19, played: 10, wins: 6, draws: 1, losses: 3, goalsFor: 14, goalsAgainst: 8, goalDifference: 6 },
    { teamId: 9, position: 3, points: 18, played: 10, wins: 5, draws: 3, losses: 2, goalsFor: 12, goalsAgainst: 7, goalDifference: 5 },
    { teamId: 5, position: 4, points: 17, played: 10, wins: 5, draws: 2, losses: 3, goalsFor: 15, goalsAgainst: 11, goalDifference: 4 },
    { teamId: 7, position: 5, points: 16, played: 10, wins: 4, draws: 4, losses: 2, goalsFor: 11, goalsAgainst: 8, goalDifference: 3 },
    { teamId: 3, position: 6, points: 15, played: 10, wins: 4, draws: 3, losses: 3, goalsFor: 10, goalsAgainst: 10, goalDifference: 0 },
    { teamId: 10, position: 7, points: 14, played: 10, wins: 4, draws: 2, losses: 4, goalsFor: 13, goalsAgainst: 14, goalDifference: -1 },
    { teamId: 12, position: 8, points: 13, played: 10, wins: 4, draws: 1, losses: 5, goalsFor: 9, goalsAgainst: 11, goalDifference: -2 },
    { teamId: 14, position: 9, points: 12, played: 10, wins: 3, draws: 3, losses: 4, goalsFor: 8, goalsAgainst: 10, goalDifference: -2 },
    { teamId: 8, position: 10, points: 11, played: 10, wins: 2, draws: 5, losses: 3, goalsFor: 9, goalsAgainst: 10, goalDifference: -1 },
    { teamId: 13, position: 11, points: 11, played: 10, wins: 3, draws: 2, losses: 5, goalsFor: 7, goalsAgainst: 10, goalDifference: -3 },
    { teamId: 4, position: 12, points: 10, played: 10, wins: 2, draws: 4, losses: 4, goalsFor: 6, goalsAgainst: 10, goalDifference: -4 },
    { teamId: 15, position: 13, points: 9, played: 10, wins: 2, draws: 3, losses: 5, goalsFor: 8, goalsAgainst: 13, goalDifference: -5 },
    { teamId: 11, position: 14, points: 8, played: 10, wins: 2, draws: 2, losses: 6, goalsFor: 10, goalsAgainst: 16, goalDifference: -6 },
    { teamId: 6, position: 15, points: 7, played: 10, wins: 2, draws: 1, losses: 7, goalsFor: 8, goalsAgainst: 17, goalDifference: -9 },
    { teamId: 16, position: 16, points: 6, played: 10, wins: 1, draws: 3, losses: 6, goalsFor: 5, goalsAgainst: 14, goalDifference: -9 },
    { teamId: 17, position: 17, points: 0, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
    { teamId: 18, position: 18, points: 0, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
    { teamId: 19, position: 19, points: 0, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
    { teamId: 20, position: 20, points: 0, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 },
  ],
  2: [
    { teamId: 2, position: 1, points: 15, played: 6, wins: 5, draws: 0, losses: 1, goalsFor: 10, goalsAgainst: 3, goalDifference: 7 },
    { teamId: 1, position: 2, points: 13, played: 6, wins: 4, draws: 1, losses: 1, goalsFor: 11, goalsAgainst: 5, goalDifference: 6 },
    { teamId: 9, position: 3, points: 12, played: 6, wins: 3, draws: 3, losses: 0, goalsFor: 8, goalsAgainst: 4, goalDifference: 4 },
    { teamId: 10, position: 4, points: 10, played: 6, wins: 3, draws: 1, losses: 2, goalsFor: 7, goalsAgainst: 6, goalDifference: 1 },
    { teamId: 5, position: 5, points: 8, played: 6, wins: 2, draws: 2, losses: 2, goalsFor: 6, goalsAgainst: 7, goalDifference: -1 },
    { teamId: 13, position: 6, points: 7, played: 6, wins: 2, draws: 1, losses: 3, goalsFor: 8, goalsAgainst: 9, goalDifference: -1 },
    { teamId: 7, position: 7, points: 7, played: 6, wins: 2, draws: 1, losses: 3, goalsFor: 5, goalsAgainst: 7, goalDifference: -2 },
    { teamId: 21, position: 8, points: 6, played: 4, wins: 2, draws: 0, losses: 2, goalsFor: 5, goalsAgainst: 4, goalDifference: 1 },
    { teamId: 11, position: 9, points: 6, played: 6, wins: 1, draws: 3, losses: 2, goalsFor: 7, goalsAgainst: 9, goalDifference: -2 },
    { teamId: 8, position: 10, points: 5, played: 6, wins: 1, draws: 2, losses: 3, goalsFor: 5, goalsAgainst: 8, goalDifference: -3 },
    { teamId: 14, position: 11, points: 4, played: 6, wins: 1, draws: 1, losses: 4, goalsFor: 4, goalsAgainst: 10, goalDifference: -6 },
    { teamId: 16, position: 12, points: 3, played: 6, wins: 1, draws: 0, losses: 5, goalsFor: 3, goalsAgainst: 10, goalDifference: -7 },
  ],
  3: [
    { teamId: 102, position: 1, points: 18, played: 8, wins: 6, draws: 0, losses: 2, goalsFor: 18, goalsAgainst: 8, goalDifference: 10 },
    { teamId: 104, position: 2, points: 16, played: 8, wins: 5, draws: 1, losses: 2, goalsFor: 15, goalsAgainst: 7, goalDifference: 8 },
    { teamId: 108, position: 3, points: 15, played: 8, wins: 4, draws: 3, losses: 1, goalsFor: 12, goalsAgainst: 8, goalDifference: 4 },
    { teamId: 106, position: 4, points: 14, played: 8, wins: 4, draws: 2, losses: 2, goalsFor: 11, goalsAgainst: 9, goalDifference: 2 },
    { teamId: 105, position: 5, points: 13, played: 8, wins: 3, draws: 4, losses: 1, goalsFor: 10, goalsAgainst: 8, goalDifference: 2 },
    { teamId: 110, position: 6, points: 12, played: 8, wins: 4, draws: 0, losses: 4, goalsFor: 11, goalsAgainst: 11, goalDifference: 0 },
    { teamId: 101, position: 7, points: 12, played: 8, wins: 4, draws: 0, losses: 4, goalsFor: 9, goalsAgainst: 12, goalDifference: -3 },
    { teamId: 115, position: 8, points: 11, played: 8, wins: 3, draws: 2, losses: 3, goalsFor: 14, goalsAgainst: 13, goalDifference: 1 },
    { teamId: 113, position: 9, points: 10, played: 8, wins: 3, draws: 1, losses: 4, goalsFor: 9, goalsAgainst: 10, goalDifference: -1 },
    { teamId: 111, position: 10, points: 9, played: 8, wins: 2, draws: 3, losses: 3, goalsFor: 7, goalsAgainst: 9, goalDifference: -2 },
    { teamId: 112, position: 11, points: 8, played: 8, wins: 2, draws: 2, losses: 4, goalsFor: 8, goalsAgainst: 11, goalDifference: -3 },
    { teamId: 109, position: 12, points: 7, played: 8, wins: 2, draws: 1, losses: 5, goalsFor: 7, goalsAgainst: 13, goalDifference: -6 },
    { teamId: 107, position: 13, points: 5, played: 8, wins: 1, draws: 2, losses: 5, goalsFor: 5, goalsAgainst: 12, goalDifference: -7 },
    { teamId: 114, position: 14, points: 4, played: 8, wins: 1, draws: 1, losses: 6, goalsFor: 6, goalsAgainst: 14, goalDifference: -8 },
    { teamId: 116, position: 15, points: 3, played: 8, wins: 1, draws: 0, losses: 7, goalsFor: 10, goalsAgainst: 18, goalDifference: -8 },
  ],
};

export class OneFootballMockService implements IOneFootballService {
  getChampionships(): MockChampionship[] {
    return CHAMPIONSHIPS.map(c => ({ ...c }));
  }

  getTeams(championshipId: number): MockTeam[] {
    const teams = TEAMS[championshipId] || [];
    return teams.map(t => ({ ...t }));
  }

  getMatches(championshipId: number): MockMatch[] {
    const matches = MATCHES[championshipId] || [];
    return matches.map(m => ({ ...m, matchDate: new Date(m.matchDate) }));
  }

  getStandings(championshipId: number): MockStanding[] {
    const standings = STANDINGS[championshipId] || [];
    return standings.map(s => ({ ...s }));
  }
}

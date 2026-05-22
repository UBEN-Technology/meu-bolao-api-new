export type MatchStatus = 'scheduled' | 'ongoing' | 'finished';

export class Match {
  public readonly id?: number;
  public championshipId: number;
  public homeTeamId: number;
  public awayTeamId: number;
  public matchDate: Date;
  public homeScore?: number;
  public awayScore?: number;
  public status: MatchStatus;
  public homeTeamName?: string | null;
  public awayTeamName?: string | null;
  public homeTeamBadge?: string | null;
  public awayTeamBadge?: string | null;
  public homeGuess?: number | null;
  public awayGuess?: number | null;
  public pointsEarned?: number | null;

  constructor(props: Omit<Match, "id">, id?: number) {
    this.id = id;
    this.championshipId = props.championshipId;
    this.homeTeamId = props.homeTeamId;
    this.awayTeamId = props.awayTeamId;
    this.matchDate = props.matchDate;
    this.homeScore = props.homeScore;
    this.awayScore = props.awayScore;
    this.status = props.status || 'scheduled';
    this.homeTeamName = props.homeTeamName;
    this.awayTeamName = props.awayTeamName;
    this.homeTeamBadge = props.homeTeamBadge;
    this.awayTeamBadge = props.awayTeamBadge;
    this.homeGuess = props.homeGuess;
    this.awayGuess = props.awayGuess;
    this.pointsEarned = props.pointsEarned;
  }
}
export class Team {
  public readonly id?: number;
  public name: string;
  public badgeUrl?: string;
  public code: string;
  public nacionality: string;

  constructor(props: Omit<Team, "id">, id?: number) {
    this.id = id;
    this.name = props.name;
    this.badgeUrl = props.badgeUrl;
    this.code = props.code;
    this.nacionality = props.nacionality;
  }
}
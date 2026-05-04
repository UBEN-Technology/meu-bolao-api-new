export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public passwordHash: string;
  public createdAt: Date;
  public isActive: boolean;
  public emailConfirmed: boolean;
  public pictureUrl?: string;
  public updatedAt?: Date;

  constructor(
    props: {
      name: string;
      email: string;
      passwordHash: string;
      isActive?: boolean;
      emailConfirmed?: boolean;
      pictureUrl?: string;
      updatedAt?: Date;
    },
    id: string,
    createdAt?: Date
  ) {
    this.id = id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = createdAt || new Date();
    this.isActive = props.isActive ?? true;
    this.emailConfirmed = props.emailConfirmed ?? true;
    this.pictureUrl = props.pictureUrl;
    this.updatedAt = props.updatedAt;
  }
}

import { User } from "@/domain/entities";
import { IUserRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class UserRepository implements IUserRepository {
  constructor(private db: Knex) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db("users").where({ email }).first();
    if (!row) return null;
    return this.mapToEntity(row);
  }

  async findByPhone(phone: string): Promise<User | null> {
    const row = await this.db("users").where({ phone }).first();
    if (!row) return null;
    return this.mapToEntity(row);
  }

  async findByDocument(document: string): Promise<User | null> {
    const row = await this.db("users").where({ document }).first();
    if (!row) return null;
    return this.mapToEntity(row);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db("users").where({ id }).first();
    if (!row) return null;
    return this.mapToEntity(row);
  }

  async save(user: User): Promise<void> {
    const insertData: any = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      document: user.document,
      password: user.passwordHash,
      created_at: user.createdAt,
      is_active: user.isActive,
      email_confirmed: user.emailConfirmed,
    };
    if (user.pictureUrl) insertData.picture_url = user.pictureUrl;

    await this.db("users").insert(insertData);
  }

  async isAdmin(userId: string): Promise<boolean> {
    const row = await this.db("system_admins")
      .where({ user_id: userId, is_active: true })
      .first();
    return !!row;
  }

  async getRoleAdmin(userId: string): Promise<'super_admin' | 'moderator' | 'user'> {
    const row = await this.db("system_admins")
      .where({ user_id: userId, is_active: true })
      .first();
    return row ? row.access_level : 'user';
  }  

  async promoteToAdmin(userId: string, level: 'super_admin' | 'moderator'): Promise<void> {
    const exists = await this.db("system_admins").where({ user_id: userId }).first();
    
    if (exists) {
      await this.db("system_admins").where({ user_id: userId }).update({
        access_level: level,
        is_active: true
      });
    } else {
      await this.db("system_admins").insert({
        user_id: userId,
        access_level: level,
        is_active: true
      });
    }
  }

  async findAll(): Promise<User[]> {
    const rows = await this.db("users").orderBy("created_at", "desc");
    return rows.map(row => this.mapToEntity(row));
  }

  async updateStatus(userId: string, isActive: boolean): Promise<void> {
    await this.db("users")
      .where({ id: userId })
      .update({ is_active: isActive });
  }

  async update(userId: string, data: { name?: string; pictureUrl?: string }): Promise<void> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.pictureUrl !== undefined) updateData.picture_url = data.pictureUrl;

    await this.db("users")
      .where({ id: userId })
      .update(updateData);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.db("users")
      .where({ id: userId })
      .update({ password: passwordHash });
  }

  async updateEmailConfirmed(userId: string, confirmed: boolean): Promise<void> {
    await this.db("users")
      .where({ id: userId })
      .update({ email_confirmed: confirmed });
  }

  /**
   * Helper para converter o registo da base de dados na entidade de domínio
   */
  private mapToEntity(row: any): User {
    return new User(
      {
        name: row.name,
        email: row.email,
        phone: row.phone,
        document: row.document,
        passwordHash: row.password,
        isActive: row.is_active,
        emailConfirmed: row.email_confirmed,
        pictureUrl: row.picture_url,
        updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
      },
      row.id,
      new Date(row.created_at)
    );
  }
}

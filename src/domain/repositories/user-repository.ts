import { User } from "@/domain/entities";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    isAdmin(userId: string): Promise<boolean>;
    getRoleAdmin(userId: string): Promise<'super_admin' | 'moderator' | 'user'>;
    promoteToAdmin(userId: string, level: 'super_admin' | 'moderator'): Promise<void>;
    findAll(): Promise<User[]>;
    updateStatus(userId: string, isActive: boolean): Promise<void>;
    update(userId: string, data: { name?: string; pictureUrl?: string }): Promise<void>;
    updatePassword(userId: string, passwordHash: string): Promise<void>;
    updateEmailConfirmed(userId: string, confirmed: boolean): Promise<void>;
}
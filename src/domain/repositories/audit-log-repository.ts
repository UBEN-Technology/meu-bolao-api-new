import { AuditLog } from "../entities";

export interface AuditLogEntry {
  id: number;
  action: string;
  executedAt: Date;
  adminName: string;
  adminEmail: string;
}

export interface IAuditLogRepository {
  create(log: AuditLog): Promise<void>;
  findAll(): Promise<AuditLogEntry[]>;
}

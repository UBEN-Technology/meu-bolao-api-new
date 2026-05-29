import { Group } from "@/domain/entities";

export interface GroupWithDetails {
  id: string;
  ownerId: string;
  championshipId: number;
  title: string;
  inviteCode: string;
  privacyType: 'public' | 'private';
  entryDeadline: Date;
  maxMembers: number;
  entryFee: number;
  hasPrize: boolean;
  isActive: boolean;
  ownerName: string;
  championshipTitle: string;
  currentMembers: number;
}

export interface GroupMember {
  id: string;
  name: string;
  joinedAt: Date;
}

export interface IGroupRepository {
  create(group: Group): Promise<void>;
  findById(id: string): Promise<Group | null>;
  findByInviteCode(code: string): Promise<Group | null>;
  listPublic(): Promise<Group[]>;
  listByUser(userId: string): Promise<Group[]>;
  addMember(groupId: string, userId: string, paid: boolean): Promise<void>;
  countMembers(groupId: string): Promise<number>;
  isUserInGroup(userId: string, groupId: string): Promise<boolean>;
  listMembers(groupId: string): Promise<GroupMember[]>;
  listAll(): Promise<GroupWithDetails[]>;
  updateStatus(groupId: string, isActive: boolean): Promise<void>;
}

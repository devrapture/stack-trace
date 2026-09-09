import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import { PersistentInvariantError } from '../../../platform/database/persistence-invariant.error.js';
import { PrismaService } from '../../../platform/database/prisma.service.js';
import {
  copyDate,
  copyNullableDate,
} from '../../users/infrastructure/prisma-user.repository.js';
import { AuthIdentityRepository } from '../application/auth-identity.repository.js';
import {
  AuthIdentitySnapshot,
  AuthIdentityStatus,
  AuthIdentityType,
  isAuthIdentityStatus,
  isAuthIdentityType,
} from '../domain/auth-identity.js';

const AUTH_IDENTITY_SELECT = {
  id: true,
  userId: true,
  identityType: true,
  status: true,
  activatedAt: true,
  disabledAt: true,
  lastUsedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AuthIdentitySelect;

type AuthIdentityRow = Prisma.AuthIdentityGetPayload<{
  select: typeof AUTH_IDENTITY_SELECT;
}>;

const requireIdentityType = (value: string): AuthIdentityType => {
  if (isAuthIdentityType(value)) {
    return value;
  }
  throw new PersistentInvariantError('auth_identities.identity_type');
};

const requireIdentityStatus = (value: string): AuthIdentityStatus => {
  if (isAuthIdentityStatus(value)) {
    return value;
  }
  throw new PersistentInvariantError('auth_identities.status');
};

const mapAuthIdentity = (row: AuthIdentityRow): AuthIdentitySnapshot => {
  return Object.freeze({
    id: row.id,
    userId: row.userId,
    identityType: requireIdentityType(row.identityType),
    status: requireIdentityStatus(row.status),
    activatedAt: copyNullableDate(row.activatedAt),
    disabledAt: copyNullableDate(row.disabledAt),
    lastUsedAt: copyNullableDate(row.lastUsedAt),
    createdAt: copyDate(row.createdAt),
    updatedAt: copyDate(row.updatedAt),
  });
};

@Injectable()
export class PrismaAuthIdentityRepository implements AuthIdentityRepository {
  constructor(private prismaService: PrismaService) {}

  async findByUserAndType(
    userId: string,
    identityType: AuthIdentityType,
  ): Promise<AuthIdentitySnapshot | null> {
    const row = await this.prismaService.authIdentity.findFirst({
      where: {
        userId,
        identityType,
      },
      select: AUTH_IDENTITY_SELECT,
    });
    return row === null ? null : mapAuthIdentity(row);
  }

  async listByUserId(userId: string): Promise<readonly AuthIdentitySnapshot[]> {
    const rows = await this.prismaService.authIdentity.findMany({
      where: {
        userId,
      },
      select: AUTH_IDENTITY_SELECT,
      orderBy: [
        {
          createdAt: 'asc',
          id: 'asc',
        },
      ],
    });
    return Object.freeze(rows.map(mapAuthIdentity));
  }
}

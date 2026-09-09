import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import { PersistentInvariantError } from '../../../platform/database/persistence-invariant.error.js';
import { PrismaService } from '../../../platform/database/prisma.service.js';
import { UserRepository } from '../application/user.repository.js';
import {
  EmailOwnershipSnapshot,
  isUserStatus,
  UserSnapshot,
  UserStatus,
} from '../domain/user.js';

const USER_SELECT = {
  id: true,
  publicId: true,
  status: true,
  displayName: true,
  activatedAt: true,
  disabledAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

type UserRow = Prisma.UserGetPayload<{
  select: typeof USER_SELECT;
}>;

export const copyDate = (value: Date): Date => new Date(value.getTime());

export const copyNullableDate = (value: Date | null): Date | null =>
  value === null ? null : copyDate(value);

const requireUserStatus = (value: string): UserStatus => {
  if (!isUserStatus(value)) {
    throw new PersistentInvariantError('user.status');
  }
  return value;
};

const mapUser = (row: UserRow): UserSnapshot =>
  Object.freeze({
    id: row.id,
    publicId: row.publicId,
    status: requireUserStatus(row.status),
    displayName: row.displayName ?? null,
    activatedAt: copyNullableDate(row.activatedAt),
    disabledAt: copyNullableDate(row.disabledAt),
    deletedAt: copyNullableDate(row.deletedAt),
    createdAt: copyDate(row.createdAt),
    updatedAt: copyDate(row.updatedAt),
  });

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(userId: string): Promise<UserSnapshot | null> {
    const row = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },

      select: USER_SELECT,
    });

    return row === null ? null : mapUser(row);
  }

  async findByPublicId(publicId: string): Promise<UserSnapshot | null> {
    const row = await this.prismaService.user.findUnique({
      where: {
        publicId,
      },
      select: USER_SELECT,
    });

    return row === null ? null : mapUser(row);
  }

  async findEmailOwnershipByNormalizedEmail(
    normalizedEmail: string,
  ): Promise<EmailOwnershipSnapshot | null> {
    const row = await this.prismaService.userEmail.findUnique({
      where: {
        normalizedEmail,
      },
      select: {
        id: true,
        userId: true,
        displayEmail: true,
        normalizedEmail: true,
        isPrimary: true,
        verifiedAt: true,

        user: {
          select: USER_SELECT,
        },
      },
    });

    if (row === null) {
      return null;
    }

    return Object.freeze({
      id: row.id,
      userId: row.userId,
      displayEmail: row.displayEmail,
      normalizedEmail: row.normalizedEmail,
      isPrimary: row.isPrimary,
      verifiedAt: copyNullableDate(row.verifiedAt),
      user: mapUser(row.user),
    });
  }
}

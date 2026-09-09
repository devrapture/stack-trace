export const USER_STATUSES = [
  'pending',
  'active',
  'disabled',
  'deleted',
] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export const isUserStatus = (status: string): status is UserStatus => {
  return (
    status === 'pending' ||
    status === 'active' ||
    status === 'disabled' ||
    status === 'deleted'
  );
};

export interface UserSnapshot {
  readonly id: string;
  readonly publicId: string;
  readonly status: UserStatus;
  readonly displayName: string | null;
  readonly activatedAt: Date | null;
  readonly disabledAt: Date | null;
  readonly deletedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface EmailOwnershipSnapshot {
  readonly id: string;
  readonly userId: string;
  readonly displayEmail: string;
  readonly normalizedEmail: string;
  readonly isPrimary: boolean;
  readonly verifiedAt: Date | null;
  readonly user: UserSnapshot;
}

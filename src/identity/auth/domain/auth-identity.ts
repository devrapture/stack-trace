export const AUTH_IDENTITY_TYPES = ['password', 'google', 'github'] as const;

export type AuthIdentityType = (typeof AUTH_IDENTITY_TYPES)[number];

export const AUTH_IDENTITY_STATUSES = [
  'pending',
  'active',
  'disabled',
] as const;

export type AuthIdentityStatus = (typeof AUTH_IDENTITY_STATUSES)[number];

export const isAuthIdentityStatus = (
  status: string,
): status is AuthIdentityStatus => {
  return status === 'pending' || status === 'active' || status === 'disabled';
};

export const isAuthIdentityType = (type: string): type is AuthIdentityType => {
  return type === 'password' || type === 'google' || type === 'github';
};

export interface AuthIdentitySnapshot {
  readonly id: string;
  readonly userId: string;
  readonly identityType: AuthIdentityType;
  readonly status: AuthIdentityStatus;
  readonly activatedAt: Date | null;
  readonly disabledAt: Date | null;
  readonly lastUsedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

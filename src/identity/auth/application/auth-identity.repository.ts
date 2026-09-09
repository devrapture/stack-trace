import {
  AuthIdentitySnapshot,
  AuthIdentityType,
} from '../domain/auth-identity.js';

export const AUTH_IDENTITY_REPOSITORY = Symbol('AUTH_IDENTITY_REPOSITORY');

export interface AuthIdentityRepository {
  findByUserAndType(
    userId: string,
    identityType: AuthIdentityType,
  ): Promise<AuthIdentitySnapshot | null>;

  listByUserId(userId: string): Promise<readonly AuthIdentitySnapshot[]>;
}

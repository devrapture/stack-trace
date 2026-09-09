import { EmailOwnershipSnapshot, UserSnapshot } from '../domain/user.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findById(userId: string): Promise<UserSnapshot | null>;

  findByPublicId(publicId: string): Promise<UserSnapshot | null>;

  findEmailOwnershipByNormalizedEmail(
    normalizeEmail: string,
  ): Promise<EmailOwnershipSnapshot | null>;
}

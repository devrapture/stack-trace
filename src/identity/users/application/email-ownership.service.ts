import { Inject, Injectable } from '@nestjs/common';
import {
  NormalizedEmailAddress,
  normalizeEmailAddress,
} from '../domain/email-address.js';
import { EmailOwnershipSnapshot } from '../domain/user.js';
import { USER_REPOSITORY, type UserRepository } from './user.repository.js';

export interface EmailOwnernshipLookup {
  readonly email: NormalizedEmailAddress;
  readonly ownership: EmailOwnershipSnapshot | null;
}

@Injectable()
export class EmailOwnershipService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async findOwnership(rawEmail: string): Promise<EmailOwnernshipLookup> {
    const email = normalizeEmailAddress(rawEmail);

    const ownership =
      await this.userRepository.findEmailOwnershipByNormalizedEmail(
        email.normalizedEmail,
      );
    return Object.freeze({
      email,
      ownership,
    });
  }
}

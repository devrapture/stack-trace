import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../platform/database/database.module.js';
import { AUTH_IDENTITY_REPOSITORY } from './application/auth-identity.repository.js';
import { PrismaAuthIdentityRepository } from './infrastructure/prisma-auth-identity.repository.js';

@Module({
  imports: [DatabaseModule],
  providers: [
    PrismaAuthIdentityRepository,
    {
      provide: AUTH_IDENTITY_REPOSITORY,
      useExisting: PrismaAuthIdentityRepository,
    },
  ],
  exports: [AUTH_IDENTITY_REPOSITORY],
})
export class AuthIdentitiesModule {}

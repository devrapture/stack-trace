import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../platform/database/database.module.js';
import { EmailOwnershipService } from './application/email-ownership.service.js';
import { USER_REPOSITORY } from './application/user.repository.js';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository.js';

@Module({
  imports: [DatabaseModule],
  providers: [
    EmailOwnershipService,
    PrismaUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY, EmailOwnershipService],
})
export class UsersModule {}

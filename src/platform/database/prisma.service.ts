import { Inject, Injectable, type OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import {
  DATABASE_CONFIG,
  type DatabaseConfig,
} from '../config/database-config.js';

const createPostgresAdapter = (config: DatabaseConfig): PrismaPg => {
  return new PrismaPg({
    connectionString: config.connectionString,
    max: config.poolMax,
    connectionTimeoutMillis: config.connectionTimeoutMs,
    idleTimeoutMillis: config.idleTimeoutMs,
    maxLifetimeSeconds: config.maxLifetimeSeconds,
  });
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(
    @Inject(DATABASE_CONFIG)
    config: DatabaseConfig,
  ) {
    super({
      adapter: createPostgresAdapter(config),
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

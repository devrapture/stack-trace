import { Injectable } from '@nestjs/common';
import {
  DatabaseHealthProbe,
  DatabaseReadiness,
} from './database-health-probe.js';
import { PrismaService } from './prisma.service.js';
import { CURRENT_SCHEMA_VERSION } from './schema-version.js';

@Injectable()
export class PrismaDatabaseHealthProbe implements DatabaseHealthProbe {
  constructor(private prismaService: PrismaService) {}

  async checkReadiness(): Promise<DatabaseReadiness> {
    try {
      const rows = await this.prismaService.$queryRaw<
        Array<{ readonly ok: number }>
      >`SELECT 1::int AS ok`;

      if (rows[0]?.ok !== 1) {
        return {
          database: 'down',
          schema: 'down',
        };
      }
    } catch {
      return {
        database: 'down',
        schema: 'down',
      };
    }

    try {
      const schemaVersion = await this.prismaService.schemaMigration.findUnique(
        {
          where: {
            semanticVersion: CURRENT_SCHEMA_VERSION,
          },
          select: {
            semanticVersion: true,
          },
        },
      );

      return {
        database: 'up',
        schema: schemaVersion === null ? 'down' : 'up',
      };
    } catch {
      return {
        database: 'up',
        schema: 'down',
      };
    }
  }
}

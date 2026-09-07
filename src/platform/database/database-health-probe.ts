export const DATABASE_HEALTH_PROBE = Symbol('DATABASE_HEALTH_PROBE');

export type DatabaseHealthState = 'up' | 'down';

export interface DatabaseReadiness {
  readonly database: DatabaseHealthState;
  readonly schema: DatabaseHealthState;
}

export interface DatabaseHealthProbe {
  checkReadiness(): Promise<DatabaseReadiness>;
}

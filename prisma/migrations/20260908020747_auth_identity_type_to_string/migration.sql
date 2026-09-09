-- AlterTable
ALTER TABLE "auth_identities"
ALTER COLUMN "identity_type" TYPE VARCHAR(32)
USING LOWER("identity_type"::text);

-- AddCheckConstraint
ALTER TABLE "auth_identities"
ADD CONSTRAINT "auth_identities_identity_type_check"
CHECK ("identity_type" IN ('password', 'google', 'github'));

-- DropEnum
DROP TYPE "AuthIdentityType";

-- Bump schema version recorded by the readiness probe.
UPDATE "schema_migrations"
SET "semantic_version" = '0.2.1'
WHERE "migration_name" = '20260906143527_record_schema_version';

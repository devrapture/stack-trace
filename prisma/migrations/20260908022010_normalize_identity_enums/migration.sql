-- CreateEnum
CREATE TYPE "AuthIdentityType" AS ENUM ('password', 'google', 'github');

-- AlterEnum
BEGIN;
CREATE TYPE "AuthIdentityStatus_new" AS ENUM ('pending', 'active', 'disabled');
ALTER TABLE "public"."auth_identities" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "auth_identities"
ALTER COLUMN "status" TYPE "AuthIdentityStatus_new"
USING (LOWER("status"::text)::"AuthIdentityStatus_new");
ALTER TYPE "AuthIdentityStatus" RENAME TO "AuthIdentityStatus_old";
ALTER TYPE "AuthIdentityStatus_new" RENAME TO "AuthIdentityStatus";
DROP TYPE "AuthIdentityStatus_old";
ALTER TABLE "auth_identities" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('pending', 'active', 'disabled', 'deleted');
ALTER TABLE "public"."users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users"
ALTER COLUMN "status" TYPE "UserStatus_new"
USING (LOWER("status"::text)::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- DropForeignKey
ALTER TABLE "auth_identities" DROP CONSTRAINT "auth_identities_user_id_fkey";

-- Replace the string constraint with the enum while preserving existing values.
ALTER TABLE "auth_identities"
DROP CONSTRAINT "auth_identities_identity_type_check";

ALTER TABLE "auth_identities"
ALTER COLUMN "identity_type" TYPE "AuthIdentityType"
USING ("identity_type"::text::"AuthIdentityType");

-- AddForeignKey
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Bump schema version recorded by the readiness probe.
UPDATE "schema_migrations"
SET "semantic_version" = '0.3.0'
WHERE "migration_name" = '20260906143527_record_schema_version';

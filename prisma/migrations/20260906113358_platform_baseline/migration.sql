-- CreateTable
CREATE TABLE "schema_migrations" (
    "semantic_version" VARCHAR(32) NOT NULL,
    "migration_name" VARCHAR(255) NOT NULL,
    "applied_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "application_build" VARCHAR(128),
    "notes" TEXT,

    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("semantic_version")
);

-- CreateIndex
CREATE UNIQUE INDEX "schema_migrations_migration_name_key" ON "schema_migrations"("migration_name");

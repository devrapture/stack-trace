INSERT INTO "schema_migrations" (
    "semantic_version",
    "migration_name",
    "notes"
)
VALUES (
    '0.1.0',
    '20260906143527_record_schema_version',
    'Records the schema version required by the API readiness probe.'
);

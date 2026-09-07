# Stack Trace Backend

NestJS API backed by PostgreSQL and Prisma.

## Requirements

- Bun 1.3.14
- A supported Node.js release (22.22.3+, 24.15.0+, or 26+)
- Docker for the local PostgreSQL service

## Setup

```bash
bun install
cp .env.example .env
bun run db:up
bun run db:migrate:deploy
```

The repository's existing local `.env` can be kept when upgrading from the former monorepo layout.

## Develop

```bash
bun run dev
```

Portless serves the API at <https://api.localhost>. The first run may prompt you to trust a local certificate. To run Nest directly instead:

```bash
bun run start:dev
```

## Commands

| Command                 | What it does                         |
| ----------------------- | ------------------------------------ |
| `bun run build`         | Build the NestJS application         |
| `bun run test`          | Run unit tests                       |
| `bun run test:coverage` | Run unit tests with coverage         |
| `bun run test:e2e`      | Run end-to-end tests                 |
| `bun run lint`          | Lint source and test files           |
| `bun run typecheck`     | Type-check the application           |
| `bun run check`         | Check formatting, lint, and types    |
| `bun run format`        | Format source and test files         |
| `bun run cli:doctor`    | Check dependency-injection wiring    |
| `bun run worker:smoke`  | Build and start the worker smoke run |
| `bun run deps:audit`    | Audit dependencies                   |
| `bun run db:up`         | Start local PostgreSQL               |
| `bun run db:down`       | Stop Compose services                |
| `bun run db:reset`      | Stop PostgreSQL and drop its volume  |
| `bun run db:logs`       | Follow PostgreSQL logs               |
| `bun run db:shell`      | Open `psql` for the local database   |

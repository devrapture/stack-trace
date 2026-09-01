# Stack Trace

Bun + Turborepo monorepo:

- `apps/api` — NestJS API
- `apps/web` — Next.js frontend (T3 App Router + Tailwind)
- `packages/shared-types` — shared TypeScript contracts

## Setup

```bash
bun install
```

Copy env files if needed:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Postgres for local data (optional until the API uses it):

```bash
bun run db:up
```

## Develop

```bash
bun run dev
```

Portless assigns ephemeral ports and serves named local URLs:

- Web: https://web.localhost
- API: https://api.localhost

First run may prompt to trust a local CA and bind port 443. To skip HTTPS:

```bash
PORTLESS_HTTPS=0 PORTLESS_PORT=1355 bun run dev
```

Run one app:

```bash
bun run dev:api
bun run dev:web
```

## Scripts

| Command                 | What it does                             |
| ----------------------- | ---------------------------------------- |
| `bun run dev`           | Start api + web via Turborepo / Portless |
| `bun run dev:api`       | Nest watch mode without Portless         |
| `bun run dev:web`       | Next.js via Portless                     |
| `bun run build`         | Build all workspaces                     |
| `bun run test`          | Unit tests                               |
| `bun run test:coverage` | API coverage                             |
| `bun run test:e2e`      | API e2e                                  |
| `bun run lint`          | Lint                                     |
| `bun run typecheck`     | Typecheck                                |
| `bun run check`         | Format check + lint + typecheck          |
| `bun run format`        | Format                                   |
| `bun run cli:doctor`    | API DI wiring check                      |
| `bun run worker:smoke`  | API worker smoke                         |
| `bun run deps:audit`    | API production audit                     |
| `bun run db:up`         | Start local Postgres                     |
| `bun run db:down`       | Stop compose services                    |
| `bun run db:reset`      | Stop compose and drop volumes            |
| `bun run db:logs`       | Follow Postgres logs                     |
| `bun run db:shell`      | `psql` into local Postgres               |

# Git Workflow

## Model: trunk + protected `staging`

```
feature/* ──┐
fix/*      ├─▶ PR ─▶ staging ──▶ PR (promotion) ──▶ main
chore/*    ──┘                     ▲
hotfix/* ────────── direct to main ─┘
```

- **`staging`** is the integration line. All normal work lands here first.
- **`main`** is the release line. It only receives:
  - promotion PRs (`staging` → `main`), and
  - `hotfix/*` PRs for production emergencies (then merge `main` back into `staging`).
- Both branches are fully protected: **no direct pushes**, no force-push, no deletions.
- **No code review is required** on either branch (per project decision 2026-08-30) — the CI checks are the gatekeeper.

## Branch naming

| Branch          | Prefix     | Example                           |
| --------------- | ---------- | --------------------------------- |
| New feature     | `feature/` | `feature/42-add-api-key-rotation` |
| Bug fix         | `fix/`     | `fix/18-health-check-500`         |
| Chore / tooling | `chore/`   | `chore/migrate-to-bun-ci`         |
| Prod emergency  | `hotfix/`  | `hotfix/auth-refresh-token`       |

Branches are short-lived (days, not weeks). Push them up early — CI runs on every push, so you get feedback before the PR is even opened.

## Commit messages: Conventional Commits

```
<type>(<scope>): <subject>

feat(cron): add api-key rotation job
fix(stats): return 404 for missing trace id
chore(ci): add gitleaks secret scan
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `build`, `ci`, `perf`, `style`.

Why:

- **Machine-readable history** — enables automated changelogs and versioning later (semantic-release, etc.).
- **Self-documenting reviews** — the commit explains intent and scope without decoding diffs.
- **Future automation** — commitlint / release tooling can gate on the same convention.

## Merge strategy

- Squash merge only (single tidy commit per PR, history = one commit per logical change).
- CI checks are the required gate — merge only when green.

## Local safety net

- `pre-commit` hook: lint (`oxlint --fix`) + format (`prettier --write`) staged files via lint-staged.
- `pre-push` hook: full `bun run check` (format + lint + typecheck) before pushing — catches CI failures locally.
- Install hooks with `bun install` (the `prepare` script runs husky automatically).

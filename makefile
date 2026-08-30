SHELL := /bin/sh

.PHONY: \
	install \
	ci-install \
	format \
	format-check \
	lint \
	typecheck \
	test \
	test-coverage \
	test-integration \
	test-e2e \
	build \
	check \
	api \
	worker-smoke \
	cli-doctor \
	db-up \
	db-down \
	db-reset \
	db-logs \
	db-shell \
	deps-outdated \
	deps-audit

install:
	bun install

ci-install:
	bun ci

format:
	bun run format

format-check:
	bun run format:check

lint:
	bun run lint

typecheck:
	bun run typecheck

test:
	bun run test

test-coverage:
	bun run test:coverage

test-integration:
	bun run test:integration

test-e2e:
	bun run test:e2e

build:
	bun run build

check:
	bun run check

api:
	bun run start:dev

worker-smoke:
	bun run worker:smoke

cli-doctor:
	bun run cli -- doctor

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

db-reset:
	docker compose down --volumes

db-logs:
	docker compose logs --follow postgres

db-shell:
	docker compose exec postgres psql -U stack_trace -d stack_trace

deps-outdated:
	bun run deps:outdated

deps-audit:
	bun run deps:audit
#!/usr/bin/env bash
#
# Applies branch protection to `main` and `staging`.
#
# Usage:
#   gh auth login                    # once
#   chmod +x scripts/apply-branch-protection.sh
#   ./scripts/apply-branch-protection.sh <owner/repo>
#
# Requires: GitHub CLI (gh) with admin access to the repo.
# Idempotent — safe to re-run.

set -euo pipefail

REPO="${1:?usage: $0 <owner/repo>}"

payload() {
  cat <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "checks": [
      { "context": "Format / Lint / Typecheck" },
      { "context": "Unit tests + coverage" },
      { "context": "nest build" },
      { "context": "E2E tests" },
      { "context": "DI wiring check (doctor)" },
      { "context": "Dependency audit" },
      { "context": "Secret scan (Gitleaks)" }
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": true
}
JSON
}

for branch in main staging; do
  echo "Protecting $branch ..."
  gh api --method PUT \
    -H "Accept: application/vnd.github+json" \
    --input <(payload) \
    "repos/$REPO/branches/$branch/protection" \
    --jq '{enforce_admins, required_status_checks, allow_force_pushes, allow_deletions}'
done

echo "Done."
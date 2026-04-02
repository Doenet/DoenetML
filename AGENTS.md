# AGENTS.md

## Testing

Agents working in this repository should read [TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md](TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md) before running tests.

- For `@doenet/test-cypress`, rebuild before Cypress runs after code changes.
- Follow the required sequence: `build -> preview -> cypress run`.
- Do not rely on an old build or an already-running preview server after source edits.
- The runbook includes non-interactive test commands, Cypress preview-server workflow, fail-fast Cypress commands, and stale-asset troubleshooting.

## Commit Hygiene Requirements

- Format changed files with Prettier before committing.
- Ignore changes to `testCode.doenet` files. Do not commit them.
- Ignore changes to `packages/doenetml/dev/main.tsx`. Do not commit them.
- Ignore changes to any untracked `*.md` files in the repository root. Do not commit them.

## Changesets

- Changesets are configured in `.changeset/config.json`.
- The repo currently uses one `fixed` group containing four published packages:
	- `@doenet/doenetml`
	- `@doenet/standalone`
	- `@doenet/doenetml-iframe`
	- `@doenet/v06-to-v07`
- User-facing changes in `@doenet/doenetml` are also apparent in `@doenet/standalone` and `@doenet/doenetml-iframe`.
- User-facing changes in `@doenet/standalone` are also apparent in `@doenet/doenetml-iframe`.
- When writing a changeset, include the published package or packages where the user-facing change is apparent, not just the package where the implementation lives.
- The fixed-group configuration still coordinates versioning across these four packages.
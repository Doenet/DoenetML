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
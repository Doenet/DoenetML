# AGENTS.md

Agents working in this repository should read [TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md](TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md) before running tests.

Key requirement:
- For `@doenet/test-cypress`, rebuild before Cypress runs after code changes.
- Follow the required sequence: `build -> preview -> cypress run`.
- Do not rely on an old build or an already-running preview server after source edits.

Use the runbook for:
- non-interactive test commands
- Cypress preview-server workflow
- fail-fast Cypress commands
- stale-asset troubleshooting
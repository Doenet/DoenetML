# Test Run Instructions For Agents (Non-Interactive)

This file is a runbook for future agents to avoid getting stuck when running tests in this repo.

All commands below should be run from the **repository root** (the directory containing the top-level `package.json`).

## Core Rule

Always use one-shot, non-interactive commands.

Avoid commands that open watchers/UIs unless explicitly requested:
- `vitest` (without `--run`)
- `cypress open`
- long-running `dev` commands used as test commands

## Critical test-cypress Warning

If you changed code that affects Cypress behavior or rendering, you must rebuild `@doenet/test-cypress` before any Cypress run.

Do not assume an existing preview server or an earlier build is still valid.

If you skip the rebuild, you may be testing stale assets and get false pass/fail results.

## Prefigure Unit Tests (Non-Interactive)

Run targeted Vitest tests with `--run`:

```bash
npm run test -w @doenet/prefigure -- --run test/index-api.test.ts test/worker-cold-start.test.ts
```

You can also run all `@doenet/prefigure` tests one-shot:

```bash
npm run test -w @doenet/prefigure -- --run
```

## test-cypress Requirements (Build + Headless Run)

For `@doenet/test-cypress`, **always build first** so tests use fresh assets.

This is mandatory after code changes. Treat `build -> preview -> cypress run` as a required sequence, not a suggestion.

### 1. Build test-cypress package

Do this before every Cypress validation after code changes:

```bash
npm run build -w @doenet/test-cypress
```

### 2. Start preview server (required by Cypress `baseUrl`)

Cypress config uses `baseUrl: http://localhost:4173`.
Start preview from repo root with workspace selector:

```bash
npm run preview -w @doenet/test-cypress
```

If you are using an agent terminal tool, run this in a background terminal.

### 3. Run Cypress in headless mode (non-interactive)

Single spec (reliable for agents):

```bash
npm exec -w @doenet/test-cypress -- cypress run -b chrome --headless --config-file cypress.config.js --config video=false,retries=0,specPattern=cypress/e2e/prefigure/prefigureNoRuntimeOnNonPrefigurePage.cy.js
```

Notes:
- Rebuild first. If you changed code and did not just rebuild `@doenet/test-cypress`, stop and do that before running Cypress.
- This command overrides `retries` from `cypress.config.js` (for example, `runMode: 2`) via CLI `--config retries=0`.
- When iterating on failing tests, also set a shorter timeout to fail fast, for example `defaultCommandTimeout=8000` (or `5000` for very fast feedback).
- Fast-fail single-spec example:

```bash
npm exec -w @doenet/test-cypress -- cypress run -b chrome --headless --config video=false,retries=0,defaultCommandTimeout=8000,specPattern=cypress/e2e/tagSpecific/choiceinput.cy.js
```

- Prefer this direct `npm exec ... cypress run` form when you must run exactly one spec.
- The script wrapper `npm run test-cypress-all -w @doenet/test-cypress -- --spec ...` can be less predictable in some agent shells.
- A reusable script is available in `@doenet/test-cypress`:

```bash
npm run test-cypress-fast-fail -w @doenet/test-cypress
```

Pass a single-spec override to that script with:

```bash
npm run test-cypress-fast-fail -w @doenet/test-cypress -- --config specPattern=cypress/e2e/tagSpecific/choiceinput.cy.js
```

Or run by tag groups (already headless):

```bash
npm run test:group4 -w @doenet/test-cypress
```

### 4. Stop preview server when done

Terminate the background preview process to avoid leaving orphan processes.

## Common Failure Pattern

If Cypress says it cannot verify `http://localhost:4173`, the preview server is not running.

Fix:
1. Start `npm run preview -w @doenet/test-cypress`.
2. Re-run the headless Cypress command.

If the browser shows a blank page and console 404 errors for hashed assets like `assets/index-*.js`, preview is serving a stale `dist/index.html`.

Fix:
1. Stop preview server.
2. Clean and rebuild dist with:

```bash
rm -rf /home/nykamp/src/DoenetML/packages/test-cypress/dist
npm exec -w @doenet/test-cypress -- vite build
```

3. Restart preview on baseUrl port 4173:

```bash
npm run preview -w @doenet/test-cypress -- --host 127.0.0.1 --port 4173
```

4. Re-run Cypress with fast-fail settings.

## Quick Checklist

1. Use non-interactive commands only.
2. For Vitest, include `--run`.
3. For `@doenet/test-cypress`, rebuild first after any code change.
4. Only after rebuilding, start preview server.
5. Only after rebuilding and starting preview, run Cypress.
6. Use `cypress run` (headless), not `cypress open`.
7. Stop background preview server after tests finish.

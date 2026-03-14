# Test Run Instructions For Agents (Non-Interactive)

This file is a runbook for future agents to avoid getting stuck when running tests in this repo.

## Core Rule

Always use one-shot, non-interactive commands.

Avoid commands that open watchers/UIs unless explicitly requested:
- `vitest` (without `--run`)
- `cypress open`
- long-running `dev` commands used as test commands

## Prefigure Unit Tests (Non-Interactive)

Run targeted Vitest tests with `--run`:

```bash
cd /home/nykamp/src/DoenetML
npm run test -w @doenet/prefigure -- --run test/index-api.test.ts test/worker-cold-start.test.ts
```

You can also run all `@doenet/prefigure` tests one-shot:

```bash
cd /home/nykamp/src/DoenetML
npm run test -w @doenet/prefigure -- --run
```

## test-cypress Requirements (Build + Headless Run)

For `@doenet/test-cypress`, **always build first** so tests use fresh assets.

### 1. Build test-cypress package

```bash
cd /home/nykamp/src/DoenetML
npm run build -w @doenet/test-cypress
```

### 2. Start preview server (required by Cypress `baseUrl`)

Cypress config uses `baseUrl: http://localhost:4173`.
Start preview from repo root with workspace selector:

```bash
cd /home/nykamp/src/DoenetML
npm run preview -w @doenet/test-cypress
```

If you are using an agent terminal tool, run this in a background terminal.

### 3. Run Cypress in headless mode (non-interactive)

Single spec:

```bash
cd /home/nykamp/src/DoenetML
npm run test-cypress-all -w @doenet/test-cypress -- --spec cypress/e2e/prefigure/prefigureNoRuntimeOnNonPrefigurePage.cy.js
```

Or run by tag groups (already headless):

```bash
cd /home/nykamp/src/DoenetML
npm run test:group4 -w @doenet/test-cypress
```

### 4. Stop preview server when done

Terminate the background preview process to avoid leaving orphan processes.

## Common Failure Pattern

If Cypress says it cannot verify `http://localhost:4173`, the preview server is not running.

Fix:
1. Start `npm run preview -w @doenet/test-cypress`.
2. Re-run the headless Cypress command.

## Quick Checklist

1. Use non-interactive commands only.
2. For Vitest, include `--run`.
3. For `@doenet/test-cypress`, build first.
4. Start preview server before Cypress run.
5. Use `cypress run` (headless), not `cypress open`.
6. Stop background preview server after tests finish.

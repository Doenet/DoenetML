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
npm run preview -w @doenet/test-cypress -- --host 127.0.0.1 --port 4173 --strictPort
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

If the browser shows a blank page and console 404 errors for hashed assets like `assets/index-*.js`, preview is serving a stale/inconsistent `dist`.

Note: this should be much less likely now that `@doenet/test-cypress` Wireit output tracks `dist/**`, but keep the recovery steps below as a fallback.

Fix:
1. Stop preview server.
2. Clean and rebuild dist with:

```bash
rm -rf packages/test-cypress/dist
npm run build -w @doenet/test-cypress
```

3. Restart preview on baseUrl port 4173 (with strict port):

```bash
npm run preview -w @doenet/test-cypress -- --host 127.0.0.1 --port 4173 --strictPort
```

4. Re-run Cypress with fast-fail settings.

## Documentation Accessibility Tests (`@doenet/docs-cypress`)

`packages/docs-cypress` runs cypress-axe accessibility checks against the
built documentation site (WCAG 2.x, both light mode and dark mode).

The docs site must be built and served before Cypress runs.

### 1. Build the docs (if not already built or after style/content changes)

```bash
export NODE_OPTIONS="--max_old_space_size=6114"
npm run build:docs
```

This requires the docs prerequisites (doenetml, standalone, iframe) to already
be built.  If they are missing, build them first:

```bash
export NODE_OPTIONS="--max_old_space_size=6114"
npm run build:docs-prereqs && npm run build:docs
```

### 2. Serve the static export

The docs produces a static export in `packages/docs-nextra/out/`.
Use `npx serve` to host it (it handles clean URLs — `/reference/document`
resolves to `out/reference/document.html` automatically):

```bash
npx serve -l 3000 packages/docs-nextra/out/ &
npx wait-on http://localhost:3000
```

Run the server in a background terminal or with `&`.

### 3. Run Cypress in headless mode (non-interactive)

```bash
npm run test-cypress-docs-all -w packages/docs-cypress
```

Or fast-fail for quick iteration:

```bash
npm run test-cypress-docs-fast-fail -w packages/docs-cypress
```

### 4. Stop the serve server when done

```bash
lsof -ti:3000 | xargs kill
```

### Common failure: "cannot verify http://localhost:3000"

The serve server is not running.  Start it (step 2) before running Cypress.

### Common failure: colour-contrast violations after style changes

If you changed `packages/docs-nextra/pages/style.css` or other doc styles,
rebuild the docs (step 1) before running the tests — Cypress reads the built
`out/` directory, not the source files.

## Quick Checklist

1. Use non-interactive commands only.
2. For Vitest, include `--run`.
3. For `@doenet/test-cypress`, rebuild first after any code change.
4. Only after rebuilding, start preview server.
5. Only after rebuilding and starting preview, run Cypress.
6. Use `cypress run` (headless), not `cypress open`.
7. Stop background preview server after tests finish.
8. For `@doenet/docs-cypress`, build the docs first, then serve `out/` on port 3000, then run Cypress.

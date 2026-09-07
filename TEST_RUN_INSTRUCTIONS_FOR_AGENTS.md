# Test Run Instructions For Agents (Non-Interactive)

This file is a runbook for future agents to avoid getting stuck when running tests in this repo.

All commands below should be run from the **repository root** (the directory containing the top-level `package.json`).

## Core Rule

Always use one-shot, non-interactive commands.

Avoid commands that open watchers/UIs unless explicitly requested:
- `vitest` (without `--run`)
- `cypress open`
- long-running `dev` commands used as test commands

## Rebuild an Edited Package Before Testing Its Consumers

Every `@doenet/*` package's `exports` point at its `dist/`, and no vitest config aliases them back to `src/`. A test that imports another package **by its `@doenet/` name** gets the **last build** of it. (A few tests and scripts reach a sibling's `src/` by relative path instead — `packages/static-assets/scripts/get-schema.ts` and the `static-assets` schema tests read `doenetml-worker-javascript/src` — and those see an edit without a rebuild.)

Nothing rebuilds it for you: almost every `test` script is a bare `vitest` with no Wireit dependencies, so neither `npm run test -w <pkg>` nor `npx vitest` builds anything. Only `doenetml-prototype` and `doenetml-to-pretext` run a Wireit build before their `vitest`.

**Rule: after editing `packages/<A>/src/`, run `npm run build -w @doenet/<A>` before running tests in any package other than `<A>`.**

An up-to-date build is a Wireit cache hit and returns in well under a second, so run it rather than reasoning about whether it is needed.

Why this matters more than it sounds: the failure is usually **silent**. A removed or renamed export throws (`someFn is not a function`), which at least looks like a problem. The common case is worse — the old code still runs, so the suite passes against the previous behavior, or a fix you just made appears to have done nothing. Do not conclude that a change had no effect until you have rebuilt the package you changed.

### Generated sources need the build too

A generator that writes into `src/generated/` has not produced a `dist/` yet. Run the package's `build` afterwards:

```bash
# schema: regenerate, then build so consumers (lsp-tools, lsp, docs) see it
npm run build:schema -w packages/static-assets
npm run build -w @doenet/static-assets

# i18n message keys / diagnostic codes
npm run codegen -w @doenet/i18n
npm run build -w @doenet/i18n
```

Adding an i18n **locale** needs all four, in this order — `codegen` → `build -w @doenet/i18n` → `build:schema` → `build -w @doenet/static-assets`. Skipping the second step drops locales from the schema.

## Critical test-cypress Warning

If you changed code that affects Cypress behavior or rendering, you must rebuild `@doenet/test-cypress` before any Cypress run.

Do not assume an existing preview server or an earlier build is still valid.

If you skip the rebuild, you may be testing stale assets and get false pass/fail results.

A root `npm run build` does **not** cover this: it does not build `@doenet/test-cypress`, and reports the package as skipped rather than as an error. Run `npm run build -w @doenet/test-cypress` explicitly (step 1 below), even if a root build just succeeded.

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
Use `npm exec serve` to host it (it handles clean URLs — `/reference/document`
resolves to `out/reference/document.html` automatically):

```bash
npm exec serve -- --no-port-switching -l 3000 packages/docs-nextra/out/ &
npm exec wait-on -- http://localhost:3000
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
lsof -ti:3000 | xargs -r kill
```

(`-r` / `--no-run-if-empty` silences the error when nothing is listening on port 3000.)

### Common failure: "cannot verify http://localhost:3000"

The serve server is not running.  Start it (step 2) before running Cypress.
If port 3000 is already occupied, `serve` now exits instead of silently
switching to another port, so free the port and restart the command.

### Common failure: colour-contrast violations after style changes

If you changed `packages/docs-nextra/pages/style.css` or other doc styles,
rebuild the docs (step 1) before running the tests — Cypress reads the built
`out/` directory, not the source files.

## Quick Checklist

1. Use non-interactive commands only.
2. For Vitest, include `--run`.
3. If you edited another package's `src/`, build that package first — nothing does it for you, and a stale `dist/` passes silently.
4. For `@doenet/test-cypress`, rebuild first after any code change.
5. Only after rebuilding, start preview server.
6. Only after rebuilding and starting preview, run Cypress.
7. Use `cypress run` (headless), not `cypress open`.
8. Stop background preview server after tests finish.
9. For `@doenet/docs-cypress`, build the docs first, then serve `out/` on port 3000, then run Cypress.

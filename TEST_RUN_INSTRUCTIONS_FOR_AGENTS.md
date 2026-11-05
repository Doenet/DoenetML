# Test Run Instructions For Agents (Non-Interactive)

This file is a runbook for future agents to avoid getting stuck when running tests in this repo.

All commands below should be run from the **repository root** (the directory containing the top-level `package.json`).

## Core Rule

Always use one-shot, non-interactive commands.

Avoid commands that open watchers/UIs unless explicitly requested:
- `vitest` (without `--run`)
- `cypress open`
- long-running `dev` commands used as test commands

### The npm scripts that open a GUI

"Don't run `cypress open`" is not enough on its own, because **no agent thinks it is
running `cypress open`** — it runs an npm script whose name looks like a test command. In
`packages/test-cypress/package.json`:

| Script | What it actually runs | |
| --- | --- | --- |
| `test-cypress` | `cypress open` | ❌ **opens a GUI** |
| `test:prefigure-live-accessibility` | `cypress open --env RUN_LIVE_PREFIGURE_ACCESSIBILITY=1` | ❌ **opens a GUI** |
| `test-cypress-fast-fail` | `cypress run … --headless` | ✅ use this |
| `test-cypress-all` | `cypress run … --headless` | ✅ use this |

`test-cypress` is the trap: it is the script whose name matches the package, so it is the
one an agent reaches for first. It has opened a window on a user's desktop. Prefer
`test-cypress-fast-fail`, and to run the live-accessibility specs pass the env var to it
yourself rather than using the `test:prefigure-live-accessibility` script:

```bash
npm run test-cypress-fast-fail -w @doenet/test-cypress -- \
  --config specPattern="cypress/e2e/prefigure/*Live*.cy.js" \
  --env RUN_LIVE_PREFIGURE_ACCESSIBILITY=1
```

The glob matters: `RUN_LIVE_PREFIGURE_ACCESSIBILITY` gates more than one suite
(`prefigureLiveAccessibility.cy.js` and `chartLive.cy.js` today), and naming a
single file silently runs a fraction of what the variable enables.

If you do start one by accident, it will not exit on its own and it will block whatever is
waiting on it.

**Stop the thing you started, not every Cypress on the machine.** A developer may have
their own Cypress open, and this repository's CI runs Cypress too, so `pkill -f cypress`
takes those down with yours and `-9` denies all of them the chance to clean up. Signal the
process group of the command you ran — `kill -TERM -<pgid>`, where the pgid is the pid of
the `npm` process you started (`ps -o pgid= -p <pid>`) — and escalate to `-KILL` on that
same group only if it has not gone after a few seconds.

Killing the child on its own does not work: `cypress open` is launched by a parent that
relaunches it, so the window closes and immediately reopens. If the run was started by a
subagent, stop the agent; that is what owns the parent.

Redirect a Cypress run to a file and grep the file. Piping it into `head` can wedge the
run rather than ending it.

## Rebuild an Edited Package Before Testing Its Consumers

Every `@doenet/*` package's `exports` point at its `dist/`, and no vitest config aliases them back to `src/`. A test that imports another package **by its `@doenet/` name** gets the **last build** of it. (A *relative* path bypasses `exports` and resolves to whatever it points at. `packages/static-assets/scripts/get-schema.ts` and `packages/doenetml-worker-javascript/src/test/utils/test-core.ts` reach a sibling's `src/` that way and so see an edit without a rebuild, while `doenetml-worker-rust/lib-doenetml-core/tests/parse-dast.ts` reaches `parser/dist` and still needs one.)

Nothing rebuilds it for you: almost no `test` script does, so neither `npm run test -w <pkg>` nor `npx vitest` builds anything. The exceptions are `doenetml-prototype`, `doenetml-to-pretext`, `doenetml-worker-rust`, `doenetml-worker-javascript` and `math`, whose `test` runs a Wireit build first.

**Rule: after editing `packages/<A>/src/`, run `npm run build -w @doenet/<A>` before running tests in any package other than `<A>`.**

An up-to-date build is a Wireit cache hit and returns in well under a second, so run it rather than reasoning about whether it is needed.

Why this matters more than it sounds: the failure is usually **silent**. A removed or renamed export throws (`someFn is not a function`), which at least looks like a problem. The common case is worse — the old code still runs, so the suite passes against the previous behavior, or a fix you just made appears to have done nothing. Do not conclude that a change had no effect until you have rebuilt the package you changed.

### The worker's Rust WASM is a third case

`node_modules/lib-doenetml-worker` is a symlink into `packages/doenetml-worker-rust/lib-js-wasm-binding/pkg` — the untracked output of `wasm-pack`, not a `dist/` and not a `src/`. `doenetml-worker-javascript/src/test/utils/test-core.ts` imports the Rust core through it, so **every Vitest test in that package runs against whatever WASM was last built on this machine**, however long ago that was. Editing a `.rs` file is not what puts it out of date; a `git pull` that brings in someone else's is enough, and nothing says so.

Stale WASM does not throw. The core boots, runs, and answers — with the behavior of the older build. In Doenet/DoenetML#1976 that looked exactly like a live data-corruption bug: two state-persistence tests failed reproducibly on `main` and passed in CI on the same commit, because CI builds `packages/doenetml-worker` before its test job and a local run had no equivalent step.

`npm run test -w @doenet/doenetml-worker-javascript -- --run <files>` now rebuilds the WASM first (`test:before`). A bare `npx vitest` from inside the package does not, so if you reach for one, build it yourself:

```bash
npm run build:rust -w @doenet/doenetml-worker-rust
```

**Before concluding that a test failing locally and passing in CI is a flake or a real defect, rule this out.**

`test:before` also rebuilds `doenetml-worker-javascript` itself, which is not redundant: `@doenet/debug-hooks` is bundled with `@doenet/doenetml-worker-javascript` left external, so the `resolvePathToNodeIdx` every test calls runs `expandCompositeComponent` out of the **built** worker while the test around it reads `src/`. Editing a component and running one spec used to exercise your edit everywhere except there. The cost is that a run straight after a source edit spends about fifteen seconds in `vite build` before Vitest starts; a run that changed nothing is still a cache hit in under a second.

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

## Vitest: Use the Workspace Script, Not a Bare `npx vitest`

`npm run test -w @doenet/<pkg>` runs vitest **with that package's `vite.config.ts`**. A bare `npx vitest --run packages/<pkg>/…` from the root does not load it, and there is no root vitest config to stand in, so the plugins and `test` options the package's suite depends on are simply absent. What you get back is failures in code you did not touch:

| package | what the root run drops | how it reads |
| --- | --- | --- |
| `parser` | the `.peggy` loader | every test file fails to import — "content contains invalid JS syntax" |
| `v06-to-v07` | `vite-plugin-arraybuffer`, which is how the resolver wasm is loaded | 23 tests fail, every one of them a reference that did not resolve |
| `doenetml-worker-javascript` | `testTimeout: 180000` (vitest's default is 5 000) | the slow suites fail on "Test timed out in 5000ms"; `evaluate.test.ts` alone reports 5 |

The suites that need nothing from their package config — `lsp-tools`, the worker's `copying` and `diagnostics` — do pass from the root, which is what makes this worth writing down: the invocation works often enough to look trustworthy, and then reports a failure that reads like a regression in the branch under review. Pass the files after `--` instead:

```bash
npm run test -w @doenet/parser -- --run
npm run test -w @doenet/doenetml-worker-javascript -- --run src/test/tagSpecific/evaluate.test.ts
```

## Rust Tests: Use the npm Script

```bash
npm run test -w @doenet/doenetml-worker-rust
```

The script does two things: `test:rust:before`, a vite build of `lib-doenetml-core/tests/parse-dast.ts` against `parser/dist`, and then `cargo test --workspace --features testing` from `packages/doenetml-worker-rust`.

Running that `cargo` line yourself runs the same suite, but only once the first half has happened at least once. Its output, `lib-doenetml-core/tests/dist/`, is gitignored, and the integration tests pull the file in at compile time (`include_str!("../dist/parse-dast.js")` in `tests/test_utils/mod.rs`), so on a clean checkout `cargo` alone stops at ``couldn't read `lib-doenetml-core/tests/dist/parse-dast.js` `` having run nothing. Reach for the script first; reach for `cargo` only to re-run a suite the script has already set up.

What else fails is any *shorter* invocation, and none of them names its cause. The first is the dangerous one, because it looks like a pass:

| invocation | what happens |
| --- | --- |
| `cargo test` | **runs 0 tests and reports ok** |
| `cargo test --workspace` | does not compile |
| `cargo test -p doenetml-core --features testing` | **compiles and runs, then fails throughout** on serde field naming |
| `cargo test -p doenetml-core --features web` | does not compile |
| `cargo test --workspace --features testing` | all green — the cargo half of the npm script, once the harness is built |

A bare `cargo test` tests nothing because the workspace sets `default-members = ["lib-js-wasm-binding"]`, and that crate has no tests of its own. It exits 0. Do not read that as a green suite.

Both non-compiling rows are the same missing flag, and they fail identically: `no method named get_prop_for_render_untracked`. That method lives in `core.rs`'s `testing_features` module, gated `#[cfg(any(feature = "testing", test, not(feature = "web")))]` — so with `web` on and `testing` off it is not there for the integration tests to call. The flag also substitutes plain-Rust math for the wasm-bindgen imports in `math_via_wasm.rs`, which is what keeps the tests meaningful once they do compile. Nothing else supplies either.

Those failures are an artifact of scoping, not a regression. `lib-js-wasm-binding` depends on the core as `doenetml-core = { path = "...", features = ["web"] }`, so a `--workspace` build unifies `web` on. Scoped to `-p doenetml-core` it is off, and thirteen types across `flat_dast`, `ref_resolve` and `components` (eleven structs and two enums, not just `FlatElement`) carry `#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]` — so serde emits snake_case where the snapshots assert camelCase. Every one of them is that mismatch — `node_idx`, `original_path`, `unresolved_path`, `nodes_in_resolved_path`, `error_type`, `children_position` — so a diff full of snake_case field names is the signature to recognize.

They fail identically on a clean `main`, so reproducing them there reads as "pre-existing" and confirms nothing. Check the invocation before the code.

**CI does run this suite, but not where you would look for it.** It runs inside **`Test Main`**, which invokes `npm run test:all-no-worker-js`, whose hard-coded workspace list includes `packages/doenetml-worker-rust`. So that script and a root `npm run test` each compile the crate and run the whole Rust suite, on top of the Vitest suites they run for the JS packages. The one job named for Rust does not: `Lint Rust Code` is `cargo fmt --check` and `cargo clippy`. There is no Rust test job, so a regression surfaces as a `Test Main` failure rather than as anything naming Rust.

`Test Main` has `needs: build`, so it cannot start until the whole `Build` job has finished, and its result arrives many minutes into a run. Run the suite yourself after touching anything under `packages/doenetml-worker-rust` rather than waiting for CI to report it.

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

If you changed `packages/docs-nextra/app/style.css` or other doc styles,
rebuild the docs (step 1) before running the tests — Cypress reads the built
`out/` directory, not the source files.

## Quick Checklist

1. Use non-interactive commands only.
2. For Vitest, include `--run`, and run it as `npm run test -w @doenet/<pkg> -- --run [files]` — a bare `npx vitest` from the root skips the package's `vite.config.ts` and fails suites that are fine.
3. If you edited another package's `src/`, build that package first — nothing does it for you, and a stale `dist/` passes silently.
4. For `@doenet/test-cypress`, rebuild first after any code change.
5. Only after rebuilding, start preview server.
6. Only after rebuilding and starting preview, run Cypress.
7. Use `cypress run` (headless), not `cypress open`.
8. Stop background preview server after tests finish.
9. For `@doenet/docs-cypress`, build the docs first, then serve `out/` on port 3000, then run Cypress.
10. For Rust, run `npm run test -w @doenet/doenetml-worker-rust`. It builds the node parse harness and then runs `cargo test --workspace --features testing`; `cargo` on its own skips that build and fails to compile on a clean checkout. A bare `cargo test` runs nothing and reports ok, and a scoped one fails throughout on serde field naming rather than on anything real. CI runs the suite inside `Test Main`, through `test:all-no-worker-js`, which runs every workspace's `test` script including this one; there is no job named for Rust tests, and `Test Main` does not start until the `Build` job has finished.

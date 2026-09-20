# AGENTS.md

Canonical guide for agents (and humans) working in this repository. Covers architecture, build commands, testing, coding conventions, commit hygiene, PR creation, and changesets.

## High-Level Architecture

DoenetML is a semantic markup language for building interactive web activities. The system has three layers:

### Layer 1: Parsing (Input)
The **parser** (`packages/parser`) converts DoenetML XML into a **DAST** (Document Abstract Syntax Tree). It handles XML parsing, validation, and normalization. Key exports: `stringToLezer()`, `lezerToDast()`, `normalizeDocumentDast()`.

### Layer 2: Computation (Worker)
The **worker** (`packages/doenetml-worker`) runs in a Web Worker and manages document state and computation. It combines:
- **JavaScript logic** (`packages/doenetml-worker-javascript`) for component evaluation, dependency tracking, and state updates
- **Rust/WASM logic** (`packages/doenetml-worker-rust/lib-js-wasm-binding`). Reference-resolution paths run in Rust today; the rest of the worker is slowly being transitioned over.

Communication between main thread and worker uses structured messages. The worker is responsible for evaluating components, tracking dependencies (DAG), and managing variants.

### Layer 3: UI (Viewer/Editor)
The **main component** (`packages/doenetml/src/doenetml.tsx`) exports two top-level React components:
- **`DoenetViewer`** — read-only rendering of DoenetML
- **`DoenetEditor`** — editor UI with live preview

Both use Redux for state management (`packages/doenetml/src/state/`) and share a Web Worker instance.

### Connected Packages
- **`@doenet/prefigure`** — backend for executing Python/computation-heavy activities
- **`@doenet/standalone`, `@doenet/doenetml-iframe`** — bundled variants of the main library for different hosting scenarios
- **`@doenet/codemirror`** — code editor integration
- **`@doenet/ui-components`** — reusable UI components (used across doenetml, prefigure, etc.)
- **`@doenet/i18n`** — message catalogs (Fluent `.ftl`) and the translator/locale-negotiation utilities shared by the viewer, the worker, and the LSP. See [`packages/i18n/README.md`](packages/i18n/README.md); run `npm run lint:i18n` after touching a catalog.
- **`packages/vscode-extension`** — VS Code extension with LSP support (`packages/lsp`)

## Monorepo Structure

This is an npm workspace monorepo. Key points:
- All packages build via **Vite** and **Wireit** (a task orchestration tool that manages build dependencies)
- **Wireit** is configured in each `package.json`'s `wireit` field; it automatically rebuilds dependencies when inputs change
- Each package can be built/tested independently with `-w <package-name>` or `-w @scope/package-name` flags
- **Every `@doenet/*` package exports only from its `dist/`.** Importing one *by package name* gets the built code, never the other's `src/`. Nothing rebuilds it for you at test time — see [Cross-package edits need a rebuild](#cross-package-edits-need-a-rebuild-before-testing)

## Build & Development Commands

### Daily Development

```bash
# Start dev server (port 8012, builds doenetml and dependencies)
npm run dev

# Build a single package (rebuilds dependencies automatically via wireit)
npm run build -w @doenet/doenetml

# Build all packages (one-shot, no watch)
npm run build:all

# Format code with Prettier (required before commits)
npm run prettier:format

# Check formatting
npm run prettier:check
```

### Run docs locally

```bash
npm run docs
```

Builds prerequisites and serves docs (Nextra-based) at `http://localhost:3000`.

## Testing

### Cross-package edits need a rebuild before testing

**After editing a package's `src/`, build that package before running tests in any other package:** `npm run build -w @doenet/<edited-package>`.

Every `@doenet/*` package's `exports` point at `dist/`, and no vitest config aliases them back to `src/`. So a test in package B that imports `@doenet/A` gets A's last build. Almost no `test` script rebuilds anything — most are a bare `vitest` — so neither `npm run test -w B` nor `npx vitest` rebuilds A, and an edit-then-test loop across a package boundary reads stale code. Five `test` scripts run a Wireit build first: `doenetml-prototype` and `doenetml-to-pretext` rebuild `parser` and `doenetml-worker`, `doenetml-worker-rust` rebuilds `parser`, `doenetml-worker-javascript` rebuilds its own dependencies plus the Rust WASM (see below), and `math` rebuilds only itself.

A *relative* path is the exception, because it bypasses `exports` and resolves to whatever it points at. Where that is a sibling's `src/`, an edit is picked up with no rebuild: `packages/static-assets/scripts/get-schema.ts` and `check-docs-coverage.ts` read `doenetml-worker-javascript/src`, which is why the schema is generated from component source, and `doenetml-worker-javascript/src/test/utils/test-core.ts` — the harness under every worker test — reads `doenetml/src/flags`. It is not only tests and scripts; `packages/standalone/src/coordinator.ts` imports `doenetml-iframe/src` the same way. Where a relative path points at a `dist/` instead, the build is still needed: `doenetml-worker-rust/lib-doenetml-core/tests/parse-dast.ts` reads `parser/dist`.

A third route reaches neither a `dist/` nor a `src/`: `node_modules/lib-doenetml-worker` is a symlink into `doenetml-worker-rust/lib-js-wasm-binding/pkg`, the untracked output of `wasm-pack`. `doenetml-worker-javascript/src/test/utils/test-core.ts` imports the Rust core through it, so every Vitest test in that package runs against whatever WASM was last built — and nothing in the package's *build* graph produces it, because the JavaScript worker only imports types from `@doenet/doenetml-worker`. A WASM older than the Rust sources fails silently and in the worst possible way: the core still runs and still answers, just with the behavior of the older build. That is how `statePersistenceKeying` and `statePersistenceShadows` came to fail locally while CI was green on the same commit (Doenet/DoenetML#1976) — CI builds `packages/doenetml-worker` before the test job, and a local run had no equivalent step. Its `test` scripts now depend on `../doenetml-worker-rust:build:rust`, so `npm run test -w @doenet/doenetml-worker-javascript` rebuilds the WASM; a bare `npx vitest` inside the package still does not, which is one more reason to use the workspace script.

The same dependency closes a route back into the *JavaScript* worker's own `dist/`. `@doenet/debug-hooks` is bundled with `@doenet/doenetml-worker-javascript` left external, so `resolvePathImmediatelyToNodeIdx` — which `test-core.ts` hands every test as `resolvePathToNodeIdx` — calls `expandCompositeComponent` out of the built worker while the test around it reads `src/`. `test:before` depends on `../debug-hooks:build`, which depends on this package's `build`, so an edit under `src/` is now rebuilt before the suite runs rather than half-ignored. That one build is why a test run straight after a source edit pays a `vite build` instead of a cache hit. It runs once per invocation of the script, though, so an `npm run test -w @doenet/doenetml-worker-javascript` left sitting in vitest's watch mode keeps re-running against the build it started with — pass `-- --run` and start a new one after an edit.

The failure is usually silent and misleading. A missing export throws (`X is not a function`), which is at least obvious; more often the old code still runs and the test **passes against the previous behavior**, or a fix you just made appears not to work. Do not conclude a change had no effect until you have rebuilt.

A build that is already up to date is a Wireit cache hit and takes well under a second, so just run it — do not try to reason about whether it is needed.

Two extra traps:

- **Generated sources.** A generator that writes into `src/generated/` (`npm run build:schema -w packages/static-assets`, `npm run codegen -w @doenet/i18n`) has not produced a `dist/` yet. Run the package's `build` afterwards, or consumers keep reading the old artifact. Adding an i18n locale needs the full sequence: `codegen -w @doenet/i18n` → `build -w @doenet/i18n` → `build:schema -w packages/static-assets` → `build -w @doenet/static-assets`.
- **`@doenet/test-cypress`** has its own rule, below, and a root `npm run build` does not cover it.

Commonly edited packages that others consume: `utils`, `parser`, `i18n`, `static-assets`, `lsp-tools`, `doenetml-worker-javascript`, `ui-components`. When in doubt about the graph, `npm run build:all` is the blunt instrument.

### Running the tests

Read [TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md](TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md) before running tests. Highlights:
- For `@doenet/test-cypress`, rebuild before Cypress runs after code changes.
- Follow the required sequence: `build -> preview -> cypress run`.
- Run Cypress with `test-cypress-fast-fail` or `test-cypress-all`. **`npm run test-cypress`
  is `cypress open`** — it opens a GUI and never exits; so is
  `test:prefigure-live-accessibility`.
- Do not rely on an old build or an already-running preview server after source edits.
- The runbook includes non-interactive test commands, Cypress preview-server workflow, fail-fast Cypress commands, and stale-asset troubleshooting.

### Test Tooling

- **Vitest** for unit tests, component logic, and utility functions (files: `*.test.ts`, `*.test.tsx`)
- **Cypress** for e2e tests, user interactions, and full rendering (files: `cypress/e2e/*.cy.js`)
- **Cargo** for the Rust core in `packages/doenetml-worker-rust` — reference resolution, the flattener, the resolver and the name maps (files: `lib-doenetml-core/src/**/*.test.rs`, `lib-doenetml-core/tests/`)
- Tests are grouped; run by group number to parallelize CI

### Common Test Commands

```bash
# Every workspace's `test` script (very slow): Vitest across the JS packages,
# plus `doenetml-worker-rust`, whose `test` compiles and runs the Rust suite.
npm run test

# The same set minus `doenetml-worker-javascript`, Rust suite included.
# This is what CI's `Test Main` job runs.
npm run test:all-no-worker-js

# Run targeted Vitest (e.g., prefigure package)
npm run test -w @doenet/prefigure -- --run test/index-api.test.ts

# Run the Rust core suite on its own (builds the node parse harness, then cargo).
# See TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md — a bare `cargo test` runs nothing.
npm run test -w @doenet/doenetml-worker-rust

# Run Cypress e2e tests in groups (recommended)
npm run test:e2e-group1
npm run test:e2e-group2
npm run test:e2e-group3
npm run test:e2e-group4
npm run test:e2e-group5
npm run test:codemirror-cypress

# Run a single Cypress spec (fast-fail mode)
npm run test-cypress-fast-fail -w @doenet/test-cypress -- --config specPattern=cypress/e2e/tagSpecific/choiceinput.cy.js
```

## Coding Conventions

- **No `private` class fields or methods.** Use an underscore prefix for internal members (`_field`).
- **No fire-and-forget promises.** Always attach an explicit `.catch(...)` handler to intentionally unawaited Promises, or use `async`/`await`.
- **Prefer function declarations** over function-valued variables (`function foo() {}` over `const foo = () => {}`), unless reassignment or dynamic replacement is required.
- **Prefer `async`/`await`** over `.then(...)` / `.catch(...)` chains.

## Commit Hygiene

- Format changed files with Prettier before committing: `npm run prettier:format`
- Files that should never be staged or committed (local development / planning notes):
  - `packages/doenetml/dev/testCode.doenet`
  - Untracked `*.md` files in the repository root

If you edit these during development they will show as modified, but should not be staged. (`packages/doenetml/dev/main.tsx` is shared dev-harness infrastructure: intentional changes to it may be committed, but avoid committing throwaway local edits such as the `USE_LOCAL_PREFIGURE` toggle.)

### Agent attribution on commits

When an agent composes a commit, credit it with a `Co-authored-by:` trailer (a blank line before the trailer block) rather than a marketing-style "Generated with …" footer in the commit body. Use the actual model/agent name and its no-reply email — do not hardcode one specific model. For example:

    Co-authored-by: Claude Opus 4.8 <noreply@anthropic.com>

The goal is simply to record that an agent helped author the change; substitute whatever model or agent is actually composing the commit.

## PR Creation

This checkout may use a personal fork as `origin` and the canonical `Doenet/DoenetML` as `upstream`.

- **Always base PRs on `upstream/main`**, not `origin/main`. The one exception is a backport to a maintenance line, which is based on and targets that branch instead — see [Releasing](#releasing).
- Push your branch to your fork (`origin`), then create the PR targeting `Doenet/DoenetML:main`.
- **Preferred method: GitHub CLI (`gh`).** The `mcp_gitkraken_pull_request_create` tool requires authentication that may not be available.
- Command format: `gh pr create --repo Doenet/DoenetML --base main --head <fork-owner>:<branch>`. Replace `<fork-owner>` with your GitHub username (e.g., `dqnykamp:my-branch`).
- Before pushing, run `npm run prettier:format` on modified files.
- Before creating the PR, confirm only intended files are staged — this repository often has unrelated local work in the tree.
- After creating the PR, verify the branch has been pushed to `origin` and the PR links to the correct target branch (`Doenet/DoenetML:main`).
- Do not put the issue number in the PR title or in commit subjects on the branch. Squash-merge appends ` (#<PR-number>)` automatically; a title like `fix: ... (#1179)` becomes `fix: ... (#1179) (#1182)` after merge. Reference issues from the PR body instead (e.g. `Closes #1179.`).

## Agent-Authored GitHub Activity

When an agent posts a PR comment, opens an issue, or comments on an issue, end the body with a footer noting that an agent helped compose the text, so reviewers can see at a glance that it was machine-generated. Use the footer appropriate to whatever agent system is actually in use — the point is to flag agent involvement, not to advertise a particular product. For example:

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
```
🤖 Generated with [GitHub Copilot](https://github.com/features/copilot)
```

Match the footer to the agent that authored the content (and update the link/label accordingly for any other agent system).

This includes review-comment replies posted via `gh api ... /replies`, full reviews (their summary body and any inline comments) posted via `gh api ... /reviews`, top-level PR comments, and any `gh issue create` / `gh issue comment` invocations. PR and issue *descriptions* created via `gh pr create` / `gh issue create` already get the footer through their templated body — this rule is the catch for the smaller surfaces where it's easy to forget.

## Releasing

DoenetML ships from two lines: `main` (current) and a maintenance branch (`0.7`) taking patch-only backports. **[`docs/RELEASING.md`](docs/RELEASING.md)** is the runbook — the dist-tag scheme and why maintenance tags carry a suffix, how a stable release is cut, the backport flow, how to open the next line, and the handful of npm and GitHub Actions behaviours that make this area surprising.

Two things worth knowing before touching anything here: a backport PR is based on the maintenance branch rather than `main`, and `latest` on npm always belongs to whatever line `main` is on — so a change that reaches users on the maintenance line got there by being cherry-picked to it after landing here.

## Changesets

The repo uses Changesets for version management. Configuration is in `.changeset/config.json`. **When creating or editing a file under `.changeset/`, invoke the [`changesets`](.github/skills/changesets/SKILL.md) skill** — it documents which `@doenet/*` packages a changeset must list, which must never appear, how version propagation works (one-directional, forward to consumers only), the private-flag trap, and the changeset file format. Don't pattern-match the package list from a sibling `.changeset/*.md` without consulting the skill — recurring mistakes have crept in that way, always the same shape: listing an internal package (`@doenet/utils`, `@doenet/lsp-tools`, `@doenet/static-assets`, …) instead of the published packages that carry the change to users. Only six packages are ever published; every other `@doenet/*` package is bundled into `@doenet/doenetml`.

## Key State & Data Flow

### Redux Store Structure
Located in `packages/doenetml/src/state/`:
- **`main` slice** — document state, component data, update queue
- **`keyboard` slice** — virtual keyboard focus tracking

Components dispatch actions to update UI state; the worker listens for changes and updates document computation.

### Worker Communication
The worker receives serialized updates and returns rendered component states. Redux selectors provide derived state to UI components.

## Common Tasks

### Add a new component type
1. Implement the **worker logic** in `packages/doenetml-worker-javascript` (component class, attributes, state variables, actions)
2. Implement the **UI renderer** in `packages/doenetml/src/Viewer/renderers` or similar
3. Register the component in `componentInfoObjects` so the worker knows about it; if the component appears in the DAST/normalized-DAST schema, update the relevant schema definitions too
4. Add **tests** in both Vitest and Cypress
5. Add a **changeset** if user-facing (see the [`changesets`](.github/skills/changesets/SKILL.md) skill for which packages to list)

### Debug a rendering issue
1. Start `npm run dev` and inspect the browser console
2. Use Redux DevTools to inspect state changes
3. Run `npm run test -w @doenet/test-cypress` to verify e2e tests still pass

## Performance & Notes

- The worker runs heavy computations off the main thread; avoid blocking UI updates
- Large documents or deeply nested variants can cause lag; consider profiling with DevTools
- Rust/WASM changes require a full rebuild of `packages/doenetml-worker-rust`; Wireit handles this but can be slow the first time

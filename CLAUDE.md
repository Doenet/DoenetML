# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## High-Level Architecture

DoenetML is a semantic markup language for building interactive web activities. The system has three layers:

### Layer 1: Parsing (Input)
The **parser** (`packages/parser`) converts DoenetML XML into a **DAST** (Document Abstract Syntax Tree). It handles XML parsing, validation, and normalization. Key exports: `stringToLezer()`, `lezerToDast()`, `normalizeDocumentDast()`.

### Layer 2: Computation (Worker)
The **worker** (`packages/doenetml-worker`) runs in a Web Worker and manages document state and computation. It combines:
- **JavaScript logic** (`packages/doenetml-worker-javascript`) for state updates and interactions
- **Rust/WASM logic** (`packages/doenetml-worker-rust/lib-js-wasm-binding`) The worker is slowly being transitioned to Rust. For the main `packages/doenetml` component, just small pieces of Rust (e.g., reference resolution) are currently invoked.

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
- **`packages/vscode-extension`** — VS Code extension with LSP support (`packages/lsp`)

## Monorepo Structure

This is an npm workspace monorepo. Key points:
- All packages build via **Vite** and **Wireit** (a task orchestration tool that manages build dependencies)
- **Wireit** is configured in each `package.json`'s `wireit` field; it automatically rebuilds dependencies when inputs change
- Each package can be built/tested independently with `-w <package-name>` or `-w @scope/package-name` flags

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

### Testing

```bash
# Run all tests (Vitest only, very slow)
npm run test

# Run Vitest only (all packages except worker)
npm run test:all-no-worker-js -- run

# Run targeted Vitest (e.g., prefigure package)
npm run test -w @doenet/prefigure -- --run test/index-api.test.ts

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

**Important**: After code changes affecting Cypress, rebuild `@doenet/test-cypress` before running Cypress tests. See `TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md` for the full runbook.

## Coding Conventions

From `AGENTS.md`; treat these as requirements:

- **No `private` class fields.** Use an underscore prefix for internal members (`_field`).
- **No fire-and-forget promises.** Always attach `.catch()` to intentionally unawaited Promises, or use `async`/`await`.
- **Prefer function declarations over function-valued variables** (`function foo() {}` over `const foo = ()`), unless reassignment is needed.
- **Prefer `async`/`await`** over `.then()` chains.
- **Format with Prettier** before committing: `npm run prettier:format`

## Files to Avoid Committing

From `AGENTS.md`:

- `packages/doenetml/dev/testCode.doenet` — local development file
- `packages/doenetml/dev/main.tsx` — local development file
- Untracked `*.md` files in the repository root — planning/notes files

If you edit these during development, they will show as modified but should not be staged.

## Changesets & Publishing

The repo uses Changesets for version management. Configuration is in `.changeset/config.json`.

### Fixed Group (synchronized versioning)
Six packages version together:
- `@doenet/doenetml`, `@doenet/standalone`, `@doenet/doenetml-iframe`
- `@doenet/v06-to-v07`, `@doenet/vscode-extension`, `doenet-vscode-extension`

### Independent Versioning
- `@doenet/prefigure` versions independently

**Rule**: When creating a changeset for a user-facing change, include **all packages** where the change is visible to end users, not just where the implementation lives.

Example: A change to `packages/doenetml/src/Viewer` affects `@doenet/doenetml`, `@doenet/standalone`, `@doenet/doenetml-iframe`, and downstream variants. Include all in the changeset.

## GitHub & Remotes

The repository may use a personal fork as `origin` with the canonical `Doenet/DoenetML` as `upstream`.

- **Always base PRs on `upstream/main`**, not `origin/main`
- Push your branch to your fork (`origin`), then create the PR targeting `Doenet/DoenetML:main`
- Use the GitHub CLI: `gh pr create --repo Doenet/DoenetML --base main --head <fork-owner>:<branch>`

## Key State & Data Flow

### Redux Store Structure
Located in `packages/doenetml/src/state/`:
- **`main` slice** — document state, component data, update queue
- **`keyboard` slice** — virtual keyboard focus tracking

Components dispatch actions to update UI state; the worker listens for changes and updates document computation.

### Worker Communication
The worker receives serialized updates and returns rendered component states. Redux selectors provide derived state to UI components.

## Testing Strategy

- **Vitest** for unit tests, component logic, and utility functions (files: `*.test.ts`, `*.test.tsx`)
- **Cypress** for e2e tests, user interactions, and full rendering (files: `cypress/e2e/*.cy.js`)
- Tests are grouped; run by group number to parallelize CI

## Common Tasks

### Add a new component type
1. Implement the **worker logic** in `packages/doenetml-worker-javascript`
2. Implement the **UI renderer** in `packages/doenetml/src/Viewer/renderers` or similar
3. Build the schema
4. Add **tests** in both Vitest and Cypress
5. Add a **changeset** if user-facing

### Debug a rendering issue
1. Start `npm run dev` and inspect the browser console
2. Use Redux DevTools to inspect state changes
3. Run `npm run test -w @doenet/test-cypress` to verify e2e tests still pass

### Run docs locally
```bash
npm run docs
```

Builds prerequisites and serves docs (Nextra-based) at `http://localhost:3000`.

## Performance & Notes

- The worker runs heavy computations off the main thread; avoid blocking UI updates
- Large documents or deeply nested variants can cause lag; consider profiling with DevTools
- Rust/WASM changes require a full rebuild of `packages/doenetml-worker-rust`; Wireit handles this but can be slow the first time

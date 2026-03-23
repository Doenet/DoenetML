# AGENTS.md

DoenetML is a semantic markup language for building interactive educational web activities. This is a large **npm workspace monorepo** (~25 packages) with a **Rust/WebAssembly core** and a **TypeScript/React** rendering layer.

## Architecture

### Package Dependency Flow

```
doenetml  (main React library)
  ├── parser                     — XML → DAST (Lezer + Peggy grammars)
  ├── doenetml-worker            — orchestrates both workers
  │     ├── doenetml-worker-rust — DAG + core computation (Rust → WASM via wasm-pack)
  │     └── doenetml-worker-javascript — component evaluation (TypeScript)
  ├── codemirror                 — editor with LSP
  │     └── lsp                  — Language Server Protocol impl
  ├── ui-components              — shared React UI primitives
  └── utils                     — color/math/contrast helpers
```

- **Rust worker** manages the dependency graph (DAG) and state propagation. Compiled to WASM via `wasm-pack`.
- **JS worker** evaluates individual components, handles answer validation, copy/ref resolution, and rendering props. The bulk of unit tests live here.
- **Parser** converts DoenetML XML into a typed **DAST**. Central types are in `packages/parser/src/types.ts`.
- **doenetml** (main): React renderer that subscribes to worker output. Workers communicate with the main thread via **Comlink** over a Web Worker.

### Key Directories

```
packages/doenetml/src/                              — React renderers, hooks, Redux slices
packages/doenetml-worker-javascript/src/components/ — one file per DoenetML component
packages/doenetml-worker-rust/lib-doenetml-core/    — Rust DAG logic
packages/parser/src/                                — Lezer grammar (.grammar), Peggy (.pegjs)
packages/test-cypress/cypress/e2e/                  — Cypress specs organized by feature
```

## Build Commands

Build dependencies are managed by **Wireit** — always use `npm run build`, never `vite build` directly. Wireit tracks file inputs/outputs and skips unnecessary rebuilds.

```bash
npm run build                   # Build @doenet/doenetml (main package)
npm run build:all-no-docs       # Build all packages except docs (CI default)
npm run build -w @doenet/<pkg>  # Build a specific package
npm run dev                     # Dev server for @doenet/doenetml at localhost:8012
```

## Testing

Read [TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md](TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md) before running tests.

```bash
# Unit tests (Vitest) — most packages
npm run test -w @doenet/<pkg> -- --run                        # All tests, one-shot
npm run test -w @doenet/<pkg> -- --run path/to/file.test.ts  # Single file
npm run test -w @doenet/<pkg> -- --run -t "pattern"          # By test name

# doenetml-worker-javascript (170+ test files split into tagged groups)
npm run test:group1 -w @doenet/doenetml-worker-javascript
# ... group2, group3, group4
```

### Cypress E2E

For `@doenet/test-cypress`, always follow the `build -> preview -> cypress run` sequence after code changes. Do not rely on an existing build or running preview server after source edits.

```bash
npm run build -w @doenet/test-cypress
npm run preview -w @doenet/test-cypress -- --host 127.0.0.1 --port 4173 --strictPort
npm exec -w @doenet/test-cypress -- cypress run -b chrome --headless --config video=false,retries=0

# Single spec (fast-fail)
npm exec -w @doenet/test-cypress -- cypress run -b chrome --headless --config video=false,retries=0,specPattern=cypress/e2e/tagSpecific/choiceinput.cy.js
```

The runbook includes additional non-interactive commands, troubleshooting for stale assets, and per-group scripts (`test:group1`–`test:group5`).

## Key Conventions

- **Wireit**: every package declares build `files`, `output`, and inter-package `dependencies` in its `package.json`. Never bypass it.
- **TypeScript**: strict mode, `ES2020` target, `ESNext` modules; named exports preferred over defaults.
- **React patterns**: renderers use a `useDoenetRenderer` hook to pull state from the worker; global state via Redux Toolkit (`createSlice` / `createSelector`).
- **CSS**: Tailwind + PostCSS for utility styles; component-scoped CSS files sit alongside their `.tsx` file (e.g. `booleanInput.css` next to `booleanInput.tsx`).
- **Test tagging**: Vitest tests in `doenetml-worker-javascript` use `@group1`–`@group4` tags; Cypress specs are organized under subdirectories like `tagSpecific/`, `copyinng/`, etc.

## Commit Hygiene

- Format changed files with Prettier before committing (`npm run prettier:format`; tab width: 4).
- Do not commit `testCode.doenet` files.
- Do not commit `packages/doenetml/dev/main.tsx`.
- Do not commit any untracked `*.md` files in the repository root.
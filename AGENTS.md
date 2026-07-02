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

### Run docs locally

```bash
npm run docs
```

Builds prerequisites and serves docs (Nextra-based) at `http://localhost:3000`.

## Testing

Read [TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md](TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md) before running tests. Highlights:
- For `@doenet/test-cypress`, rebuild before Cypress runs after code changes.
- Follow the required sequence: `build -> preview -> cypress run`.
- Do not rely on an old build or an already-running preview server after source edits.
- The runbook includes non-interactive test commands, Cypress preview-server workflow, fail-fast Cypress commands, and stale-asset troubleshooting.

### Test Tooling

- **Vitest** for unit tests, component logic, and utility functions (files: `*.test.ts`, `*.test.tsx`)
- **Cypress** for e2e tests, user interactions, and full rendering (files: `cypress/e2e/*.cy.js`)
- Tests are grouped; run by group number to parallelize CI

### Common Test Commands

```bash
# Run all tests (Vitest only, very slow)
npm run test

# Run Vitest only (all packages except `doenetml-worker-javascript`)
npm run test:all-no-worker-js

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

- **Always base PRs on `upstream/main`**, not `origin/main`.
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

## Changesets

The repo uses Changesets for version management. Configuration is in `.changeset/config.json`. **When creating or editing a file under `.changeset/`, invoke the [`changesets`](.github/skills/changesets/SKILL.md) skill** — it documents which `@doenet/*` packages a changeset must list, which must never appear, how version propagation works (one-directional, forward to consumers only), the private-flag trap, and the changeset file format. Don't pattern-match the package list from a sibling `.changeset/*.md` without consulting the skill — recurring mistakes (notably adding `@doenet/lsp-tools` or `@doenet/static-assets`) have crept in that way.

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

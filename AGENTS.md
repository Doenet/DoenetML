# AGENTS.md

## Testing

Agents working in this repository should read [TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md](TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md) before running tests.

- For `@doenet/test-cypress`, rebuild before Cypress runs after code changes.
- Follow the required sequence: `build -> preview -> cypress run`.
- Do not rely on an old build or an already-running preview server after source edits.
- The runbook includes non-interactive test commands, Cypress preview-server workflow, fail-fast Cypress commands, and stale-asset troubleshooting.

## Coding Conventions for Agents

- Avoid `private` class fields and methods; use an underscore prefix for internal members.
- Avoid fire-and-forget calls via `void`; if a Promise is intentionally not awaited, attach an explicit `.catch(...)` handler.
- Prefer function declarations over function-valued variables, unless reassignment or dynamic replacement is required.
- Prefer `async`/`await` over old-style Promise chains (`.then(...)` / `.catch(...)`) when writing asynchronous code.

## Commit Hygiene Requirements

- Format changed files with Prettier before committing.
- Ignore changes to `testCode.doenet` files. Do not commit them.
- Ignore changes to `packages/doenetml/dev/main.tsx`. Do not commit them.
- Ignore changes to any untracked `*.md` files in the repository root. Do not commit them.

## PR Creation

- This checkout may use a personal fork as `origin` and the canonical repository as `upstream`.
- Do not assume `origin/main` matches the PR base. Base pull requests on `upstream/main`.
- Push the branch to your fork, then create the PR in `Doenet/DoenetML` with your fork branch as the head.
- **Preferred method: Use GitHub CLI (`gh`).** The `mcp_gitkraken_pull_request_create` tool requires authentication that may not be available.
- Command format: `gh pr create --repo Doenet/DoenetML --base main --head <fork-owner>:<branch>`. Replace `<fork-owner>` with your GitHub username (e.g., `dqnykamp:my-branch`).
- Before pushing, run `prettier` to format modified files and ensure formatting compliance.
- Before creating the PR, confirm that only intended files are staged and committed, since this repository often has unrelated local work in the tree.
- After creating the PR, verify the branch has been pushed to `origin` and the PR links to the correct target branch (`Doenet/DoenetML:main`).

## Changesets

- Changesets are configured in `.changeset/config.json`.
- The repo currently uses one `fixed` group containing six packages:
  - `@doenet/doenetml`
  - `@doenet/standalone`
  - `@doenet/doenetml-iframe`
  - `@doenet/v06-to-v07`
  - `@doenet/vscode-extension`
  - `doenet-vscode-extension`
- Additionally, `@doenet/prefigure` is published but with an independent version (not part of the fixed group).
- User-facing changes in `@doenet/doenetml` are also apparent in `@doenet/standalone`, `@doenet/doenetml-iframe`, `@doenet/vscode-extension`, and `doenet-vscode-extension`.
- User-facing changes in `@doenet/standalone` are also apparent in `@doenet/doenetml-iframe`.
- When writing a changeset, include the published package or packages where the user-facing change is apparent, not just the package where the implementation lives.
- The fixed-group configuration coordinates versioning across all six fixed-group packages.
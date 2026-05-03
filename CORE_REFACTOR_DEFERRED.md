# Core.js refactor — deferred findings

These items came out of the PR review for `core-refactor-1` (Phase 1: extracting helpers from `packages/doenetml-worker-javascript/src/Core.js`). They were intentionally out of scope for that PR but are good candidates for the next refactor pass.

The implementation in this branch covers the in-scope items from the PR review.

## Deferred items

### Type the `core: any` back-reference in extracted managers

Every new manager (`DiagnosticsManager`, `VisibilityTracker`, `StatePersistence`, `AutoSubmitManager`, `NavigationHandler`, `ResolverAdapter`) declares `core: any;`. That defeats the point of converting to TypeScript — typos and accidental property reads through `core` go unchecked.

Since `Core.js` is still JavaScript, defining a real `Core` interface is awkward. Two practical paths:

1. **A minimal `CoreBackref` interface** in `packages/doenetml-worker-javascript/src/types/coreBackref.ts` listing only the fields each manager actually reads. This is documentary and catches typos. Each manager can narrow further with `Pick<CoreBackref, ...>`.
2. **Convert `Core.js` to `Core.ts`** in a follow-up phase. Requires real type definitions for `_components`, `flags`, `componentInfoObjects`, etc. — a much larger lift but lets the managers drop their back-reference typing concerns entirely.

(1) is the cheaper near-term win.

### Reduce stateless managers to plain functions

`NavigationHandler` and `ResolverAdapter` hold no state of their own — only a `core` back-reference. The pure-function shape used in `StateVariableNameResolver.ts` is more honest for these:

```ts
// NavigationHandler.ts
export async function handleNavigatingToComponent({
    core, componentIdx, hash,
}: { core: CoreBackref; componentIdx: number; hash: string }) { ... }

export function navigateToTarget({ core, args }: { core: CoreBackref; args: any }) { ... }
```

Core's wrappers shrink by one line each. If we keep the class form for symmetry with the other (genuinely stateful) managers, that's defensible — but the current PR has both shapes coexisting, so the inconsistency is real.

### Move `getSourceLocationForComponent` out of `DiagnosticsManager`

It currently lives at `DiagnosticsManager.ts:150-170`. It walks `_components` ancestors to find a position; nothing about it is diagnostic-specific. It's only there because diagnostics are its primary caller (`Core.js:7530`). Better home: `packages/doenetml-worker-javascript/src/utils/descendants.js` alongside `ancestorsIncludingComposites`.

### `TimerLabels` constants for `reportTimerError`

Each call site to `reportTimerError(...)` writes a hand-typed label (`"auto-submit answers"`, `"scheduled saveState"`, `"throttled saveChangesToDatabase"`, `"visibility periodic send"`, `"visibility resume send"`, `"visibility auto-suspend"`). A shared object would catch typos and centralize the namespace:

```ts
// packages/doenetml-worker-javascript/src/utils/timerErrors.ts
export const TimerLabels = {
    autoSubmit: "auto-submit answers",
    scheduledSaveState: "scheduled saveState",
    throttledSaveChanges: "throttled saveChangesToDatabase",
    visibilityPeriodicSend: "visibility periodic send",
    visibilityResumeSend: "visibility resume send",
    visibilityAutoSuspend: "visibility auto-suspend",
} as const;
```

Skip if the next phase introduces a broader logging/instrumentation layer that supersedes this helper.

### Refactor `calcStartEndIdx` out of `determineParentAndIndexResolutionForResolver`

`ResolverAdapter.determineParentAndIndexResolutionForResolver` contains a nested `async function calcStartEndIdx(replacements)` that mutates three variables from the outer scope (`start_idx`, `end_idx`, and reads `update_start`, `update_end`, `copyComponent`) as side effects. The function is recursive and returns a value, but callers discard the return and rely entirely on the side-effect mutations. This was carried over verbatim from Core.js.

A cleaner shape: make `calcStartEndIdx` a standalone helper (or a private method on `ResolverAdapter`) that returns `{ start_idx, end_idx }` directly, eliminating the closure mutation. This untangles the logic and makes the function independently testable.

### Regression test for the `.primitive.number` → `.primitive.value` fix

Commit `aed7910c` fixed a latent bug at `ResolverAdapter.ts:84` (was reading `component.attributes.createComponentIdx.primitive.number`, should be `.value` after a `primitive.type === "number"` guard). The fix matches the pattern at `utils/resolver.ts:220-224` and `utils/componentIndices.ts:725`.

This codepath fires when a copy component (created via `extend`) has a `source:sequence` attribute and a numeric `createComponentIdx`. A targeted Vitest case constructing that specific shape and asserting the resolver receives a `parentSourceSequence` with the correct `parent: <number>` field would lock the fix in. Without it, regressions could re-introduce the silent `undefined`-parent bug.

## Notes for the next agent

- The applied items in this PR are self-contained — see the diff against the previous commit. The structural deferrals above don't depend on each other except that #1 (typing) makes #2 (stateless→plain) cleaner since the back-reference type would already exist.
- AGENTS.md is the source of truth for project conventions; CLAUDE.md is now a one-line pointer.
- Cypress runs in CI; do not include local Cypress steps in any verification plan.

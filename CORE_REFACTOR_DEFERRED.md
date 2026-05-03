# Core.js refactor — deferred findings

These items came out of the PR reviews for the multi-phase refactor (`core-refactor-1`, `core-refactor-2`, …) extracting helpers from `packages/doenetml-worker-javascript/src/Core.js`. They were intentionally out of scope for those PRs but are good candidates for a follow-up pass.

## Deferred items

### Type the `core: any` back-reference in extracted managers

Every new manager declares `core: any;` — Phase 1 (`DiagnosticsManager`, `VisibilityTracker`, `StatePersistence`, `AutoSubmitManager`, `NavigationHandler`, `ResolverAdapter`) and Phase 2 (`RendererInstructionBuilder`, `ProcessQueue`, `ComponentLifecycle`, `ChildMatcher`, `DeletionEngine`, `ActionTriggerScheduler`). That defeats the point of converting to TypeScript — typos and accidental property reads through `core` go unchecked.

Since `Core.js` is still JavaScript, defining a real `Core` interface is awkward. Two practical paths:

1. **A minimal `CoreBackref` interface** in `packages/doenetml-worker-javascript/src/types/coreBackref.ts` listing only the fields each manager actually reads. This is documentary and catches typos. Each manager can narrow further with `Pick<CoreBackref, ...>`.
2. **Convert `Core.js` to `Core.ts`** in a follow-up phase. Requires real type definitions for `_components`, `flags`, `componentInfoObjects`, etc. — a much larger lift but lets the managers drop their back-reference typing concerns entirely.

(1) is the cheaper near-term win.

### Reduce stateless managers to plain functions

Several managers hold no state of their own — only a `core` back-reference:

- Phase 1: `NavigationHandler`, `ResolverAdapter`
- Phase 2: `ComponentLifecycle`, `DeletionEngine` (and `ChildMatcher`, modulo its single recursion-guard array)

The pure-function shape used in `StateVariableNameResolver.ts` is more honest for these:

```ts
// NavigationHandler.ts
export async function handleNavigatingToComponent({
    core, componentIdx, hash,
}: { core: CoreBackref; componentIdx: number; hash: string }) { ... }

export function navigateToTarget({ core, args }: { core: CoreBackref; args: any }) { ... }
```

Core's wrappers shrink by one line each. If we keep the class form for symmetry with the other (genuinely stateful) managers, that's defensible — but the current shape has both forms coexisting, so the inconsistency is real. `ChildMatcher`'s `derivingChildResultsInProgress` array is a small enough piece of state that it could be lifted into a module-level closure or threaded through the call, allowing it to also become a plain-function module.

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

### Pre-existing fire-and-forget calls still in `Core.js`

Three intentionally unawaited Promise calls remain in `Core.js`. They pre-date this PR (this refactor did not introduce them, and adding `.catch` handlers was out of scope for a behavior-preserving extraction), but they violate the AGENTS.md convention that fire-and-forget Promises must attach an explicit `.catch(...)` handler. They should be picked up in the next phase that touches Core directly.

- **`Core.js:410`** — `this.saveState();` inside the `generateDast` epilogue (`if (!this.receivedStateVariableChanges) { this.saveState(); }`). Returns a Promise; rejection is unhandled.
- **`Core.js:11160`** — `this.saveState(true, true);` inside `processNewStateVariableValues` after recording component submissions. Same shape as above.
- **`Core.js:449-452`** — `setTimeout(this.sendVisibilityChangedEvents.bind(this), this.visibilityInfo.saveDelay)` inside `onDocumentFirstVisible()`. The bound function returns `Promise<void> | undefined`; setTimeout discards the return, so any rejection is unhandled.

Suggested fix in each case: wrap with `.catch(reportTimerError("<label>"))` using the helper added in this PR (`src/utils/timerErrors.ts`). For the setTimeout case, use a thin arrow wrapper: `setTimeout(() => { this.sendVisibilityChangedEvents()?.catch(reportTimerError("first-visible visibility send")); }, ...)`.

Phase 2's `ProcessQueue._kickoff` already attaches a `.catch(console.error)` to its `executeProcesses()` call, but the rest of the codebase still needs a sweep for bare `executeProcesses()` invocations and other unawaited Promises.

### Carried-over `TODO` comments in the new managers

When the Phase 2 modules were extracted, several `TODO` / `XXX` markers were lifted verbatim from `Core.js`. They aren't blockers but represent unanswered design questions that have been deferred for years; tackling them is independent of the refactor itself.

- `ProcessQueue.ts:97, 106` — `// TODO: if skip an update, presumably we should call reject???` Unresolved: skipped queue entries currently never resolve or reject, so callers awaiting them hang.
- `ProcessQueue.ts` (between the `update` and `action` branches in `executeProcesses`) — commented-out `getStateVariableValues` queue branch. Either revive or delete.
- `RendererInstructionBuilder.ts:91` — `//TODO: Figure out what we need from here` above the change-detection pass.
- `RendererInstructionBuilder.ts:253` — `// && !deletedRenderers.includes(componentIdx)  TODO: what if recreate with same name?` — guards re-render of a name that has been deleted and re-created.
- `RendererInstructionBuilder.ts:275` — `// TODO: need this to ignore baseVariables change: is this right place?` on `rendererType` capture.
- `ChildMatcher.ts:430, 468` — two `// XXX: how does this work with the new componentIdx approach?` comments on the placeholder-adapter branch.

### `processQueue` field naming inside Core

`Core` stores the `ProcessQueue` instance as `this.processQueueManager` while every other manager is named after its class (`this.componentLifecycle`, `this.childMatcher`, `this.deletionEngine`, `this.actionTriggerScheduler`, `this.rendererInstructionBuilder`, `this.diagnosticsManager`, `this.statePersistence`, etc.). The `Manager` suffix is here because `Core` already exposes `get processQueue() { return this.processQueueManager.queue; }` for the underlying array — and JS doesn't let an instance field shadow an inherited accessor of the same name.

Two cleanups to consider together:

1. Drop the `get/set processQueue` wrappers on `Core` (no current consumers need the array directly — components and CoreWorker only see the four request entry points and the `processing`/`stopProcessingRequests` flags), then rename `processQueueManager` → `processQueue`.
2. Or leave as-is for the explicit symmetry between "manager class instance" and "the array it owns".

Pick one; the current shape inherits the asymmetry from a half-finished rename.

### Standardize `core._components` vs `core.components` access in extracted managers

`Core` exposes `_components` as the canonical array and `get components()` as a read-only accessor returning the same array. Phase 2's modules now consistently use `core._components` (Phase 1 mostly does too). If future managers are added, keep this convention so reviewers don't have to remember the array and getter are the same thing. The deferred `CoreBackref` interface above is the natural place to enforce it (expose only `_components`).

### Regression test for the `.primitive.number` → `.primitive.value` fix

Commit `aed7910c` fixed a latent bug at `ResolverAdapter.ts:84` (was reading `component.attributes.createComponentIdx.primitive.number`, should be `.value` after a `primitive.type === "number"` guard). The fix matches the pattern at `utils/resolver.ts:220-224` and `utils/componentIndices.ts:725`.

This codepath fires when a copy component (created via `extend`) has a `source:sequence` attribute and a numeric `createComponentIdx`. A targeted Vitest case constructing that specific shape and asserting the resolver receives a `parentSourceSequence` with the correct `parent: <number>` field would lock the fix in. Without it, regressions could re-introduce the silent `undefined`-parent bug.

## Notes for the next agent

- The applied items in this PR are self-contained — see the diff against the previous commit. The structural deferrals above don't depend on each other except that #1 (typing) makes #2 (stateless→plain) cleaner since the back-reference type would already exist.
- AGENTS.md is the source of truth for project conventions; CLAUDE.md is now a one-line pointer.
- Cypress runs in CI; do not include local Cypress steps in any verification plan.

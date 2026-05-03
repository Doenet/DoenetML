# Core.js refactor — deferred findings

These items came out of the PR reviews for the multi-phase refactor (`core-refactor-1`, `core-refactor-2`, …) extracting helpers from `packages/doenetml-worker-javascript/src/Core.js`. They were intentionally out of scope for those PRs but are good candidates for a follow-up pass.

## Deferred items

### Type the `core: any` back-reference in extracted managers

Every new manager declares `core: any;` — Phase 1 (`DiagnosticsManager`, `VisibilityTracker`, `StatePersistence`, `AutoSubmitManager`, `NavigationHandler`, `ResolverAdapter`), Phase 2 (`RendererInstructionBuilder`, `ProcessQueue`, `ComponentLifecycle`, `ChildMatcher`, `DeletionEngine`, `ActionTriggerScheduler`), and Phase 3 (`StateVariableDefinitionFactory`, `StateVariableInitializer`, `ComponentBuilder`, `CompositeExpander`). That defeats the point of converting to TypeScript — typos and accidental property reads through `core` go unchecked.

Since `Core.js` is still JavaScript, defining a real `Core` interface is awkward. Two practical paths:

1. **A minimal `CoreBackref` interface** in `packages/doenetml-worker-javascript/src/types/coreBackref.ts` listing only the fields each manager actually reads. This is documentary and catches typos. Each manager can narrow further with `Pick<CoreBackref, ...>`.
2. **Convert `Core.js` to `Core.ts`** in a follow-up phase. Requires real type definitions for `_components`, `flags`, `componentInfoObjects`, etc. — a much larger lift but lets the managers drop their back-reference typing concerns entirely.

(1) is the cheaper near-term win.

### Reduce stateless managers to plain functions

Several managers hold no state of their own — only a `core` back-reference:

- Phase 1: `NavigationHandler`, `ResolverAdapter`
- Phase 2: `ComponentLifecycle`, `DeletionEngine` (and `ChildMatcher`, modulo its single recursion-guard array)
- Phase 3: `StateVariableDefinitionFactory`, `StateVariableInitializer`, `ComponentBuilder`, `CompositeExpander` — none keep their own state; they only read/write through `core`

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

- **`Core.js:444`** — `this.saveState();` inside the `generateDast` epilogue (`if (!this.receivedStateVariableChanges) { this.saveState(); }`). Returns a Promise; rejection is unhandled.
- **`Core.js:4387`** — `this.saveState(true, true);` inside `processNewStateVariableValues` after recording component submissions. Same shape as above.
- **`Core.js:483-486`** — `setTimeout(this.sendVisibilityChangedEvents.bind(this), this.visibilityInfo.saveDelay)` inside `onDocumentFirstVisible()`. The bound function returns `Promise<void> | undefined`; setTimeout discards the return, so any rejection is unhandled.

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

Phase 3 lifted further `TODO`s verbatim from `Core.js` into the new modules:

- `StateVariableInitializer.ts:42` — `// TODO: do we want to delete alias from state?` on the alias-handling branch of `initializeComponentStateVariables`.
- `StateVariableInitializer.ts:313` — `// TODO: delete since arrayEntrySize isn't currently used?` on the array-entry size dependency setup.
- `StateVariableInitializer.ts:362, 923` — `// TODO: we are communicating this to updateDependencies by adding ...` on dependency-name punning.
- `StateVariableInitializer.ts:666, 766` — duplicate `// TODO: if we redesign arrays to be based on indices (or even slices), ...` reflections on array-entry materialization.
- `StateVariableInitializer.ts:817` — `// TODO: wrapping components (like most array features) was designed before ...`.
- `StateVariableInitializer.ts:868, 1449` — duplicate `// TODO: a better idea? This seems like it could lead to confusion.` on the public-state-variable-name resolution path.
- `StateVariableDefinitionFactory.ts:1355, 1451` — duplicate `// TODO: how do we make it do this just once?` on the array-entry definition setup.
- `ComponentBuilder.ts:170, 238` — duplicate `// TODO: should we check for child results earlier so we don't have to check them ...` on the post-creation child-result re-derivation.
- `CompositeExpander.ts:373` — `// TODO: are there any scenarios where this will lead to an infinite loop?` on the `createSerializedReplacements` retry loop.
- `CompositeExpander.ts:688` — `// XXX: what is the replacement for targetComponentIdx?` on the shadow-mediating composite branch.

### `processQueue` field naming inside Core

`Core` stores the `ProcessQueue` instance as `this.processQueueManager` while every other manager is named after its class (`this.componentLifecycle`, `this.childMatcher`, `this.deletionEngine`, `this.actionTriggerScheduler`, `this.rendererInstructionBuilder`, `this.diagnosticsManager`, `this.statePersistence`, etc.). The `Manager` suffix is here because `Core` already exposes `get processQueue() { return this.processQueueManager.queue; }` for the underlying array — and JS doesn't let an instance field shadow an inherited accessor of the same name.

Two cleanups to consider together:

1. Drop the `get/set processQueue` wrappers on `Core` (no current consumers need the array directly — components and CoreWorker only see the four request entry points and the `processing`/`stopProcessingRequests` flags), then rename `processQueueManager` → `processQueue`.
2. Or leave as-is for the explicit symmetry between "manager class instance" and "the array it owns".

Pick one; the current shape inherits the asymmetry from a half-finished rename.

### Standardize `core._components` vs `core.components` access in extracted managers

`Core` exposes `_components` as the canonical array and `get components()` as a read-only accessor returning the same array. Phase 2's and Phase 3's modules now consistently use `core._components` (Phase 1 mostly does too). If future managers are added, keep this convention so reviewers don't have to remember the array and getter are the same thing. The deferred `CoreBackref` interface above is the natural place to enforce it (expose only `_components`).

### Regression test for the `.primitive.number` → `.primitive.value` fix

Commit `aed7910c` fixed a latent bug at `ResolverAdapter.ts:84` (was reading `component.attributes.createComponentIdx.primitive.number`, should be `.value` after a `primitive.type === "number"` guard). The fix matches the pattern at `utils/resolver.ts:220-224` and `utils/componentIndices.ts:725`.

This codepath fires when a copy component (created via `extend`) has a `source:sequence` attribute and a numeric `createComponentIdx`. A targeted Vitest case constructing that specific shape and asserting the resolver receives a `parentSourceSequence` with the correct `parent: <number>` field would lock the fix in. Without it, regressions could re-introduce the silent `undefined`-parent bug.

### De-duplicate attribute-derived state variable construction in `StateVariableDefinitionFactory`

The factory builds attribute-derived state variables in three almost-identical sites: `createAttributeStateVariableDefinitions` (around lines 130, 170, 232-402, 405-419), `createReferenceShadowStateVariableDefinitions` (around lines 678, 721-743, 782-952, 955-968), and the adapter-shadow path (around line 448, 554-567). Four families of duplication are visible:

1. **`shadowingInstructions` block.** Three near-identical 30-line blocks that map `attributeSpecification.createPrimitiveOfType` (string/stringArray/numberArray) to the corresponding component type (text/textList/numberList) and assign it to `stateVarDef.shadowingInstructions.createComponentOfType`. Extract a `_setShadowingInstructionsFromAttribute(stateVarDef, attributeSpecification)` helper.
2. **`stateVariableForAttributeValue` resolution.** Two identical lookups of `componentStateVariableForAttributeValue → attributeClass.stateVariableToBeShadowed → "value"`, both with the same "Component type … does not exist" throw. Extract `_resolveAttributeValueVariable(attributeSpecification, attrName, componentClass)`.
3. **`definition` / `inverseDefinition` callback pair on attribute-derived state vars.** ~170 lines duplicated almost verbatim between `createAttributeStateVariableDefinitions` and `createReferenceShadowStateVariableDefinitions`. A shared closure-builder returning `{ definition, inverseDefinition }` would absorb the duplication.
4. **`attributesToCopy` loop.** Three copies of the array + copy loop. The first intentionally adds `"triggerActionOnChange"`; the other two omit it. Today this divergence relies on visual diff; a helper like `_copyPassthroughAttributes(stateVarDef, attributeSpecification, { includeTriggerActionOnChange })` would make it explicit.

### Collapse the two branches of `ComponentBuilder.addComponents`

The initial-add branch (`addComponents` body when `initialAdd === true`, around lines 89-185) and the incremental-add branch (around lines 186-254) share three drains verbatim:

- Two `expandAllComposites(document)` calls (force=false then force=true).
- The `stateVariablesToEvaluate` drain loop (~16 lines apiece).
- The trailing `if (compositesToUpdateReplacements.size > 0)` "drain + re-render" tail (~12 lines apiece).

Extracting `_drainStateVariablesToEvaluate()`, `_expandAllCompositesBothPasses(component)`, and `_drainCompositesToUpdateReplacements()` would shrink `addComponents` by roughly 40 lines and make the initial-add vs incremental-add asymmetry obvious.

### Extract `_finishExpanding` and unexpanded-composite helpers in `CompositeExpander`

Two patterns duplicate verbatim across `expandCompositeComponent` and `expandShadowingComposite`:

1. **"Finished expanding" cleanup** (lines 411-420 and 741-750). Identical 9-line `compositesBeingExpanded.indexOf(componentIdx)` + `throw if -1` + `splice` block. Extract `_finishExpanding(componentIdx)`.
2. **Unexpanded-composite list cleanup** in `expandCompositeComponent` (lines 277-294 of the current file). The `unexpandedCompositesReady` and `unexpandedCompositesNotReady` lists each get the same `indexOf` + `splice` treatment; can collapse to `for (const arr of [parent.unexpandedCompositesReady, parent.unexpandedCompositesNotReady])`.

### Drop dead `replacementsCreated` guard in `CompositeExpander.expandShadowingComposite`

Around line 674 (the second `if (component.replacementsWorkspace.replacementsCreated === undefined) { ... = 0 }` inside the `!foundCircular` branch). `replacementsCreated` is already initialized to `0` ~200 lines earlier in the same function (around line 467) and is never re-set to undefined between the two checks. The second guard is dead.

### Pre-existing `verifyReplacementsMatchSpecifiedType` warnings loop bug

`CompositeExpander.expandShadowingComposite`, around lines 695-704. Both loops iterate `verificationResult.diagnostics` and add the items as both `"error"` and `"warning"` diagnostics, so every diagnostic is double-reported and there is no path for a true warning to come through. The second loop almost certainly should iterate `verificationResult.warnings` (or equivalent), or be deleted. Carried over verbatim from `Core.js`; not introduced by the refactor. Confirm against the verifier's actual output shape and fix in a separate PR.

### Pre-existing unreachable diagnostic in `StateVariableInitializer.initializeArrayStateVariable`

Around line 453 of the current file:

```ts
if (!numDimensionsInArrayKey > stateVarObj.numDimensions) {
    core.addDiagnostic({ ... "Number of dimensions specified in array key ..." ... });
    ...
}
```

`!numDimensionsInArrayKey` is `false` for any positive integer, and `false > number` is always `false`, so the diagnostic is unreachable. Almost certainly intended `numDimensionsInArrayKey > stateVarObj.numDimensions`. Pre-dates the refactor (present in `Core.js` since the 2021 rename); flag for a separate fix once the intended check has been confirmed against test expectations.

### Re-home `recursivelyReplaceCompositesWithReplacements`

Currently at `StateVariableInitializer.ts:1609` and exposed via the wrapper `Core.js:recursivelyReplaceCompositesWithReplacements`. Conceptually it walks composites and substitutes their replacements — nothing to do with state-variable initialization. Better home: `CompositeExpander` (or a new `CompositeReplacementWalker` if `CompositeExpander` shouldn't grow further). While moving it, drop the unread `forceExpandComposites` parameter — declared at line 1612, never read in the body, only forwarded recursively (line 1673). Pre-existing dead parameter, lifted from `Core.js`.

### Minor cleanups in `ComponentBuilder`

- **`componentIdx == undefined` (line 311)** uses loose equality where the rest of the file uses strict (`=== undefined`). Tighten for consistency.
- **`if (!this.core.nTimesAddedComponents) { ... = 1 } else { ...++ }` (lines 67-71)** is a verbose increment-or-init. `this.core.nTimesAddedComponents = (this.core.nTimesAddedComponents ?? 0) + 1;` is one line.
- **Bare `catch (e) { console.error(e); throw e; }` (around line 534)** in the `attribute.references` branch of `createChildrenThenComponent`. The catch adds nothing the caller can't see; consider dropping it. The sibling catch at line 503 has real logic (rewrites circular-dependency messages) and should stay.

### Move `findShadowedChildInSerializedComponents` to `utils/`

`ComponentBuilder.findShadowedChildInSerializedComponents` (around lines 850-869 of the current file) reads/writes nothing on `this.core` and is a pure recursion over a serialized component tree. A natural fit for `utils/` next to the other serialized-tree walkers. This overlaps with the broader "stateless managers → plain functions" deferred item but is a particularly clean lift.

### Audit class for future extraction phases: `this`-rebinding traps

Phase 3 hit two regressions of the same shape (fixed in `caf3033f5`) that future mechanical extractions will hit again. When lifting code out of `Core.js` into a new manager class, every occurrence of these patterns needs a deliberate look:

1. **`let core = this;` captures.** Inside the original Core method, `this` is Core. Inside the extracted manager method, `this` is the manager — so the line must become `let core = this.core;`. A blind copy silently changes which object `core` refers to.
2. **`function () {}` callbacks attached to plain objects** (e.g., `stateDef.definition = function (args) { ... this.X(...) ... }`). These are call-site-bound by whatever later invokes them — typically Core or a state-var machinery object — so `this` inside the body refers to *that* call-site object, not the surrounding lexical scope. After extraction, if the body uses `this.X()` expecting Core, it still works (the call site is unchanged). But if the body was rewritten to use `this.core.X()` during extraction (assuming "this is the manager"), it breaks. Leave these bodies alone — let `this` resolve at the call site.
3. **`.bind(this)` on wrappers passed by reference** (e.g., `core.foo.bind(this)`). After extraction, `this` is the manager; the bind target needs to become `this.core` explicitly.

Quick grep targets when reviewing the next phase: `let core = this`, `\.bind(this)`, and arrow vs. `function` callback choices on objects assigned to `stateDef`/`stateVarObj`.

## Notes for the next agent

- The applied items in this PR are self-contained — see the diff against the previous commit. The structural deferrals above don't depend on each other except that #1 (typing) makes #2 (stateless→plain) cleaner since the back-reference type would already exist.
- AGENTS.md is the source of truth for project conventions; CLAUDE.md is now a one-line pointer.
- Cypress runs in CI; do not include local Cypress steps in any verification plan.

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

### Refactor `calcStartEndIdx` out of `determineParentAndIndexResolutionForResolver` — DONE

Extracted from the nested closure in `ResolverAdapter.determineParentAndIndexResolutionForResolver` into a standalone module-level helper in `utils/resolver.ts`. The new `calcStartEndIdx({ replacements, copyComponentIdx, updateStart, updateEnd })` returns `{ flattenedReplacements, startIdx, endIdx }` directly — no closure mutation, no discarded return value. Behaviour is preserved verbatim, including the parent-overrides-child semantics that the original closure relied on. Unit tests cover the nine behavioural branches in `src/test/utils/calcStartEndIdx.test.ts`.

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

Phase 4 lifted further `TODO`s verbatim into the five new modules — line numbers are approximate and subject to drift; `grep -n "TODO\|XXX\|kludge" path/to/file` is the canonical lookup:

- `EssentialValueWriter.ts` — top-of-`executeUpdateStateVariables` "do we need to check again ... how would we end the loop?" on the post-flush composite-expand re-check; `requestComponentChanges` carries a TODO about `additionalStateVariableValues` guarding (`additionalStateVariablesDefined.includes` may NPE if falsy); the "TODO: if child is a replacement of a composite, determine what to do" branch in the primitive-child path that throws when hit.
- `StateVariableEvaluator.ts` — "This is a kludge" comment on the `reprocessAfterEvaluate` second-pass mechanism for math expressions ignoring strings; two duplicate "TODO: is there a reason to check deeper?" comments on shallow-array-equality checks; "TODO: is this the correct response to having no changes but a variable not resolved?" on the `noChanges` branch; "TODO: address multidimensional arrays" on the array-entry resolution path.
- `StalenessPropagator.ts` — "TODO: remove all these error checks to speed up process" decade-old marker in `processMarkStale`'s validation block.
- `CompositeReplacementUpdater.ts` — `updateCompositeReplacements` carries TODOs at "why must we evaluate and not just resolve it?" (around line 71), an "infinite loop?" reflection in the `do…while` retry, "used to checkForDownstreamDependencies here" placeholders, "check if change.parent is appropriate dependency", "check if component...", "why does this delete delete upstream", "check if components...", "is isResponse the only attribute...". Two unanswered TODOs in `calculateAllComponentsShadowing` ask why `replacementOf` is needed (not reachable through `shadowedBy`?) and whether the no-link case is handled.

### `processQueue` field naming inside Core

`Core` stores the `ProcessQueue` instance as `this.processQueueManager` while every other manager is named after its class (`this.componentLifecycle`, `this.childMatcher`, `this.deletionEngine`, `this.actionTriggerScheduler`, `this.rendererInstructionBuilder`, `this.diagnosticsManager`, `this.statePersistence`, etc.). The `Manager` suffix is here because `Core` already exposes `get processQueue() { return this.processQueueManager.queue; }` for the underlying array — and JS doesn't let an instance field shadow an inherited accessor of the same name.

Two cleanups to consider together:

1. Drop the `get/set processQueue` wrappers on `Core` (no current consumers need the array directly — components and CoreWorker only see the four request entry points and the `processing`/`stopProcessingRequests` flags), then rename `processQueueManager` → `processQueue`.
2. Or leave as-is for the explicit symmetry between "manager class instance" and "the array it owns".

Pick one; the current shape inherits the asymmetry from a half-finished rename.

### `statePersistence` instantiation position in the Core constructor

Phase 4 moved `new StatePersistence({ core: this })` from `generateDast` into the constructor (commit `73a2337ec`), which is correct — `terminate()` awaits `saveImmediately()`, so calling `terminate` before the first `generateDast` would have thrown without it. But the new instantiation sits at the tail of the constructor (`Core.js:251`), after `updateExecutor`, rather than grouped with the other persistence/lifecycle managers earlier in the block.

Functionally fine (every back-reference is resolved at call time, not constructor time), but visually the manager-instantiation block has a clear top-to-bottom grouping that this entry breaks. One-line move into the natural position once someone is touching this file.

### Standardize `core._components` vs `core.components` access in extracted managers

`Core` exposes `_components` as the canonical array and `get components()` as a read-only accessor returning the same array. Phase 2's and Phase 3's modules now consistently use `core._components` (Phase 1 mostly does too). If future managers are added, keep this convention so reviewers don't have to remember the array and getter are the same thing. The deferred `CoreBackref` interface above is the natural place to enforce it (expose only `_components`).

### Regression test for the `.primitive.number` → `.primitive.value` fix

Commit `aed7910c` fixed a latent bug at `ResolverAdapter.ts:84` (was reading `component.attributes.createComponentIdx.primitive.number`, should be `.value` after a `primitive.type === "number"` guard). The fix matches the pattern at `utils/resolver.ts:220-224` and `utils/componentIndices.ts:725`.

This codepath fires when a copy component (created via `extend`) has a `source:sequence` attribute and a numeric `createComponentIdx`. A targeted Vitest case constructing that specific shape and asserting the resolver receives a `parentSourceSequence` with the correct `parent: <number>` field would lock the fix in. Without it, regressions could re-introduce the silent `undefined`-parent bug.

### De-duplicate attribute-derived state variable construction in `StateVariableDefinitionFactory` — DONE

All four duplication families collapsed.

1. **`shadowingInstructions` block.** Three 30-line copies replaced by `_setShadowingInstructionsFromAttribute(stateVarDef, attributeSpecification)`.
2. **`stateVariableForAttributeValue` resolution.** Two copies (plus the adapter-shadow path that the original audit had missed) collapsed onto `_resolveAttributeValueVariable(attributeSpecification, attrName, componentClass)`. The helper returns `undefined` for the no-`createComponentOfType` case.
3. **`attributesToCopy` loop.** Three copies replaced by `_copyPassthroughAttributes(stateVarDef, attributeSpecification, { includeTriggerActionOnChange })`. The flag makes the divergence between `createAttributeStateVariableDefinitions` (forwards `triggerActionOnChange`) and the two other paths explicit.
4. **`definition` / `inverseDefinition` callback pair.** Both 170-line bodies were byte-identical between `createAttributeStateVariableDefinitions` and `createReferenceShadowStateVariableDefinitions`; the reference-shadow `inverseDefinition` signature declared two extra parameters (`stateValues`, `workspace`) that the body never read, so dropping them was safe. The reference-shadow site also carried a stale `// attribute based on child` comment for what is actually an attribute component, fixed in passing to match the standalone site's `// attribute based on component`. Both callbacks lifted into `_buildAttributeDerivedDefinitions({ varName, stateVariableForAttributeValue, attributeSpecification, attrName })` returning `{ definition, inverseDefinition }`. Both call sites now invoke the helper and assign the returned closures to their `stateVarDef`. The `noInverse` opt-out remains at the call site.

### Collapse the two branches of `ComponentBuilder.addComponents` — DONE

All three drains extracted into internal (underscore-prefixed) helpers on the class: `_expandAllCompositesBothPasses()` (the two-pass `expandAllComposites(document)`), `_drainStateVariablesToEvaluate()` (the queue-and-evaluate loop), and `_drainCompositesToUpdateReplacements()` (the conditional "drain + re-render" tail). Both branches of `addComponents` now use them, making the initial-add vs incremental-add asymmetry visible at a glance.

### Extract `_finishExpanding` and unexpanded-composite helpers in `CompositeExpander` — DONE

Both patterns extracted:

1. **"Finished expanding" cleanup** — pulled out of `expandCompositeComponent` and `expandShadowingComposite` into an internal `_finishExpanding(componentIdx)` method (underscore-prefixed per AGENTS.md; no `private` keyword).
2. **Unexpanded-composite list cleanup** in `expandCompositeComponent` — collapsed the `unexpandedCompositesReady` / `unexpandedCompositesNotReady` indexOf+splice pair into `for (const list of [parent.unexpandedCompositesReady, parent.unexpandedCompositesNotReady])`, with a `continue` for the missing-list case.

### Pre-existing exception-leak windows in `CompositeExpander` expansion paths

Both `expandCompositeComponent` and `expandShadowingComposite` mutate
expansion-tracking state at points that are not protected against a thrown
exception in the awaited work that follows:

1. **Parent's unexpanded-composite lists** (`expandCompositeComponent`,
   around line 277). The composite is removed from
   `parent.unexpandedCompositesReady` / `unexpandedCompositesNotReady`
   *before* `createSerializedReplacements` and the rest of the async
   expansion run. If a later `await` throws, the parent's lists no
   longer reflect that the child still needs expansion, and dependency
   code that consults those lists will misclassify the parent.
2. **`compositesBeingExpanded` push/pop pairing**. Both functions push
   `componentIdx` onto `core.updateInfo.compositesBeingExpanded` near the
   top of the function and only pop (via `_finishExpanding`) at the end.
   Any throw between leaks the entry permanently. `Dependencies.resolveItem()`
   and the circular-shadow checks both consult this array, so a single
   failed expansion can cause later updates to be misclassified as
   circular or in-progress until the worker is recreated.

Both windows pre-date the Phase 5f refactor (the splices were inline
before extraction; the cleanup site has not moved). Fix is a `try`/`finally`
wrapper around each function body so the cleanup runs on the throw path,
or — for the parent-list mutation — defer the splice until after the
work that can throw has completed. Surface for separate PR; verify
against tests that intentionally trigger expansion failures.

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

### Re-home `recursivelyReplaceCompositesWithReplacements` — DONE

Moved from `StateVariableInitializer` to `CompositeExpander`. Dropped the unread
`forceExpandComposites` parameter. Removed the `Core.recursivelyReplaceCompositesWithReplacements`
wrapper; `Dependencies.js` now calls `core.compositeExpander.recursivelyReplaceCompositesWithReplacements(...)`
directly. Annotated the destructure parameter and return shape, eliminating the
implicit-any warnings that came with the original method.

### Minor cleanups in `ComponentBuilder` — DONE

- Loose `componentIdx == undefined` tightened to strict (`=== undefined`).
- `if (!nTimesAddedComponents) { ...= 1 } else ++` collapsed to `nTimesAddedComponents = (nTimesAddedComponents ?? 0) + 1`.
- Bare `catch (e) { console.error(e); throw e; }` in the `attribute.references` branch of `createChildrenThenComponent` deleted (the call already propagates and the log adds no info). Sibling catch at the `attribute.component` path retained (it still rewrites circular-dependency messages).

### Move `findShadowedChildInSerializedComponents` to `utils/` — RESOLVED (deleted instead)

On inspection, `ComponentBuilder.findShadowedChildInSerializedComponents` had
no callers anywhere in the workspace — only its own self-recursion. It has been
dead code since at least the April 2025 worker-package rename (the historical
`originalName` version had the same shape). Deleted rather than relocated.

### Phase 4: Heavy duplication across the new managers

The Phase 4 extraction (`StateVariableEvaluator`, `StalenessPropagator`, `EssentialValueWriter`, `CompositeReplacementUpdater`, `UpdateExecutor`) preserved several copy-paste clusters that were already in `Core.js`. Each is a real refactor — extracting them is a separate behavior-preserving PR rather than something to fold into the extraction itself.

**`StalenessPropagator`** — DONE.

- `_getArrayKeysAndSize(stateVarObj, component)` collapses the arrayKey/arraySize-from-`_previousValue` block shared between `lookUpCurrentFreshness` and `processMarkStale`.
- `_remapArrayEntryFreshness(result, allStateVariablesAffectedObj)` collapses the four `fresh` / `partiallyFresh` array-entry remap blocks (two in each of those functions).
- `_replaceWithStaleGetter(stateVarObj, component, vName)` collapses the "save `_previousValue` + reinstall lazy getter" block shared between `markStateVariableAndUpstreamDependentsStale` and the upstream-walk loop.
- `_processStaleVisit({ component, varName, allStateVariablesAffectedObj })` collapses the ~200-line freshness-classification + side-effect-dispatch + getter-reinstall + recurse block. Both call sites now invoke it with their pre-built `allStateVariablesAffectedObj`. The renderer-add at the top of each branch and the `upDep.valuesChanged` setup remain at the call sites since they encode genuinely different responsibilities (single-var vs multi-var renderer detection; per-`componentInd`/`varName` change-record write on the dependency).
- **Bug fix folded in:** the action-chaining bag in the upstream-walk loop had been keying by `upDep.componentIdx`, but dependency objects (per `Dependencies.js`) only carry `upstreamComponentIdx`. The lookup was always `undefined`, so every chain entry from the upstream side had been routed to a single `"undefined"` bucket on `componentsToUpdateActionChaining`. With the helper now keying by `component.componentIdx` (which is `upDepComponent` in the upstream context), chain entries land on the correct upstream component.

**`StateVariableEvaluator`** — DONE: both clusters extracted.
- The five "look up `varName` in `receivedValue`, otherwise scan `arrayEntryNames` for a matching entry, otherwise throw" sites collapsed onto `_findOrThrowMatchingArrayEntry({ varName, receivedValue, component, errorMessage })`. The two sites that additionally marked `receivedValue[entry] = true; valuesChanged[entry] = true;` keep that mark at the call site (passing the helper's return value).
- The two byte-identical "checkForActualChange / scalar / shallow-array-equality" blocks collapsed onto `_isUnchanged(newValue, previousValue)`.

**`EssentialValueWriter`** — DONE.
- Four `requestComponentChanges` recursion sites collapsed onto a new `_recurseInto({ inst, newInstruction, workspace, newStateVariableValues })` helper. Sites that build a transient `inst` literal pass it inline; the `additionalStateVariableValues`-setting site keeps its mutation outside the helper (passing the assembled `inst`).
- `_resolveValueOfStateVariable(instruction, component)` extracted; both the array-entry-path and scalar-path `valueOfStateVariable` branches now `await` it.

**`CompositeReplacementUpdater`** — DONE.
- All six `component.shadowedBy` + skip-on-`propVariable || doNotExpandAsShadowed` sites replaced by a module-level `function* iterateExpandableShadows(component)`. The two "find the matching shadow by `compositeIdx`" sites collapsed onto `findExpandableShadowByCompositeIdx(component, compositeIdx)`.
- `_recordDeleteResults({ deleteResults, composite, numberDeleted, parentsOfDeleted, deletedComponents, componentChanges, topLevel, firstIndex })` extracted from `deleteReplacementsFromShadowsThenComposite`. Both branches (top-level and non-top-level) call it; the optional `topLevel`/`firstIndex` params let the helper attach the splice-position fields only when the top-level branch needs them. The non-top-level branch still owns its `Object.assign(addedComponents, …)` tail; the top-level branch still owns its extra renderer-update fan-out for `composite.parentIdx`'s descendants.
- `calculateAllComponentsShadowing` now uses `iterateExpandableShadows` for its `shadowedBy` walk, replacing the hand-rolled `propVariable`/`doNotExpandAsShadowed` skip predicate. The `replacementOf` tail is unchanged.

**`UpdateExecutor`** — DONE.
- `_recordSourceDetails(instruction, sourceInformation)` extracted; both call sites (read-only branch and main loop) now invoke it.
- Cumulative-merge pattern between the essential-values and newStateVariableValues branches relocated into `EssentialValueWriter._mergeIntoCumulative(stateId, varName, value)`. `UpdateExecutor` now hands off to `essentialValueWriter._mergeIntoCumulative(...)` from both branches; the `removeFunctionsMathExpressionClass` import that was only feeding those two sites is gone.

### Phase 4: Type the destructure parameters and complete the strict-mode pass

The Phase 4 modules carry ~96 TypeScript warnings (down from ~188 after the inline cleanup pass on `Record<string, any>` bag locals, `Object.getOwnPropertyDescriptor(...)?.get` null-safety, `catch (e: any)`, and the three latent bugs TS caught — `&` typo, `Array.isArray()` no-arg, and `valuesChanged.arraySizeChanged` missing the `[varName]` index). The remaining warnings cluster:

- **TS7031 / TS7006 (~87 warnings)** — untyped destructured binding elements and untyped function parameters. Every public method on the five new managers (and most private ones) destructures `{ component, varName, ... }` without a parameter type. This is the same "established sibling-style pattern" that Phases 1-3 left in place; it's flagged as a follow-up rather than a regression. Adopting types for a single manager's surface (e.g., `StateVariableEvaluator`'s three public methods — `getStateVariableValue`, `getStateVariableDefinitionArguments`, `recordActualChangeInStateVariable`) is the highest-leverage starting point because callers are concentrated. The deferred `CoreBackref` interface (see top of this file) would also let `core: any` shed its `any`.
- **TS7053 (~7 warnings)** — `sourceInformation[idx]` indexing in `UpdateExecutor` (lines 141, 143, 182, 184) and `arrayInstructionInProgress.desiredValue[arrayKey]` indexing in `EssentialValueWriter` (lines 765, 773, 804). Both root-cause to a destructure parameter that needs a type — once the wider pass above happens, these resolve as a side effect.
- **TS2345 (4 warnings) — real signature drift across managers**:
  - `CompositeReplacementUpdater.ts:213` — call to `deleteReplacementsFromShadowsThenComposite` is missing `componentsToDelete` from the destructure expectation.
  - `EssentialValueWriter.ts:131` — `Argument of type 'any' is not assignable to parameter of type 'never'`; suggests an array typed as `never[]` getting pushed into.
  - `StateVariableEvaluator.ts:91` — call to `getStateVariableDefinitionArguments` missing `excludeDependencyValues` from the destructure expectation.
  - `UpdateExecutor.ts:39` — `performAction`'s recursive call to `performUpdate` passes only `{ updateInstructions, actionId, doNotSave }` while the destructure declares `diagnostics` and `event` as required. Either widen `performUpdate`'s destructure (mark them `?`) or pass them in the recursive call.

Each TS2345 hints at either a buggy call site or a destructure that should be marked optional. None have caused observable failures, so they're judgment calls — fix them when designing the real interfaces above.

### Phase 4: JSDoc on public entry points

Each of the five new managers has a strong class-level docstring (`StateVariableEvaluator.ts:1-16` is the model — a one-paragraph contract describing role and back-reference fields). But the public methods themselves have no JSDoc, despite carrying rich option-bag semantics:

- `UpdateExecutor.performUpdate` — has ~9 boolean flags (`overrideReadOnly`, `doNotSave`, `canSkipUpdatingRenderer`, `skipRendererUpdate`, …). The difference between `canSkipUpdatingRenderer` (skips both renderer paths) and `skipRendererUpdate` (skips only the late `updateAllChangedRenderers`) in particular is non-obvious and worth documenting.
- `EssentialValueWriter.processNewStateVariableValues` and `requestComponentChanges` — the inverse-definition contract (what an instruction's `value` / `valueOfStateVariable` / `additionalDependencyValues` means and how the chain terminates) is the trickiest piece of the engine and lives only in code.
- `StateVariableEvaluator.getStateVariableValue` — the most-called method on the class. A one-paragraph contract describing what it mutates on `component.state[*]` and when it triggers `markStateVariableAndUpstreamDependentsStale` would significantly help future maintainers.
- `CompositeReplacementUpdater.updateCompositeReplacements` — the public entry point. The contract for `calculateReplacementChanges` (currently a free-floating comment block at the top of the function) should become a JSDoc on the helper or on the `do…while` retry loop.
- `StalenessPropagator.processMarkStale` — the freshness-predicate contract (the meaning of `fresh`/`partiallyFresh` returns and how the array-entry remap bridges array-level and entry-level freshness) is alluded to in the class header but belongs on the method itself.

This is a documentation-only PR; can be done independently of the duplication or typing work above.

### Phase 4: Pre-existing console-error-and-throw blocks — DONE

Both `try { await ... } catch (e) { console.error(e); throw e; }` blocks in `UpdateExecutor.ts` (theme-set branch of `performAction` and main action-dispatch branch) deleted. The errors already propagate; `ProcessQueue` is the eventual catcher.

### Phase 4: Empty `catch (e) {}` in `EssentialValueWriter` — DONE

Annotated with a comment explaining the expected `get_component(ind)` out-of-range throw and that any other error shape is also swallowed (worth narrowing if math-expressions ever exposes a concrete error type).

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

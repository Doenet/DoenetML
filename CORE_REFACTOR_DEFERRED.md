# Core.js refactor — deferred findings

These items came out of the PR reviews for the multi-phase refactor (`core-refactor-1`, `core-refactor-2`, …) extracting helpers from `packages/doenetml-worker-javascript/src/Core.js`. They were intentionally out of scope for those PRs but are good candidates for a follow-up pass.

## Deferred items

### Type the `core: any` back-reference in extracted managers — DONE

Resolved via PR #1041 (commit `bbb808f6a`): `Core.js` was converted to `Core.ts`, giving managers a real `Core` type to import. The managers that still hold a back-reference (`ProcessQueue`, `AutoSubmitManager`, `RendererInstructionBuilder`, `StatePersistence`, `VisibilityTracker`, `ActionTriggerScheduler`, `StalenessPropagator`, `StateVariableEvaluator`, `UpdateExecutor`, `CompositeReplacementUpdater`, `EssentialValueWriter`, plus `DiagnosticsManager` which dropped its back-ref entirely) now declare `core: Core` instead of `core: any`. The intermediate `CoreBackref` interface ended up unnecessary — the direct `Core` import is cleaner.

### Reduce stateless managers to plain functions — DONE

All nine identified managers were converted to module-function form across PRs #1050 (`af88a65f4` — `NavigationHandler`, `ResolverAdapter`, `ComponentLifecycle`, `DeletionEngine`, `ChildMatcher`), #1051 (`618adce9b` — `CompositeExpander`), #1052 (`9ee2f37ce` — `ComponentBuilder`), #1053 (`52bc49c06` — `StateVariableInitializer`), and #1054 (`4ff8b3352` — `StateVariableDefinitionFactory`). `ChildMatcher`'s `derivingChildResultsInProgress` array became a module-level closure. Core no longer instantiates these as managers; it imports the functions directly.

### Move `getSourceLocationForComponent` out of `DiagnosticsManager` — DONE

Relocated; `DiagnosticsManager` no longer carries any back-reference to `core`.

### `TimerLabels` constants for `reportTimerError` — DONE

`src/utils/timerErrors.ts` exports the `TimerLabels` constant; all `reportTimerError(...)` callsites in `AutoSubmitManager`, `CoreWorker`, `StatePersistence`, `UpdateExecutor`, `Core`, and `VisibilityTracker` use it.

### Refactor `calcStartEndIdx` out of `determineParentAndIndexResolutionForResolver` — DONE

Extracted from the nested closure in `ResolverAdapter.determineParentAndIndexResolutionForResolver` into a standalone module-level helper in `utils/resolver.ts`. The new `calcStartEndIdx({ replacements, copyComponentIdx, updateStart, updateEnd })` returns `{ flattenedReplacements, startIdx, endIdx }` directly — no closure mutation, no discarded return value. Behaviour is preserved verbatim, including the parent-overrides-child semantics that the original closure relied on. Unit tests cover the nine behavioural branches in `src/test/utils/calcStartEndIdx.test.ts`.

### Pre-existing fire-and-forget calls still in `Core.js` — DONE

The three `saveState()` and `setTimeout(...)` callsites in `Core.ts` (now-`.ts`) were wrapped with `.catch(reportTimerError(TimerLabels.*))`. `ProcessQueue._kickoff`'s `executeProcesses()` is also `.catch`-wrapped.

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

Phase 4 lifted further `TODO`s verbatim into the five new modules — line numbers are approximate and subject to drift; `grep -n "TODO\|XXX\|kludge" path/to/file` is the canonical lookup:

- `EssentialValueWriter.ts` — top-of-`executeUpdateStateVariables` "do we need to check again ... how would we end the loop?" on the post-flush composite-expand re-check; `requestComponentChanges` carries a TODO about `additionalStateVariableValues` guarding (`additionalStateVariablesDefined.includes` may NPE if falsy); the "TODO: if child is a replacement of a composite, determine what to do" branch in the primitive-child path that throws when hit.
- `StateVariableEvaluator.ts` — "This is a kludge" comment on the `reprocessAfterEvaluate` second-pass mechanism for math expressions ignoring strings; two duplicate "TODO: is there a reason to check deeper?" comments on shallow-array-equality checks; "TODO: is this the correct response to having no changes but a variable not resolved?" on the `noChanges` branch; "TODO: address multidimensional arrays" on the array-entry resolution path.
- `StalenessPropagator.ts` — "TODO: remove all these error checks to speed up process" decade-old marker in `processMarkStale`'s validation block.
- `CompositeReplacementUpdater.ts` — `updateCompositeReplacements` carries TODOs at "why must we evaluate and not just resolve it?" (around line 71), an "infinite loop?" reflection in the `do…while` retry, "used to checkForDownstreamDependencies here" placeholders, "check if change.parent is appropriate dependency", "check if component...", "why does this delete delete upstream", "check if components...", "is isResponse the only attribute...". Two unanswered TODOs in `calculateAllComponentsShadowing` ask why `replacementOf` is needed (not reachable through `shadowedBy`?) and whether the no-link case is handled.

### `processQueue` field naming inside Core (DONE)

Resolved in PR #1049. Added `ProcessQueue.sendRecordEvent(event)` (push-and-kickoff) and switched `VisibilityTracker.sendVisibilityChangedEvents` to call it instead of poking `core.processQueue.push(...)` and `core.processing` / `core.executeProcesses()` directly. With no remaining external readers of the array or the processing flags, dropped Core's `get/set processQueue` (array), `get/set processing`, `get/set stopProcessingRequests`, and the `executeProcesses()` wrapper, then renamed `processQueueManager` → `processQueue`. `Core.terminate()` now reads `this.processQueue.processing` / `.stopProcessingRequests` directly.

### `statePersistence` instantiation position in the Core constructor — DONE

`new StatePersistence({ core: this })` now sits with the other manager instantiations in the main constructor block (Core.ts:371) rather than at the tail.

### Standardize `core._components` vs `core.components` access in extracted managers — DONE

All extracted managers and module functions consistently use `core._components`; no remaining read-side uses of the `components` getter. Convention to be enforced in future extractions.

### Regression test for the `.primitive.number` → `.primitive.value` fix — DONE

Added at `src/test/copying/external_references.test.ts` ("name reference into extended external content resolves through parentSourceSequence (regression)"). The test pins the contract: with the bug shape (`parent: undefined` from a missing primitive field), name resolution into a copied-and-renamed external section would not reach the leaf, and the test's `s.inner.leaf` and `p1` lookups would fail.

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
   around line 315). The composite is removed from
   `parent.unexpandedCompositesReady` / `unexpandedCompositesNotReady`
   *before* `createSerializedReplacements` and the rest of the async
   expansion run. If a later `await` throws, the parent's lists no
   longer reflect that the child still needs expansion, and dependency
   code that consults those lists will misclassify the parent.
2. **`compositesBeingExpanded` push/pop pairing**. The push happens at the
   top of `expandCompositeComponent` (line 313), and the matching pop happens
   in either `_finishExpanding(line 425)` (non-shadow path) or inside
   `expandShadowingComposite` at `_finishExpanding(line 704)` (shadow path).
   Any throw between push and pop leaks the entry permanently.
   `Dependencies.resolveItem()` and the circular-shadow checks both consult
   this array, so a single failed expansion can cause later updates to be
   misclassified as circular or in-progress until the worker is recreated.

Both windows pre-date the Phase 5f refactor (the splices were inline
before extraction; the cleanup site has not moved). The clean fix is a
`try`/`finally` wrapper in `expandCompositeComponent` that owns the
push/pop, plus deferring the parent-list splice until after the work
that can throw has completed. Holding off until there is at least one
test that intentionally triggers an expansion failure — the only
existing test in `functionTag.test.ts` (line 7319) is a happy-path
regression for an error that *was* reachable, not a forced-throw test.
Behavior change for an untested error path is the gating risk.

### Drop dead `replacementsCreated` guard in `CompositeExpander.expandShadowingComposite` — DONE

Removed.

### Pre-existing `verifyReplacementsMatchSpecifiedType` warnings loop bug — DONE

The duplicate warning-loop was deleted; only the single `diagnostics` loop remains.

### Pre-existing unreachable diagnostic in `StateVariableInitializer.initializeArrayStateVariable` — DONE

The `!numDimensionsInArrayKey > stateVarObj.numDimensions` typo was corrected to `numDimensionsInArrayKey > stateVarObj.numDimensions`, restoring reachability.

### Collapse the 1-D vs N-D branches of `StateVariableInitializer.initializeArrayStateVariable`

`StateVariableInitializer.ts:449-797` (the `if (stateVarObj.numDimensions > 1) { ... } else { ... }` block) duplicates the per-array plumbing across both branches: `keyToIndex`, `setArrayValue`, `getArrayValue`, `getAllArrayKeys`, `arrayVarNameFromArrayKey`, `arrayVarNameFromPropIndex`, and `adjustArrayToNewArraySize`. The 1-D branch is essentially the N-D branch specialised to `numDimensions === 1`.

A unified implementation that always uses the multi-index path would shed roughly 80 lines of duplication. The trade-off is that the 1-D path has a flatter, faster shape (`Number(key)` instead of `key.split(",").map(Number)`); benchmarking against the existing array-heavy components (`mathList`, `numberList`, `point`'s array entries) is the gating step before unifying. Carried over verbatim from `Core.js`; not introduced by the class→module conversion (PR `core-refactor-17`).

### `getAllArrayKeys` default in `StateVariableInitializer.initializeArrayStateVariable` — DEFERRED INDEFINITELY

Three sites still open with `if (args.arrayKeys === undefined) { args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize); }` (down from five since the original audit). The originally-proposed "fold into `getAllArrayKeys` itself" doesn't apply cleanly: the function takes `arraySize`, not `arrayKeys` — they are different concerns. A small `_resolveArrayKeysOnArgs(args, stateVarObj)` mutating helper saves only ~6 net lines and adds an indirection; not worth the churn unless touched in passing during a larger pass. `??=` would also work but subtly changes the null/undefined semantics.

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

### Phase 4: Type the destructure parameters and complete the strict-mode pass — DONE

All five Phase 4 modules now report 0 errors under `tsc --noEmit`; package-level total dropped from 366 → 277. Public destructure parameters are typed using `ComponentInstance` (lifted to required `stateId` and `essentialState` since both are always present once `BaseComponent` / `ComponentBuilder` have run) and per-file local aliases for the loose-typed bags (`UpdateInstruction`, `PerformActionArgs`, `PerformUpdateArgs`, `NewStateVariableValues`, `ComponentChange`, `ComponentMap`, `SourceInformation`, `SourceOfUpdate`).

Notable fixes folded in:
- **Real shim bug in `Dependencies.d.ts`** — `checkForCircularDependency` was declared with `stateVariable: string`, but `Dependencies.js:566` accepts `varName`. The shim mismatch had been silently mis-rejecting the only TypeScript caller. Fixed.
- **Empty `Set` initialisations** typed: `compositesNotReady` (`Set<number>`), `parentsOfDeleted` (`Set<ComponentIdx>`), `arrayVarNamesChanged` (`string[]`).
- **TS2345 #1 (`UpdateExecutor.ts:39`)** — `PerformUpdateArgs` now declares `diagnostics`, `event`, and `actionId` optional (the recursive setTheme call only passes `updateInstructions`, `actionId`, `doNotSave`). The flag fields each got a JSDoc paragraph distinguishing `canSkipUpdatingRenderer` from `skipRendererUpdate`.
- **TS2345 #2 (`EssentialValueWriter.ts:131`)** — fixed by typing the empty `Set` literal.
- **TS2345 #3 (`StateVariableEvaluator.ts:91`)** — `getStateVariableDefinitionArguments` now marks `excludeDependencyValues` as `boolean | undefined` (defaulting to `false`) instead of declaring it required.
- **TS2345 #4 (`CompositeReplacementUpdater.ts:213`)** — `deleteReplacementsFromShadowsThenComposite` now declares `componentsToDelete` as optional, matching the actual `if (componentsToDelete) { ... }` body.

Where the strict cascade exposed nullable fields the codepath guarantees populated (e.g. `component.replacements` inside `adjustReplacementsToWithhold`, `component.shadows` inside `shadowedBy` walks, `component.parentIdx` inside `_components` lookups), non-null assertions (`!`) were used at the use site rather than tightening `ComponentInstance` further. The two newly-required fields were tightened deliberately because they are set unconditionally during construction.

### Phase 4: JSDoc on public entry points — DONE

JSDoc paragraphs added to every public entry point identified in the original list, plus the surrounding methods on the same classes for symmetry:

- `UpdateExecutor.performUpdate` — full contract for the `updateInstructions` dispatch loop, the post-loop renderer/persistence side effects, and an inline distinction between the four boolean flags (notably `canSkipUpdatingRenderer` vs `skipRendererUpdate`).
- `UpdateExecutor.performAction` — special-case branches (`setTheme` re-entry, post-deletion `recordVisibilityChange`) and the main action-dispatch path with optional case-insensitive matching.
- `EssentialValueWriter.executeUpdateStateVariables` — public bulk-write entry point: write → flush composites → expand → flush again.
- `EssentialValueWriter.processNewStateVariableValues` — bulk-apply contract, missing-component bookkeeping, and the role of the `newComponent` flag.
- `EssentialValueWriter.requestComponentChanges` — inverse-definition chain contract: how `instruction` is recursively expanded, where `newStateVariableValues` and `workspace` accumulate, and how the chain terminates.
- `StateVariableEvaluator.getStateVariableValue` — what gets mutated on `component.state[*]`, the `reprocessAfterEvaluate` kludge, and the relationship to `markStateVariableAndUpstreamDependentsStale`.
- `StateVariableEvaluator.recordActualChangeInStateVariable` — the three side effects (mark-stale, force-recalculation, record-actual-change) and how they relate to the `additionalStateVariablesDefined` group.
- `CompositeReplacementUpdater.updateCompositeReplacements` — the four-step pipeline (calculate / delete / create / thread) and the shadow short-circuit.
- `StalenessPropagator.markStateVariableAndUpstreamDependentsStale` — the entry-point contract for the staleness pass.
- `StalenessPropagator.lookUpCurrentFreshness` — the read-only freshness probe used to capture "previously effectively fresh" before the new mark-stale pass runs.
- `StalenessPropagator.processMarkStale` — the `fresh` / `partiallyFresh` freshness verdict shape and the array-level/entry-level bridging via `_remapArrayEntryFreshness`.
- `StalenessPropagator.markUpstreamDependentsStale` — one-step upstream walk, per-edge bookkeeping, and the `_processStaleVisit` re-entry that terminates at any cached-stale frontier.

### Phase 4: Loose `(repl: any)` callbacks in `CompositeReplacementUpdater` — deferred

Several arrow-callback parameters in `CompositeReplacementUpdater` carry an explicit `(repl: any)` annotation (lines around the `component.replacements!.map(...)` calls and the `(x: unknown) => !x` filter in `EssentialValueWriter`). They survive only because `ComponentInstance.replacements` is loosely typed as `any[]` (with a `!` non-null assertion at each use site). Once `replacements` is tightened to `(ComponentInstance | string)[]` (and `dep.downstreamPrimitives` to a concrete shape), these annotations should drop. Tracking here so the cleanup happens together with the wider `ComponentInstance` typing pass.

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

### Further de-duplication in `StateVariableDefinitionFactory`

The class→module conversion (`core-refactor-18`) preserved three small duplications that are still candidates for follow-up extraction. They pre-date the conversion and were intentionally left alone there to keep the diff scoped to the structural change:

1. **`primaryStateVariableForDefinition` resolution.** The 8-line block that picks `redefineDependencies.substituteForPrimaryStateVariable` → `componentClass.primaryStateVariableForDefinition` → `"value"` and then looks the resulting key up in `stateVariableDefinitions` appears in both `createAdapterStateVariableDefinitions` (~line 333) and `createReferenceShadowStateVariableDefinitions` (~line 515, with an additional `throw` on missing `stateDef`). Extracting `_resolvePrimaryStateVariableForDefinition({ redefineDependencies, componentClass, stateVariableDefinitions, throwIfMissing })` would centralise the precedence rule and the error message.
2. **Attribute-spec → dependency-shape switch.** The four-way branch on `attributeSpecification` (`createPrimitiveOfType` → `attributePrimitive`, `createReferences` → `attributeRefResolutions`, else → `attributeComponent`, plus the two `fallBack*` branches) is structurally identical between `createAttributeStateVariableDefinitions` (~lines 180–196 inside the `returnDependencies` closure) and `createReferenceShadowStateVariableDefinitions` (~lines 452–483 building `thisDependencies`). A small `_buildAttributeValueDependencies(spec, attrName, stateVariableForAttributeValue)` helper that returns the dependency map would consolidate them; the only behavioural difference is the order in which `fallBack*` and the value-source branch are added, which the helper can preserve by returning a map both call sites spread into their own object.
3. **Shadow-variable scan.** Inside `createReferenceShadowStateVariableDefinitions`, the same `for (let varName in targetComponent.state) { if (stateObj.shadowVariable || stateObj.isShadow) stateVariablesToShadow.push(varName); }` loop appears twice — at lines ~650–655 (the prop-variable branch) and again at lines ~733–738 (the no-prop-variable branch). Lifting it into a tiny `_collectShadowVariableNames(targetComponent)` would be one line at each call site.

None of these are urgent; each is a 5–15 line collapse and would land cleanly with no behavioural change.

### Tighten remaining `: any` in `StateVariableDefinitionFactory`

`core-refactor-18` (and the small follow-up review pass) tightened the public destructure shapes (`componentIdx: ComponentIdx`, `prescribedDependencies: Record<string, any[]> | undefined`, `stateVariableDefinitions: Record<string, any>`, etc.) but several inner positions remain `any`:

- `componentClass: any`, `redefineDependencies: any`, and `targetComponent`/`adapterTargetComponent: any` — tightening requires real types for the component-class shape (`createAttributesObject`, `returnNormalizedStateVariableDefinitions`, `primaryStateVariableForDefinition`, `implicitPropReturnsSameType`) and a `RedefineDependencies` discriminated union (`{ linkSource: "adapter" | "referenceShadow"; … }`). Both are bigger pieces of typing work than fits in a tightening pass on this file alone.
- `attributeSpecification: any` in the four `_*Attribute*` helpers — `AttributeDefinition<unknown>` (from `utils/dast/types.ts`) covers most fields, but the runtime additionally reads `noInverse`, `componentStateVariableForAttributeValue`, `fallBackToSourceCompositeStateVariable`, `essentialVarName`, `isLocation`, and (for the inverse path) more. `AttributeDefinition` would need to grow to cover them before the parameter type can be tightened.
- The internal callbacks attached to `stateDef` (e.g. `function ({ dependencyValues, usedDefault, essentialValues }) { … }`) carry implicit-`any` errors. They run in the StateVariableEvaluator's call-time context; tightening would mean importing/exporting the dep-value/usedDefault/essentialValues bag types from the evaluator. Cheap interim fix: explicit `(args: any)` annotations to silence the ~20 implicit-any errors in this file without changing semantics.

## Notes for the next agent

- The applied items in this PR are self-contained — see the diff against the previous commit. The structural deferrals above don't depend on each other except that #1 (typing) makes #2 (stateless→plain) cleaner since the back-reference type would already exist.
- AGENTS.md is the source of truth for project conventions; CLAUDE.md is now a one-line pointer.
- Cypress runs in CI; do not include local Cypress steps in any verification plan.

# Core refactor — remaining work

Forward-looking plan for items that were intentionally deferred during the multi-phase
refactor that extracted helpers from `packages/doenetml-worker-javascript/src/Core.js`
(now `Core.ts`) into `src/core/*.ts`. PRs #1036–#1056 closed the large structural
work; what remains is a mix of (a) typing tightening blocked on upstream type work,
(b) behaviour fixes in untested error paths, (c) a benchmarking-gated unification, and
(d) old TODO/XXX markers lifted verbatim from `Core.js` that were never refactor work
in the first place.

Each section below lists the **scope**, **blocker** (why it isn't done yet), and
**strategy** (concrete next step when someone picks it up).

---

## 1. Tighten typing in `StateVariableDefinitionFactory`

**Scope.** Several inner positions in `src/core/StateVariableDefinitionFactory.ts`
remain `any`:

- `componentClass: any`, `redefineDependencies: any`, `targetComponent`/
  `adapterTargetComponent: any` on the public functions.
- `attributeSpecification: any` in the four `_*Attribute*` helpers.
- The internal callbacks attached to `stateDef` (`function ({ dependencyValues,
  usedDefault, essentialValues }) { … }`) carry ~20 implicit-any errors.

**Blocker.** Tightening requires upstream type work that is bigger than this file:

- A real type for the component-class shape (`createAttributesObject`,
  `returnNormalizedStateVariableDefinitions`, `primaryStateVariableForDefinition`,
  `implicitPropReturnsSameType`).
- A `RedefineDependencies` discriminated union (`{ linkSource: "adapter" |
  "referenceShadow"; … }`).
- Growing `AttributeDefinition<unknown>` (in `utils/dast/types.ts`) to cover the
  fields the runtime additionally reads: `noInverse`,
  `componentStateVariableForAttributeValue`, `fallBackToSourceCompositeStateVariable`,
  `essentialVarName`, `isLocation`, and the inverse-path fields.
- For the `stateDef` callbacks: importing/exporting the dep-value/usedDefault/
  essentialValues bag types from `StateVariableEvaluator`.

**Strategy.** Sequence the upstream work first:

1. Define `ComponentClassShape` in `src/types/` (or extend the existing
   `componentInstance.ts`).
2. Define `RedefineDependencies` as a discriminated union.
3. Extend `AttributeDefinition` with the missing fields.
4. Then thread the new types through `StateVariableDefinitionFactory`'s public
   functions and the four `_*Attribute*` helpers.
5. For the `stateDef` callbacks, factor the bag types out of
   `StateVariableEvaluator` into a shared types module and tighten in one pass.

A cheap interim fix worth doing alone: add explicit `(args: any)` annotations on
the `stateDef` callbacks to silence the ~20 implicit-any errors without changing
semantics. That brings the file's tsc error count down and makes the real
tightening work easier to read against later.

## 2. Loose `(repl: any)` callbacks in `CompositeReplacementUpdater`

**Scope.** Several arrow-callback parameters in
`src/core/CompositeReplacementUpdater.ts` carry an explicit `(repl: any)`
annotation (around the `component.replacements!.map(...)` calls and the
`(x: unknown) => !x` filter in `EssentialValueWriter`). They survive only because
`ComponentInstance.replacements` is loosely typed as `any[]`, with a `!` non-null
assertion at each use site.

**Blocker.** Tightening `ComponentInstance.replacements` to
`(ComponentInstance | string)[]` (and `dep.downstreamPrimitives` to a concrete
shape) is the prerequisite. Doing it scoped just to this file would create
churn that conflicts with the upstream typing pass.

**Strategy.** Land this together with the wider `ComponentInstance` typing pass
(item #1's first prerequisite). Once `replacements` is tightened, the `(repl: any)`
annotations and most of the `!` non-null assertions in this file drop without
behaviour change.

## 3. Shadow-variable scan loop dedup in `StateVariableDefinitionFactory`

**Scope.** Inside `createReferenceShadowStateVariableDefinitions`, the same loop
appears twice:

```ts
for (let varName in targetComponent.state) {
    let stateObj = targetComponent.state[varName];
    if (stateObj.shadowVariable || stateObj.isShadow) {
        stateVariablesToShadow.push(varName);
    }
}
```

at the prop-variable branch (~lines 650–655) and again at the no-prop-variable
branch (~lines 733–738).

**Blocker.** None — this is a 1-line collapse per call site. Left as the third
item of "Further de-duplication" because it pre-dates the class→module
conversion and was scoped out of the de-dup PR (#1056) which only touched
items #1 and #2.

**Strategy.** Lift into `_collectShadowVariableNames(targetComponent)` returning
a `string[]`; both call sites become `stateVariablesToShadow.push(...
_collectShadowVariableNames(targetComponent))`. ~15 lines of code change,
behaviour-preserving.

## 4. Pre-existing exception-leak windows in `CompositeExpander`

**Scope.** Two windows in `src/core/CompositeExpander.ts` where expansion-tracking
state is mutated before async work that may throw:

1. **Parent's unexpanded-composite lists** (`expandCompositeComponent`, around line
   315). The composite is removed from `parent.unexpandedCompositesReady` /
   `unexpandedCompositesNotReady` *before* `createSerializedReplacements` and the
   rest of the async expansion run. If a later `await` throws, the parent's lists
   no longer reflect that the child still needs expansion, and dependency code
   that consults those lists (`Dependencies.js:5208,5212,5281`) will misclassify
   the parent.
2. **`compositesBeingExpanded` push/pop pairing.** The push happens at the top of
   `expandCompositeComponent` (line 313); the matching pop happens in either
   `_finishExpanding(line 425)` (non-shadow path) or inside
   `expandShadowingComposite` at `_finishExpanding(line 704)` (shadow path).
   Any throw between push and pop leaks the entry permanently.
   `Dependencies.resolveItem()` and the circular-shadow checks both consult this
   array, so a single failed expansion can cause later updates to be misclassified
   as circular or in-progress until the worker is recreated.

**Blocker.** Behaviour change for an error path with no forced-throw test. The
only existing test that touches this code (`functionTag.test.ts:7319`) is a
happy-path regression for an error that *was* reachable, not a forced-throw
test. Without coverage, it's impossible to verify the fix doesn't introduce a
new failure mode.

**Strategy.**

1. First write a Vitest test that intentionally triggers an expansion failure
   (e.g. a composite whose `createSerializedReplacements` throws via a
   maliciously-shaped DoenetML), and asserts that subsequent unrelated
   expansions still succeed (proves the leak).
2. Then in `expandCompositeComponent`, wrap the body after the push (line 313)
   in `try`/`finally` that owns the `compositesBeingExpanded` pop via an
   idempotent `indexOf` + `splice` (so it's safe even if the dispatch into
   `expandShadowingComposite`'s own `_finishExpanding` already popped on the
   success path).
3. Defer the parent-list splice (lines 315–328) until after the awaited work
   that can throw — i.e. either move it after the `await
   createAndSetReplacements` or capture the splice positions and restore them
   in the `catch` branch.
4. Remove the inline `_finishExpanding` calls at lines 425 and 704 once the
   `try`/`finally` owns the cleanup.
5. Run the new test plus the existing `functionTag.test.ts` regression to
   confirm the happy path is unchanged.

## 5. Collapse 1-D vs N-D branches of `StateVariableInitializer.initializeArrayStateVariable`

**Scope.** `src/core/StateVariableInitializer.ts:449–797` — the `if
(stateVarObj.numDimensions > 1) { ... } else { ... }` block — duplicates the
per-array plumbing across both branches: `keyToIndex`, `setArrayValue`,
`getArrayValue`, `getAllArrayKeys`, `arrayVarNameFromArrayKey`,
`arrayVarNameFromPropIndex`, and `adjustArrayToNewArraySize`. The 1-D branch is
essentially the N-D branch specialised to `numDimensions === 1`.

A unified implementation that always uses the multi-index path would shed
roughly 80 lines of duplication.

**Blocker.** The 1-D path is hot and has a flatter, faster shape (`Number(key)`
instead of `key.split(",").map(Number)`). Unifying without measuring the
performance impact on array-heavy components risks a silent regression on the
common case.

**Strategy.**

1. Benchmark the 1-D path against the existing array-heavy components
   (`mathList`, `numberList`, `point`'s array entries) under realistic
   document sizes. The package has no existing benchmark harness — this likely
   means setting up a small Vitest `bench` file or using the existing
   `createTestCore` with `performance.now()` brackets.
2. If the perf delta is negligible (<5%), unify on the N-D path and delete the
   1-D specialisation.
3. If the delta is meaningful, keep both branches but extract the shared
   plumbing (the seven functions above) into a helper that both branches
   instantiate, parameterised by the index-decoder function.

## 6. `getAllArrayKeys` defaulting in `StateVariableInitializer.initializeArrayStateVariable`

**Scope.** Three sites in `src/core/StateVariableInitializer.ts` open with
`if (args.arrayKeys === undefined) { args.arrayKeys =
stateVarObj.getAllArrayKeys(args.arraySize); }`.

**Blocker.** Status: deferred indefinitely. Originally proposed as "fold into
`getAllArrayKeys` itself", but that doesn't compose — `getAllArrayKeys` takes
`arraySize`, not `arrayKeys`, so the fold isn't actually possible. A small
mutating helper `_resolveArrayKeysOnArgs(args, stateVarObj)` saves ~6 net lines
and adds an indirection. `??=` would also work but subtly changes the
null/undefined semantics.

**Strategy.** Don't pursue as standalone work. If the file is opened for the
1-D vs N-D unification (item #5), fold the defaulting into a single helper
during that pass while everything is being moved around anyway.

## 7. Audit checklist for `this`-rebinding traps in future extractions

**Scope.** Phase 3 hit two regressions of the same shape (fixed in `caf3033f5`)
that any future mechanical extraction from `Core` will hit again. This is a
checklist to run when reviewing the next extraction PR, not active code work.

**Blocker.** None — this isn't a fix, it's review guidance.

**Strategy.** Move into `AGENTS.md` (or a sibling reviewer's-checklist file) so
it surfaces during PR review of future Core extractions, then remove from this
plan. The checklist itself:

1. **`let core = this;` captures.** Inside the original Core method, `this` is
   Core. Inside the extracted manager method, `this` is the manager — so the
   line must become `let core = this.core;`. A blind copy silently changes
   which object `core` refers to.
2. **`function () {}` callbacks attached to plain objects** (e.g.,
   `stateDef.definition = function (args) { ... this.X(...) ... }`). These are
   call-site-bound by whatever later invokes them — typically Core or a
   state-var machinery object — so `this` inside the body refers to *that*
   call-site object, not the surrounding lexical scope. After extraction, if
   the body uses `this.X()` expecting Core, it still works (the call site is
   unchanged). But if the body was rewritten to use `this.core.X()` during
   extraction (assuming "this is the manager"), it breaks. Leave these bodies
   alone — let `this` resolve at the call site.
3. **`.bind(this)` on wrappers passed by reference** (e.g.,
   `core.foo.bind(this)`). After extraction, `this` is the manager; the bind
   target needs to become `this.core` explicitly.

Quick grep targets when reviewing the next phase: `let core = this`,
`\.bind(this)`, and arrow vs. `function` callback choices on objects assigned
to `stateDef` / `stateVarObj`.

## 8. Carried-over `TODO` / `XXX` / `kludge` markers

**Scope.** Markers lifted verbatim from `Core.js` into the extracted modules
during Phases 2–4. None are blockers — they're unanswered design questions
that have been deferred for years.

**Blocker.** Most of these aren't refactor work; they're domain-design
questions whose answers depend on understanding the original intent. Tackling
them is independent of the structural refactor.

**Strategy.** Don't address as a batch. Each marker should be revisited the
next time someone genuinely needs to change behaviour in that area —
debugging, feature work, or tracing an unrelated bug. The canonical lookup is
`grep -nE "TODO|XXX|kludge" src/core/<file>` since line numbers drift.

The current inventory (for awareness, not as a punch list):

**Phase 2 modules:**

- `ProcessQueue.ts` (~lines 97, 106) — "if skip an update, presumably we
  should call reject???" — skipped queue entries currently never resolve or
  reject, so callers awaiting them hang. Also a commented-out
  `getStateVariableValues` queue branch between `update` and `action` —
  revive or delete.
- `RendererInstructionBuilder.ts` (~lines 91, 253, 275) — change-detection
  pass design questions; deleted-and-recreated-with-same-name guard;
  `rendererType` capture position.
- `ChildMatcher.ts` (~lines 430, 468) — placeholder-adapter vs new
  componentIdx approach.

**Phase 3 modules:**

- `StateVariableInitializer.ts` (~lines 42, 313, 362, 666, 766, 817, 868,
  923, 1449) — alias-handling, array-entry size, dependency-name punning,
  array-entry materialization, public-state-variable-name resolution.
- `StateVariableDefinitionFactory.ts` (~lines 1355, 1451) — array-entry
  definition setup ("how do we make it do this just once?").
- `ComponentBuilder.ts` (~lines 170, 238) — post-creation child-result
  re-derivation.
- `CompositeExpander.ts` (~line 373) — `createSerializedReplacements` retry
  loop infinite-loop concern.

**Phase 4 modules:**

- `EssentialValueWriter.ts` — `executeUpdateStateVariables` post-flush
  composite-expand re-check; `requestComponentChanges` `additionalStateVariableValues`
  guarding; the throw branch in the primitive-child path.
- `StateVariableEvaluator.ts` — the `reprocessAfterEvaluate` "kludge" comment;
  shallow-array-equality check depth; `noChanges`+unresolved-variable
  response; multidimensional-array handling.
- `StalenessPropagator.ts` — decade-old "remove all these error checks to
  speed up process" marker in `processMarkStale`'s validation block.
- `CompositeReplacementUpdater.ts` — `updateCompositeReplacements` carries
  several open questions (evaluate-vs-resolve, infinite-loop, downstream
  dependency removal, `replacementOf` necessity in
  `calculateAllComponentsShadowing`).

---

## Notes for next agent

- **Cypress runs in CI** — do not include local Cypress steps in any
  verification plan.
- **AGENTS.md is the source of truth for project conventions**; CLAUDE.md is a
  one-line pointer.
- **Item dependencies.** #2 (`(repl: any)` callbacks) is blocked on the same
  upstream `ComponentInstance` work that #1 needs. Sequence them together. #5
  (1-D vs N-D) and #6 (`getAllArrayKeys` defaulting) touch the same file —
  fold #6 in if #5 is being done. Everything else is independent.
- **Items intentionally out of this plan.** Wider Core typing (converting
  `ComponentInstance.state`, `dependencies`, etc. to concrete types) is its
  own initiative, not refactor follow-up. The TODO inventory in #8 is awareness,
  not work.

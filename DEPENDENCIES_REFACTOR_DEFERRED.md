# Dependencies refactor — remaining work

Forward-looking plan for items deferred during the multi-PR refactor that split
`packages/doenetml-worker-javascript/src/Dependencies.js` into typed modules
under `src/core/dependencies/`. The structural split (file organisation +
`Dependencies.d.ts` removal) and the initial typing pass (removing every
`// @ts-nocheck` and tightening as far as the surrounding types currently
allow) are done. What remains is a mix of (a) further type tightening that
needs upstream type work first, (b) latent behaviour issues surfaced and
documented in code, and (c) small consistency cleanups.

Each section below lists the **scope**, **blocker**, and **strategy** (the
concrete next step when someone picks it up).

---

## 1. Per-subclass field shapes on `Dependency`

**Scope.** `src/core/dependencies/Dependency.ts` carries an
`[key: string]: any` index signature so subclasses can set their dynamic
per-type fields (`componentIdx`, `parentIdx`, `attributeName`, `staticValue`,
`childIndices`, `componentTypes`, `compositeIdx`, `replacementPrimitives`,
`previousReplacementPrimitives`, `downstreamPrimitives`,
`originalDownstreamVariableNamesByComponent`, …). Every subclass relies on
that escape hatch, which means none of those fields are checked.

**Blocker.** The set of fields a given subclass touches isn't documented
anywhere except by reading the constructor / `setUpParameters` / `getValue`
bodies. Doing this safely needs one walk per subclass.

**Strategy.** Per file in `src/core/dependencies/<topic>Dependencies.ts`:

1. List the fields the subclass reads and writes (search `this.<name>` per
   class).
2. Add the fields as declared properties on the subclass (typed as
   `any` initially is fine; the goal is documentation + autocomplete, not
   exhaustive narrowing).
3. Once a subclass declares all of its fields, remove the inherited
   `[key: string]: any` from `Dependency` for that subclass via a more
   specific shape — or leave the index signature on `Dependency` and rely
   on TS already preferring the declared field type.

Cheap interim win: drop the explicit `let parent: any = ...` / `let
composite: any = ...` annotations in `childDependencies.ts`,
`siblingAndValueDependencies.ts`, and `replacementDependencies.ts` once
`ComponentInstance.activeChildren` and `.replacements` are tightened (see
`CORE_REFACTOR_DEFERRED.md` items #1–#2).

## 2. `getValue` return-type honesty

**Scope.** `Dependency.getValue` declares
`Promise<any>` because subclass overrides return narrower shapes:

- The base returns `{ value, changes, usedDefault }`.
- `DoenetAttributeDependency`, `ExtendingDependency`,
  `AttributePrimitiveDependency`, `ComponentIdentityDependency`, and the
  `getValue` overrides in `replacementDependencies.ts` /
  `childDependencies.ts` / `stateVariableDependencies.ts` all return
  shapes that drop `usedDefault` (callers cope because of falsy checks).

**Blocker.** Tightening to a discriminated union (`Promise<{ value;
changes; usedDefault?: any }>`) is fine for the type, but a few overrides
also wrap `value` in `[]` vs return scalar / `null`, and the
`returnSingleVariableValue` / `returnSingleComponent` flow is still
runtime-only.

**Strategy.** Pick one of:

- **Cheap.** Add `usedDefault?: any` to the base return type and let TS
  permit overrides that omit it. This drops `Promise<any>` to a real shape
  with no source-code changes elsewhere.
- **Right.** Have each subclass return `{ value, changes,
  usedDefault: false }` explicitly so the return type is consistent across
  the hierarchy. Then narrow the base type to
  `Promise<{ value; changes; usedDefault }>`. This costs one line per
  override but removes the `any`.

## 3. `Record<string, any>` / `any[]` on internal handler tables

**Scope.** `DependencyHandler` declares several tables loosely:

- `circularCheckPassed: Record<string, boolean>` — fine.
- `dependencyTypes: Record<string, any>` — values are dependency-class
  constructors; could be `Record<string, DependencyClass>` once the
  registry's `DependencyClass` is exported.
- `resolveBlockers.neededToResolve` and `resolveBlockers.resolveBlockedBy`
  — nested maps; runtime structure is well-known but never declared.
- `attributeRefResolutionDependenciesByReferenced` — `Record<ComponentIdx,
  any>` today.
- `DependencyUpdateTriggers` entries — every field is `Record<…, any>`.

**Blocker.** Each of these is constructed across many call sites, and
narrowing requires walking each writer to confirm the shape. The "needed
to resolve" / "resolve blocked by" tables in particular are constructed
inside `addBlocker` / `deleteFromNeededToResolve` /
`deleteFromResolveBlockedBy` and read across half the file.

**Strategy.** Do one table at a time, each as its own small PR:

1. Pick a table (e.g. `resolveBlockers.neededToResolve`).
2. Define its shape as a named type (e.g.
   `type NeededToResolve = Record<ComponentIdx, Record<TypeBlocked,
   Record<StateVarKey, BlockerCode[]>>>`).
3. Walk every writer and confirm it produces that shape.
4. Walk every reader and adjust the index types it expects.

Items #2–#4 of `CORE_REFACTOR_DEFERRED.md` (the `(repl: any)` /
`ComponentInstance.replacements` work) is a similar shape and should land
first if both are scheduled — the typing on the leaf objects rolls up.

## 4. `: any` on destructured method parameters in `DependencyHandler`

**Scope.** ~25 method parameters in `DependencyHandler.ts` are typed
`: any`:

- `setUpStateVariableDependencies({ ... }: any)`
- `deleteAllDownstreamDependencies({ ... }: any)`
- `deleteAllUpstreamDependencies({ ... }: any)`
- `addBlockersFromChangedStateVariableDependencies({ ... }: any)`
- `addBlockersFromChangedActiveChildren({ parent }: any)`
- `addBlocker({ ... }: any)`
- `processNewlyResolved({ ... }: any)`
- `resolveItem({ ... }: any)`
- `resolveStateVariablesIfReady({ ... }: any)`
- `resolveIfReady({ ... }: any)`
- `getNeededToResolve({ ... }: any)` and the `delete*FromNeededToResolve`
  family
- … plus the matching helpers around `ResolveBlockedBy`.

Each is structured: every caller passes the same field set
(`blockerComponentIdx`, `blockerType`, `componentIdxBlocked`, `typeBlocked`,
…). The argument shape is consistent enough to be a single named type.

**Blocker.** None — this is mechanical, just bulky. The reason it wasn't
done with the initial typing pass is that the union of accepted blocker
types (`stateVariable | componentIdentity | recursiveStateVariable |
expandComposite | recalculateDownstreamComponents | …`) hadn't been
inventoried.

**Strategy.**

1. Define
   `type BlockerInfo = { blockerComponentIdx: ComponentIdx;
   blockerType: BlockerType; blockerStateVariable?: string;
   blockerDependency?: string; … }`.
2. Define `BlockerType` and `TypeBlocked` as string literal unions
   covering every value passed at every call site.
3. Replace `: any` with the typed shape on `addBlocker`,
   `deleteFromNeededToResolve`, `deleteFromResolveBlockedBy`, and the
   `getNeededToResolve` / `getResolveBlockedBy` / `checkIfHaveNeededToResolve`
   helpers.
4. The other methods (`resolveItem`, `resolveIfReady`, etc.) get their
   own argument types in the same pass.

## 5. `StateVariableDescription.indexAliases` is undeclared

**Scope.** `stateVariableDependencies.ts` reads
`stateVarInfo.indexAliases` at runtime, but the `StateVariableDescription`
type in `src/utils/componentInfoObjects.ts` does not declare that field.
Worked around with a local `as any` cast and a comment pointing at this
deferred item.

**Blocker.** None for the type addition itself. A separate audit is needed
to confirm what the runtime shape of `indexAliases` actually is — it's
indexed by dimension number and yields an array of alias-name strings,
but the precise shape (and whether it's always present on array-state
variables) should be confirmed before locking it down.

**Strategy.**

1. Walk every writer of `indexAliases` (component-class definitions in
   `src/components/`).
2. Add the inferred shape to `StateVariableDescription` as
   `indexAliases?: string[][]` (or whatever the audit lands on).
3. Drop the `as any` cast in `stateVariableDependencies.ts`.

## 6. `registry.ts` uses a hand-rolled `DependencyClass` type

**Scope.** `src/core/dependencies/registry.ts` declares its own
constructor-shape type:

```ts
type DependencyClass = (new (args: any) => any) & { dependencyType: string };
```

instead of `typeof Dependency`. The reason: `typeof Dependency` requires
the subclass constructors to accept the strictly-typed
`DependencyHandlerOptions`-shaped argument, but every subclass currently
inherits the constructor unchanged from `Dependency`, and TS reports
"types of construct signatures are incompatible" when several declared
constructor properties differ.

**Blocker.** Same as #1 — once each subclass either declares its own
constructor explicitly with the full typed-args bag, or stops carrying
`[key: string]: any`, the inferred constructor signature aligns with
`Dependency`'s.

**Strategy.** Defer until #1 lands; then drop the local
`DependencyClass` type in favour of `typeof Dependency`.

## 7. `upValuesChangedSub` reference in `recordActualChangeInUpstreamDependencies`

**Scope.** `DependencyHandler.recordActualChangeInUpstreamDependencies`
references an identifier `upValuesChangedSub` that is **not declared**
anywhere in the file. The original JS source had a `Note (dated July 20,
2023)` comment flagging this as suspected dead code that would throw
`ReferenceError` if reached, but all tests still passed. The TS port marks
the three reference sites with `// @ts-expect-error` so the file compiles
without changing behaviour.

**Blocker.** Determining whether the path is genuinely unreachable, vs a
real bug that hasn't fired in production, needs runtime instrumentation:
the path runs only when an upstream variable's `valuesChanged` map has
no entry for the changed `varName` *and* the component carries
`stateVarAliases`.

**Strategy.**

1. Add a temporary `console.warn` (or a counter on `Core.diagnostics`) at
   the entry to the offending block.
2. Run the full test suite + a representative document set; confirm zero
   hits.
3. If clean: delete the dead code (and the `// @ts-expect-error`
   markers). If hit: replace `upValuesChangedSub` with the intended
   variable (likely `upDep.valuesChanged[ind]`) and add a regression
   test.

## 8. `resolveComponentsInPathIndices` accepts but ignores `force`

**Scope.** `refResolutionDependencies.ts` calls
`this.resolveComponentsInPathIndices(composite.refResolution.originalPath,
force)`, but the function never reads its second argument. The TS port
declares the parameter as `_force?: boolean` to compile.

**Blocker.** Whether `force` is supposed to be threaded through to
`this.dependencyHandler.core.resolveItem` calls inside the function isn't
clear from the caller's intent — `force` matters in
`determineDownstreamComponents` for unblocking circular resolution, but
the inner resolve calls don't currently take it.

**Strategy.**

1. Read `RefResolutionDependency.determineDownstreamComponents` to see
   what `force` is supposed to mean at this layer.
2. Either drop the unused argument from every caller, or thread `force`
   into the inner `resolveItem` calls and drop the underscore prefix.

## 9. `core.resolvePath` non-null assertion

**Scope.** `refResolutionDependencies.ts` invokes
`this.dependencyHandler.core.resolvePath!({…})`. `resolvePath` is declared
optional on `Core` (and on `CoreOptions`) because it's set lazily during
initialisation. Every other caller in the codebase already assumes it's
present.

**Blocker.** Tightening Core's type means deciding when in the lifecycle
`resolvePath` is guaranteed to be set, then either:

- Splitting `Core` into a `CoreUninitialised` / `CoreReady` discriminated
  union, or
- Setting `resolvePath` to a no-op default in the constructor and making
  the public field non-optional.

**Strategy.** Take this on with the same pass that addresses items #1–#2
of `CORE_REFACTOR_DEFERRED.md` (wider Core typing). Once the field is
non-optional, drop the `!` here.

## 10. `function () { ... }.bind(this)` → arrow conversions

**Scope.** Two helper closures inside `DependencyHandler` —
`deleteBlockerTypeAndCode` (in `deleteFromNeededToResolve`) and
`deleteTypeAndCodeBlocked` (in `deleteFromResolveBlockedBy`) — were
written as `let foo = function (neededObj) { … }.bind(this);` in the JS
source. The TS port rewrote them as arrow functions so `this` resolves
lexically, and dropped the trailing `.bind(this)`. No behaviour change.

**Strategy.** No follow-up needed — listed here only so reviewers
auditing the diff can see that the change is intentional and runtime-
identical.

---

## Notes for whoever picks this up

- **Sequencing.** Items #1, #5, and #6 cluster — fixing #1 unblocks #6
  and lets #5 simplify. Items #3 and #4 are independent and can be done
  per-table / per-method. Item #7 is its own diagnostic-style task. Item
  #9 follows the wider Core typing initiative.
- **Items intentionally out of this plan.** Wider `ComponentInstance`
  typing, `Core` lifecycle modelling, and the inverse-definition value
  bag types are tracked in `CORE_REFACTOR_DEFERRED.md`. The dependencies
  layer benefits from those as a side effect; we shouldn't duplicate
  that work here.
- **Testing posture.** Targeted tests
  (`copying/extend_references.test.ts`, `copying/external_references.test.ts`,
  `copying/unlinked copy.test.ts`, `baseComponent/baseComponentProperties.test.ts`,
  `answerValidation/symbolicEquality.test.ts`) exercise the dependency
  graph aggressively and ran clean for every step of this refactor.
  Future tightening passes should run that subset locally and let CI
  catch the rest.

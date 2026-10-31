# Testing the principles

This document covers how the suite is organized today, how coupled it is to the current core,
and how to organize, tag and encode the principles. The goals are that a new core can be judged
principle by principle, and that new components are held to the same rules automatically.

Paths: `T/` is `packages/doenetml-worker-javascript/src/test/`.

## 1. What exists today

### Inventory

| Suite | Size | Character |
|---|---|---|
| JS worker Vitest (`T/`) | about 4,985 tests in 233 files | the parity oracle |
| `T/tagSpecific/` | 3,556 tests in 137 files | one file per tag; mixes behavior, math correctness and rendering |
| `T/prefigure/` | about 510 | PreFigure output, i.e. rendering |
| `T/copying/` | 300 | references, extend and copy. Most of the principle-stating files live here |
| `T/diagnostics/` | 155 | errors, warnings, circularity |
| `T/utils/` | 126 | persistence (34), renderer update lanes, internal helpers |
| `T/answerValidation/` | 100 | grading semantics |
| `T/baseComponent/` | 78 | propagation (11), style overrides, commas, and **28 tests of core internals** |
| Rust core | 300 `#[test]` | about 52 name-resolution tests are author-observable, because the JS core uses this resolver; the rest are internal |
| Parser | 197 | `macro-parse` and `normalize-dast` pin author syntax and are core-independent |
| Cypress | 794 tests in 118 specs | almost all rendering and UI; `DocViewer/saveLoadState.cy.js` is the end-to-end reload test |
| Docs examples | about 1,840 ```` ```doenet ```` fences | **none is executed as a test** |

A rough classification of the JS worker suite:

| Class | Tests | Share |
|---|--:|--:|
| (a) author-observable behavior of constructions | ~2,400 | 48% |
| (b) rendering and UI output | ~830 | 17% |
| (c) core internals | ~150 | 3% |
| (d) diagnostics | ~450 | 9% |
| (e) math and feature correctness | ~1,150 | 23% |

The principles in this directory live almost entirely in class (a). Class (e), for example "a
function's derivative is right", is correctness that any core must reproduce, but it is not about
how constructions behave.

### Coupling to the current core

- **Reading state evaluates everything.** Tests read state through
  `core.returnAllStateVariables(false, true)`, which evaluates every state variable of every
  component. It also exposes `activeChildren` and `replacements`. There are 4,927 call sites, and
  35,661 calls to `resolvePathToNodeIdx`.
- **Tests read internal names.** 91 of the 281 state-variable names that tests read are not
  public properties in the schema. That is 954 reads in 66 files; `isNumericOperator` alone has
  324.
- **The cells core's parity run** (PR #2281, `CELLS_CORE_PARITY.md`) passes 563 of 5,302 tests.
  About 1,200 to 1,250 tests (≈23%) fail purely because of coupling. About 750 to 800 of those come
  from three helpers:
  - `getDiagnosticsByType`, which reads `core.core.diagnostics`;
  - `withListEntriesAsComponents` and `rendered-commas`, which read
    `core.core.rendererInstructionBuilder`.

  Two public APIs on the core would turn those into behavioral tests: `diagnostics()`, and a
  normalized rendered-tree query.
- **The parity report is grouped by gap** (missing prop, missing action, …), not by principle. It
  cannot answer "does the new core satisfy every Tier 1 principle?".
- **Cypress tests select by component index.** Most build `#_id_<index>` from an index they
  look up during the test. That is fine within one load, but not across a reload (SAVE-5); PR
  #2364 fixes the one active test that carried indices across `cy.reload()`. Nine selectors
  are hard-coded instead, in `tagSpecific/repeat.cy.js` and `baseComponent/renderCommas.cy.js`.
  All nine are `#_id_0`, the document itself, so they only assume that the document gets index
  0. That is low risk, but it is still an allocation assumption. A core that numbers components
  differently would break them, and looking the document up like any other component would
  remove it.

### Tests that already state a principle
These are the seed of the principles layer. Each has a header comment stating a rule, a table
over forms, or both:
- `T/copying/extend_parity.test.ts`: references × containers, bare against extend.
- `T/copying/context_attributes.test.ts`: 23 reference forms × 5 containers × 3 settings. This is
  the most systematic file in the suite.
- `T/copying/copy_of_extend.test.ts`, `list_extend_attributes.test.ts`,
  `unlinked_copy_reload.test.ts`.
- `T/tagSpecific/compositesInTypedContainers.test.ts`, `conditionalcontent_case_state.test.ts`, and
  the `listcomponent*.test.ts` files.
- `T/baseComponent/compositeCommas.test.tsx`.
- **`T/tagSpecific/rectangle-characterization.test.ts`**, the best model. It has numbered
  invariants I1–I3, each tested in every mode, with the id in the test name, and a header saying
  that a failure "is a signal to investigate … not to rewrite the expectation".

There is **no** test that enumerates components from the schema. Coverage across components is
therefore uneven:
- `fixed` is untested on 7 of 14 graphical shapes;
- `fixLocation` is untested on every shape except point;
- `bindValueTo` has 44 test files for mathInput and none for subsetOfRealsInput;
- reload has no test for fractionInput.

## 2. A principles layer

### 2.1 Layout
```
packages/doenetml-worker-javascript/src/test/principles/
  registry.ts                 # id → { tier, family, statement, docs, exceptions }
  api.ts                      # the black-box API (§2.4)
  NAME.names.test.ts          # one file per family; each it() carries its ids
  REF.extend.test.ts
  CPY.copy.test.ts
  VAL.values-attributes.test.ts
  CTX.inherited-attributes.test.ts
  COMP.composites.test.ts
  INT.inverses.test.ts
  SAVE.reload.test.ts
  ACT.actions.test.ts
  ANS.answers.test.ts
  VAR.variants.test.ts
  generated/                  # schema-driven sweeps (§2.3)
    fixtures.ts               # a minimal instance and a mutation for each component
    exemptions.ts             # a reason for each component that is exempted from a sweep
    every-component.extend-copy.test.ts
    every-graphical.fixed.test.ts
    every-input.bindValueTo.test.ts
    every-interactive.reload.test.ts
    fixture-coverage.test.ts  # fails when a schema component has no fixture and no exemption
```

Use one file per family, not one per id. Families share fixtures, and one file per id would mean
hundreds of tiny files.

`registry.ts` is the machine-readable copy of these documents. A test checks that every id in the
registry appears in a `docs/principles/*.md` file, and the reverse.

### 2.2 Tagging with native Vitest tags
The repository has Vitest 4.1, which supports native tags. In `vite.config.ts`, register every
principle id, plus `tier1`, `tier2`, `tier3`, `internal`, `rendering` and `math`. Strict tags,
which are the default, then turn a typo or an unregistered id into an error.

```ts
it("a copy of an extend pastes what the extend names", { tags: principle("CPY-4") }, async () => { … });
// principle("CPY-4") returns ["CPY-4", "tier2"], reading the tier from registry.ts
```

- **Tag existing tests in place.** Do not move the files. `copy_of_extend.test.ts` simply gains
  `{ tags: principle("CPY-4") }`.
- **Run by principle or tier.** `vitest --tags-filter tier1` or `--tags-filter CPY-4`.
- **Replace the core-specific skips.** Tag census and internal-structure tests `internal`. The
  `describe.skipIf(DOENET_TEST_CORE === "rust")` blocks then become `--tags-filter '!internal'` for
  any alternative core.
- **Seed the `internal` tag mechanically.** It applies to the 40 files that touch `core.core`, the
  66 that read state variables that are not public, and the four files that already use `skipIf`.
- **Keep `@groupN`.** It is only for CI sharding, and is independent of these tags.
- **Group parity reports by principle.** Have `scripts/cells-parity.mjs` (PR #2281) and
  `packages/rust-parity` print a first table "by principle and tier": passed/total for each id,
  and what blocks it. The goal becomes "100% of tier1, ≥ X% of tier2". Untagged tests are shown as
  "unclassified".
- **Mark decided changes.** Tests whose behavior a decision deliberately changes (ADR 0009 bans,
  [decisions.md](decisions.md)) get a `changed:D13`-style tag, so that they count as expected
  failures rather than gaps.

### 2.3 Schema-driven sweeps
`packages/static-assets/src/generated/doenet-schema.json` lists all 269 elements, with their
attributes, public properties and abstract ancestors (`_graphical`, `_input`, `_composite`). CI
already keeps it fresh. Sweeps over it make cross-cutting principles hold for every component,
including components added later:

1. **Every component: extend and copy (REF-1 to REF-4, CPY-1, CPY-3).** For each fixture, write
   `<T name="a" …/>`, `<T extend="$a" name="b"/>` and `<T copy="$a" name="c"/>`, together with the
   source pasted literally. Then:
   - every public property agrees at load and after the fixture's mutation, linked for the extend
     and independent for the copy;
   - the same holds three levels deep;
   - the bare `$a` agrees with the unadorned extend.
2. **Every `_graphical` component, `fixed` and `fixLocation` (CTX-1, CTX-2, CTX-5, CTX-7):**
   - a drag is refused when fixed;
   - a `<graph fixed>` and a `<group fixed>` pass it down, and `fixed="false"` on the item wins;
   - a reference to it is fixed;
   - with `draggable="false"`, a drag is refused but a bound input still moves it.
3. **Every input with `bindValueTo` (INT-1):**
   - binding to a compatible `<math>`, `<number>`, `<text>` or `<boolean>` writes through, and
     the reverse direction updates the input;
   - a fixed target refuses the write and the input snaps back.
4. **Every interactive property (SAVE-1).** Interact, save, then reload with `initialState`; every
   public property equals what it was before. ADR 0016 and 0017 already propose declaring
   interactive props per component. Putting that flag in the schema makes this sweep exact.
5. **Every component: diagnostics depend only on the source** (if ADR 0013 is adopted).
6. **Every single-use child (REF-4a, D25).** For each component with a `<label>`, `<title>`,
   `<caption>` or `<shortDescription>` child group:
   - writing two of them uses the last;
   - adding one inside an `extend` or `copy` replaces the source's.
7. **Every list: a hidden entry (D29; done in #2368 as `listEntryHide.test.ts`).** For each list type (the authored value lists,
   `pointList`, `vectorList`, `sequence`, `sort`, `shuffle`, `collect`, `group asList`), write
   the first entry's source with `hide` and check, under one rule:
   - whether it is drawn and included in text;
   - `$l[1].hide` and `$l[1].hidden`;
   - whether `$l[1]` placed elsewhere is hidden;
   - that indices and values still count it.
8. **Every inherited attribute: one grid.** Run `context_attributes.test.ts`'s 23-form grid for
   `hide`, `disabled` and `styleNumber` too. That makes CTX-7 and CTX-8 explicit.

Each sweep starts out failing for many components. That is intended: each failure is a fixture to
write, an exemption with a reason, or an inconsistency to record in
[decisions.md](decisions.md). The fixture-coverage lint test is what makes "a new component is
tested against the principles" enforceable.

### 2.4 A black-box test API
Principle tests should use only an API that any core can implement:

```ts
const doc = await load(doenetML, { variant, initialState, locale });
doc.value("P.x");                  // a public property, by author path
doc.text("p1");                    // what the reader sees, as text
doc.exists("r[3].q");              // name resolution
await doc.act("P", "move", { x: 3, y: 4 });
await doc.type("mi", "x+1");  await doc.submit("ans");
doc.diagnostics();                 // [{ level, code, path }]
const saved = await doc.save();    // then load(doenetML, { initialState: saved })
doc.rendered("g");                 // optional: a normalized render tree, for (b)-class tests
```

It has no component indices, no `stateValues`, no `activeChildren`, and no component types other
than ones an author writes. Every read is fresh, so tests cannot read a stale snapshot. Implement
it three times: over the JS `PublicDoenetMLCore`, over `test-core-rust.ts`, and over the cells
adapter. An ESLint `no-restricted-imports` rule scoped to `src/test/principles/**` keeps the
layer free of `test-core.ts` and `core.core`.

Do not port all 5,000 tests. In order:
1. Rewrite the three helpers on top of public APIs.
2. Tag the files listed in §1.
3. Write the principle tests through `api.ts`, beginning with the "critical tests" listed at the
   end of each document in this directory and with the coverage gaps listed there.

### 2.5 Marking Tier 3 tests
Every document here ends with a Tier 3 list. Tag those tests `tier3`, with a short reason, rather
than deleting them. They keep guarding main until a new core replaces it, and the parity report
does not count them. The common shapes are:
- census and "which internal component was built" assertions;
- saved-state key formats;
- reuse-versus-rebuild heuristics;
- evaluation-order artifacts;
- unit tests of internal helpers;
- tests that state their own behavior is undesired, such as #246.

## 3. Keeping the principles true as DoenetML grows

- **Design docs.** Each principle has an id, a statement, a tier, examples, exceptions, tests and
  open decisions in this directory. Change the docs in the same PR that changes the behavior.
- **Author docs.** Put the Tier 1 statements, without ids, in the author pages
  (`packages/docs-nextra/content/concepts/`). Today `references.mdx` calls `$p` "the same point"
  and has no section on `extend` versus `copy`, attribute overrides, appended children, or the
  paste rule. The `extend` and `copy` attributes have no description in the schema. A short
  "Reusing content: `$x`, `extend`, `copy`" concept page built from the README's one-page model
  would close that gap.
- **Executable docs examples.** Add an optional fence annotation such as
  ```` ```doenet test="CPY-1" ````, or an expected-values block, plus a Vitest file that loads
  those fences through `api.ts`. Start by asserting "loads without errors" for all ~1,840
  examples.
- **`docs/PR_REVIEW_GUIDELINES.md`.** Add a "Principles" section. Proposed text:
  1. Does the change alter behavior covered by a principle id? The PR names the id. A Tier 1
     change needs a maintainer decision and a changeset.
  2. Is a new component in every applicable sweep, either with a fixture or with a reasoned
     exemption?
  3. Do new tests read only public properties through the black-box API, or carry the
     `internal` tag?
  4. Is a new special case recorded as an exception on its principle, or as an inconsistency in
     `decisions.md`?
- **`AGENTS.md`.** Under "Testing", say where the principles layer is and how to run
  `--tags-filter tier1`. In the steps for adding a component, add: "add a fixture in
  `principles/generated/fixtures.ts`, or an exemption with a reason".
- **CI.** Run `--tags-filter tier1` on every PR as a fast gate. Fail when a schema component has
  no fixture and no exemption, or when a registry id has no tagged test.
- **Guard tests over every class.** `T/baseComponent/essentialMathReload.test.ts` (#2380) is an
  example that already exists. It checks every component class for a property of SAVE-1, a math
  value restored as a math, so that a new component that breaks it fails a test. Sweeps of
  this kind are cheap, and they keep a principle true as components are added.
- **Schema metadata.** Add optional static fields on component classes, emitted into the schema:
  - `interactiveProps`;
  - `principleExemptions: { "CPY-1": "reason" }`.

  The sweeps, the docs and a new core's component definitions can all read them.
- **Housekeeping.** Rename `T/copying/unlinked copy.test.ts` to `unlinked_copy.test.ts`; the space
  breaks shell pipelines and parity grouping.

## 4. Suggested order of work

1. Fix B1 and B2 in [decisions.md](decisions.md). They break a Tier 1 guarantee today.
2. Settle D2, D7, D8, D9, D13, D22 and D23. (D3 and D29 are done: #2367, #2368. D1 is done: #2397.) D30 (identity in events) is checked against
   doenet.org; its fix is #2365. These decide what the Tier 1 author model says.
3. Add `registry.ts`, the tags and the `principle()` helper. Tag the principle-stating files.
   Change the parity scripts to report by principle.
4. Add `diagnostics()` and a rendered-tree query to the public core. Rebase the three coupled
   helpers onto them.
5. Write `api.ts` and the first two sweeps (extend/copy, and graphical `fixed`), along with the
   fixture-coverage lint.
6. Write the concept page for authors, and the PR-review checklist.

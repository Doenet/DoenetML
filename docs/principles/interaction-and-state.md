# Interaction and state: inverses, saved state, actions, answers, variants

Paths: `T/` is `packages/doenetml-worker-javascript/src/test/` and `W/` is
`packages/doenetml-worker-javascript/src/`. Tiers are defined in the [README](README.md).

## How it works today, in one paragraph

An interaction is a request to change one value.
- **Inverting.** The writer (`W/core/EssentialValueWriter.ts:592`) asks that value's inverse
  how to achieve the change. The answer either passes a desired value on to a dependency
  (`setDependency`) or stores it (`setEssentialValue`). The chain stops at stored state, and
  everything downstream is recomputed forward.
- **Refusing.** `fixed`, and `fixLocation` on location variables, refuse requests before they
  are inverted.
- **Committing an input.** An input commits in two steps: `value := immediateValue`, then
  `immediateValue := value` as it actually turned out. The second step is what makes an input
  "snap back".
- **Saving.** Stored values are keyed by a document-derived `stateId` and saved.

---

## 1. Inverse updates and binding

### INT-1: an input shows the value it is bound to; editing it asks that value to change (Tier 1)
`<mathInput bindValueTo="$x"/>`, or an input with a child, shows `$x`. Typing changes `$x` if it
can be changed. Otherwise the input snaps back to `$x`.

The value comes from the first of these that exists: the child, then `bindValueTo`, then the
input's own stored value, with `prefill` as its default.

```xml
<math name="m" fixed>1</math><mathInput bindValueTo="$m"/>   <!-- type 5: shows 1 again -->
<number name="n">3</number><mathInput bindValueTo="$n"/>     <!-- type 5: n = 5 -->
```

Evidence, across every input type:
- `T/tagSpecific/mathinput.test.ts:2350`, `:2565`, `:2152`;
- `booleaninput.test.ts:336`, `:452`, `:484`;
- `textinput.test.ts:594`, `:726`, `:782`;
- `choiceinput.test.ts:1049`;
- `fractioninput.test.ts:198`.

Coverage is uneven: 44 test files exercise `bindValueTo` for mathInput, and **none** for
subsetOfRealsInput.

A failed write is silent. No diagnostic tells the author that a binding only works one way (D15).

### INT-2: a change travels back to what the author or reader set; derived values are never stored (Tier 1 for the effect, Tier 2 for where it is stored)
- `<math>2$n+1</math>` typed to 11 stores `n=5` (**[probe]**). The only saved keys are the
  input and `n`.
- Through a chain of inputs, the change lands on the first input's stored value.

Evidence:
- `T/utils/statePersistenceKeying.test.ts:80` (a drag is saved on the point's `x` and `y`, not on
  the point);
- `T/utils/statePersistenceContents.test.ts:61-129`.

### INT-3: a formula runs backward coordinate by coordinate, when each coordinate depends on one changeable value through `+ − × ÷` by constants (Tier 1 for the common cases, Tier 2 for the edges)
Values that are `fixed` count as constants. In a tuple, only
the coordinates that can be inverted are written.

| Written | Action | Result (**[probe]**) |
|---|---|---|
| `<math>2$n+1</math>` (n=3) | type 11 | n=5; the math shows `2·5+1` |
| `<math>$n^2</math>` | type 16 | snaps back |
| `<math>$a+$b</math>` | type 10 | snaps back: two free values |
| `<math>($a^2,$b)</math>` | type (5,6) | b=6; a is unchanged |
| `<number>$n+1</number>` | type 10 | n=9 |
| `<point>($a+$b,$c)</point>` | drag to (7,8) | c=8; x stays |
| `<vector head="(2$a,$b)"/>` | head to (6,7) | a=3, b=7 |

Code: `W/utils/valueFunctions/math.js:374-457`, `:668-880`.

Evidence:
- `T/tagSpecific/point.test.ts:420`, `:434`, `:448`;
- `mathinput.test.ts:11440`, `:11609`;
- `math.test.ts:3965-4070`, `:12828`;
- `number.test.ts:2315`.

These are point- and math-centric. Vector, line, circle and polygon formulas are barely tested.

Tier 3: that the unsimplified form `2·5+1` is kept after an inverse.

### INT-4: dragging a whole object moves it rigidly, or not at all (Tier 1)
Dragging a whole circle, line or polygon never deforms it. If part of it cannot move, the whole
object stays put (**[probe]**: `<line through="$A $B"/>` with B fixed does not move).

The cells core generalizes this (ADR 0006).

### INT-5: operators that snap a value invert by projecting (Tier 2; not uniform today)
`<round>`, `<floor>`, `<ceil>`, `<clampNumber>`, `<abs>`, `<min>` and `<max>` can be bound to an
input. Today they behave differently (**[probe]**, D15):

| Operator or input | What the source receives |
|---|---|
| `<abs>` | a projected value, losing the sign: −9 typed to 7 gives n = 7 |
| `<round>`, `<floor>`, `<ceil>` | the raw value: n = 3.7 under a round that shows 4 |
| a slider dragged directly | a projected value |
| another input writing into a value a slider is bound to | the raw value |

ADR 0003 says "project, then pass the projected value down" reproduces the current core. That
is true only for a slider dragged directly.

### INT-6: what blocks a change
Each of these refuses a different set of changes, while the component's value still follows its
children and attributes:

| Attribute | Refuses | Tier |
|---|---|---|
| `fixed` | every change pushed into the component | 1 |
| `draggable="false"` | only the reader's direct drag | 1 |

See [inherited-attributes.md](inherited-attributes.md), CTX-1 to CTX-3.

---

## 2. Saved state and reload

### SAVE-1: a reload restores exactly what the reader saw (Tier 2; to authors, "your work is still there")
Evidence:
- `T/utils/statePersistenceContents.test.ts:88`, `:200-336` (a revealed solution, an opened hint,
  a paginator page, a slider, a graph's pan, a code editor);
- `T/tagSpecific/answer.test.ts:10114-10448` (submitted responses of each type);
- `curve.bezier.test.ts:2965` (#2328);
- `conditionalcontent_case_state.test.ts:117`;
- `repeatForSequence.test.ts:1916-2382`;
- `T/copying/unlinked_copy_reload.test.ts`.

The end-to-end form is `packages/test-cypress/cypress/e2e/DocViewer/saveLoadState.cy.js`.

Recent fixes show where the current representation is fragile:
- **Math loses its type through JSON** (#2316, #2321, #2323, #2328). ADR 0017 keeps a kind with
  each entry instead.
- **A restore raced an array's size** (#2328).
- **Restored values are trusted rather than recomputed**, so a restored "just submitted" can be
  stale (#2325).

A rewrite should save only true sources, and recompute everything else.

The guarantee covers what the reader sees and the values that were stored. It does not cover
the core's internal identity for components: a component can come back with a different index
(SAVE-5, #2349).

### SAVE-2: a shadow's state is its source's, and is saved once; only the reader's work is saved (Tier 2)
- `<mathInput extend="$mi"/>` is the same input shown twice. Whichever half the reader types
  into, one entry is saved.
- Exceptions: state a shadow keeps for itself, such as a copied hint's `open` or a shuffled
  choice's `submitted`.

Evidence:
- `T/utils/statePersistenceShadows.test.ts:96-395` (#1974);
- `statePersistenceContents.test.ts:62`, `:79`, `:180` (#1940, the SCORM size budget).

### SAVE-3: saved state is keyed by a document-derived id, not by build order (Tier 2)
Keys look like `/~P@x` (a name path plus an attribute), `<composite>|n` and `|case<i>|`.

Evidence: `T/utils/statePersistenceKeying.test.ts:51-359`, including `:190` "survives an edit
elsewhere in the document".

But the viewer restores only when the document's `cid` matches (`DocViewer.tsx:1204`, #830), so in
production *every* edit throws saved state away. "Survives an edit" is true only in the core.
ADR 0017 proposes carrying state across edits that are safe for every student (D18).

### SAVE-4: hidden or withheld content keeps the reader's work (Tier 1 since #2318)
This covers a repeat that shrinks and grows, a case switched away and back, and a group with
`rendered="false"`. It is in tension with the wording in #2149, "content that a
conditionalContent does not select should behave as though deleted". One statement should be
retired; the one the code now follows is this rule (D18).

### SAVE-5: a component's index is allocation order, and is not guaranteed to stay the same (not a guarantee)
A component's index, and the DOM id `_id_<index>` the viewer builds from it, follow the order in
which the core happens to make components. Nothing promises that order. It can differ:
- **after an edit**, for every component after the change;
- **between two loads of the same document, with only the reader's work changed.** #2349
  (closed as not planned) has an unlinked copy holding `$ci`, a reference to a choiceInput's
  value. On the first load `ci` has no selection when the copy is made, so the copy's list is
  made later. Loaded again with a saved selection, the list is made first, and the components
  after it move (13 → 15, 14 → 16, 15 → 12). Larger documents moved up to 18 of 56
  components;
- **within one session, in a different core.** The cells core reassigns indices whenever a
  structural change, such as a repeat's count changing, rebuilds the document (its ADR 0004).

The reader sees no difference. Values are restored by `stateId` (SAVE-3), so SAVE-1 holds.

**Rule:** anything that must identify a component across a reload, an edit or a rebuild uses
the component's name path or its `stateId`, never its index. Tests look components up again,
by name, after every load.
- `packages/test-cypress/cypress/e2e/variants/specifysinglevariant.cy.js` "replacements of
  composites are not included in generated variant info, reload" carried four input indices
  across `cy.reload()`. PR #2364 changes it to look the inputs up by name after each load.
- The paginator tests that do the same are all `it.skip`.

The index is still exposed outside the core, in two places:
- recorded events name their component by index;
- the viewer's DOM ids are built from it.

Whether those should use a stable key is decision D30.

---

## 3. Actions

### ACT-1: an action acts when clicked or triggered, unless it is disabled (Tier 1)
`<updateValue>`, `<callAction>` and `<triggerSet>` act when clicked, or when triggered in one of
these ways:
- `triggerWhen`, which fires on a false→true *change* only, never at load;
- `triggerWith="$other"`, which follows another action;
- `triggerWhenObjectsClicked` or `triggerWhenObjectsFocused`.

`disabled`, including an inherited one, stops all of these and stops anything chained to them
(#2315).

Evidence:
- `T/tagSpecific/updatevalue.test.ts:1223-3817`;
- `callAction.test.ts:839-2694`;
- `triggerset.test.ts:380-1912`.

### ACT-2: `newValue` is evaluated when the action runs, and changes its target through the target's inverse (Tier 1)
The same rules as INT-3 apply. `<updateValue target="$m" newValue="25"/>`, where `m` is `$n^2`,
silently does nothing. A counter `newValue="$n+1"` clicked twice and then reloaded shows 3
(**[probe]**).

Evidence: `T/tagSpecific/updatevalue.test.ts:272-400`, `:3404`, `:3455`, `:3512`.

### ACT-3: actions run one after another, and each sees the result of the previous one (Tier 2)
- A `<triggerSet>` doing `$n+10`, then `$n+100`, from n=3 gives 113.
- A chain in which `a` doubles n, then `b` and `c` (both `triggerWith="$a"`) do `n+1` and `10n`,
  gives 1 → 2 → 3 → 30 (**[probe]**).

The order of chained actions is the order in which they were registered, which is effectively
document order. No test pins the order of chained actions that hit the same target.

`T/baseComponent/blockerOrder.test.ts` is **not** this guarantee. It tests an internal
scheduling structure.

### ACT-4: a bare `$uv` is the same button; an `extend` or `copy` is a new button that carries no triggers (Tier 2)
Evidence:
- `T/tagSpecific/updatevalue.test.ts:1127` "chained updates, copies don't copy triggers", `:1693`;
- `callAction.test.ts:1243`;
- one click on overlapping objects runs the action once (`updatevalue.test.ts:1464`, `:1550`,
  #2311).

---

## 4. Answers

### ANS-1: credit records the last submission; it is not a live grade (Tier 1 in effect)
If what is correct changes after a submission, the recorded credit does not change. Only "just
submitted" turns false (**[probe]**: the credit stays 1 after the award's value changes, after a
reload, and after a reload into an edited award).

Gradebooks depend on this. ADR 0017 in the cells core instead says "credit derived … the answer
regrades". That needs a decision (D16).

Evidence: `T/tagSpecific/answer.test.ts:5214`, `:4565`, `:4634`, `:7663`, `:7875`, `:4957`,
`:4988`.

### ANS-2: an answer's responses are its inputs; with no inputs, the references inside its awards (Tier 1 for inputs, Tier 2 for the reference rule)
Rules:
- With no input, every *reference* in an award is a potential response (#826).
- `<considerAsResponses>` and `referencesAreResponses` select references explicitly.
- `forAnswer` on an input outside the answer makes it a response (#836).
- A missing entry is an empty response that equals nothing (VAL-5).

Evidence: `answer.test.ts:3583-3947`, `:8892-9232`; the responses section of
`T/copying/value_references.test.ts`.

### ANS-3: `maxNumAttempts` and `disableAfterCorrect` stop submission (Tier 1)
`W/utils/answer.js:846-886`. See CTX-12.

---

## 5. Variants

### VAR-1: the same variant index gives the same selections (Tier 1)
Evidence: `T/variants/specifySingleVariant.test.ts:348-1306`; `uniqueVariants.test.ts`.

### VAR-2: adding content that is not random does not change a variant's selections (Tier 1)
Evidence: `specifySingleVariant.test.ts:1421`. Its own TODO notes that this holds only with
`uniqueVariants` on.

### VAR-3: with unique variants (the default), adding any random component re-maps every variant (current behavior; Tier 3 candidate)
The variant index is spread as a mixed-radix number over all random descendants
(`W/utils/variants.ts:15-56`). **[probe]**: appending a five-way `<selectFromSequence>` *after*
two existing selections changes both of them.

Seeding each random component from (variant index, its stable key) would make additions safe, at
the cost of exact unique-variant enumeration (D17). The exact value tables in
`uniqueVariants.test.ts` are Tier 3 under either choice.

---

## 6. Tests of core internals (Tier 3)

These test the current core's machinery, not DoenetML. A new core should not port them. A few
contain a Tier 2 property worth restating as a black-box test, noted in the table.

| Test | What it covers | Worth keeping as a black-box test |
|---|---|---|
| `T/baseComponent/blockerLedger.test.ts` | resolve-blocker bookkeeping | — |
| `T/baseComponent/blockerOrder.test.ts` | topological fitting, cycle report | — |
| `T/baseComponent/arrayFreshness.test.ts` | `numFreshKeys` | — |
| `T/baseComponent/circularCheckMarks.test.ts` | a data structure | — |
| `T/baseComponent/lazyStateVariables.test.ts` | dependency laziness | `:58` (a write to a value nobody has read works), `:77` (saved state restores into content not yet shown) |
| `T/utils/processQueueExclusive.test.ts` | `runExclusive` | "a save never sees a half-applied update" |
| `T/utils/deferredRendererUpdates.test.ts` | renderer update lanes | "nothing is dropped" (`:507`, `:923`) |
| `T/utils/statePersistenceRace.test.ts` | ticketed saves | "the newest save wins; payload and score pair" |
| `T/perf/*` | census and counts | — |
| key-shape assertions in `statePersistenceKeying.test.ts:80`, `:241`, `:277`, `:359` and `statePersistenceShadows.test.ts:96`, `:163`, `:191` | the format of saved keys | "same document, same keys" and "restores from the source entry alone" |
| `answer.test.ts:5981` | a lazy getter | — |
| `rawRendererValue` strings asserted after a snap-back in `mathinput.test.ts` | renderer protocol text | "shows the bound value" |

## 7. Coverage gaps

- **Reload after typing or dragging:** not tested for most input types (math, text, boolean,
  choice, matrix, fraction), nor for a dragged circle, line, polygon or vector.
- **Formula inversion:** not tested beyond point and math (vector, line, circle and polygon
  formulas).
- **Refusals and conflicts:**
  - no test that a write cannot reach a fixed source through *any* form of reference (D7);
  - no test of a single request writing one source twice (D15).
- **Ordering:** chained actions that hit the same target.
- **Projection operators:** what the source receives under round, floor, ceil, clamp and wrap.
- **Answers:** credit when what is correct changes after a submission.
- **Variants:** VAR-2 with `uniqueVariants` off; inserting a random component.

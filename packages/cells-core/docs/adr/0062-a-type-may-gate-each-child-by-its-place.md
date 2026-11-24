# A type may gate each of its children by its place

Status: proposed 2026-11-24. Settles the open `<cascade>` item of ADR
0058 by the decision the user took there: a declared per-child gate.
Generalizes ADR 0040's decision 1 (a gate is its own declaration), and
follows ADR 0054 (a cascade passes both numbering sequences) and ADR 0009
(what is behind an inactive case is not shown).

A `<cascade>` reveals its steps one at a time, each once the steps before
it are complete. The type declares the gate it sets on each of its
children by its place, from a prop it derives; a step the gate holds back
is, to everything the core reads through a gate, what a child of an
inactive case is: not shown, not scored, not in the text. Numbers count
every step, so they stay put as the steps reveal.

## Context

The current core's cascade (`Cascade.js`, `utils/cascadeStep.js`) works
on its children's positions: `numCompleted`, how many leading steps have
`creditAchievedForProgress` 1 (or have none), says which are shown;
`childrenToHide` hides the rest, but a section or cascade held back
(`childrenToHideChildren`, its `hideChildren`) keeps its heading and hides
what it holds; one `<cascadeMessage>` is shown per gap, the next after the
last step shown, or a held-back step's own when that step is the next.

ADR 0040's `gate: active` gates *all* of a type's children by one 0/1
prop (a case's). Nothing in the core gated one child and not another, nor
hid a child's children while showing the child; and there was no progress
credit apart from `creditAchieved`.

## Decision

1. **A step gate is a declaration.** `gate: Step(numCompleted, revealAll,
   hideFutureSections) { skip: [Title, Setup], message: CascadeMessage,
   headed: [Section, Aside, Proof, Cascade] }` on `<cascade>`
   (`StepGate`, `components/decl.rs`). Its *steps* are its
   component children, looked through the structure (a group, the active
   case of a choice, each iteration of a repeat), but the `skip` types and
   the messages. The step at place k (from 0, counted among the steps in
   the active cases) is there while k ≤ `completed` or `all` is 1, as the
   current core rules. A `headed` step held back keeps its heading unless
   `future` (`hideFutureSections`) is 1; what it holds is behind the gate.
   Every step of a held-back gated type is hidden.

2. **Through a step gate as through a case.** Each walk that looks through
   a case's gate looks through a step's:
   - *Scoring* (`build/expand/aggregate.rs`, mirrored in
     `compile/graph/aggregate.rs`): the build makes each step's gate a cell
     (`Le(place, completed)`, then `Max` with `all`) and multiplies the
     step's weight by it, as a case's `active` multiplies what it holds;
     not when the credit being made is the gated type's own progress, which
     counts every step.
   - *What is shown and the text*: read when asked
     (`Document::revealed`, `document/cascade.rs`), from the gated type's
     three settings and the cases' `active` cells, as the counters and a
     section's full number are (ADR 0044): `Shown`, `Heading` (a held-back
     headed step) or `Hidden`; a text skips a child not shown. The bridge
     records `reveal_reads` as it records `counter_reads`.
   - *Numbering and the counters* count every step: a number stays put as
     the steps reveal. Paths (`document/paths.rs`) reach a held-back step,
     as the current core resolves a hidden component.

3. **A progress credit.** `AggOp::ProgressCredit` over the scored items: a
   section's `creditAchievedForProgress` and a cascade's, the weighted mean
   of their items' progress, as `creditAchieved` is of their credit. An
   item's progress is its credit (an answer's own progress for
   `handGraded`, 1 once answered, waits on the answer machinery's
   `handGraded`, which it lacks). When no item's progress differs from its
   credit, the progress aliases the credit and costs no cell.

4. **`numCompleted` is an aggregate.** `AggOp::Completed` over
   `Collection::Steps`: Σₖ caseₖ · Πⱼ≤ₖ completeⱼ, where a step is complete
   when its progress is 1 (`Eq`), or it holds nothing scored, and a step in
   an inactive case neither counts nor holds the next back. A step's
   progress is its own when it has one (an answer, a section, a cascade),
   else the mean over what it holds. A section that is a step aggregates its
   scores whatever it says (`PlanCtx::is_step`), as the current core's
   `childrenAggregateScores` makes it.

5. **One message per gap,** as the current core chooses it: the held-back
   next step's own messages, when it keeps its heading and has one (a
   nested cascade has one when it would show one of its own); else the
   cascade's own next message after its last step shown, unless the
   cascade is itself held back and not its parent's chosen step. A message
   outside a held-back step or a cascade is not governed.

## Considered options

- **The hiding as the renderer's**, from `numCompleted` alone (ADR 0058's
  second option): no gate in the core, so held-back steps would stay
  scored and in the text. The user chose the gate.
- **A gate cell per step as a rendered prop** for the bridge to read: the
  step's type would carry a prop for every document, a cell where no
  cascade is; the read-when-asked walk costs a cell nowhere and reads only
  outputs (`numCompleted`, `revealAll`, `hideFutureSections`, `active`).
- **Gating the numbering**, as a case's gate does: a step's number would
  change as it is revealed, which the current core's numbers do not.

## Consequences

- `<cascade>` and `<cascadeMessage>` are types; the core names neither
  (the declaration says what a step, a message and a heading are).
- **Scoring differs from the current core's while a step is held back:**
  there a held-back step is scored (a section around a cascade of two
  steps, the first half right, has credit 1/6 there and 1/4 here); here it
  counts once revealed. `cascade.test.ts`'s "a section around a cascade is
  scored on the cascade's steps" and "a cascade nested in a cascade is
  scored on its own steps" read the current core's values at those points.
- A `<p>` step is looked through by the document's credit, where the
  current core's `<p>` aggregates inside a cascade: the same when it holds
  one answer, its answers each counted when it holds several.
- `tests/cascade.rs`, `cascade.spec.rs`; `tests/every_count.rs` checks the
  gates and `numCompleted` against the template graph.

## Migration

- *Done 2026-11-24:* decisions 1 to 5; the wasm `revealed` and
  `reveal_reads`; the bridge draws a cascade as a `div`, leaves out what is
  hidden and a held-back step's content.
- *Open:* `handGraded` (decision 3); `titleColor` and the heading-bar
  colors, the renderer's; a cascade's `recordVisibilityChange`, the
  viewer's.

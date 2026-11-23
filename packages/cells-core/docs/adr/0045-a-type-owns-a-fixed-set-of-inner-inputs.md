# A type owns a fixed set of inner inputs, which its planner wires

Status: proposed 2026-11-23. Builds on ADR 0014 (errors depend only on
the source), ADR 0018 (essential means a student can write it), ADR 0021
(an attribute nothing reads is refused), ADR 0029 (a planner reads no
other element's plan), ADR 0034 (a planner is a function of its record)
and ADR 0038 (the core names no component type); a sized grid of them
follows ADR 0041 (every list is a sequence).

Some inputs are made of inputs: a `<fractionInput>` is a numerator box and
a denominator box, a `<matrixInput>` a grid of boxes. A type declares the
inputs it owns, in order; each is an element of an owned type, planned by
its owner as an answer plans its awards, and the owner's props are wired
from theirs.

## Context

In the current core, `FractionInput.js` holds the value and two
`_fractionInputComponent` children render as math inputs (`rendererType =
"mathInput"`), each reading its part of the value (`part="numerator"`) and
writing it back through the fraction input's inverse. The parser's
normalizer writes those children into the DAST
(`<fractionInput><_fractionInputComponent part="numerator"/>
<_fractionInputComponent part="denominator"/></fractionInput>`), so the
cells core sees them as source elements, of a tag it did not know: the
element's children were content, and a `<fractionInput>` was refused.

The cells core already has elements one element plans for another: an
answer's awards and its implicit input (`compile/stages/plan/answer.rs`),
built on the answer's machinery. A fraction input is not machinery:
everything about it but its two boxes is an ordinary planner's work.

## Decision

1. **A type declares the inputs it owns** (`inner { numerator:
   FractionInputPart, denominator: FractionInputPart }` in its
   `component!` block, `InnerInput`): a fixed list, in order. Each
   entry's type is an owned type (`flags: [owned]`, `owner: FractionInput`)
   whose props are an input's (`interactive`, `rendered`).

2. **The owned inputs are the owner's first children.** An element child
   of an owned inner type (`is_owned_input`) is a component of its owner,
   never content: a type that reads its children (`children: Value`)
   passes over it as over a `<label>`, and outlining builds it. An entry
   the source does not write (a DAST the normalizer did not see) is made
   by outlining, a synthetic element in its place
   (`compile/stages/outline/inner.rs`). An owned input written anywhere
   else is refused, as a free award is.

3. **The owner's planner plans them** through `PlanCtx`:
   `ctx.inner(k)` finds the `k`-th owned input, `ctx.plan_inner(inner,
   wiring)` gives it its plan (an unbound input: its value an essential
   leaf, holding its prefill), and the owner's props read it
   (`Inner::port`) or compute over it (`ctx.inner_quotient`, a fraction's
   `num / den` math cell). Nothing else plans an owned input (ADR 0029:
   the owner writes the plan, it reads none). The owner's props are
   derived; the essential cells are the boxes', which a student types
   into (ADR 0018).

4. **A refused box refuses its owner.** The owner's plan reads its boxes'
   ports by element (`Arg::Elem`); a box refused for an attribute nothing
   reads has no ports, so linking boxes the owner with the box's error
   (`box_elem_readers_of_boxes`), the rule every reader of a box follows.

5. **The renderer draws the boxes.** The bridge sends each owned input as
   the input it is drawn as (`_fractionInputComponent` as a `mathInput`,
   with its renderer actions); where the prototype has no renderer for the
   owner, the owner stands as its children (`TRANSPARENT`).

6. **The owner as an answer's input** reads what its type declares as its
   response (`response: Math(expr)`): the answer's planner wires the
   declared port, not a math input's.

7. **A value bound to the owner is refused for now.** In the current core
   a `bindValueTo` or a `<math>` child binds the fraction's value, and
   the boxes show its decomposition, writing back through it. Here the
   boxes would derive from the bound value and invert onto it, and a bound
   math is numeric in this core (ADR 0005): a number has no numerator.
   `bindValueTo` is not read (so refused, ADR 0021), and a value child is
   refused with that reason.

### A sized grid

A `<matrixInput>`'s boxes are not a fixed set: there is one per entry of a
`numRows` × `numColumns` grid, and the size may be an input. That extends
this decision the way ADR 0041 extends a list: the declaration names one
owned type and a count (`inner { entries: MatrixInputCell * (numRows,
numColumns) }`), and the boxes are a structural sequence laid out by when
the count settles. A literal size settles at load: the boxes are a fixed
set, as here, made by outlining. A size read from a cell is a structural
count (ADR 0041 step 4): the boxes are one template stamped per entry, a
change of size rebuilds, and the owner reads the boxes as the sequence's
items rather than by position. The owner's planner plans the template's
box once; what a box holds across a rebuild is its essential state, keyed
by its entry (ADR 0017).

## Considered options

- **Synthesize the boxes always, ignoring the normalizer's.** The
  normalizer writes them, so their nodes give the boxes a place in the
  source (diagnostics, saved state keyed by node); outlining makes only
  what is missing.
- **The math input type for the boxes.** A box is a math input in every
  way but its planning, and the bridge could send it as one. But a type
  claims its roles once (ADR 0038), a math input is an answer's input and
  reads as a `<math>`, and a free box must be refused: an owned type of
  its own says all of that with the declarations there are.
- **Machinery** (`machinery: FractionInput`), as the answer is: the
  compile would plan the boxes and the fraction alike. But only the boxes
  are not a planner's ordinary work; three `PlanCtx` methods give a
  planner that, and the next owner (a matrix input) reuses them.

## Consequences

- `<fractionInput>`: its value, numerator and denominator, its prefills,
  and as an answer's input, typed into box by box.
- A blank box is a NaN leaf in the fraction (`2/NaN`), where the current
  core shows `2/＿`: the engine has a blank expression, which a NaN math
  leaf does not become today.
- `PlanCtx` grows by three methods and `Inner::port`.

## Migration

1. Done (2026-11-23): `InnerInput` and `inner { .. }`; owned inputs
   outlined as components (`is_owned_input`, `add_inner_inputs`);
   `PlanCtx::inner`, `plan_inner`, `inner_quotient`; `<fractionInput>`
   and `_fractionInputComponent` (`components/inputs/fraction_input.rs`,
   `tests/fraction_input.rs`); the answer wires a declared response port;
   the bridge's `fractionInput` (transparent) and
   `_fractionInputComponent` (a math input) and its action; the test
   adapter's readers and a fraction input's `activeChildren`.
2. Open: a value bound to a fraction input, once a bound math can be
   symbolic; `colorInputsSeparately` and `creditAchievedPerInput`.
3. Open: `<matrixInput>`, a sized grid, with ADR 0041 step 4.

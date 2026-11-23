# A value in a graph is drawn at its anchor, which the compile plans for every type

Status: proposed 2026-11-23. Builds on ADR 0018 (essential means a
student can write it), ADR 0019 (outputs), ADR 0020 (the shared renderer
interface), ADR 0021 (an attribute nothing reads is refused) and ADR 0029
(a planner reads no other element's plan).

A `<math>`, `<number>` or `<text>` placed in a `<graph>` is a label the
graph draws at a point, its **anchor**, which a student may drag. Every
value type the current core anchors has two props for it, `anchorX` and
`anchorY`, which the compile plans from the `anchor` attribute after the
type's own planner runs, whatever that planner is.

## Context

The current core gives each such type an `anchor` state variable
(`returnAnchorAttributes` in `utils/graphical.js`): `anchor="(1,2)"` or
`anchor="$P"`, the origin without one, essential (a drag writes it), with
`positionFromAnchor` and `draggable` for its renderer. The types are the
values and everything built on them: `<math>`, `<number>`, `<text>`,
`<m>`, `<md>`, `<latex>`, the formatted values and every numeric operator.
A boolean has none and is not drawn in a graph.

The cells core had no anchor, so the prototype's renderers left a value
in a graph out (ADR 0020). The types it needs span four families and
both planner kinds: some are planned from their table (`<number>`,
`<abs>`, `<m>`), others by a function (`<math>`, `<text>`, `<sum>`).

## Decision

1. **An anchor is two props of the type's table**, declared `anchorX:
   anchor(0), anchorY: anchor(1)` (`PropFrom::Anchor`): an input a drag
   requests and an output a graph draws, so `interactive` and `rendered`
   by construction. A planner leaves them not given (`Wire::absent`); a
   table plans them so.

2. **The compile plans them for every type, after its planner**
   (`compile/stages/plan/anchor.rs`, beside the hold): the element's own
   `anchor`, a point (`(1,2)`, given values a drag writes, or `$P`, which a
   drag moves, ADR 0006), else under `extend` the referent's, else the
   origin, given. A copy that aliases its referent's props (a bare copy, a
   clone) keeps them. Reading `anchor` accepts it (ADR 0021); on a type
   with no anchor it is refused. `positionFromAnchor` and `draggable`
   are a renderer's, accepted on any type with an anchor
   (`ANCHOR_PRESENTATION_ATTRS`).

3. **Outside a graph an anchor is no state.** Nothing draws or drags a
   value there, so the pass leaves its anchor not given, a constant every
   such anchor shares: one cell per document, no essential cell, no
   instruction (ADR 0019). Whether a graph is above the element is read
   from its template, the element's ancestors and those of the repeat or
   choice the template belongs to. Nor is such an anchor an input of the
   input signature (ADR 0017): an edit that drops a value outside a graph
   loses no student's work. Inside a graph it is one, as a point's
   coordinates are.

4. **A `$ref` child shown as a value** (`$p1.y` in text) has every prop
   of its type, its anchor the missing value: the builder and the
   compile's graph stamp give it as many slots as its type's table.

5. **The bridge sends an anchor wherever there is one, in a graph**
   (`anchorProps`, merged into any element's props): `numericalAnchor`,
   `positionFromAnchor` (`center` by default) and `draggable` (true). A
   drag is the current core's `moveText`, `moveMath` or `moveNumber`, a
   point request on the two anchor cells, for any type with an anchor.
   The prototype draws a value with one as a JSXGraph text, its LaTeX
   typeset.

## Consequences

- Inside a graph, a value's anchor costs two essential cells, as a
  point's coordinates do. The writable census counts them among an
  author's values (six in the golden set, six in `sir.doenet`); none is a
  student's until a drag.
- A choice's interface value (`$cc.x`, where every case has an `x`)
  chooses its anchor among the cases' like every other prop: two
  instructions of no state per such value, live because an input is a
  root wherever it is. Four in the golden set (`choices.doenet`).
- An anchor is an input wherever the component is. Making an input
  depend on where its component is placed would thread placement through
  the writable record, the share keys (ADR 0033) and the refusal
  analysis; the constant anchor outside a graph costs nothing to keep
  instead.

## Considered options

- **An anchor per type in each planner.** Rejected: fourteen of the types
  are planned from their table and the rest by seven planner functions;
  the attribute, the copy rules and the origin would be written in each.
- **Anchors as interactive given values everywhere.** Measured: two
  essential cells for every value in every document, a math in a
  paragraph as much as one in a graph. Rejected for decision 3.
- **The anchor as a component of its own** (a hidden point under the
  value). Rejected: a value's props would no longer be its table's, and
  every copy rule would have to carry a second component.

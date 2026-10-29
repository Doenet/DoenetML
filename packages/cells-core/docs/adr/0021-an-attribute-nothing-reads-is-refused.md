# An attribute nothing reads is refused

Status: accepted 2026-10-29.

An attribute an author writes on an element is accepted only if the core
read it while the document was planned and checked, or a renderer reads
it from the document's literal attributes. Any other attribute is an
error on its element: the element is boxed (ADR 0013), the diagnostic
names the attribute and the tag (`cells-unsupported-attribute`), and the
rest of the document loads. `Dast::attr`, the one way the core looks an
attribute up by name, records each lookup; after a compile and its check
succeed, the check walks the source outside the boxes, boxes every
element with an attribute never looked up, all at once, and compiles
again.

We chose this because an attribute the core ignores is a wrong answer
with no diagnostic, which ADR 0016 already forbids for a combination of
attributes a planner cannot honor ("no silent NaN"). The review against
the DoenetML principles (`docs/principles-alignment.md`) found the core
loading `copy="$P"` as a fresh default point, `<graph fixed>` with
draggable points, and `draggable`, `disabled`, `styleNumber` and
`fixLocation` accepted everywhere and read nowhere. Each is a Tier 1
rule the core does not hold yet; until it does, the author must be told,
and the parity run must count these documents as gaps the core named,
not as wrong values. Recording reads, rather than declaring per type
which attributes are allowed, means the rule holds for every planner
written since, with nothing to keep in step: what a planner reads is
what it supports.

## Considered options

- A declared allowlist per type (the `attributes { .. }` a `Plan` type
  already names, plus its table's). Rejected as the whole rule: a planner
  reads attributes those lists do not name (`compare_attrs` reads an
  award's `symbolicEquality` and its answer's; the repeat planner reads
  `valueName` and `indexName` in `add_elem_inner`), so the list would
  refuse attributes that work until every read was mirrored in it, and
  silently stop refusing when a planner stopped reading one.
- A warning rather than an error. Rejected: the element then renders
  without the attribute's effect, which is the silence the rule removes.
  A document that loads with no errors has none (ADR 0014); an ignored
  attribute is one.
- Refusing one element per compile, as other failures do. Rejected: a
  document with twenty `draggable="false"` would compile and probe
  twenty times more. The unread check knows every offending element, so
  it boxes them in one round.

## Consequences

- The read record lives in the `Dast` (`ReadFlags`, one flag per
  attribute, set through a shared reference), since every lookup goes
  through it. It is never cleared: a `Dast` is made once per load, the
  compile is its only reader, and `LiteralAttrs` keeps what a renderer
  reads.
- A renderer's attributes are declared, not recorded: `PRESENTATION_ATTRS`
  (`components/mod.rs`) for the ones every type may carry
  (`displayDecimals`, `label`, `labelPosition`, `layer`,
  `shortDescription`, `styleNumber`) and a type's `presentation { .. }`
  for one its renderer alone reads (`to` on `<ref>`, `widths` on
  `<sideBySide>`, `height` on `<spreadsheet>`). A renderer that starts
  reading a new attribute declares it in the same change, or the check
  refuses the documents it draws.
- A planner that looks an attribute up only in some configurations (a
  point reads `x` only without `coords`) refuses it in the others, which
  is true: there it does nothing. A planner that wants to accept and
  ignore an attribute reads it and warns (`PlanCtx::warn`).
- What the normalizer makes (`_repeatSetup` and what it holds) is not
  the author's and is skipped.
- Fixtures that carried ignored attributes changed: the golden
  `circles.doenet` and `lines.doenet` wrote `constrainTo` as an attribute,
  which is not one `<point>` has, so their points were unconstrained;
  they now use `<constraints>`, which adds two live instructions to the
  golden census (`tests/live.rs`). `sticky.doenet` loses `filled`, and
  `fixtures/sir.doenet` loses `draggable="false"` on its polylines,
  `columnHeaders` and `margins`; the core read none of them, so no value
  changes.
- The JavaScript worker's parity run on this core will report these
  documents as load errors naming the attribute, in place of values that
  differed. That is the intended reading until the attributes are
  implemented, in the order `docs/principles-alignment.md` §6 gives.

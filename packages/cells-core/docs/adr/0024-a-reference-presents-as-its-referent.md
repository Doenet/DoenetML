# A reference presents as its referent

Status: accepted 2026-10-29.

A reference (`$P`, `<point extend="$P"/>`, a container copy's clone) is
shown as its referent is, unless it says otherwise: its label, and the
display settings a renderer reads from the literal attributes
(`displayDecimals`), are its own when it writes them, else its referent's,
through any chain of references. The component table carries, per
component, the component it is a reference to (`referent`), and the
bridge reads presentation through it. Presentational children, a
`<label>` or a `<shortDescription>`, are components of their element on
every type, which planners pass over; and the children written inside a
container extend come after the referent's, so of a child a component
uses one of, the last one written wins.

We chose this because a reference is the referent itself, shown again
(REF-1 and CTX-11 of the principles, Tier 1: "references and copies show
their source's label unless they set their own"; CTX-10: "display
settings travel with the value"), and because REF-4 says children written
inside an extend are appended after the source's. The cells core had
dropped a container extend's own children (`<p extend="$p">b</p>` showed
only `p`'s content), refused a `<label>` child on a point as an unknown
constraint, which boxed the point and every reference to it, and read a
label or a display setting from the element's own literal attributes
alone, so `$P` of a labelled point had no label and `$n` of a number with
`displayDecimals` showed ten digits (`docs/principles-alignment.md` §3.5
and §3.6).

## Considered options

- Cloning the referent's `<label>` into every reference at compile.
  Rejected: a label is document text the renderer reads, not state, and
  cloning it per reference multiplies components for nothing the core
  computes; a column that says what a reference refers to serves labels,
  display settings and whatever presentation a renderer adds later.
- Keeping presentation out of the core entirely, with the bridge
  deducing a reference from the DAST. Rejected: which component a
  reference resolves to is the build's knowledge (an index, a choice's
  pick), not the source's.

## Consequences

- `ComponentTable::referent` is set wherever the build makes a reference
  (`instance_sources`, `copy_into`); the wasm binding exposes it as a
  column like `parent`, and `CellsTable.attrThrough` and `label` in the
  bridge read through it.
- `Compiler::is_presentation_child` names the presentational children; a
  `Plan` type and a type whose value is its children keep them as child
  components, and the point planner's constraint loop skips them. A
  renderer that draws a type with a label (the prototype's point
  renderer still writes a fixed name) reads `label` the way the inputs'
  contracts do.
- `plan_container_copy` appends the element's own children after the
  clones; `label` and `titleChild` in the bridge take the last child
  (REF-4a, D25).
- Not covered: a `<label>` child's reference (`<label>$n</label>`) is
  compiled as any child's is, but a label with math is drawn as text.

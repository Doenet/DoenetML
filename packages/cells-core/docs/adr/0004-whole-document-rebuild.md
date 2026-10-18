# Structural change rebuilds the whole document inside the tick

When a tick changes a structural cell (a repeat's iteration count), the core
rebuilds the entire document from the retained DAST before the tick returns:
components, cells, program and schedule are all new. Iteration counts and
essential values carry over through stable scope ids and essential keys, so
a point that was dragged keeps its position, and an iteration that
disappears and later reappears returns as it was left. The tick reports
`rebuilt`, and the renderer re-reads the component table.

We chose this because it keeps the one invariant that makes everything else
fast: between structural changes the schedule is fixed and the cell array is
a flat `f64` slice. No incremental graph editing, no tombstones, no
re-scheduling of partial programs. The build compiles each template once and
stamps it per iteration through dense per-scope tables, at about a quarter of
a microsecond per component, so a document with 10,000 iterations (60,000
components) rebuilds in about 16 ms natively; the measured curve is in
`RESULTS.md`.

## Considered options

- Bounded repeats: allocate a declared maximum and mark surplus iterations
  inactive. Rejected: it moves the cost to every tick and every document, and
  authors do not know the maximum.
- Incremental graph edits: append and remove cells and instructions in
  place. Rejected for now: it needs a mutable schedule and free lists in the
  cell array, which is exactly the complexity the architecture avoids. It is
  the fallback if the rebuild curve crosses the budget at sizes that matter.
- Scoped rebuild of only the repeat's subtree. Not needed yet; same fallback.

## Consequences

- Cell indices and component indices move on a rebuild. The renderer keys
  its tree by stable component identity (DAST node plus scope), which the
  component table exposes, so a rebuild is an update pass, not a remount.
- The document retains its DAST and a store of every essential value it has
  ever held (per scope and template slot), both small next to the cell array.
- The scheduler checks whether creation order is already a valid evaluation
  order before sorting; for stamped templates it almost always is.
- A count that depends on cells inside its own repeat cannot settle; the
  build gives up after eight passes with an error rather than looping.
- A value-sized array elsewhere in Doenet (solutions of an equation,
  extrema of a function) is the same mechanism: its count is a structural
  cell whose producer happens to be a symbolic evaluation.

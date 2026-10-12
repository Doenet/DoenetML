# `<math>` lowers to operators when its leaves are numeric

Revised by ADR 0008: symbolic rewriting now runs inside a tick. Lowering is unchanged.

A `<math>` whose leaves are all number literals or references to numeric
cells is turned into ordinary operators at build time (`3$a + 2` becomes
`Scale` then `Offset`), exactly as if the author had written the chain by
hand; it has no expression at tick time and inverts through the lowered
operators like any other derived cell. A `<math>` with a free symbol becomes
a *math cell*: a fixed cell holding a handle into the expression arena, with
a derived `value` of NaN and an `expr` that an `<evaluate>` can apply to a
number. The decision is made once, from the leaf kinds, never from runtime
values.

We chose this because it removes the question in the brief of whether
authors should mark a math as "for computation" or "symbolic": the core can
tell. It also keeps symbolic work out of the tick entirely. Expressions are
built when the document is built; a tick only evaluates them, and only
where an `Evaluate` or `EvalAt` instruction asks. The measured cost of a
chain of `<math>` elements equals the same chain of `<op>` elements.

## Considered options

- Evaluate every math at tick time through the expression library (what
  the current core does for `<number>` with math children). Rejected: it
  makes the most common case, arithmetic on numbers, pay for a tree walk and
  loses inversion.
- A tag-level distinction (`<math>` versus a computational variant).
  Rejected: it asks authors for information the build already has.
- Lower dynamically when an expression happens to be numeric at runtime.
  Rejected: the schedule is fixed between structural changes, so the shape
  of the program cannot depend on values.

## Consequences

- A reference to a lowered math inside another math is a cell leaf, not a
  copy of its tree; `$m + y` with numeric `m` is `cell + y`.
- The expression's cell leaves are explicit inputs of the `Evaluate`
  instruction, so scheduling and dirty tracking see them.
- Symbolic inverses are out of scope; a request on an evaluated cell is
  dropped. A real expression library would add them as operator inverses.
- The hand parser here covers `+ - * / ^`, parentheses and juxtaposition,
  and the calls `round`, `floor`, `min`, `max` and `clamp` (number bounds),
  each lowered to its operator; a symbolic math may not use them.
  The real parser lives with the future Rust expression library; the arena
  interface (flat nodes, cell leaves, evaluate, substitute) is what the core
  needs from it.

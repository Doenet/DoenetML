# Symbolic instructions run inside a tick, dirty-gated

Revises ADR 0005, which said a tick only evaluates expressions and never
rewrites them. Lowering stays: an all-numeric `<math>` still becomes
operators. A math cell may now be essential (a `mathInput`'s expression) or
derived. Simplify, expand, substitute, derivative, evaluate and equals are
instructions in the ordinary program and schedule, and they write new
expressions into the arena during a tick. A symbolic instruction runs only
when one of its inputs changed. A numeric leaf that changes is substituted,
and the instruction reruns, matching the current core's behavior. Plan 5
(`docs/history/plan-5.md`) chose this before building.

## Considered options

- **A new expression is a structural change, so it goes through a rebuild.**
  Rejected because every keystroke in a mathInput would cost a whole-document
  rebuild.
- **Rewrite only at build time or on an explicit commit (Enter, submit).**
  Rejected because it bakes a UI habit of the current core into the core.
- **Keep cell leaves symbolic during simplify**, so `$n x + 2x` becomes
  `(n+2)x` once and a tick only folds numbers. It is deferred, not rejected.
  It is an optimization with edge cases (`n = -2` shows `0x`), and it is
  listed in Plan 5's classification table.

## Consequences

- The arena grows during a session. Plan 5 measures that growth before any
  reclamation is built.
- Math cells need a change test for gating. A hash-consed arena gets one for
  free (equal handles), which is one of the things Plan 5 compares.

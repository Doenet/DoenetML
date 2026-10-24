# Idempotent operators invert by projection

An operator that is idempotent (Round, Floor, Clamp, and compositions of them
such as a slider's snap-to-step) inverts a requested output value by applying
itself to that value and passing the result down to its input. A request for
3.7 on a Round output asks the input to become 4. A request outside a Clamp's
range asks the input to become the nearer bound.

We chose this because it reproduces what the current core does for a slider
with `bindValueTo`: the bound component receives the snapped value, not the
raw one. It also keeps inversion local and value-only: no new request outcome
("adjusted") and no component-specific inverse code.

## Considered options

- Identity inverse, with the forward pass re-applying the operator. This is
  what the prototype's `Clamp` did. Rejected: the essential cell beneath the
  operator receives the raw value, so a numberInput bound to a slider would
  show 3.7 while the slider shows 4, which disagrees with Doenet.
- A reported "adjusted request" outcome alongside "dropped". Rejected: the
  renderer already reads the cell's final value after the tick, so the
  adjustment is visible without a new outcome type.

## Consequences

- The rule "idempotent operators invert by projecting" is uniform; adding such
  an operator needs no inverse design.
- An inverse can still reject a request on domain grounds (a non-integer ask
  on a cell that must hold an integer), which uses the existing dropped-request
  path.
- Where two projections sit in one chain (a slider bound to a slider with a
  different step), the lower one wins for the stored value and the upper one
  re-snaps for display; this is the same as the current core.

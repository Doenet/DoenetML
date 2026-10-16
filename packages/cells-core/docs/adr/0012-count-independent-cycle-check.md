---
status: proposed
---

# Cycles are rejected for every iteration count, not the count at load

The cycle check runs on the template graph with every indexed reference
assumed to land on a real iteration, so a document that is acyclic at the
count the author tested but cyclic at a count a student can reach is
rejected at load. A count that reads a cell inside its own iterations is
rejected at load for the same reason, instead of failing after eight
rebuild passes. Today the only check is the topological sort of the stamped
graph (ADR 0004), and an indexed reference past the current count has no
edge at all because it resolves to the missing referent; the three documents
under Outcome load cleanly and then wedge on a student's second interaction.

We chose this because a rebuild happens inside a tick, where there is no
author to read the error (ADR 0004). A failed rebuild leaves the old
structure in place but the essential write has landed, so the input shows
the new count while the old iterations remain and every later structural
tick fails the same way. The author cannot be asked to test every count.
The template graph has one node per template slot rather than per
iteration, so the check costs a small fraction of one build pass and runs
once, since rebuilds change counts but never templates.

## The check

- Nodes are template slots (one per prop of one element in a template) and
  document-level slots.
- An edge from a slot inside a repeat to a slot in the same repeat carries
  the index offset the reference was written with: `$r[$i-2].x` is minus
  two, a bare `$x` is zero. A reference from outside the repeat to a literal
  index (`$r[2].x`) is an edge to the template slot, as is a reference from
  inside the repeat out to a document-level slot. Neither carries an
  offset.
- A loop is a cycle if its offsets sum to zero. A loop whose offsets do not
  sum to zero is a recurrence marching through the iterations and remains
  legal, so the lagged recurrence tests in `tests/repeat.rs` keep passing.
- Only loops whose total is zero for some count up to the repeat's cap
  count; in practice every zero-sum loop qualifies, since a cap of two
  already fits an offset of plus one and minus one.
- A count whose slot reaches a slot inside its own iterations is a cycle.
  `Structure::repeat_cross_reads` already walks the count's inputs and
  skips the repeat's own scopes (`o != ri`); the self-read becomes
  `Error::Cycle` naming the repeat.

## Considered options

- Keep the stamped-graph check and report a failed rebuild as a tick error.
  This is what exists. Rejected: the student, not the author, sees the
  error, and the document is left with an input value its structure does
  not match.
- Check the stamped graph at every count up to the cap at load. Rejected:
  a cap of ten thousand means ten thousand builds, and a document with two
  repeats needs their product.
- Roll back the essential write when a rebuild fails, so the document stays
  consistent. Not enough on its own: the student still cannot reach the
  count, with no explanation. Worth doing as well; it is the subject of a
  separate change.
- Let a missing referent break a loop, as it does now, but warn when an
  index could ever be in range. Rejected: a warning at load is read by the
  same author who did not test that count.

## Consequences

- A document that is acyclic only because an index is always out of range
  is rejected. No fixture or golden document relies on this.
- The lagged recurrence `x[i] = f(x[i-1])` stays legal; the two-sided
  neighbor form `x[i] = x[i-1] + x[i+1]` becomes a load error at any count,
  where today it loads at count one.
- Reactive choices are unaffected: every branch is built and a flip is an
  ordinary tick (ADR 0009). Load-time choices fix the graph per seed, so a
  cycle inside one option is still caught at load, for the students who
  draw it; checking every option is a separate question.
- Dynamic indices (`$r[$k]`) remain rejected at compile time. Admitting
  them would make every loop through such an edge a cycle, since its
  offset is unknown; that is a decision for when they are wanted.
- `CONTEXT.md`: a cycle is rejected at load time for every iteration
  count, never only the count at load.

## Outcome

Probed against the core on 2026-10-16, before the change. Each loads and
then fails on the first structural tick:

```xml
<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n"><number name="x">$y</number></repeatForSequence>
<number name="y">$r[2].x</number>
```

Setting `n` to 2: `dependency cycle involving component 'y.value'`, the
input holds 2, one iteration remains, and every later tick on `n` fails.

```xml
<repeatForSequence name="r" length="$n" indexName="i">
  <number name="x">$r[$i-1].x + $r[$i+1].x</number>
</repeatForSequence>
```

Setting `n` to 2: the same cycle error.

```xml
<graph><repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence></graph>
<boolean name="b">$r[2].p.x > 0</boolean><number name="k">2 - $b</number>
```

Dragging point 2 to x = 1: `document structure did not settle after 8
rebuilds`. The count reads its own iteration 2, which exists only while
the count is 2.

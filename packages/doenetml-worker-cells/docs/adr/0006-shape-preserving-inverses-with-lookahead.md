# Shapes keep their shape through point groups on requests, not through instructions

A whole-shape drag is a *point group*: the renderer asks for several points
at once (`Document::request_points`), and an inverse that moves several
points (a circle's center or radius) produces one too. Before the request
engine queues a group it asks what each point would actually become, by
inverting the group on a scratch copy of the cells and evaluating forward,
writing nothing (`Program::realize`). If a strict subset of the points is
held back, all by the same shift, the shift is applied to the rest, so a line
dragged against a grid-snapped point stays parallel to itself and a circle
keeps its radius. That is the only context an inverse ever gets: realized
values of points requested together, inside the same tick.

A free line, segment or polygon therefore has no instruction of its own: its
point cells alias the points' cells, and a vertex defined from its siblings
is an ordinary dependency, not a cycle. A `rigid` polygon is the exception:
the document asks for the coupling, so one identity instruction owns its
vertices and its inverse projects the requested change onto a rigid motion
or similarity, extending ADR 0003 from scalar to vector projection.

## Considered options

- A second pass in an action layer or in the core (compare after the tick,
  re-request), which is how the current core does it. Rejected: it is the
  mechanism this round set out to avoid, and it makes a drag cost two ticks.
- One identity instruction per free shape, with the equal-shift rule inside
  its inverse. Built first; rejected because the instruction couples every
  output to every input, so a shape whose own vertex refers to another of
  its vertices became a dependency cycle (seven of the current core's tests).
- Per-point identity instructions tagged with a group id, gathered by the
  engine. Equivalent in behavior to the chosen option with one more concept;
  rejected as the larger core.
- Declaring constraints so a shape inverse could compose them. Rejected as
  lookahead with more machinery: a chain from a derived cell to its essential
  cell is already a function the core can evaluate.

## Consequences

- Shape preservation is a property of the interaction, not of the document:
  the same two point requests sent as scalars move only what they name. The
  document's essential set and reference integrity are unchanged either way.
- The hard part of an inverse (make the requested cell equal the value) never
  needs context; the soft part (keep what was dragged together together)
  needs realized sibling values and nothing from earlier ticks.
- Lookahead costs one inversion of the group plus a copy of the cell array,
  about a tenth of a tick at 160,000 cells; a dirty overlay would make it
  proportional to the group if that ever mattered.
- When two requests in one group or tick reach one essential cell, the later
  one wins, as everywhere in this core; the current core keeps the first.

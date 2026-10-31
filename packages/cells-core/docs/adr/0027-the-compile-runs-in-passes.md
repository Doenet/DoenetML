# The compile runs in passes, each reading only what earlier passes finished

Status: proposed 2026-10-30. Every migration step is done. Amended
2026-10-30: pass 3 plans on demand rather than from a graph made first
(see "The rule for pass 3"), and pass 2 is part of pass 3 (see "Pass 2").
ADR 0029 replaces the rule for pass 3: no planner reads another element's
plan.

The compile (ADR 0015) becomes five passes over the source, run once
each, in a fixed order. A pass reads only what earlier passes finished,
never what the same pass is still making; within a pass the work is
independent, so every error a pass can find it finds at once, and records
it where it arises rather than restarting the compile.

| Pass | Reads | Makes | Errors it finds |
|---|---|---|---|
| **1. Shape** | the DAST | element types, templates, the name table, container copies expanded | unknown tags, duplicate names, extends that name nothing, lint findings |
| **2. References** | shape | a `RefPlan` for every `$ref` and every `extend` (planned within pass 3: see "Pass 2") | unknown or ambiguous names, bad paths |
| **3. Plans** | shape, references | every element's `Source`s and hold, each after the plans it reads | every planner's errors and warnings, then unread attributes (ADR 0021) |
| **4. Finish** | every plan | choice interfaces, arity, keys, slot offsets | a choice interface a reference misuses, a misbound operator |
| **5. Probe** | the whole `Compiled` | cycles, writable and live records, structural depth | dependency and structural cycles, what only a build sees |

An element that fails is boxed (ADR 0013) where it fails and **keeps its
name**. A reference to a boxed element resolves, and reads an undefined
value of what the reader expects, with no diagnostic of its own: the box's
error is its explanation (`Source::undefined` takes the box's `Warned`).
An extend of a boxed element is boxed in turn, its diagnostic naming the
referent's box as its cause; because pass 3 plans a referent before what
reads its plan, the referent is boxed before the extend is planned, in
the same pass.

We chose this because the compile today does not know what it knows until
the end, and learns the rest by trial and restart:

- **The element set is not fixed until planning ends.** Planning a
  container copy adds elements, so `compile_all` loops over
  `pending_elems` and `pending_macros` until neither grows.
- **Planning order is the document's order, not the order of what reads
  what.** `plan_with_extend` reads its referent's shared state from
  `Compiler::shared_state` with `unwrap_or_default`, and that entry exists
  only once the referent is planned. `<point name="Q" extend="$P" y="5"/>`
  written before `<point name="P" x="1" y="2"/>` does not share `x` with
  `P`: a request setting `Q.x` to 7 leaves `P.x` at 1, where the same two
  elements in the other order move both. No diagnostic says so.
  `inline_math` already works around the same hazard by planning a later
  `<math>` ahead of its turn; the rule should be the compile's, not each
  reader's.
- **Every failure restarts everything.** `plan_and_check` boxes one
  element per failure, then plans and probes the whole document again.
- **Boxes cascade.** A boxed element has no name, so every reference to it
  is an unknown reference, which boxes its reader on the next round. With
  only `P` wrong,

  ```
  <point name="P" bogus="1"/><number name="n">$P.x</number><p>$n</p>
  ```

  reports `bogus` on `<point>`, then `unknown reference '$P'`, then
  `unknown reference '$n'`: three compiles and probes, two errors that are
  false (`$P` names an element the author wrote). The language server,
  which sees documents mid-edit, sees this most.
- **The unread-attribute rule leans on order.** `ReadFlags` persist across
  attempts so a later attempt does not forget earlier reads, and lint must
  run after the check, since its own lookups (`decorative`, `label`,
  `labelIsName`) go through `Dast::attr` and would count as reads.

A build never reads an attribute (`build/` looks one up only in its test
fixtures), so every read ADR 0021 counts happens in passes 1 to 3, and the
rule can run at the end of pass 3 rather than after the probe.

## The rule for pass 3

A planner reads another element's plan only through one accessor,
`Compiler::planned_elem`, which plans that element first when it is not
planned yet. What reads only an element's type, body or children (a
reference's path, an extend's referent type) reads through
`settled_elem`, which does the same for the elements whose planning
changes those: a `<math>` (a tuple may become a point), a `<collect>` or
`<polyline>` (which become collects), a `<pointList>` (which may extend
a list) and a container copy (which gets its clones). So every element
is planned after the plans it reads, whatever the document's order: an
extend reads its referent's (shared state, its attributes as the
referent binds them, ADR 0023); a math that inlines another reads that
math's; whatever reads an element's settled type reads that element's.

An element reached again while it is being planned is in a loop of
plans, an error on that element (`Error::Cycle`), since the loop has no
order to be planned in. Reading another element's *values* is no read
of its plan: `<point name="a" x="$b.x"/><point name="b" x="$a.x"/>`
plans in any order, and its cycle is the build's to report, as before.
Inlining is the one read that may fail softly: a math already being
planned, or one that fails, is left a cell (two maths naming each other
are a cycle of values).

Reads of another element's *source* (an answer's planner reading an
award's `symbolicEquality`, ADR 0021's example) need no order: the source
is pass 1's.

This amends the rule as first proposed, which built a graph of *reads
the plan of* from pass 2's plans before any element was planned, sorted
it, and asserted in the accessor that the graph had predicted every
read. An element's planning follows references from its own attributes
and content, its referent's attributes (ADR 0023), an ancestor's
`fixed` (ADR 0022) and the `<when>`s under an answer, so the graph would
have to predict each of these: too few edges and a document trips the
assertion, too many and a cycle of values becomes a false loop of plans.
Planning on demand through the accessor reaches the same order with
nothing to predict, and the accessor is still the one place a read of
another element's plan happens.

## Pass 2

References are planned within pass 3, each when the planner that needs
it asks (`Compiler::plan_ref`), not in a pass of their own before it. A
path's plan reads the planned types of what it passes through: `$m.x`
names a coordinate only once `<math name="m">(3, 4)</math>` is planned
as a point, and a math's type can depend on what it references. And a
planner chooses where a reference is bound: the referent's scope for an
inherited attribute (ADR 0023), an ancestor's for `fixed` (ADR 0022), a
submitted response for `$mi` under an answer. A pass made before pass 3
could plan only part of the references and would leave the rest to
pass 3 anyway. The extends of container copies, which pass 1 needs, are
planned there, from the name table alone. ADR 0029 adds a pass 2 for the references
inside `<math>` text: each math is parsed once, after pass 1, its type
being pass 1's.

## Considered options

- **Keep the restart loop and fix order bugs as found.** Rejected: the
  extend bug is one instance of a hazard every planner that reads another
  element has, and the loop is what makes boxes cascade. Each fix would be
  local and the hazard global.
- **Box many elements per round but keep restarting.** Better than one per
  round, and the cheapest change, but a box still hides its name, so its
  readers still fail a round later. Keeping the name is what stops the
  cascade; batching only shortens it.
- **Check attributes against a declared list in pass 1.** ADR 0021
  considered this and rejected it: planners read attributes no list names
  (`valueName` and `indexName` in `add_elem_inner`, `symbolicEquality` in
  `compare_attrs`), and a list kept in step by hand stops refusing when a
  planner stops reading. That still holds. This ADR keeps recorded reads
  and only moves the check to where every read has happened.
- **Plan elements in parallel.** Pass 3's independent elements could be,
  but `Compiler`'s tables (the expression arena, `refs`, `shared_state`)
  are shared and would need splitting into per-element parts and a merge.
  Not chosen for its own sake: the probe, not planning, is the expensive
  pass, and this ADR runs it once. The pass structure allows it later.
- **Make the probe a separate checker.** Rejected: the probe is a real
  build through a view that stands for every count and pick (ADR 0012,
  ADR 0014), so what it rejects is what a build would do, with no second
  model to keep in step. It stays the last pass.

## Consequences

- Every diagnostic is still a function of the source alone (ADR 0014),
  and `diagnose` still equals what a load reports. Passes that collect
  several errors at once sort them by node, as `diagnostics::sort` does
  now, so the list does not depend on the order work ran in.
- A document with *n* independent errors compiles once, not *n* + 1 times.
  The probe may still find an error passes 1 to 4 cannot (a cycle has no
  element to box and fails the load, as now; an element that fails only in
  the probe is boxed and the probe runs again). That retry remains, and is
  the only one.
- The unread-attribute check boxes what it finds and replans pass 3 once:
  a box keeps its name, and read flags are not cleared, so replanning
  cannot make another attribute unread. Lint reads attributes through a
  lookup that records nothing (`Dast::attr_peek`), so it may run in any
  pass, and does in pass 1.
- `pending_elems`, `pending_macros`, the `planned` set's use as a guard
  against early planning, `fail_at`'s choice of the innermost failure and
  the read flags' survival across attempts are no longer needed.
- `ComponentType::Error` gains a name, and a reference to it a defined
  reading: every reader that matches on a referent's type handles `Error`
  as "undefined of what I expect". Its props stay empty, and a build never
  emits it.
- A renderer sees a reference to a box as undefined, where it now sees a
  box of its own. The diagnostics list gets shorter by the false errors;
  parity counts against the JavaScript worker may move for documents with
  errors.

## Migration

Each step lands alone, with the golden diff unchanged except where a step
says otherwise.

1. **Plan in dependency order.** Add `planned_elem` and `settled_elem`,
   route every read of another element's plan through them, and make a
   re-entry a cycle error. Fixes the extend bug above, and a reference
   into a later `<math>` that reads its settled type (`$m.x` of a tuple
   that becomes a point). Done: `tests/plan_order.rs` loads documents in
   every rotation and the reverse of their siblings to the same values
   and diagnostics.
2. **Boxes keep their names.** `push_error_elem` keeps the node's name;
   resolution and planning treat an `Error` referent as undefined; an
   extend of a box is boxed with a cause. Removes the cascade. Tests: the
   three-error document above reports one error; any expectation in
   `tests/diagnostics.rs` or `tests/load_errors.rs` that lists a cascaded
   error loses it. Done. What reads a referent's type to plan (an extend,
   `<constrainTo>`, `<functionIterates function>`) is boxed with
   `cells-boxed-referent`; a reference reads undefined, the build
   resolving a box as it does a missing index. A path through a box ends
   at it, so the box's descendants' names (`$g.A` of a boxed `g`) read
   undefined too, while a bare `$A` of a descendant is still unknown,
   since a box has no children. A box for a duplicate name stays unnamed.
   The golden diff changes only by a box's path, now its name.
3. **Lint reads without recording.** Add `Dast::attr_peek`, use it in
   `lint.rs`, and run lint first.
4. **Collect pass 3's errors in place.** A planner's failure boxes its
   element and planning continues; `plan_and_check` loops only on probe
   failures. Move the unread-attribute check to the end of pass 3. Done,
   for passes 1 and 3: an element that fails in either, and a `$ref` that
   cannot be planned, is boxed in place (`Compiler::box_in_place`), and
   what is under it (its children, its repeats' and choices' templates)
   is marked dead and never built; a reference to it reads undefined. A
   failure is still boxed by compiling again when it cannot be boxed in
   place: something already planned or cloned what is under it, it has no
   node (a clone), or it is pass 4's (a branch interface, a misbound
   operator), which other elements' plans may already name.
   `tests/diagnostics.rs` checks that four independent errors take one
   plan.
5. **Expand container copies in pass 1.** The riskiest step: a copy's
   referent must be found from the name table alone, and copies of copies
   expanded in extend order. A copy whose referent is reached through an
   index or another template is refused today (`plan_with_extend`); it
   stays refused. Removes the pending loop. Done: the copies are
   expanded once the walk is done (`expand_container_copies`), a copy of
   a copy, or a copy among a referent's children, after its referent; a
   copy reached again while it expands (one inside its own referent) is
   a cycle. Since nothing is planned yet, a clone of a `<math>` takes its
   type when the clone is planned, and a `<collect>` or `<polyline>`
   under a copied container is refused by its type.
6. **Split passes 2 and 4 out of `compile_all`** into functions of their
   inputs, so each pass's reads are the arguments it is given. Done for
   pass 4: `compile/finish.rs` runs it over the plans, the source, the
   name table (`NameTable`, pass 1's) and the shared state. Pass 2 stays
   within pass 3 (see "Pass 2").

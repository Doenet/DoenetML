# Every read across elements is a fact of a declared kind

Status: proposed 2026-11-23. Draft; no migration step is done. Carries
out ADR 0032's decision 6 (a facts graph with recorded reads) in a
narrowed form: a declared schema and one recorder, not a query engine.
Restates ADR 0029's rule (a planner reads no other element's plan) as a
row of that schema.

What a stage of the compile reads of another element is a *fact*: a value
of a declared *kind* about a *holder* (an element, an attribute, a port),
known from a declared stage on. Every such read goes through one recorder,
which keeps the edge from reader to fact. A schema, one table in one file,
says which kinds each stage may read. Boxing propagates over the recorded
edges, whatever the kind. The stages, their tables and their fixpoints do
not change.

## Context

### Dependencies before the program are tracked several ways

The program's instructions are the one representation of what depends on
what once a build is made. Before that, each kind of dependency between
elements has its own mechanism:

| A reader depends on | How it is tracked today |
|---|---|
| a referent's settled type | `referent_type` records `(t, e, RefId)` in `Outline::reads` and `Planned::reads`; linking boxes readers of boxes to a fixpoint (`box_readers_of_boxes`) |
| its own attributes | `Dast::attr` marks a bitset on the source (`attr_read`); linking boxes an element with an attribute nothing read (`link/unread.rs`, ADR 0021) |
| the graph it sits in | `PlanCtx::enclosing_graph_prop` reads the scope's outlined type, unrecorded |
| a container copy's clones | `clones_pending` and `Error::AwaitsClones`; outlining makes the clones and runs the read again (`with_clones`) |
| a referent's given leaves | `Planned::shares`, tied when linking |
| another element's port type | sealing's fixpoint (`seal/types.rs`); a failure is a `Failure` naming a node, and the compile runs again from outlining with it boxed (`plan_and_check`) |
| a constant's value, a count | the check (ADR 0037) and the build (ADR 0004, ADR 0041) |

Each row is sound for what it covers. Together they have three costs.

- **A rule per mechanism.** ADRs 0021, 0027, 0029, 0030 and 0032 each add
  a rule a contributor keeps by hand: settle a fact in outlining so no
  planner reads another's plan, read a referent's type only through
  `referent_type`, read an attribute through `attr` and not `attr_peek`
  when it has a meaning. Nothing checks the rules but review.
- **Reads that go around.** `enclosing_graph_prop` reads another element's
  row and records nothing: a box of the graph is not propagated to the
  point by any recorded edge. Forty-nine sites under `stages/plan/` reach
  `rd.outlined` or the source directly; most read the element's own row,
  and which do not is found only by reading them.
- **Boxing by kind.** ADR 0032's decision 6 asked for "one recorder" so
  that "a document compiles once however many elements fail". Only the
  referent-type read has a recorder, so only it propagates in place; a
  failure in sealing still recompiles from outlining.

### What is not wanted

The general answer is a query engine (Salsa, rustc's queries): every fact
memoized under a hashed key, every read recorded, demand-driven order,
cycle recovery. The compile is two thirds of a load and has grown 1.2 to
1.7 times in a week of ADRs (`docs/load-cost.md`); an engine puts a hash
lookup in front of every read of the columnar tables ADR 0031 made, and
buys incremental recompilation, which a compile that runs once per load
(ADR 0015) does not use. It would also absorb sealing's fixpoint,
sharing's union-find and the rebuild as modes of one engine, where today
each is a named stage that is simple because it is particular.

## Decision

### 1. A fact is a kind and a holder

```rust,ignore
pub(in crate::compile) enum Fact {
    /// Outlining's row of an element: its type, its body, its collected
    /// type, its clones.
    Settled(TemplateId, ElemId),
    /// An attribute of the source, read for its meaning.
    Attr(AttrId),
    /// The type sealing inferred for a port.
    PortType(TemplateId, ElemId, Port),
}
```

The enum is closed and short. A kind is added when a stage reads a new
sort of thing across elements, with a row in the schema (decision 3) in
the same change. ADR 0040's `provided` is the next (`Provided(TemplateId,
ElemId, Port)`), and a constant read by a load-time choice (ADR 0037) the
one after, if the check is brought under the recorder.

A fact is not a node of a new graph. Each stage keeps its own nodes (an
element, a port, a template graph node, a slot, a cell), and a fact names
a holder in the stage that makes it.

### 2. Every kind has a binding time

The binding time is the stage from which a fact of the kind is known, in
the order of `Stage` (`compile/ir/template.rs`), extended past the compile
for kinds that will need it:

```
Outline < Parse < Plan < Link < Seal < Check < Build < Tick
```

| Kind | Bound at | Written by |
|---|---|---|
| `Settled` | Outline | outlining |
| `Attr` | Outline (the source) | the parser; read when its meaning is given |
| `PortType` | Seal | sealing's fixpoint |

The rule: a stage reads a fact bound at an earlier stage. A stage reads a
fact bound at its own stage only where the stage is a declared fixpoint
over that kind (sealing over `PortType`) or a declared demand order
(outlining over `Settled`, by `with_clones`). These exceptions are rows of
the schema, not conventions.

ADR 0029's rule is the row "Plan does not read `Plan`": there is no kind
bound at Plan, so no planner can read one.

### 3. The schema is one table

```rust,ignore
/// What each stage may read across elements (ADR 0042).
pub(in crate::compile) const READS: &[(Stage, FactKind, Within)] = &[
    (Stage::Outline, FactKind::Settled, Within::Demand),   // with_clones
    (Stage::Parse,   FactKind::Settled, Within::Earlier),
    (Stage::Plan,    FactKind::Settled, Within::Earlier),
    (Stage::Plan,    FactKind::Attr,    Within::OwnOnly),  // ADR 0034
    (Stage::Seal,    FactKind::PortType, Within::Fixpoint),
    // ...
];
```

`Within::OwnOnly` says the reader is the holder (an element reads its own
attributes, ADR 0034); such a read is recorded for the unread-attribute
check but makes no edge between elements.

The schema is what a contributor reads to learn what a stage may depend
on. It is checked, not consulted: decision 4.

### 4. One recorder; the check is in tests, the edges in every build

```rust,ignore
impl Facts {
    pub(in crate::compile) fn read(&mut self, reader: (TemplateId, ElemId), fact: Fact);
}
```

Every read of a fact goes through `Facts::read`. The stage running is the
one `Boxes::enter` set.

- **In debug builds and tests** the recorder asserts that the stage may
  read the kind (decision 3). A read the schema does not allow is a
  failed test, not an order bug found later.
- **In every build** the recorder keeps what propagation needs: an edge
  per cross-element read, appended to a `Vec` by kind, as
  `Planned::reads` is now, and the attribute bitset, as `attr_read` is
  now. The storage stays per kind; the interface is one. No read is
  hashed.

`Dast::attr` becomes a read of `Fact::Attr` through the recorder;
`Dast::attr_peek` stays, the one read that gives an attribute no meaning
and records nothing (ADR 0021).

### 5. Boxing propagates over the edges, whatever the kind

`box_readers_of_boxes` becomes `box_readers`: to a fixpoint, every reader
of a fact whose holder is a box is boxed in place, with the box its
cause. One function, over every kind's edges. A kind whose reads cannot
reach a box (`Attr`, read by its own holder) has no edges to walk.

When sealing records its cross-element `PortType` reads, a type failure
that names an element boxes it in place and propagates, as a planning
failure does today, instead of ending the compile with a `Failure` and
compiling again. The retry stays for what the check finds (a stamping
failure, a prefill, a load-time choice): those are findings over the
template graph, which would have to be stamped again, and bringing them
under the recorder is left to a later ADR.

### 6. What this does not change

- Each stage stays a function of what it reads (ADR 0030) with its own
  table (ADR 0031). Reads stay array indexes into those tables.
- Sealing's type inference and sharing's union-find (ADR 0033) stay
  fixpoints of their own stages. The schema names them; it does not run
  them.
- The rebuild (ADR 0004) and the layout by when a count settles (ADR 0041)
  stay the build's. `Build` and `Tick` are in the order so a later kind
  can be bound there; this ADR adds none.
- The machinery (answers, choices, repeats) still plans what it owns
  (ADR 0029's exception, `docs/machinery-context.md`).
- The template graph, the build and the program are unchanged. The
  coverage check (`build/coverage.rs`), which holds every build's
  dependencies to the template graph's, is the model for the check this
  ADR adds at the compile's boundaries, not a thing it replaces.

## Considered options

- **Keep a mechanism per kind.** Each is small and correct. But the rules
  between them are kept by review, a read that goes around one
  (`enclosing_graph_prop`) is invisible, and each new relation (ADR 0040's
  three) brings a mechanism of its own.
- **A query engine.** Rejected above: a hash per read in the stage that
  is two thirds of a load, incremental recompilation nobody uses, and the
  fixpoints and the rebuild hidden inside it as modes.
- **Record every read in release, check the schema at run time.** The
  check is of the code, not of the document: a read the schema forbids is
  forbidden in every document, so a test finds it once. Paying for it at
  every load buys nothing.
- **One graph of facts with one node type.** What a node is differs by
  stage (an element, a port, a slot, a cell), and the maps between them
  are one to many, many to one and one to none. Facts are named by the
  stage that makes them; the maps stay the stages' own.

## Consequences

- What a stage may depend on is one table, and a test fails when code
  reads past it. The rules of ADRs 0021, 0029 and 0034 about reads become
  rows of the table.
- A box propagates along every recorded kind. The point in a boxed graph
  is boxed with it once `enclosing_graph_prop` (or ADR 0040's `provided`)
  reads through the recorder.
- Sealing's failures that name an element no longer recompile the
  document. A document with several such failures compiles once instead
  of once per failure.
- A new cross-element relation costs a `Fact` variant and a schema row,
  not a mechanism.
- Lines: about 800 to 1,000 lines track dependencies today (`ir/boxes.rs`,
  `stages/link/`, part of `plan_and_check`, the read recording, the clone
  ordering). This ADR shrinks some of that and adds the enum, the schema
  and the recorder; the net is near even. The gain is the number of
  rules, not the number of lines.
- Load: every step records `scripts/load-diff.sh` beside its golden diff,
  and every shape is within noise (about 5%). A step that is not means the
  recorder does more than push to a `Vec`, and is reworked before it
  lands.

## Migration

Each step lands alone, with the golden diff unchanged and
`load-diff.sh` within noise.

1. **`Fact` and the recorder.** `Fact`, `FactKind` and `Facts` in
   `compile/ir/facts.rs`. `Read` (`ir/settled.rs`) and the two `reads`
   vectors become `Facts`'s `Settled` edges; `referent_type` and
   `record_read` read through it. `box_readers_of_boxes` reads the edges.
   Test: `tests/diagnostics.rs` and `tests/plan_order.rs` unchanged.
2. **Attributes.** `Dast::attr` records `Fact::Attr` through the recorder;
   the bitset is its storage. `link/unread.rs` asks the recorder. Test:
   the unread-attribute diagnostics unchanged.
3. **The schema and its check.** `READS` in `compile/ir/facts.rs`, and
   the debug assertion in `Facts::read`. Test: the crate's suite in debug,
   and a test that a read the table forbids panics.
4. **The reads that go around.** `enclosing_graph_prop` reads the scope's
   row through the recorder. The 49 sites under `stages/plan/` that reach
   `rd.outlined` or the source are sorted into reads of the element's own
   row, left as they are, and reads of another's, which go through the
   recorder. Test: a point in a graph whose graph is boxed is boxed, in
   `tests/diagnostics.rs`.
5. **One propagation.** `box_readers_of_boxes` becomes `box_readers` over
   every kind's edges. Test: unchanged diagnostics.
6. **Sealing in place.** Sealing records `PortType` reads across elements;
   a type failure naming an element is boxed in place and propagated, and
   `seal/types.rs` stops returning a `Failure` for it. Test: the same
   diagnostics, and `trace::count("boxed")` shows one compile for a
   document with two type failures where it showed three.
7. **The next kind.** When ADR 0040's step 2 lands, `provided` is
   `Fact::Provided` with its row, and nothing else.

## Open questions

- Whether the check's findings (stamping, define, the constants) should
  come under the recorder, ending the retry entirely, or whether the
  retry stays as the template graph's one way to box. That is ADR 0032's
  "compiles once" in full, and needs the template graph to be stamped in
  part again.
- Whether the maps between stages that change what a node is (ports to
  template graph nodes, nodes to slots, slots to cells) should each carry
  a declared multiplicity and an edge-preservation test, as the template
  graph to build map does in `build/coverage.rs`. That is about the
  stages' nodes, not about facts, and would be an ADR of its own.

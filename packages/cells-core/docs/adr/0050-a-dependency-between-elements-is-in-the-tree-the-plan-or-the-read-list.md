# A dependency between elements is in the tree, in the plan, or in the read list

Status: proposed 2026-11-23. Draft; no migration step is done. Replaces
the first draft of this number ("Every read across elements is a fact of
a declared kind", commit 04f940f), which proposed a `Fact` enum, a schema
table and one recorder. Sets aside ADR 0032's decision 6 (a facts graph
with recorded reads, so a box needs no restart): the restart stays.
Restates ADR 0029's rule and ADR 0030's as what the code's ownership
already holds.

The compile adds no mechanism for what depends on what. Three it has are
named as rules. What a stage may read is what it is handed. A dependency
between elements is in the tree, in the plan, or, for the one kind of
read that leaves no trace in either, in the read list. An element that
fails is boxed in place up to linking and by compiling again after it.
One change to the code follows: planning reaches another element's row
only through accessors that say which of the three the read is.

## Context

### What the first draft set out to fix

The first draft counted seven ways a dependency between elements is
tracked before the program exists, and named three costs: a rule per
mechanism kept by review, reads that go around the mechanisms, and
boxing that propagates for one kind of read only. It proposed one
recorder every cross-element read goes through, a table of which stage
may read which kind of fact, and a debug assertion holding reads to the
table.

### What the code does today

Checked on 2026-11-23 against commit cd9472c.

- **The read it named as going around does not.** The draft's example
  was `PlanCtx::enclosing_graph_prop`, which reads the graph an element
  sits in and records nothing, so "a box of the graph is not propagated
  to the point by any recorded edge". A `<parabola>` in a `<graph>` with
  an attribute nothing reads, or with `xmin="1+"`, is boxed with the
  graph, and a `<number extend="$p.vertex.x"/>` beside them reports
  `cells-boxed-referent`. `Boxes::box_in_place` boxes everything under
  the element it boxes (`subtree`), and `name_scope` is the parent
  element, so what an element reads of what encloses it is always read
  of an ancestor.
- **A second propagation was not in the draft's table.**
  `box_elem_readers_of_boxes` (`stages/link/mod.rs`) boxes every element
  whose plan reads a port of a box (`Arg::Elem`). It reads the edges off
  the plans; nothing recorded them. The source `enclosing_graph_prop`
  returns is an `Arg::Elem`, so that read is covered twice.
- **Binding time is held by construction.** Every stage after outlining
  is handed `Reader::new(dast, &settled)`: it cannot change what
  outlining settled. A port's type cannot be read before sealing, since
  sealing makes the table that holds it (ADR 0031). A debug assertion
  that planning does not read a port type checks what cannot be written.
- **A recorder does not see what does not call it.** The draft's check
  ran inside `Facts::read`. A read that goes around the recorder, the
  failure the check was for, is the one read it never sees.
- **Attributes make no edge.** An element reads its own attributes (ADR
  0034). `Fact::Attr` would have kept the bitset and given it a second
  name.
- **Sealing runs after linking.** Linking has tied the given leaves a
  copy shares before sealing infers a type. Boxing in place from sealing
  means untying them, propagating again, and inferring again every type
  that came through the box. Compiling again from outlining with the
  node boxed (`plan_and_check`) has none of that to get right.

Of the 62 sites under `stages/plan/` that index `rd.outlined`, most read
the element's own row. The rest that were read are parent walks
(`anchor.rs`, `fix.rs`), an answer's or a choice input's own children,
and referents. They have not all been sorted; step 2 of the migration
does that.

## Decision

### 1. What a stage may read is what it is handed

A stage is a function from the tables of the stages before it, borrowed
shared, to a table of its own (ADRs 0030 and 0031). That signature is the
schema: there is no table of stages and kinds beside it. A new thing a
stage reads is a new parameter, and whether a stage may read it is
whether the stage that makes it has run.

ADR 0029's rule (a planner reads no other element's plan) is kept the
same way: a planner is handed its record and a `PlanCtx` (ADR 0034), and
`PlanCtx` has no accessor that returns another element's plan.

### 2. A dependency between elements is in one of three places

| The read | Where the dependency is | What boxing does |
|---|---|---|
| Of an ancestor: the graph an element sits in, the nearest container (ADR 0022), a provided prop (ADR 0040) | The tree | `box_in_place` boxes the subtree |
| One that is in the plan: a port of another element (`Arg::Elem`), a reference in a source | The plan | `box_elem_readers_of_boxes`, and a reference to a box when it is read |
| One that decides the plan and is not in it: a referent's settled type | The read list (`Outline::reads`, `Planned::reads`) | `box_readers_of_boxes` |

The rule: a dependency is read off the tree or the plan where they show
it, and recorded only where they do not. What is read off cannot be left
out by a site that forgot to record it. Only the third row is kept by a
call, and `Reader::referent_type` is the one function that makes it.

A new relation between elements says which row it is. ADR 0040's
`ctx.provided("xmin")` reads the nearest enclosing element that provides
the prop and returns a source: the first row for the read, the second
for the source. It adds no mechanism.

### 3. Planning reaches another element's row by its relation

The raw index, `rd.outlined(t).elems[x.index()]`, is not written in the
planners' files. Planning reads a row through one of:

- `own_row(t, e)`: the element being planned. Unrecorded.
- `enclosing_row(t, e)` and the walks built on it (the nearest
  container, the enclosing graph): reached only through `name_scope` and
  the template's `parent`, so what it returns is an ancestor.
  Unrecorded: the first row of decision 2.
- `referent_type(.., t, e, p)`: as today. Recorded: the third row.
- `owned_row(t, e, k)`: an element under `e` that `e`'s plan is made of
  (an answer's input and awards, a choice input's choices; ADR 0029's
  exception, `docs/machinery-context.md`). Unrecorded: the plan reads a
  port of `k`, the second row. A site that reads `k` to decide and puts
  no port of `k` in the plan is not this accessor's; see the open
  questions.

The accessors live in one file under `stages/plan/`. Which relation a
read is, is then said where the read is written, and a read of an
element that is none of the four does not compile.

### 4. A failure is boxed in place up to linking and by compiling again after

- **Outlining, planning, linking.** Nothing has been made from the
  failing element's plan. It is boxed in place and its readers after it,
  as today.
- **Sealing and the check.** Given leaves are tied and types inferred.
  The failure names a node, and the compile runs again from outlining
  with the node boxed (`plan_and_check`), as today. A compile that runs
  again keeps nothing that could be stale.

The clone ordering is the same rule at a smaller size: a read of a
container copy whose clones are not made fails naming it
(`Error::AwaitsClones`), outlining makes them, and the read runs again
(`with_clones`).

A document with k failures in sealing compiles k + 1 times. That is a
cost on documents with errors only, and it is not measured. If it is
shown to matter (step 4), sealing reports every failure of a pass and
the compile runs twice, not once per failure. Boxing from sealing in
place is not the remedy.

### 5. What this does not change

- The stages, their tables and their fixpoints (ADRs 0027, 0030, 0031).
- `Read`, the two `reads` vectors, `attr_read` and `link/unread.rs`
  (ADR 0021), `Planned::shares`, sealing's fixpoint, sharing (ADR 0033).
- The retry for what the check finds, and the rebuild (ADR 0004).
- Load: no read is added to a compile, and none is recorded that is not
  recorded today.

## Considered options

- **The first draft: a `Fact` enum, a schema and one recorder.** The bug
  it was written to fix does not occur; its check does not see a read
  that goes around it; its schema restates what borrowing holds; and its
  one real gain, sealing's failures boxed in place, is the part with the
  most to get wrong. It added an enum, a table and a stage order running
  to `Build` and `Tick` with no kind bound at either.
- **A query engine.** Rejected in the first draft, for reasons that
  stand: a hash in front of every read in the stage that is two thirds
  of a load (`docs/load-cost.md`), and incremental recompilation, which
  a compile that runs once per load (ADR 0015) does not use.
- **Record every cross-element read, and derive none.** One mechanism
  instead of three, but each recorded read is a call a site can leave
  out, and the reads of ancestors and of ports are the many. The tree
  and the plan hold them already and cannot be out of date.
- **Leave it to review.** Decisions 1, 2 and 4 are how the code works
  now, and writing them down costs nothing. Decision 3 is the one edit:
  without it, whether a read under `stages/plan/` is of the element's
  own row is found by reading it.
- **Box in place from sealing.** One compile for a document with several
  type failures. It makes sealing write the box table it now only reads
  (ADR 0031), and needs linking's ties and sealing's inferences undone
  for what read the box. Reporting every failure of a pass gets most of
  the gain and undoes nothing.

## Consequences

- The compile gains no enum, table or recorder. The ADRs a contributor
  keeps by hand about reads (0029, 0030, 0034) are each one line of
  decision 1 or one accessor of decision 3.
- A relation added later (ADR 0040's three) says which row of decision 2
  it is. One that is none of them, a read of an element that is neither
  ancestor nor referent, that decides a plan and is not in it, is the
  case that would need the read list widened from references to
  elements. None is known.
- ADR 0032's "a document compiles once however many elements fail" is
  not carried out. A document with errors compiles more than once, and
  how often is bounded by step 4 if it is taken.
- What would reopen this: a compile that recompiles part of a document
  after an edit (against ADRs 0004 and 0015), or relations of the kind
  in the point above arriving in number.

## Migration

Each step lands alone, with the golden diff unchanged. Steps 1 and 2
change no behaviour; `scripts/load-diff.sh` is recorded for step 2 and
is within noise.

1. **Pin what holds.** Tests in `tests/diagnostics.rs`: an element in a
   graph that is boxed (an unread attribute; a bad `xmin`) is boxed with
   it, and a reference to that element from outside is
   `cells-boxed-referent`; the same for an element under a boxed
   container whose `fixed` it inherits (ADR 0022). These pass today.
2. **The accessors.** `own_row`, `enclosing_row`, `owned_row` in one
   file under `stages/plan/`; the 62 sites that index `rd.outlined` are
   sorted into them, and the raw index is no longer reachable from the
   other files of `stages/plan/`. A site that fits none is the finding
   of this step and is listed here before it is changed.
3. **The rule in the code's own words.** The module docs of
   `stages/link/mod.rs` and `ir/boxes.rs` carry decision 2's table, and
   `docs/guide/` says which row a new relation is.
4. **Sealing's failures, if measured.** `trace::count("boxed")` over the
   fixtures and a document with several type failures says how many
   compiles an erroneous document costs. If that is a cost worth
   removing, `seal/types.rs` returns every failure of a pass and
   `plan_and_check` boxes them together. Test: the diagnostics unchanged,
   and two compiles where there were k + 1.

## Open questions

- Whether any site under `stages/plan/` reads an element under it to
  decide its plan and puts no port of that element in the plan. Such a
  read is in none of decision 2's rows. Step 2 finds it; the remedy is a
  second read list keyed by element, not a new kind of thing.
- How the raw index is kept out of the planners' files. `Reader` is what
  every stage reads rows through, so its `outlined` cannot be made
  private to planning. A wrapper planning holds in place of the bare
  `Reader` is the likely form; it has not been tried.
- Whether reporting every failure of a sealing pass (step 4) can add an
  error that compiling once per failure would not: a failure that is
  there only because another element failed. The diagnostics tests
  decide it.
- The first draft's second open question stands apart from this ADR:
  whether the maps between stages that change what a node is (ports to
  template graph nodes, nodes to slots, slots to cells) should each
  carry a declared multiplicity and an edge-preservation test, as
  `build/coverage.rs` has for the template graph to build map.

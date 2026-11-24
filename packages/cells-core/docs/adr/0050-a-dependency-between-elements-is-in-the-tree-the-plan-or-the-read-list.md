# A dependency between elements is in the tree, in the plan, or in the read list

Status: accepted 2026-11-23. Migration steps 1 to 4 are done; what step 2
found is listed under it. Replaces
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
  questions. `body_rows(t, e)` is the same for the hidden elements
  outlining made in a repeat's body, which the repeat plans.
- `referent_row(rt, x)`: an element a reference of the one planned
  names, read for more than its type (its node, its scope, its own
  `extend`). Added by step 2, which found such reads. Unrecorded: each
  follows a `referent_type` of the same reference, or puts the reference
  in a source of the plan.

The accessors live in one file under `stages/plan/`, `rows.rs`. Which
relation a read is, is then said where the read is written, and the raw
index does not compile in the other files. The accessors take ids, so
they name the relation and do not prove it: `owned_row` asserts in debug
builds that `k` is under `e`, and the others are held by review of the
one line that calls them.

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

A document with k failures in sealing compiled k + 1 times. That is a
cost on documents with errors only. Step 4 measured it and took the
remedy: sealing's type checks, which run once every type is settled,
report every element that fails one, and the compile runs twice, not
once per failure. Sealing's other failures (a choice's interface, the
inference itself) and the check's still name one node each. Boxing from
sealing in place is not the remedy.

### 5. What this does not change

- The stages, their tables and their fixpoints (ADRs 0027, 0030, 0031).
- `Read`, the two `reads` vectors, `attr_read` and `link/unread.rs`
  (ADR 0021), `Planned::shares`, sealing's fixpoint, sharing (ADR 0033).
- The retry for what the check finds, and the rebuild (ADR 0004). Step 4
  changes how many nodes one retry boxes, not that sealing ends the
  compile to box.
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
  not carried out. A document with errors compiles more than once: twice
  for any number of failed type checks (step 4), and once more per node
  for what the check finds.
- What would reopen this: a compile that recompiles part of a document
  after an edit (against ADRs 0004 and 0015), or relations of the kind
  in the point above arriving in number.

## Migration

Each step landed alone in behaviour: the golden diff is unchanged over
all four (37 documents, programs identical), and
`scripts/load-diff.sh` against the commit before them is within noise
(new / base from 0.97 to 1.03 over the eight shapes at 1,000 and 10,000
after step 2, and from 0.96 to 1.05 after step 4; the 1.05, `poly` at
10,000, was the 0.97 of the run before).

1. **Pin what holds.** Done. `tests/diagnostics.rs`:
   `what_sits_in_a_boxed_graph_is_boxed_with_it` (an unread attribute; a
   bad `xmin`; a `<number extend="$p.vertex.x"/>` outside is
   `cells-boxed-referent`) and
   `what_inherits_a_boxed_containers_fixed_is_boxed_with_it` (ADR 0022).
   Both passed before any other step, in one compile.
2. **The accessors.** Done. `Reader` is split in two:
   `SourceReader`, the readers, whose row access is private to
   `compile/read/`; and `Reader`, which derefs to it and adds the rows,
   for every stage but planning. Planning holds `Rows`
   (`stages/plan/rows.rs`), which derefs to `SourceReader` and keeps its
   `Reader` private, so `rd.outlined(t)`, `rd.elem(t, e)` and
   `rd.settled()` do not compile in the planners' files. The sites
   (62 of `outlined`, 6 of `elem`, 3 of `settled`) sort as:
   - *own*: 32 reads, among them every `Elem { .. } = ..` at the head of a
     planner.
   - *enclosing*: the three walks (`under_graph`, `nearest_attr`,
     `enclosing_graph_prop`), now `Rows`'s, over one `enclosing_row`.
   - *owned*: 14 reads, of an answer's children and a choice input's choices
     (`answer.rs`), a list's entry elements (`lists.rs`), a type's owned
     inputs and a piecewise function's pieces (`ctx.rs`), and a repeat's
     hidden body elements (`iterates.rs`, through `body_rows`).
   - *the tables' shape*, no element's row: a template's element count,
     its `$ref` children, its parent; and `box_in_place`, which is
     handed every row.
   - *outlining's facts of the element*, not rows: an answer's when
     references and responses, now readers of `SourceReader`
     (`when_ref`, `answer_response`).

   What fit none of the three accessors, the findings:
   - **Ten reads of a referent's row for more than its type.**
     `copies.rs` (whether an `extend` referent is one the author wrote,
     twice), `ctx.rs` (the referent's node and scope, for a copy with
     overrides), `condition.rs` (whether a math a comparison names is
     written `unordered`; it arrived by a merge after the step and did
     not compile until it said its relation), `iterates.rs` (a `<functionIterates>`'s function: that
     it is one, and its node; a `<repeat for>`'s target: that it is a
     `<functionIterates>`), `lists.rs` (whether a piece names a value
     list, what a copy of a list extends, the type an entry is taken
     of). Each follows a `referent_type` of the same reference, which
     recorded the read, or puts the reference in a source of the plan,
     so each is in decision 2's second or third row. They read through
     `referent_row`, a fourth accessor; nothing else was changed.
   - **No read of an element under the reader that puts no port of it
     in the plan** (the first open question). An answer that finds a
     child of a type it does not take fails, and has no plan. A list
     whose child is an entry element holds a reference to it.
   - **One read that decides a plan and is in none of the three places,
     outside this step's sites.** `inline_maths` (`attrs.rs`), which a
     line's equation calls, replaces a reference to a `<math>` with that
     math's parsed expression, read from parsing's table, not from a
     row. The reference is then in no source and the read is not
     recorded, so `<math name="b" bogus="1">2x + 1</math>` is boxed and
     `<line>y = $b</line>` still has slope 2, where every other
     reference to a box reads the missing value. Not changed by the
     step, which changes no behaviour, and closed after it: each math
     `inline_maths` inlines is read through `referent_type` for the
     element being planned, so it is the third row, and the line is
     boxed with the math as its cause (`cells-boxed-referent`), in one
     compile, whichever is written first. Test:
     `a_line_that_inlines_a_boxed_math_is_boxed_with_it`.
3. **The rule in the code's own words.** Done. The module docs of
   `stages/link/mod.rs`, `ir/boxes.rs` and `stages/plan/rows.rs` carry
   decision 2's table, and `docs/guide/compile.md` ("Boxing") says which
   row a new relation is.
4. **Sealing's failures, measured and taken.** Done. Every golden
   document and fixture (63) compiles once. A 1,000-element document
   with k `<point x="$p"/>` (an arity failure of sealing's type checks)
   compiled k + 1 times, each compile the cost of the first: 5 ms with
   none, 20 ms with 5, 108 ms with 40, in a release build. Sealing's
   checks run in a pass of their own after the types' fixpoint, so
   `infer_types` now returns every element's first failure of that
   pass, less those under another failing element, and
   `plan_and_check` boxes them together. Test:
   `several_type_failures_compile_twice` (seven failures, a failing
   element under a failing graph among them: seven errors less the
   nested one, two compiles), and the diagnostics otherwise unchanged.

## Open questions

- Answered by step 2: no site under `stages/plan/` reads an element
  under it to decide its plan and puts no port of that element in the
  plan. The one read found in none of decision 2's rows was of a
  referent's parsed math (`inline_maths`), listed under step 2 and now
  recorded.
- Answered by step 2: the raw index is kept out of the planners' files
  by splitting `Reader`, not by forwarding its methods. The readers are
  `SourceReader`'s, with row access private to `compile/read/`; `Reader`
  adds the rows; planning's `Rows` derefs to the first and hides the
  second.
- Answered by step 4, in part: reporting every failure of a sealing pass
  can report an element that compiling once per failure would not.
  Where B fails a check on a port it reads of A, and A fails one of its
  own, compiling per failure boxed A first and B then read a box and
  passed; both are reported now. B's failure is of what B wrote and
  would be reported once A is fixed, so it is kept. A failure under
  another failing element is dropped, as a box reports nothing of what
  is under it. No test in the suite changed.
- Whether the accessors of decision 3 should be held by more than their
  names: `own_row` takes any element, and only `owned_row` checks its
  relation, in debug builds.
- The first draft's second open question stands apart from this ADR:
  whether the maps between stages that change what a node is (ports to
  template graph nodes, nodes to slots, slots to cells) should each
  carry a declared multiplicity and an edge-preservation test, as
  `build/coverage.rs` has for the template graph to build map.

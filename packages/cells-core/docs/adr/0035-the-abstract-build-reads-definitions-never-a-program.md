# The abstract build reads cell definitions, never a program

Status: accepted 2026-11-05. Proposed 2026-11-05; every migration step is
done (see Migration). Amends ADR 0015 (what the compile reads of the
build) and ADR 0012 (its reason for the abstract build running emit).

A build is expand, resolve, emit, schedule (ADR 0015). This ADR splits
emit in two at the line the code already draws inside it. **Define**
merges aliased slots into the cells they will share, orients the author's
operators (ADR 0026) and classes every cell: writable or not (ADR 0018),
live or dead (ADR 0019), counted, a document constant (ADR 0028). **Emit**
numbers the cells, makes the constant pool, folds, binds operators into
instructions, seeds values and makes tapes. The abstract build runs
expand, resolve, its count and loop checks, and define, and returns what
it found (`AbstractFindings`). It makes no program, so emit runs only in a
stamped build and reads no view.

The rule this makes: the check reads the graph and the cell definitions,
never a numbered cell or a bound instruction. A rule about what a cell *is*
(its class, what it needs, where a request on it goes, what an author may
reference) belongs in define or before it; a rule about what a cell is
numbered or how an instruction is bound belongs in emit. A diagnostic
raised in emit is wrong on its face, as ADR 0015 says of one raised in
`build/`.

## Context

### What the abstract build takes from emit

The abstract build (`build/abstract_build.rs`, ADR 0012, ADR 0014) is the
build run through the abstract view, and `build_with` (`build/mod.rs`)
runs it through the same `finish` (`build/emit.rs`) as a stamped build.
What the compile keeps of it is `AbstractFindings`: the structural depth,
four records by template slot (writable, live, counted, document
constants) and the warnings. Reading `finish` for where each comes from:

1. The union-find over aliases and the one defining slot of each cell
   (`SlotCells`, `build/slot_cells.rs`). Both walks need it: they walk
   cells, not slots.
2. The orientation of the author's binary operators (`build/orient.rs`),
   which decides which inputs an operator writes, which the writable walk
   reads.
3. The writable walk and the live walk (`build/writable.rs`,
   `build/live.rs`), and the records made from them and from the counted
   and document slots the builder gathered while resolving.
4. The refuse warnings (ADR 0026, `build/emit.rs:701`): once the program
   is bound, the abstract build runs `program::refuse::analyze` over it
   and warns, once per template element, of each interactive prop whose
   request would be refused or dropped. This is the one thing the abstract
   build reads off its program rather than its definitions, and it does so
   by design: the analysis "reads only the program, so the build can warn
   of a refused prop and a document can refuse its requests from the same
   rule" (`program/refuse.rs`; the document's side is
   `Interactive::refused_bits`, made once per stamped build).

Everything else after the walks, the abstract build computes and
discards: the numbering, the pool, the folds, the instructions, the seeded
values, the tapes, the holds, the component keys, the live bits. Emit's
doc for the dead cell says so in as many words: "Not in the abstract
build, whose build is not kept" (`build/emit.rs:123`).

### What this costs the code

- `finish` reads the view at twelve places (`folds_iterations`, and the
  `folds` it binds at `build/emit.rs:65`). Five of them are "the abstract
  build walks, every other build reads the record"; one runs the refuse
  warnings in the abstract build only; the rest switch off, in the
  abstract build, the alias-loop error, pruning, pooling, folding and math
  compilation. A reader of emit must hold both paths.
- `BuildOutput` carries a `findings` field that is "empty in any other
  build" (`build/mod.rs:220`), and `BuildOutput::abstract_findings`
  consumes a build to take it. The type says a build is sometimes the
  abstract one.
- One authoring diagnostic is raised during emit: the prefill rule in
  `seed_cells` (`build/emit.rs:840`), that a prefill reference must name a
  value that is not computed. The rule needs two facts, whether the
  referent's source is an operator and whether it is a counted value
  (ADR 0028, a collect's count), both known from the definitions. It sits
  in emit because seeds are processed there, and for that reason it
  carries a stand-in for the abstract view only (`follows_counts`,
  `build/emit.rs:873`): the abstract build stands a collect's count in by
  an operator over the repeats' counts, which the rule must see through.
  ADR 0012's reason for the abstract build running emit is this rule: "the
  prefill rule is checked by `seed_cells` itself rather than by a copy in
  the abstract build", and `abstract_build`'s doc says the same, "emitted
  so emit's rules run on the referents of every count and every option".
- A document with no repeats or selects pays an extra expand and emit at
  load, about the size of its one build, since the ADR 0015 amendment made
  every load one sequence. Half of that is a program nobody schedules.

### What the code already believes

The count and loop checks (`check_counts`, `check_loops`) run on the
resolved slots, before `finish`. The coverage tests read the abstract
build's graph through `staged` (`build/coverage.rs:82`), expand and
resolve only, "the whole graph, before cells are made". The walks read a
cell only through its definition, `Def`, "the cells a build's slots will
make, and what each depends on". The one check that depends on a numbered
cell, that a live cell needs no dead one, is a check of emit's own
invariant and is already skipped in the abstract build.

So the abstract build reads definitions in substance. The structure says
otherwise: one function, one output type, a view read where the view no
longer matters.

### The two readers of the abstract build's program

The input signature (ADR 0017, `build/signature.rs`) "is read off the
abstract build", and `signature_renamed` (`compile/check.rs:80`) runs the
full abstract build to get a `BuildOutput` for it. Its own rule is that a
cell hashes "as what it is: an essential cell by its key and prop, a
constant by its value, a derived cell by its operator over its inputs'
hashes; never by a cell index". That is a description of the definitions.
The code reads the program: `Signer` finds each derived cell's producer
among `out.instrs`, follows `program::Needs`, and hashes a symbolic
operator by the text of its template in the session's engine and a
sampled curve by the tape emit made (`op_hash`).

The refuse analysis is the other. It asks three things of a graph: what
produces each cell and reads which inputs, which inputs an operator's
inverse may write, and which cells a constant flag holds. Its `Graph` is
a private struct over instructions and operands. The definitions answer
the same three questions, and the walks already ask them there:
`Def::needs`, `Def::request_targets` (through `PlannedOp::writes`) and
`Def::held_always`, with `BuiltSource::eval_inputs` for the evaluation
inputs the cycle check reads. The analysis is written against the
program only because the abstract build had one.

## Decision

### The stages of a build

Expand, resolve, define, emit, schedule. `build_with` runs them in that
order with the abstract build's checks between resolve and define, as
today. Each stage reads what the earlier ones finished.

**Define** takes the resolved builder and returns the definitions
(`Defined`, a name to settle in the migration): the `SlotCells` (which
slots share a cell and which defines it), the orientation, and a class
per cell. It has three steps:

1. Merge aliases and find each cell's definer. A cell of aliases with no
   definer is a loop of aliases. In the abstract build it becomes a NaN
   constant, since the loop check has judged it (a recurrence folded onto
   itself is no cycle). In a stamped build it is `Unchecked`: ADR 0014
   says the compile found every cycle, so this can only be a gap. This is
   define's one read of the view, and it is the defensive kind.
2. Orient (ADR 0026), before the walks, which read the orientation.
3. Class. The abstract build calls the walks and makes the records; a
   stamped build reads the records the compile keeps (`Plans::classes`,
   `live`, `counted`, `document_constants`). The caller decides, so define
   has no branch for it: `define_by_walk` and `define_by_record` (or one
   function taking the classes as an argument) replace the five
   `if folds` in `finish`. The `testing` feature's check that the record
   agrees with a stamped build's own walk (`Live::walked`,
   `walked_essential_slots`, `tests/live.rs`, `tests/every_count.rs`)
   calls the walks on the stamped build explicitly, as it does now behind
   the feature flag.

The prefill rule moves to define, stated on definitions: a prefill
reference must name a cell whose definition is not an operator, unless the
cell is a counted value. The stand-in goes, since the counted slots are
known to the builder before any program exists (`counted_slots`), in both
views, and the rule reads them instead of looking through the abstract
build's operator. A failure boxes the element as before (`failed_node`).

**Emit** takes the builder and its definitions and makes a `BuildOutput`:
numbering (the pool first, ADR 0028, then essential, then derived),
pruning (ADR 0019), folding (ADR 0028), binding, seeding, tapes, holds,
component keys and the live bits, and the check that a live cell needs no
dead one. It reads no view. `folds_iterations` leaves `build/emit.rs`;
`prune && !folds` becomes `prune`, `!fold || folds` becomes `!fold`, and
the two `compile = !folds` for math become unconditional.

**The abstract build** runs expand, resolve, `check_counts`,
`check_loops` and define, and returns `AbstractFindings` from the
definitions and the builder's diagnostics. It never constructs a
`BuildOutput`, and `BuildOutput` loses its `findings` field and
`abstract_findings()`. `build::abstract_build` keeps its `checks` flag for
the test loads that run it without its loop checks.

### The signature reads definitions

`Signer` reads the abstract build's definitions rather than its program:
a derived cell's producer is its defining slot's `BuiltSource::Op` over
`op_inputs`, mapped through `SlotCells::cell_of`; what a cell needs is
`Def::needs`, which already accounts for holds; a constant's value is its
source's; an essential cell's key and prop come from `essential_key` on
its defining slot, the same call emit makes to build
`Structure::essential_keys`. A symbolic operator hashes by its planned
template (`PlannedOp::Template`, whose text the compile holds in its
expression arena) and a sampled curve by the shape it is sampled from,
not by the tape emit makes of it. The signature is a function of the
source (ADR 0017) and must not change under this ADR: `tests/compare.rs`
and `tests/safe_edits.rs` are the guard, and the migration adds a test
that the old and new signers agree on every fixture before the old one is
removed.

`signature_renamed` then runs the abstract build to its definitions, not
to a build.

### The refuse analysis reads a graph, which the definitions and the program both are

`refuse::analyze` keeps one implementation, as ADR 0015 requires of a
rule the check and the runtime share, and reads it through a trait that
names the three questions it asks: a cell's producer and that producer's
evaluation inputs, the inputs an operator's inverse may write, and
whether a cell is held always. The program implements it as today, for
`Interactive::refused_bits` at each stamped build. The definitions
implement it for the abstract build, which warns from define: each asked
cell is an interactive prop's defining slot's cell, named by the first
component and prop that reaches it, as the block in emit names it now.
The warnings' text and order do not change; `tests/refuse.rs` is the
guard, and the migration adds a test that the two implementations agree
on every fixture, asked cell by asked cell, before emit's block goes.

A vector operator counts as one node in both: on the program through
`Op::Vec`, on the definitions through `BuiltSource::VecOut` and its head.

### What each stage takes from the other, amended

ADR 0015 lists what the compile reads of the build: the abstract build,
`build::first_build` and `BuildOutput`. `first_build` is already gone (the
2026-10-29 amendment). After this ADR the compile reads
`build::abstract_build`, which returns `AbstractFindings`, and the
signature, which reads definitions. No `BuildOutput` crosses the line:
the compile never holds a program, made or discarded.

The view is read by expand and resolve (`View::iterations`, `index`,
`collect_count`, `options`, `plans`, and `folds_iterations` where
iterations fold into later sources), by the abstract build's checks, and
by define's alias-loop step. It is not read by emit or by anything after.

## Considered options

- **Keep the abstract build a build through another view.** One sentence
  describes it, and the sentence is why emit reads the view: whatever the
  build does, the abstract build does, and emit must switch off what the
  abstract build cannot keep. It is the sentence that let `BuildOutput`
  grow a field for one of its two producers. Rejected: the sentence is
  shorter than the code it costs.
- **Have the abstract build skip emit with no define stage.** Not
  possible: the walks need the aliases merged and the operators oriented,
  which is the first half of `finish`. The stage is that half, named.
- **Fold define into the end of resolve.** It is one function fewer, but
  the abstract build's checks run between resolve and define on the
  unmerged slot graph, as the loop check's labels need, and the stage
  boundary is what the rule reads off. Rejected.
- **A checker of its own, over the template graph.** Rejected in ADR 0015
  and again here: the abstract build's value is that it resolves
  references with the build's code. This ADR narrows what it shares with
  the build to what resolves and defines, which is the part worth sharing.
- **Leave the signature and the refuse warnings on the program and run
  emit for them alone.** It keeps `BuildOutput` crossing the line for two
  readers, and keeps emit correct under the abstract view for those
  readers only, with nothing else exercising that path. Rejected: the
  signature's own rule says what it reads, and that is the definitions;
  the refuse analysis asks three questions the definitions already answer
  for the walks.
- **Warn of refused requests from the first stamped build.** It would
  warn per iteration, not per template element, and only of the count and
  the picks that build happened to have. Rejected by ADR 0014: every
  diagnostic depends on the source alone, and the abstract build stands
  for every count and every pick.
- **Two copies of the refuse rule**, one over definitions for the abstract
  build and one over the program for the tick. Rejected by ADR 0015: a
  rule the check and the runtime share has one implementation, or the two
  can disagree about which requests land.

## Consequences

- Emit has one semantics, a stamped build's, and about a thousand lines
  read without a second path in mind. The code that must be right under
  both views is expand, resolve, the checks and define's first step, which
  is the graph, the abstract build's whole business.
- `BuildOutput` is one thing: a stamped build before scheduling.
- The abstract build is cheaper. The ADR 0015 amendment's price for a
  document without repeats or selects falls from an expand and emit to an
  expand, resolve and define; the migration measures it.
- The prefill rule reads a fact instead of a stand-in, and the abstract
  build's stand-in for a collect's count is read by nothing but the counts
  check it was made for.
- A contributor's rule gains a line: a diagnostic in emit is misplaced,
  and a view read in emit is a bug.
- ARCHITECTURE.md's pipeline gains a stage and its table a row; CONTEXT.md
  gains *define* beside "expand, resolve, emit, schedule"; the doc of
  `build::abstract_build` loses "emitted so emit's rules run" (it no
  longer runs emit, and needs no reason to); ADR 0012's statement of that
  reason and ADR 0015's "What each stage takes from the other" are amended
  to point here.
- The two readers are the risk, and each gets a step of its own so its
  diff stands alone. The signature's hash of a symbolic operator must
  come from the plan's template rather than the engine's text of it, and
  a sampled curve's from its shape rather than its tape, and both must
  hash as before for every saved state in the wild to stay recognized
  (ADR 0017). The refuse analysis must find, on the definitions, exactly
  the refusals it finds on the program, or the abstract build's warning
  and the document's refusal part ways.

## Migration

Each step keeps the golden diff, the diagnostics and the signature of
every fixture unchanged, and is measured against the commit before, load
and tick, in instructions, as ADR 0015's steps were.

1. **The signature onto definitions.** `Signer` takes the builder's
   definitions instead of a `BuildOutput`, with the old signer kept behind
   the `testing` feature and a test that both agree on every fixture under
   `fixtures/`; then the old signer goes. `signature_renamed` still runs
   the full abstract build until step 3. This step settles how a template
   and a shape hash without the engine and the tapes.

   *Done.* As landed: `signature::sign` reads the builder and its
   `SlotCells` between define and emit, which `build_with` runs as two
   functions (`Builder::define`, `Builder::emit`) with a reader between
   them; `abstract_signature` signs there, and `signature_renamed` still
   builds, so emit's rules box what they box. The program's signer stayed
   behind `testing` for `tests/signature.rs`, which showed the two equal,
   hash for hash, on the golden documents, every fixture and eight
   documents of the constructs that hash differently, and then went with
   the test. A template hashes by its planned tree with leaves numbered by
   input, printed as the engine prints it (`sym::engine::template_text`,
   a function of the tree with no engine), which is the text the program's
   signer hashed; a sampled curve as `Sample` over the shape it reads,
   since the abstract build compiles no tape; a seeded default by the
   text of the number the seed imports. A scalar operator hashed at
   first as the program's signer had, by a bound operator printed with
   its inputs left out, to keep every hash; with step 2 it hashes by its
   `OpSpec` printed, the one hash this ADR moves (a saved state never
   carries a signature: `doc` is the source's hash, ADR 0017). The golden
   dump now carries the signature, so `scripts/golden-diff.sh` guards it
   for the steps after. In instructions under callgrind, against the
   commit before: load of sir and a tick on the mixed shape at 10,000
   within the 0.1% that repeated runs of one binary differ by; load of
   that shape 0.2% fewer, on every run.
2. **The refuse analysis onto a graph trait**, implemented by the program
   and by the definitions, with a test that both find the same refusals
   on every fixture; then the abstract build warns from the definitions
   and the `if folds` block in emit goes. `tests/refuse.rs` guards the
   warnings.

   *Done.* As landed: `program::refuse::Graph` asks a graph for a
   cell's producer and its inputs and outputs, an operator's written
   inputs and kind (scalar, vector, symbolic), and whether a cell is
   essential or held always; `analyze` is generic over it. The program
   answers through `ProgramGraph` (the tick's `refused_bits`), the
   definitions through `build/refuse.rs`, where a cell is the slot its
   aliases merged under and a node an operator's defining slot, and
   `Builder::refuse_warnings` names each asked cell by the first
   component and prop that reaches it, as emit's block did. The
   definitions answer "held always" by the program's rule, a set flag
   that is any constant cell, a given value no input writes included,
   where `Def::held_always` sees a `Const` alone; the gap is the writable
   walk's, left for its own change. `tests/refuse_pair.rs` showed the two
   equal, warning for warning, on the golden documents, every fixture and
   six documents of what the analysis reads, and then went with the
   program's side. Emit keeps one `if folds`, the call, until step 3.
   In instructions under callgrind, against the commit before: load of
   sir within the 0.1% that repeated runs of one binary differ by, load
   of the mixed shape at 10,000 0.2% fewer.
3. **Split `finish`.** Define and emit as separate functions with a named
   result between them; the abstract build stops at define and returns
   `AbstractFindings`; `BuildOutput` loses `findings`; the five class
   branches become the caller's choice; `folds_iterations` leaves
   `build/emit.rs`. The `testing` feature's walked checks call the walks
   explicitly.

   *Done, with step 4.* As landed: `build/define.rs` holds
   `Builder::define` (merge, the alias-loop step, orient, the prefill
   rule) and `Defined`, the named result: the `SlotCells` with each
   slot's two classes, made by `Defined::by_walk` in the abstract build
   and `Defined::by_record` in a stamped one, so define has no branch and
   emit reads `Defined` and no view. `Builder::stage` is expand, resolve
   and the checks, shared by `build` and the abstract build's
   `with_abstract`, which stops at define and hands the definitions to a
   reader: `Builder::findings` for the compile, `signature::sign` for the
   signature. `BuildOutput` has no `findings`; `AbstractFindings` is the
   abstract build's return. `build_with` is gone. Step 4 landed here
   because this step is not green without it: with the abstract build
   stopping at define, a prefill of a computed value would fail the
   stamped build instead of boxing at load.
4. **The prefill rule into define**, stated on definitions, and the
   stand-in removed. `tests/load_errors.rs` and the prefill tests guard
   the message and the boxed element.

   *Done, with step 3.* As landed: `Builder::prefill_rule`, run by
   define: a prefill reference must name a cell whose definition is not
   an operator, unless the cell is a counted value, which
   `Builder::counted_cell` reads off `counted_slots`, now kept in both
   views (`is_counted` records what the stamped build reads from the
   record too). The rule no longer looks through the abstract build's
   stand-in for a collect's count by `follows_counts`; the stand-in
   itself stays, for the counts check. `Builder::seed_source` is the one
   place a seed's source is read, by emit's seeding and the signature
   alike: a counted value's `Copy` reads through to the number. The rule
   now admits every counted value, where it admitted only a collect's
   count that follows its repeats: a prefill of a counted section number
   seeds the number instead of boxing. In instructions under callgrind,
   against the commit before: load of the mixed shape at 10,000 3.1%
   fewer, the program the check made and dropped; load of sir 0.2%
   fewer, at the edge of what repeated runs of one binary differ by.
5. **Documents**: ARCHITECTURE.md, CONTEXT.md, the doc of
   `build::abstract_build`, and the amendments to ADR 0012 and ADR 0015.
   This ADR's status becomes accepted.

   *Done.* As landed: ARCHITECTURE.md's pipeline has a define line
   between expand and emit, its Build section a **Define** item (merge,
   orient, the prefill rule, the classes, and the readers of `Defined`)
   beside a shorter **Emit**, a paragraph on which stage reads the view
   and where a rule belongs, and its table of types a row for `Defined`;
   its Check item says the abstract build stops at define and makes no
   program. CONTEXT.md's *Build* names the five stages, each in a
   clause, and *Compile stages* says the abstract build runs as far as
   define. `build::abstract_build`'s doc gives no reason for running
   define. ADR 0012's status, its prefill bullet and its paragraph on
   the abstract build running emit point here; ADR 0015's status and its
   "What each stage takes from the other" point to an amendment of
   2026-11-05, which restates what the compile reads of the build.
   ADR 0012's section of the same date measures what Consequences said
   the migration would: over the fixtures without a repeat or a select,
   the abstract build takes a median 0.71 of what it took before step 1,
   and a load 0.93, the load within run-to-run noise.

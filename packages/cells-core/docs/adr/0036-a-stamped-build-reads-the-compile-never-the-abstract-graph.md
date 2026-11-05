# A stamped build reads the compile, never the abstract build's graph

Status: accepted 2026-11-05. Proposed 2026-11-05; the two pointers of
Migration are landed. Records a line the code already keeps and
names the option on the other side of it, so the question is not asked
again at each step of ADR 0032. Amends nothing; ADR 0015 and ADR 0035
fix what the compile reads of the build, and this ADR fixes the reverse.

A stamped build derives from the compile and the session: it expands,
resolves, defines and emits from the plans, at the counts and picks it is
asked for. What it takes from the abstract build is *facts about template
slots*, each a bit per slot (writable, live, counted, document constant)
and one number (the structural depth), never a slot, an edge or a graph.
The abstract build's graph is discarded with the check that made it, and
no stamped build is made by copying or unfolding it.

The rule a contributor follows: a build reads `Plans` and `Session`. A
thing the abstract build finds that a build needs is recorded on the
template slot it concerns, or, once ADR 0032's step 8 lands, on the port.
A build that reads a `SlotId`, a `BuiltSource` or a label the abstract
build made is wrong on its face.

## Context

### The question

The check builds the document once through the abstract view (ADR 0012,
ADR 0014): every repeat gets one iteration, every select every option,
every choice a stand-in for its branches, and every reference edge a
label saying how it moves through the iterations. That graph holds every
edge any count or pick could create, and the cycle check, the writable
and live walks and the classing of constants run over it (ADR 0018, ADR
0019, ADR 0028). It is a complete, resolved, defined graph of the
document, with one node per template slot. A stamped build at a given
count is, in every stamped iteration, the same template's slots again.

So the question arises, and has been asked: should a stamped build be
made *off* that graph, by copying each template's block of slots once
per scope and remapping its edges through their labels, rather than by
running expand and resolve again from the plans? The abstract build
would then be the one resolution of the document, and every stamped
build an instantiation of it.

### What the abstract graph is

The abstract view (`build/view.rs`) answers a build's structural
questions so that one iteration stands for all:

- `iterations` is 1 for every repeat, and `index` clamps any index into
  that iteration, so `$r[2].x`, `$r[$i-1].x` and `$r[$n].x` all land on
  the same slot; the edge's label (`Coord::Keep(shift)` or
  `Coord::Reset`) records how they differ, and no more than the cycle
  check needs: a kept coordinate's shift, or that the coordinate was
  chosen independently.
- `collect_count` says a collect's count reads the counts of the repeats
  it gathers from, where a stamped build counts what it gathered.
- `options` builds every option of a select, with one stand-in for the
  whole pick, where a stamped build draws from the seed.
- `plans` gives a first-iteration prop both its sources, the second as a
  *later source* on the same slot, where a stamped build gives each
  iteration one.
- A choice's interface is a stand-in reading every branch's component,
  where a stamped build reads the branch the case takes.

Each of these folds a family of stamped graphs onto one. The relation is
a covering: every dependency of a stamped build is one the abstract graph
has, with a label the stamped iterations satisfy. `build/coverage.rs`
states and tests exactly that (`admits`), on every golden document and
fixture at counts 0 to 4 and four seeds (`tests/every_count.rs`). The map
goes from the stamped graphs to the abstract one. It does not come back:
a `Reset` label does not say which literal index, which pick or which
branch was taken; a clamped index does not say whether the stamped index
is past the count and so the missing referent; a later source does not
say which iterations take it; a stand-in does not say which branch is
active in this scope. What lifts the abstract graph back to a stamped one
is the reference plan, the count, the seed and the case's value, which is
what resolve reads from the plans today.

### What crosses the line today, and what it costs

`AbstractFindings` (`build/mod.rs`) is five things: four `Record`s, a bit
per template slot each, and the depth. A stamped build classes by the
records (`Defined::by_record`) and bounds its passes by the depth, and
reads nothing else the abstract build made. The abstract builder is
dropped when the check returns.

The cost of running expand and resolve twice is one abstract build per
load. ADR 0012's section of 2026-11-05 measures it after ADR 0035: over
the 43 fixtures without a repeat or a select, the abstract build is 5% to
32% of a load, the median 14%, and for the repeat fixtures it is under
0.1 ms of loads of 5 to 60 ms. A rebuild pays no abstract build at all.
ADR 0028's profile of a rebuild at 5,000 iterations of a mixed body puts
emit at 27 of 43 ms and resolve at 12.

## Decision

### 1. A stamped build reads the plans and the session

Expand, resolve, define and emit read `Plans`, the `Session`, the counts
and the seed, through the stamped view. They read nothing the abstract
build made but the records, through the compile that keeps them. The
abstract builder lives as long as the check and no longer.

### 2. What the abstract build hands over is attributes of template slots

A fact the abstract build finds for every build to read is recorded on
the template slot it concerns, as the four records are. It is never a
slot of the abstract builder, a source, an edge or a label: those name
the abstract build's own graph, which no other build has. When ADR 0032's
step 8 makes the abstract build an analysis over the template graph, the
records become attributes of ports and this rule reads: a build reads
the IR and its attributes.

### 3. The abstract graph is the right abstraction for the check and the wrong one to instantiate from

The labels carry what the cycle check needs and nothing more, which is
why the check is one Tarjan walk, with a Bellman-Ford per component, over a graph the size
of the templates (ADR 0012). Enriching them until a stamped build could
be lifted from them (the affine index plan on every edge, the collection
and selector behind every reset, the branch behind every stand-in) makes
the abstract graph the compile's IR with the view's folding applied, at
which point the thing to build from is the IR, unfolded, which is what a
stamped build does. The direction is ADR 0032's step 8, where the
abstract analysis and the stamped build read one template graph, not a
step where the stamped build reads the folded one.

### 4. A document without repeats or selects still builds from the compile

For such a document the abstract definitions and the stamped definitions
coincide, and the one-load-sequence amendment of ADR 0015 pays an
expand, resolve and define for it (ADR 0012, 2026-11-05: a median 14% of
its load). Reusing the abstract builder as the first stamped build when
the view's answers coincide would save that, and it is the one place
option A wins. It is not taken now: it is a second path into emit, which
ADR 0035 just reduced to one, and a second kind of first build, which
the amendment removed. It is the first thing to measure if flat loads
come to matter; the measurement is `cycle_check_cost`'s abstract-build
column against its load column.

## Considered options

- **Make a stamped build off the abstract build's graph.** Copy each
  template's block of slots once per scope, remap edges through their
  labels, and emit. Rejected. The labels do not carry enough to lift the
  graph (see "What the abstract graph is"), so a stamped build would
  either carry an *unfold* step that splits later sources by position,
  picks a branch per stand-in, drops the other options and bound-checks
  every clamped index against the count, which is resolve written a
  second time over a different representation, or the labels would be
  enriched until the graph is the IR. The abstract builder would also
  have to live for the document's life, a second representation beside
  `Plans`, in wasm memory that never shrinks (ADR 0015, memory). And
  the gain is bounded by resolve's share of a build, which ADR 0028's
  profile puts at under a third of a rebuild, with emit, the pool, seeds,
  tapes and the schedule untouched.
- **Enrich the labels until the abstract graph can be unfolded.** This is
  ADR 0032's step 8 approached from the build's side: the abstract graph
  becomes the template graph with affine edges, collections and branch
  joins. Not rejected; it is the same destination, and the compile's
  side is the one to approach it from, since the compile already holds
  every fact the labels would have to be enriched with.
- **Keep the abstract builder for the first stamped build of a document
  with no repeats or selects.** Deferred, with its condition, in decision
  4.
- **Stamp a template's block once and replicate it by offset.** If a
  stamped build is the template graph times its scopes, emit could number
  a template's block by base-plus-offset per scope and schedule the block
  once per template, which is where a 10,000-iteration load's time would
  go. First-iteration specializations, missing referents at a count's
  edge, picks and choices break the uniformity, so the common block would
  be stamped and the exceptions patched. Deferred: it needs the template
  graph as the IR first (ADR 0032, step 8), and it is a decision of its
  own, with a measurement of how much of a repeat's build is the
  replicated part.

## Consequences

- The check's soundness keeps resting on the view: a structural read
  that bypasses it is one the cycle check cannot see (ADR 0012), and
  `tests/every_count.rs` keeps testing the covering rather than having
  it by construction. ADR 0032's step 8 is where it becomes structural,
  by giving both readers one graph, not by giving the stamped build the
  folded one.
- `AbstractFindings` stays a small, flat thing, and a change that makes
  it carry a slot id or an edge is a change to this ADR.
- The abstract builder's fields that exist for folding (`later_sources`,
  `stand_ins`, `pick_stand_ins`, `labels`, `document_slots`) are the
  check's, and leave the builder with step 8; nothing a stamped build
  does comes to depend on them.
- A document with repeats keeps its compile for rebuilds, as now, and
  nothing else.

## Migration

None in code: the build keeps this line today. Two pointers land with
the ADR's acceptance: ARCHITECTURE.md's paragraph on which stage reads
the view gains the sentence that a stamped build reads the compile and
the session, never the abstract build's graph, and ADR 0032's step 8
names this ADR as the rule its port attributes satisfy.

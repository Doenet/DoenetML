# Every error depends only on the document source

Status: accepted 2026-10-17; amended the same day to check every option of
every select (below).

Whether an element can be built depends on the DoenetML source alone:
never on an iteration count, on which option a select draws in an
iteration, or on any state a student or a saved session brings. So a load
finds every error the document has, and an author can rely on it: a
document that loads with no errors has none at any count a student
reaches. A build after the load never finds one; if it does, the core has
a bug, and the build fails rather than putting a new error box in front
of a student.

ADR 0013 says the same of the diagnostic list and expected it to follow
from the probe stamping every repeat body once. It did not quite: a
review found builds after the load boxing elements the load had not
(`known_bugs.rs`, history), because some rules were checked against the
one instance a build happened to stamp rather than against every instance
the source allows. This ADR makes the property a rule with an owner and
an enforcement.

## The rule

A check that can fail an element is a fact about the source. Where the
answer could differ between instances of the same source (iterations of a
repeat, the picks of a select inside one), the check must hold for every
instance, and the load's build must be the one to find it:

- **Checks that need only the DAST belong in compile.** Compile depends
  on the DAST and the boxes alone, so it answers the same in every build.
  A select's ability to draw its picks (`numToSelect` against the number
  of options with weight) moved there from the draw itself, which a
  select in a repeat makes once per iteration a student adds.
- **Checks on what a reference reaches run in the probe, against every
  instance.** The probe (ADR 0012) stamps each repeat body once and builds
  every option of every select, in a repeat or not (the amendment below). Where a real build would reach
  one of several instances, the probe reaches a *stand-in* that reads all
  of them, and whatever a rule asks of the referent it asks of each:
  - an interface name's stand-in (as before) and a whole pick's
    (`$r[2].s[1]`, new) read every option;
  - a whole pick needs every option to hold one component, all of one
    type, as an interface name already needed one type per branch;
  - an interface name, or a whole pick, holds one kind of value (number,
    text, math) in every branch;
  - a stand-in is symbolic when any branch is, and its props are computed,
    so the prefill rule (a seed names a value that is not computed) holds
    for every option.
- **What a count can remove is missing, not an error.** An index past the
  count is the missing referent (NaN) wherever a reference may point:
  `$r[3].x` always was; an `extend`, an array prop's items and a container
  copy now are too, and take the referent's values once the repeat grows.
  A check on a referent's type still runs, in the probe, on the one
  iteration it stamps, which has the type of every other.
- **The probe must not reject what a real build accepts.** A collect's
  count is a constant in every real build and an operator over the
  repeats' counts in the probe; the prefill rule treats it as the
  constant.

## Enforcement

`build` takes a `Pass` (`build/mod.rs`; since ADR 0015 the compile does
this, and `build::build` returns a `BuildError`, which can only say
`Unchecked`, a cycle included). Only a
document's first build
finds errors: its compile and, for a document with repeats, the probe box
what fails; for a document with no repeats the one stamped build boxes,
since no other build will ever run. Every later build (a later pass of
the load, a rebuild in a tick, a rebuild after restoring saved state)
starts from the first's boxes, and an element failing that is not among
them is `Error::Unchecked`: the tick is rolled back and `rebuild_error`
names it. Nothing is added to the document's diagnostics after load.

With boxes fixed at load, every build compiles to the same templates and
slot offsets, so an element's essential values keep their keys across
rebuilds without any remapping.

`tests/every_count.rs` holds the promise over every golden document and
fixture: each is built at counts 0 to 4 for each repeat and at four
seeds, as a later build with the load's boxes, and driven there by
requests; an `Unchecked` anywhere fails the test. Each such build, and each
seed's build of a document without repeats, must also have only
dependencies the probe's graph has, with labels its iterations satisfy
(`build/coverage.rs`), so the probe's claim to stand for every build is
checked, not assumed. `tests/load_errors.rs` has the constructs that once
broke it.

## Adding a check

Ask whether its answer can differ between two instances of the same
source. If not, it belongs in compile or may stay where it is. If so, make
the probe see every instance: give the probe a stand-in, or make the
instance-dependent case the missing referent. Then add the construct to
`tests/load_errors.rs` and let `every_count` run.

## Cost

Measured as instructions to load each generated fixture against the
commit before this change: −0.4% to +0.6% (the most, wording-1000, is
`conditionalContent`'s per-branch kind check). The probe itself runs only
for documents with repeats, as before, and takes 2% to 8% of their load
(`LoadTimings::cycle_check`: repeat-100 8%, sir 3%, repeat-1000 2%).
Ticks and rebuilds do no new work.

## Amendment: every option of every select

As first accepted, the probe built every option only of a select inside
a repeat, where a later iteration may draw any of them; outside one it
built the session's draw, so a load's errors were per seed. An author
previewing one seed could publish a document that boxed an option for the
students who drew it. Now the probe builds every option of every select,
and runs for a document with a select even when it has no repeat. With it:

- The compile depends on the source alone: its templates, boxes and
  diagnostics are the same at every seed (`tests/compile_purity.rs`), so
  one compile could serve every student of a document.
- A load's diagnostics are `diagnose`'s list, and the probe is one build
  for both: `diagnose` is the check without the load.
- An error in an option a student never draws still boxes it there, out of
  sight, and is reported.

Cost: the options a seed does not draw are built once more at load, so it
grows with the selects outside repeats and their options. In
instructions: select-1000 (1,000 four-option selects) +43%, select-100
+23%; documents without such selects unchanged. In wasm, select-1000's
load goes from 23 to 44 ms and its linear memory from 6.1 to 8.2 MiB. A
document with a few selects pays about a millisecond. Two ways to lower
it, not done: check once when a document is published and keep the
compile with it, or build only the undrawn options beside the stamped
build instead of the whole probe.

## Amendment: the passes a structure needs

A load or a rebuild builds until the structure settles, which takes one
pass more than the document's structural depth. The passes were capped at
eight, so a document whose counts chain through more repeats than that
could load with an early repeat empty, then fail mid-session when a count
filled the chain ("did not settle after 8 rebuilds"). The depth is a fact
about the source: the probe computes it, and every build's chains of
repeats map onto the probe's, so none is deeper. The compile records it
(`Compiled::structural_depth`), load and rebuild allow depth plus one
passes (and never fewer than eight), and a structure that still has not
settled is `Unchecked`, a core bug (`tests/load_errors.rs`, a chain ten
deep).

Amended 2026-10-29: only the probe measures the depth. Every build used
to measure its own, and the one build warning (a count reading a cell
inside another repeat's iterations, ADR 0013) came from the real build's
measurement, which broke the rule above for a warning: a load at a count
of zero saw the read land on the missing referent, so it reported no
warning where `diagnose` did. The probe's count check already walks the
same edges to reject a loop of structure; it now gives the depth and the
warnings too (`build/probe.rs`, `ProbeOutput`), the compile keeps them
with its diagnostics, and a real build reports nothing of its own
(`tests/repeat.rs`).

## Considered options

- Box an element a later build fails, as before. Rejected: an author
  cannot know a document is sound, and a student meets an error box
  mid-session.
- Run the exhaustive build (`diagnose`) at load. First rejected: the draw
  of a select outside a repeat is fixed for the session, so the extra work
  never changes what that student meets. Adopted by the amendment, since
  what an author is told should not depend on which student loads.
- Build at every count and seed. Rejected for the reason in ADR 0012.
- Treat a missing `extend` referent as an error at every count. Rejected:
  `$r[k].x` is already the missing value past the count, and a copy of it
  should not differ.

## Consequences

- A document that loads reports every error it has; `diagnostics()` is
  the same before and after any tick, and at every seed.
- Some documents that loaded clean now report an error at load: a whole
  pick of a select in a repeat whose options differ in shape, a choice
  whose branches hold a name with different kinds of value, a prefill that
  names a pick that may be computed, a select that cannot draw. Each could
  fail mid-session before.
- A prefill naming a computed value now boxes the input instead of failing
  the load, and a prefill is seeded again in each pass of a load, so it
  reads the counts the load settles on.
- `Error::Unchecked` is a core bug by definition; it should never reach a
  student, and the every-count net is what keeps it so.

# Rebuild cycles: a survey of the remaining constructs

Surveyed 2026-10-16 at commit 7fdb1ac, after ADR 0012. The question for
each construct: does the dependency graph the build emits depend on
anything other than the DAST, and if so can that thing change between the
initial build and a rebuild, so that a document loads without a cycle
error and hits one inside a student's tick?

Method: for each candidate a minimal document was loaded with
`cells_core::testing::test_utils::load` (or `load_with_seed`), then driven
with one request through `Document::request`, and the load result,
`TickOutcome::rebuilt`, `rebuild_error` and `structure_settled()` were
recorded. The throwaway probe is deleted; the open holes are kept as
ignored tests in `crates/cells-core/tests/rebuild_cycles.rs`, each
asserting the behaviour proposed below.

What ADR 0012 covers, as read from `build/cycles.rs`: a probe expansion
with one iteration per repeat and the picks a select really draws for
iteration 1; every reference edge labelled per nesting level of its target
as kept (with a shift) or reset; reset coordinates free; an SCC is a cycle
when every kept coordinate admits a zero-sum closed walk; and a count whose
inputs reach a slot inside its own iterations (`check_counts`, a DFS over
slot inputs). Three things the probe does not model: the *existence* of an
iteration is never an edge; a value the build fixes from the gathered set
(a collect's `count`) is a constant with no inputs; and emit (`finish`)
does not run in the probe, so rules checked at emit are not checked.

## Entries

### 1. Collect and polyline by literal index

```xml
<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n"><number name="x">$y</number></repeatForSequence>
<collect name="c" from="$r" componentType="number"/>
<number name="y">$c[2]</number>
```

and the same with `<polyline name="pl" vertices="$r"/>` and `$pl[2].x`.

Observed: load error, `dependency cycle involving component 'x.value'`
(`'p.x'` for the polyline). The probe clamps an index past its one item to
the last item (`resolve.rs`, the `Collect | Polyline` arm) and the copy's
edge to the original defaults to a reset label.

Verdict: closed by ADR 0012.

Imprecision, not a hole: the clamp applies to every collect, including one
whose gathered set never follows a repeat. A document with a repeat
anywhere and `<collect from="$g">` over three fixed points plus
`<number name="y">$c[5].x</number>` feeding one of those points is
rejected at load, although `$c[5]` is missing at every count. A rule that
clamps only when some gathered item lives in an iteration scope would
remove the false rejection.

### 2. Collect count and polyline `numVertices` read by the repeat's count

```xml
<booleanInput name="g"/>
<repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence>
<collect name="c" from="$r" componentType="point"/>
<boolean name="two">$c.count = 2</boolean>
<number name="k">2 - $g*$two</number>
```

and the same with `$pl.numVertices`.

Observed: loads, settled, at count 2 (`g` is 0). Setting `g` to 1:
`document structure did not settle after 8 rebuilds`, the input holds 1,
the structure is left unsettled. The same inside a nested repeat (the
collect and count in an outer iteration) behaves the same.

Why: `expand_collect` sets the collect's slot 0 to `Source::Fixed(n)`, the
number gathered; a polyline is the same body. The count's DFS in
`check_counts` stops at the constant, and `check_loops` has no edge either.
Reading an *item* of the collect instead (`$c[2].x`) is caught, since the
copy's slot aliases the original inside the iteration.

Verdict: **open hole**. Proposed rule: in the probe, give a collect's count
(and a polyline's `numVertices`) a probe-only source that reads one slot of
every gathered original, or of the repeat's own count slot, so the DFS from
a count reaches the iterations through it. Equivalently, label the
constant as "depends on the gathered set" and have `check_counts` follow
it. Kept as `a_count_reading_a_collect_over_its_own_iterations_is_a_cycle`.

### 3. Two repeats whose counts read each other's iterations

```xml
<booleanInput name="g"/>
<repeatForSequence name="r" length="$a"><number name="x">1</number></repeatForSequence>
<repeatForSequence name="s" length="$b"><number name="y">1</number></repeatForSequence>
<boolean name="bs">$s[2].y > 0</boolean>
<boolean name="br">$r[2].x > 0</boolean>
<number name="a">2 - $g*$bs</number>
<number name="b">2 - $g*$br</number>
```

Observed: loads settled at counts 2 and 2. Setting `g` to 1: `document
structure did not settle after 8 rebuilds`. The counts alternate between
(1, 1) and (2, 2).

Why: `check_counts` asks only whether a count reaches a slot inside its
*own* iterations. Here `a` reaches `s`'s iterations and `b` reaches `r`'s,
and the existence of an iteration is not an edge, so no slot loop exists
either. The variant where one count aliases the other (`b` is `$a`) *is*
caught, because the DFS from `b` passes through `a` into `s`'s iterations.
The same holds through a `<functionIterates>` and the `<repeat for>` over
it: `numIterates` reading an iterate through the repeat is caught.

Verdict: **open hole**. Proposed rule: generalize `check_counts` from
self-loops to cycles on the repeat graph: an edge from repeat `r` to
repeat `s` when `r`'s count reaches a slot inside `s`'s iterations (or,
with entry 2's fix, a constant derived from them); any strongly connected
component with an edge is a structural cycle. Nesting adds no edge, since
an inner count reading the outer iteration is the legal case. Kept as
`counts_reading_each_others_iterations_are_a_cycle`.

### 4. Load-time select inside a repeat

```xml
<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n">
  <select name="s">
    <option><number name="a">1</number><number name="b">2</number></option>
    <option><number name="a">$b</number><number name="b">$a</number></option>
  </select>
</repeatForSequence>
```

Observed over seeds 0 to 11: seeds whose iteration 1 draws option 2 fail
at load with a cycle; seeds 1 and 7 load clean (iteration 1 draws
option 1) and the request `n = 2` fails with `dependency cycle involving
component 'a.value'`; seeds 5 and 8 happen to draw option 1 at
iterations 1 to 3 and rebuild cleanly. A second form, where option 2 is
`<number name="a">$y</number>` and the document has
`<number name="y">$r[2].s.a</number>`, behaves the same (seeds 0, 3, 5
load clean and fail at `n = 2`).

Confirmed on the way: the pick is a pure function of the seed, the
select's node and its chain of (repeat node, position) pairs
(`seeded_stream`), so a pick never changes across rebuilds and an
iteration that disappears and returns draws the same option. The seed is
in `Structure` and carried over unchanged. The essential key of a pick is
(scope, template slot) and scope ids only grow. What differs is the pick
*per iteration*, by design, and the probe expands iteration 1 only.

The same mechanism empties a collect in the probe: with the point living
only in the option iteration 1 does not draw,
`<collect name="c" from="$r" componentType="point"/>` has no item in the
probe, `$c[1].x` resolves to the missing slot (the `Some(_) => Missing`
arm), and a document that feeds that back into the point loads clean and
fails at `n = 3` (seeds 1 and 2).

Verdict: **open hole**, distinct from the "check every option" question
ADR 0012 leaves open, because here the document is cyclic for the seed
the student has. Proposed rule: in the probe, expand every option of a
select that sits inside a repeat body (as a reactive choice expands every
case), with the pick edges labelled reset; a select outside any repeat
keeps probing its real pick. Kept as
`a_cyclic_option_drawn_by_a_later_iteration_is_a_cycle`.

### 5. Reactive `<conditionalContent>` and the branch interface

```xml
<numberInput name="n" value="1"/><booleanInput name="b"/>
<repeatForSequence name="r" length="$n">
  <conditionalContent name="cc">
    <case condition="$b"><number name="x">1</number></case>
    <else><number name="x">$y</number></else>
  </conditionalContent>
</repeatForSequence>
<number name="y">$r[2].cc.x</number>
```

Observed: load error, cycle at `x.value`.

Verdict: cannot happen. Every case is built in every build
(`expand_choice`), the `Choose` operator over an interface name reads
every branch's slot, gates are `Eq` operators over the choice cell, and
nothing is built lazily or by value. The only count dependence is through
indexed references, which ADR 0012 covers.

### 6. Sticky groups

```xml
<booleanInput name="g"/>
<graph><stickyGroup name="sg">
  <repeatForSequence name="r" length="$k"><point name="p">(1,1)</point></repeatForSequence>
</stickyGroup></graph>
<boolean name="two">$r[2].p.x > 0</boolean>
<number name="k">2 - $g*$two</number>
```

Observed: load error, cycle at `r` (the count reads its own iteration).

Verdict: cannot happen. The snap pre-pass acts on requests
(`document/sticky.rs`), adds no instruction and no edge; the member table
is rebuilt from the component table after every build, so membership
follows iteration counts without touching the graph.

### 7. Answers and scoring

```xml
<booleanInput name="g"/>
<section name="sec" aggregateScores>
  <repeatForSequence name="r" length="$k">
    <mathInput name="m"/><answer name="a" response="$m">1</answer>
  </repeatForSequence>
</section>
<boolean name="full">$sec.creditAchieved = 1</boolean>
<number name="k">2 - $g*$full</number>
```

Observed: load error, cycle at `r`.

Verdict: closed by ADR 0012. The credit wiring (`scoring.rs`) runs in the
probe too; the weighted mean's edges into the iteration's answer are
labelled reset by default and `check_counts` follows them. At count 0 the
credit is a constant, which is exactly the case the probe's one iteration
exposes. Section numbers inside a repeat are constants per position and
read nothing structural.

### 8. Math lowering

```xml
<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n"><math name="mm">$m + x</math></repeatForSequence>
<math name="m">$r[2].mm</math>
```

Observed: load error, cycle at `mm.expr`.

Verdict: closed by ADR 0012. The symbolic-or-numeric decision
(`is_symbolic`) can flip between builds (`m` is numeric at count 1 because
its leaf is the missing slot, symbolic at count 2), but the decision only
changes the operator; the set of leaf edges is the same, and the probe
resolves the leaf to iteration 1 so it decides as the full build would.
The "reference cycle counts as numeric" memo (`MathMode::Deciding`) breaks
only the *decision's* recursion; the edges are still emitted and the loop
is reported. `SourcePlan::Math` emits no edges when the expression has a
free symbol (`is_numeric`), but that is decided by the DAST text alone.

### 9. `<functionIterates>` and `<repeat for>`

```xml
<numberInput name="n" value="1"/>
<function name="f" variables="u">2 u</function>
<functionIterates name="fi" function="$f" initialValue="$rp[3].v" numIterates="$n"/>
<repeat name="rp" for="$fi.allIteratesWithInitial" valueName="x" indexName="i">
  <number name="v">$x[1]</number>
</repeat>
```

Observed: load error, cycle at `x.x1`.

Verdict: closed by ADR 0012. The probe carries both the first-iteration and
later-iteration sources (`Probe::extra`), the `<repeat for>` count aliases
the iterates' count, and `$fi[i+offset]` is labelled with the offset. A
`numIterates` reading an iterate through the repeat is caught by
`check_counts` through the alias (entry 3).

### 10. Nested repeats

```xml
<numberInput name="n" value="1"/>
<repeatForSequence name="o" length="$n" indexName="i">
  <repeatForSequence name="r" length="$i" indexName="j"><number name="x">$y</number></repeatForSequence>
</repeatForSequence>
<number name="y">$o[2].r[2].x</number>
```

Observed: load error, cycle at `x.value`.

Verdict: closed by ADR 0012 for misses. A real cycle in the stamped graph
projects to a closed walk of the probe graph whose shifts sum to zero in
every kept coordinate, so the per-coordinate test cannot miss one unless an
edge carries a wrong kept label; the labels read from `resolve` and
`edge_label` are correct for every path examined (unlabelled edges keep
only the scope prefix the two slots share).

Imprecision, as the ADR says: the per-coordinate test over-reports.
`x` reading `$o[$i+1].r[$j-2].x + $o[$i-2].r[$j+1].x` is rejected at load
with shifts (1, -2) and (-2, 1), although no non-negative combination of
those sums to zero and no count realizes the loop. A joint test (a
zero-sum non-negative combination across coordinates at once) would remove
it; a false rejection is read by the author, so it is not a hole.

### 11. Carryover and the settle loop

Verdict: cannot happen on its own. The carryover holds iteration counts by
(scope, node) and essential values by (scope, template slot), both stable,
and the seed. A rebuild starts from the previous counts and settles when
every count cell matches; what can oscillate is a count whose value depends
on the existence of iterations, and every such dependence is a reference
into iterations, a collect-derived constant (entry 2) or another count
(entry 3). Nothing else in `Carryover` feeds the graph.

### 12. Validations deferred by a missing referent

A reference past the count at load resolves to the missing slot without
looking at what it would name, so rules about the referent run only on the
rebuild that makes it exist. Probed: a number aliasing a point
(`$r[2].p`, arity), a copy of a section (`$r[2].sec`, uncopyable), a math
leaf naming a point (`$r[2].p + 1`), an unknown prop (`$r[2].x.nosuch`),
`extend="$r[2].p"`. Every one is a load error today, because the probe
expansion resolves them against iteration 1 and runs the same rules. This
is a side effect of ADR 0012 worth keeping.

One rule runs at emit and escapes the probe:

```xml
<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n"><number name="x">$mi</number></repeatForSequence>
<mathInput name="mi" prefill="$r[2].x"/>
```

Observed: loads clean; `n = 2` fails the rebuild with
`prefill="$x.value": a prefill reference must name a value that is not
computed` (and then panics, see entry 13). With count 2 at load the same
document is rejected at load.

Verdict: **open hole** of the same shape (clean load, rebuild error the
student sees), not a cycle. Proposed rule: check seed sources in the probe
(after `resolve_all`, the source kind of each `seeds` entry is known: an
alias chain ending in a `Literal`/`Default`/`Fixed` is fine, anything
reaching an `Op` is not), or run `seed_cells`'s check in the probe. Kept as
`a_prefill_naming_a_computed_cell_past_the_count_is_rejected_at_load`.

Also noted, not an error: `$r[2].t.value` with `t` a text is a `Number`
copy at count 1 and a `Text` copy at count 2 (`place`'s `is_text`), so the
copy's component type changes across a rebuild. A renderer keyed by type
would see a different component.

### 13. A failed rebuild beside a symbolic instruction panics

Found while probing entry 12. Any document with a symbolic instruction (a
`<mathInput>` read by a number, a `<math>` with a free symbol) whose
rebuild fails, for any of the reasons above, panics instead of returning
`rebuild_error`:

```
range end index 2 out of range for slice of length 0
crates/cells-core/src/program/mod.rs:260 (step_sym)
```

`Document::rebuild`'s error path calls `put_engine`, which installs
`Sym::new(engine)` with an empty memo and then `run_all`s the old program;
`step_sym` indexes the memo by operand position. The memo is sized only in
`Program::schedule`. Not a cycle hole, but it turns every hole above into a
crash on the page that is most likely to have one (anything with a
`<mathInput>`). Kept as
`a_failed_rebuild_beside_a_symbolic_instruction_reports_instead_of_panicking`.

### 14. Other `Resolved::Missing` sites

- `Step::Index` on a `PointList` past its children: the children come from
  a polygon's, circle's or line's array prop, whose item count is fixed by
  the DAST (`resolve_items` reads a `Fixed` count), so the index is missing
  at every count. Cannot happen.
- `Arg::Ref(_, Sel::Item(..))` past the items: the same array props; a
  polyline has none. Cannot happen.
- `Step::Index` on a select past `numToSelect`: a literal. Cannot happen.
  `$r[2].s[2].v` with the select in a repeat loads and rebuilds cleanly.
- `resolve_iface` from `Missing`: only reached through an indexed path,
  which the probe clamps.
- A `Step::Index` on a collect that is empty in the probe: entry 4.

## Open holes, ranked

1. **A failed rebuild panics beside a symbolic instruction** (entry 13).
   Not a cycle, but it is what a student actually sees for every hole
   below on any page with a `<mathInput>`, and it is a one-line fix:
   size the memo in `put_engine` (or keep the old `Sym`'s memo) before
   recomputing. Independent of ADR 0012.
2. **Select inside a repeat probed at iteration 1's pick only** (entry 4).
   The most likely to be authored: a problem set that repeats a randomly
   chosen variant, where one variant has a loop the author never drew.
   Rule: probe every option of a select inside a repeat body, pick edges
   reset.
3. **Counts reading each other's iterations** (entry 3). Needs two repeats
   coupled through indexed references in both directions, which is rare
   but is exactly the pattern a "show one more row when the other table is
   full" document has. Rule: cycles on the repeat graph, not self-loops.
4. **A collect count or polyline `numVertices` over the repeat's own
   iterations** (entry 2). A `count` reading `$c.count` is natural to write
   (grow until the collection has N items). Rule: a probe-only edge from
   the gathered constant into the iterations, so the DFS and the repeat
   graph of item 3 both see it.
5. **Prefill rule deferred past the count** (entry 12). Rare and an
   `Unsupported` error rather than a cycle, but the same clean-load,
   failing-tick shape. Rule: check seed sources in the probe.

Items 2 to 4 are all gaps in what the probe models, not in the SCC test;
each is a change to `build/cycles.rs` and the probe arms of
`resolve.rs`/`expand/mod.rs`, with the SCC test untouched. The ADR 0012
mitigation listed as a separate change, rolling back the essential write
when a rebuild fails, would keep the document consistent for every item
but item 1, and is still worth doing: a hole this survey missed will have
the same shape.

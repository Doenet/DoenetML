# Composed inverses write the input that leads to state, and are checked whole

Status: proposed 2026-10-29. A plan: steps 1 to 3 below are done,
steps 4 to 6 are to do. It
decides whether component props keep inverting by composition before
the remaining components are ported (ADR 0016).

A prop's inverse stays composed: the core inverts the chain of operators
a prop lowers to, each by its own rule, and component authors write no
inverse code except as a vector operator. Three changes make that sound
first:

1. **Orientation.** A binary operator writes the input whose sources
   include state, not whichever input happens to be first. When exactly
   one input leads to a writable value, the build puts that input first.
   For subtraction and division this uses new reversed operators. When
   both inputs lead to state through *different* sources, the first
   input is written, as now.
2. **Refusal.** A request is dropped, and the build warns, when the
   value its inverse writes reaches the requested cell along more than
   one path (`x * x`, `S - b S I`). Today such a request lands on a wrong
   value, and asking again moves it.
3. **Whole-prop checks.** A standing test asks every interactive cell of
   the golden documents and fixtures for several values. Each must come
   out exact, projected (asking again for either value changes nothing),
   unchanged or dropped, never anything else. Vector operators get the
   same round trip over samples.

## Context

What the JavaScript core's handwritten inverses do, and what composition
does on real documents, was surveyed on 2026-10-29. The survey is to be
written up in step 1.

**The current core.** Its 221 state-variable inverses
(`inverseDefinition`, outside tests) break down as:

| What the inverse does | Count |
|---|---:|
| Passes the value through to one input or its stored value | 80 |
| Routes by structure: attribute if given, else `bindValueTo`, else stored | 40 |
| Undoes arithmetic | 11 |
| Clamps, rounds or snaps | 11 |
| Entry by entry over an array | 14 |
| Depends on run-time context | 22 |
| Symbolic | 20 |
| Moves several inputs together | 13 |
| Other | 10 |

- The first five rows, about 70%, are what composition and a choice of
  lowering at build time already express. Moving several inputs
  together is what this core's vector operators and point groups do
  (ADR 0006).
- The 94 `inverseArrayDefinitionByKey` sites (about 6,800 lines, where
  polygons, polylines and rectangles keep their shape) were not
  classified.
- 72 of the 221 have conditional failure paths written by hand. Four in
  `RegularPolygon.js` (lines 638–784) return `{ sucess: false }`, a typo
  that has gone unnoticed.

**The current core's `<math>` inverse is composed too, with a better
rule.** `checkForScalarLinearExpression` (`utils/valueFunctions/math.js`)
writes the operand whose variables include a modifiable child, whatever
its position. It returns `foundLinear: false` when both operands contain
one. The Rust core's handwritten `<math>` inverse refuses any math with
more than one input (`math_prop.rs`, a TODO).

**This core.** A sweep asked every interactive number cell of the golden
documents and `fixtures/sir.doenet` for several values, 18,248
requests, with an x/y pair asked together as a point group.

- Every request whose written value reaches the requested cell along one
  path came out exact, projected, unchanged or dropped.
- All 10,733 that came out *unstable* reach it along more than one path:
  the value missed the request, and asking again moved it. 10,724 are
  points and tuples of `sir`'s `functionIterates`. Nine are in the
  golden `ops` document, where `i = max(f / b, n) + a` with `a`, `b`
  and `f` computed from `n`.
- A binary operator holds its other input fixed while it writes its
  first. When the other input moves with the written one, the answer is
  wrong.
- The circle's hidden `Mul(radius, radius)` is the same case. It is not
  interactive today.

**What checks inverses today.**

- The `inverses` tests check each scalar operator alone, with its inputs
  bound to distinct cells.
- Nothing checks a composed chain, or a vector operator's round trip
  (ADR 0018: "Vector operators have no round-trip tests yet").
- 5 of 63 types have specs.
- The listing of `drops` operators on draggable paths that ADR 0016
  promised does not exist.

**The first-argument rule.** It costs component authors the order of
their operands (ADR 0016, `components/inputs/mod.rs`'s slider). It
drops `k / $a`, because the lowering puts the fixed `k` first.

## Decision

### Orientation (fix 1)

A new pass, after planning and before the writable walk (ADR 0018,
`build/writable.rs`), orients every binary scalar operator. It cannot
run during lowering, because the walk follows the operators' `writes`
masks, which orientation decides.

1. **Find which inputs lead to state.** An input *leads to state* when
   its sources, through every input of every operator below it, include
   a value slot (a literal or a default) or an input's own state. A fixed
   value does not count, nor a `Hold`'s flag.
2. **Exactly one input leads to state:** that input becomes the first.
   - `Add`, `Mul`, `Min` and `Max` swap their inputs.
   - `Sub` and `Div` become new entries that keep the "writes its first
     input" rule, so `scalar_ops!` needs no new form and the
     `inverses` tests cover them as they are:
     - `RSub(a, b)` = `b - a`, written `exact |d| (A, b - d)`;
     - `RDiv(a, b)` = `b / a`, written `exact |d| (d != 0).then_some((A, b / d))`.
   - A literal numerator lowers to `Over(a; k)` = `k / a`, written
     `exact |d| (d != 0).then_some((A, k / d))`, so `k / $a` is no
     longer dropped.
3. **Both inputs lead to state through different sources:** the first
   input is written, as now. ADR 0018 records that the current core does
   the same for `<point x="$k $n"/>`.
4. **Both lead to the same source:** the request is refused (fix 2).
5. **Neither leads to state:** the request drops, as now.

Component tables (`computed(OpSpec::…)`) are oriented by the same pass,
so an author no longer orders operands for the inverse's sake.

### Refusal (fix 2)

After the writable walk, the build finds each interactive cell's
*written slots*: those its inverse can reach, following the `writes`
masks and aliases as the walk does.

- It counts the paths from each written slot to the cell over every
  input of every instruction, saturating at 2.
- A vector operator counts as one node: its handwritten inverse is
  trusted to handle its own inputs together.
- A cell with any count of 2 gets a bit beside `interactive`
  (`document/interactive.rs`).
- `request.rs` drops a request on such a cell, before inversion, into
  `TickOutcome::dropped`.
- The build emits a warning (a new `cells-` code, ADR 0013) naming the
  prop and the source it reaches twice.
- The same pass emits the listing ADR 0016 promised: an info diagnostic
  for a `drops` operator on an interactive path.

### Whole-prop checks (fix 3)

- **The standing sweep.**
  - `tests/round_trip.rs` loads the golden set and `sir` (not the
    generated fixtures; see step 3).
  - It requests every interactive number cell at several values, and an
    x/y pair of one component as a point group.
  - It asserts that each comes out exact, projected, unchanged or
    dropped.
  - Until fix 2 lands, it asserts the exact unstable requests known
    instead, counted by document and row. That list may only shrink: the
    test fails when a row gains an unstable request, or when a listed row
    loses one without the list being changed.
- **Vector operators.** A test in `program/vector.rs` runs each vector
  operator's inverse over its `writes` samples. It requires the same
  round trip of each output requested alone and of all together, with
  shape-preserving operators checked against their stated rule.
- **New components.** The spec harness (`testing/spec.rs`) runs the sweep
  on each spec's document, so every new component is held to it without
  writing a case.
- **Domains.** An inverse can round-trip and still accept a value its
  prop cannot hold, so the sweep cannot see it. A spec of an interactive
  prop with a domain (an index, a count, a bounded value) requests
  values outside it and expects them projected or dropped. The survey
  found `choiceInput`'s `selectedIndex` writing 2.5, 7 and −1 as asked.

## Considered options

- **Handwritten inverses per prop, as both current cores do.** Rejected.
  - It moves the 70% that composition expresses back into per-component
    code.
  - Each inverse would need its own tests to reach what one property test
    gives every chain.
  - The writable walk needs each inverse's writes declared statically,
    which hand-written code would have to repeat by hand.
  - The survey's typo and the Rust core's TODO are what it costs.
- **Solving a multi-path request numerically** (a secant or Newton
  iteration through the lookahead of ADR 0006). Deferred.
  - It would make `x * x` and `sir`'s points draggable, which neither
    current core does.
  - It is a new behaviour to specify (which root, convergence, a
    projection's interplay).
  - Refusing matches both current cores, and the bit leaves room for it.
- **Checking each request at run time by lookahead**, accepting it only
  if the realized value round-trips. Rejected: it pays a forward
  evaluation on every tick to find what the build can know once.
- **Refusing every request where two inputs lead to state.** Rejected:
  it would refuse `<point x="$k $n"/>`, which the current core
  inverts.

## Migration

Each step is one commit that passes `cargo test --workspace` and the
golden diff (`scripts/golden-diff.sh`), or lists the diff it expects.

1. **Write up the evidence.** Done. `docs/composed-inverses.md` holds:
   - the survey of the current core's `inverseDefinition`s, with the
     examples behind each count;
   - the sweep's results;
   - the comparison with `checkForScalarLinearExpression`.

   The sweep is `crates/cells-bench/examples/round_trip.rs`, which prints
   the classification for any document (`-- path.doenet`).
2. **Survey the `inverseArrayDefinitionByKey` sites.** Done; the
   report's "What the JavaScript core's array inverses do".
   - There are 96 sites, about 7,200 lines.
   - 63 are composable, 5 are existing vector operators, and 5 are
     point groups or sticky snapping.
   - 10 need new vector operators, about nine kinds, each a pure
     function of the requested and current values.
   - 6 are symbolic (out of scope, below), and 7 are plumbing.
   - *Gate:* none needs history or the cause of a request without a
     mechanism here, so the ADR stands.
   - Three findings change the plan:
     - The new vector operators come before the components that need
       them (step 6). Composed, two of them reach a value along several
       paths (a parabola's vertex, a normalized direction), so fix 2
       would drop requests the current core moves.
     - An inverse reads its inputs from the current cells. A port
       therefore decides which cells a whole-shape drag requests, or
       gives the joint move to one operator (a rectangle's span).
     - A round trip does not check a domain: `choiceInput`'s
       `selectedIndex` takes 2.5, 7 or −1 exactly. Fix 3 adds domain
       cases.
3. **Land the standing test.** Done.
   - **The sweep** is `testing::round_trip`. The `round_trip` example
     prints it.
   - **`tests/round_trip.rs`** sweeps the golden set and `sir`, 18,248
     requests.
     - It requires every unstable request to be multipath.
     - It requires the unstable requests to be exactly
       `KNOWN_UNSTABLE`: `ops`'s number and point (9) and `sir`'s
       points and tuples (10,724).
     - The list counts requests by document and row (`"point (x, y)"`)
       rather than by component path, which would list `sir`'s hundreds
       of components. A changed count fails either way.
     - The generated fixtures are left out. Each is one synthetic shape
       of up to 100,000 elements, where a sweep, a copy of the document
       per request, costs the square of the size.
     - It takes 14 seconds unoptimized, most of it `sir`.
   - **The vector-operator round trip** (`program/vector.rs`) asks each
     point output's two coordinates together, as a renderer does, and
     each other output alone, then all together.
     - Asked one coordinate at a time, a point's projection (`Shape`,
       `ProjectCircle`, `ProjectLine`, `LinePointsFromCoeffs`) is not
       idempotent: the other coordinate is filled from the current value.
       No renderer asks that way.
     - It also checks that a rigid `Shape` keeps its points' distances,
       and that moving a circle's center keeps its radius.
     - Every operator passes; none is listed.
   - **The spec hook** sweeps each case's document after its load. All
     five specs pass.
   - **Domains.** Of the specs' components, only the slider has
     interactive props with a domain, value and index. Its spec already
     checked the value's range and step and an index above the range; it
     now also checks an index below the range, and a NaN index, dropped.
   - **`choiceInput`'s unprojected `selectedIndex`** is a separate task;
     it has no spec yet.
4. **Orientation**: the pass, `RSub`, `RDiv` and `Over`, with
   `Div(Fixed k, a)` lowered to `Over`.
   - Expected golden diff: a request through a reoriented operator
     writes the input that leads to state where it was dropped before.
     Each such row is listed in the commit.
5. **Refusal**: the bit, the drop in `request.rs`, the warning and the
   `drops` listing. The standing test's known-unstable list becomes
   empty and is removed.
   - Expected golden diff: the listed cells' requests are dropped.
   - Requests the sweep found projected but reaching their source twice
     (483, nearly all in `sir`) are dropped too. The commit lists those
     that are not in `sir` and says whether the current core moves them.
6. **Measure and close.**
   - `scripts/tick-diff.sh`: the tick must not slow by more than the
     noise floor. The new operators cost what the ones they replace do,
     and a refused request is one bit read.
   - Load time on `sir` and the largest generated fixtures: orientation
     is one pass over the operators. The path count is per interactive
     cell; if it costs more than 5% of load, it becomes one pass per
     written slot over its dominated region.
   - Rerun the parity dashboard's drag rows (`CELLS_CORE_PARITY.md`).
   - Then mark this ADR accepted, and port the remaining components
     (ADR 0016) with composition, vector operators for joint moves, and
     the round trip required of every spec.
   - Each port lands with the vector operators the report lists for it
     (`Centroid`, `Span`, `RegularPolygon`, `ParabolaVertex`,
     `Normalize`, …). Each port says which cells a drag of the whole
     component requests.

Out of scope:

- symbolic inverses beyond `Evaluate` (ADR 0005), which stay where the
  engine is, including the six symbolic array inverses step 2 found
  (rebuilding a vector or matrix expression, matching a choice's
  text);
- the current core's run-time context in inverses (`initialChange`,
  `displayMode`), which is a difference between the cores' models, not
  between ways of writing an inverse.

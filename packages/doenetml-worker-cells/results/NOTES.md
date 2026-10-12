## Observations

_Hand-written; included verbatim by `scripts/render-results.py`. Numbers quoted here are from the run on the date in the header and are rounded._

**The core is never the bottleneck.** A full recompute of 100,000 derived cells takes about 0.7 ms natively and 1.5 to 2.5 ms inside wasm in the browser, including inverting a 100,000-step chain back to its essential cell. Linear extrapolation puts the 50 ms drag budget at several million serial operators. Chain depth, the question the prototype was built to answer, is not a constraint in this architecture. Everything that threatened the 50 ms loop in the browser turned out to be renderer cost (see below).

**Startup: the wire format and the component layer were the costs, and both are now structural rather than incidental.** The first version deserialized DAST JSON into a tree of enums and built a `Vec` of component structs; at 100k cells that was about 300 ms of JSON and 140 ms of build after the easy fixes (a single-pass serde visitor, no per-slot strings), and 1.1 s end to end in the browser. Two structural changes followed. The DAST is now flat and columnar with one shared string table, loaded either from the same JSON or from a compact binary format (`CDST`, ADR 0002) that is about 40 percent of the JSON size and decodes as a few `memcpy`s plus bounds checks. Components are parallel arrays with implicit props and a packed child list, and the renderer reads those columns through typed-array views exactly as it reads cells, so there is no serialized render manifest. At 100k cells, decoding the binary takes 8 ms natively where the JSON takes 255 ms, so the whole native load is about 80 ms from the binary against 356 ms from JSON and about 1,170 ms in the first version. In the browser the core loads in about 170 ms from the binary (down from 506 ms from JSON), the build stage takes about 60 ms natively (down from 140), and the table step that replaced the manifest takes under a millisecond (down from about 100 ms). A 10k-point document loads end to end in the browser in under 200 ms, most of it React's first render. What remains is the fetch, React's first render of large documents, and the text parse that sits outside the measurements.

**Memory is now about 85 bytes per cell for operator chains and 36 for plain points**, down from 270 and 150. Cells are 8 bytes; the program is 36 bytes per derived cell (a 32-byte instruction plus the producer index); the component columns are about 28 bytes per component plus 4 per child and per prop; the string table holds the unique names, about 10 bytes per named component. The `aliases` fixtures still make the point that components, not cells, are the memory: 10,000 copies of one point produce 6 cells and about 320 KB of component columns. Shrinking further would mean narrower instruction encoding and dropping names for unnamed components, neither of which the measurements justify yet.

**Full recompute beats dirty tracking on dense closures; sparse closures want the opposite.** On chains and fan-outs, where a drag changes nearly every derived cell, the branch-free full pass is fastest at every size and the dirty-scan pays for its checks. The heap-based dirty-closure is several times slower there because of per-instruction heap traffic. On the grid fixtures, where a drag touches one chain out of a thousand, dirty-closure is two orders of magnitude faster than either alternative. A production core wants a hybrid: walk the closure, but fall back to a plain scan of the affected index window once the closure is a large fraction of the program.

**In the browser, two renderer pitfalls each cost more than the whole core.** First, React clones every child fiber of a parent on the update path, so a document with 100,000 sibling components spent about 35 ms per tick in React even when only a handful of cells changed; chunking children into a 32-ary tree brought that to under 1 ms. Second, the newline between every element in the generated documents became a `<span>`, and Chromium spent over 100 ms per tick laying out 100,000 of them; dropping whitespace-only text at build time brought the 100k-chain frame time from 125 ms to under 4 ms. After both fixes, the one case that still misses the 50 ms budget is `fanout-10000`: 10,000 circles legitimately move on every tick, and React plus SVG painting cost about 100 ms. That is a limit on simultaneously moving rendered elements, not on the dependency graph.

**The zero-copy read path works as intended.** The renderer reads cells through a `Float64Array` view over wasm memory and re-derives the view only when the pointer or buffer changes. Per-cell-index subscriptions mean a tick that changes N cells wakes exactly the N subscribed components. The cost of transferring the changed-index list out of wasm is visible for the 100k chain (about 1 ms of the 2.5 ms core time) and could be removed by letting the renderer scan a dirty bitmap in wasm memory instead.

**A serving detail worth knowing: the binary fetched slower than the JSON on the preview server** (about 390 ms against 230 ms at 100k cells) because the server gzip-compresses JSON but not an unknown binary type, and 46 MB of JSON compresses far better on the wire than it parses. In production the binary should be served with content encoding too; it compresses well since most of its bytes are small integers and repeated names.

**Moving the core to a worker costs 1 to 10 ms of latency per tick and one vsync.** With the core in a Web Worker, the round trip from pointer event to updated cells on the main thread is about 1 ms for small documents and 5 to 10 ms when 10k to 100k cells change, whether the values arrive through a `SharedArrayBuffer` (the worker copies only changed cells into it) or by `postMessage` of changed indices and values. The two transports are within noise of each other at these sizes; the shared buffer wins only in that the main thread never allocates. Because the update becomes asynchronous, the resulting frame lands on the next vsync, so frame latency is about 17 ms instead of 1 to 3 ms on the main thread. True zero-copy wasm shared memory (atomics) was not built: it needs a nightly toolchain, and the copy-into-shared-buffer variant already shows the boundary cost is small next to React and painting. Worker startup adds about 5 to 20 ms for spawn and module load; the document bytes are transferred into the worker rather than copied, and the component columns are copied out once at load (a few milliseconds at 100k components).

**Against the current core, the prototype is two to four orders of magnitude faster on the same documents.** The current standalone bundle (JS core) was given the same generated documents with `<op>` rewritten as `<number>` math and `numberInput` as `mathInput`. It took about 2 s to initialize 100 free points and 34 s for 1,000; the prototype loads 1,000 points in about 70 ms end to end, including React's first render. A `movePoint` action on one of 100 points took about 22 ms in the current core and about 170 ms with 1,000 points, where the prototype's whole tick is under 1 ms. The gap is widest on chains: moving the point at the end of a 100-step chain of numbers took about 130 ms in the current core and about 2.1 s for a 1,000-step chain, against 0.1 ms here. Fan-out is similar: one input driving 1,000 points took 78 s to initialize and 5.3 s per move in the current core, against about 10 ms per frame here. Part of the current core's cost is its generality (math expressions, the component-per-value graph, the worker round trip, JSXGraph), so this is not a like-for-like comparison of equal functionality; it is the comparison the prototype was built to make, between a data-organized core and the component-organized one on documents both can express. The current core could not be measured on the 10k-cell fixtures within the time budget.

**The TypeScript parser is the slowest stage by far, even though it is out of scope.** Parsing 5 MB of DoenetML to DAST takes about 5 s in node and needs a larger stack for 100k sibling elements. Any startup target below a second for large documents requires parser work regardless of core architecture.

**Measurement caveats.** `performance.now()` in headless Chromium is coarsened to 0.1 ms, so the in-browser core column is a sanity check; the criterion tables are authoritative for core time. Chromium coalesces pointer events when the main thread is busy, so slow documents record fewer ticks than mouse moves. The current wasm-pack's bundled wasm-opt had to be disabled; the wasm is compiled with Rust's release profile only.

## Plan 2: real functionality (sliders, repeats, types, symbolic math)

_The second round asked whether the cell architecture holds for four kinds of functionality Doenet needs (`docs/history/plan-2.md`). The bar: a snag is **fatal** if a feature needs component-specific code back in the core or misses 50 ms per interactive tick at 10k components; **noted** if it needs a new but generic core concept; otherwise a pass. Numbers below are from the run on the date in the header; the tables under "Structural tick", "Browser end to end" and "Baseline" hold the full set._

**Inverses: pass.** The slider's whole value chain is fifteen props of one component definition, all data (`SLIDER_PROPS` in `components.rs`): `maxIndex = floor((to - from)/step + 1e-10)`, `index = min(max(round((pre - from)/step), 0), maxIndex)`, `value = from + index * step`. No slider code exists anywhere in the core. The one rule it needed is ADR 0003: idempotent operators (Round, Floor, Clamp, Min, Max) invert by *projection*, applying themselves to the requested value, which is what makes a bound component receive the snapped value as the current core does. `bindValueTo` is nothing but an alias of the slider's storage cell onto the other component's value cell, so a slider bound to a derived number bound to an input, or a slider bound to a slider with a different step, inverts through everything with no special case (`tests/slider.rs`). Two benign deviations are recorded in the tests: a request on `index` snaps instead of being rejected (the current core never exposes `index` to a request), and `from`/`to`/`step` are cells (so `step="$s"` works). A differential test (`web/baseline/slider-diff.mjs`, table below) runs nine slider scenarios through both cores with the same requests and compares every observed value: snapping, clamping, fractional steps, off-grid initial values, binding to an input, binding to a derived number, a slider bound to a slider with another step, a step bound to a slider, non-finite requests, and an emptied input. It found three differences in 36 observations, two of which were then aligned (infinite requests are dropped before inversion; a NaN stored value puts the slider at `from`). The one that remains is in the current core: its `<number>` inverts only through a single math child (`Number.js`, `singleMathChild`), so after a slider bound to `<number>2$n</number>` is dragged to 7.4 the current core shows 7 on the number and the slider but NaN on the input `n`, where the prototype inverts through the lowered `Scale` and gives 3.5. The prototype's answer is the one the document asks for. Cost: a slider bound through a 100,000-operator chain is 0.59 ms per native tick (`sliderchain-100000`), the same as the plain chain; a stack of 1,000 sliders each bound to the previous one, which runs 1,000 snap chains per drag, is 76 µs. In the browser the 100k slider chain is about 1.3 ms of core per drag step.

**Arrays and repeat: pass, with one noted concept and one renderer finding.** `<repeatForSequence>` is expanded by the builder: the template is walked once per iteration, each iteration in its own *scope*, so names inside the template exist once per iteration and `$r[3].p.x`, `$r[$i-2].x` and `$c[2].y` resolve at build time (the wire format gained the index expressions, version 2). The iteration count is an ordinary derived cell (`count = min(max(floor(length), 0), maxNumber)`), read by the builder; a tick that changes it rebuilds the whole document from the retained DAST before returning (ADR 0004). Essential values survive by *essential key* (DAST node, prop, stable scope id) through a store that outlives any one build, so a point dragged in iteration 2 is still there after N goes 3 → 1 → 5. A reference with no referent is the shared fixed NaN cell and re-aliases to the real cell when the iteration appears; a lagged recurrence seeds itself with the `default` operator (the cell version of `valueOnNaN`), whose inverse follows whichever argument is live, so dragging the last term of `x_k = 2 x_(k-2)` writes the seed. `<collect>` over a repeat is a build-time walk that copies what it finds (copies share cells), and grows with the repeat in the same rebuild. Nested repeats, out-of-range indices, forward lags (a cycle, rejected) and dynamic indices (`$r[$n]`, rejected as a follow-up) are covered in `tests/repeat.rs`.

The noted concept is the rebuild itself: the schedule is no longer fixed for the life of the document, only between structural ticks. Its cost is the build. The first version re-walked the DAST per iteration (tag and attribute matching, literal parsing, hashed name lookup) and cost about 0.5 µs per component: 34 ms for 10,000 iterations (60,000 components, 70,000 cells) and 243 ms for 50,000. Phase timers showed that walk and the per-prop source resolution as two thirds of it, the hashed essential-value carry-over and scheduling as most of the rest. The builder now compiles each template once into plans (parsed literals, references as paths relative to the template nesting) and stamps it per iteration through dense per-scope tables; essential values are stored per (scope, template slot) and moved rather than cloned between builds; and the scheduler verifies creation order in one pass before falling back to a sort, which it never needs for stamped templates. That is about 0.25 µs per component: 16 ms for 10,000 iterations and about 100 ms for 50,000, with the remaining time split evenly between stamping, resolving references, and numbering cells. Whole-document rebuild therefore meets the 50 ms budget natively up to roughly 30,000 iterations of this template and in wasm (about 1.3× slower) past 20,000. A scoped rebuild of just the repeat's subtree, or copying stamped iterations that did not change, is the next cut if a document needs it. A 50k-iteration repeat is 1.8 KB on the wire against 5 MB for the same points written out, which is its own argument for keeping repeats structural.

Rebuilds cascade along two constructs. Nesting: an inner repeat's count cannot be computed until the enclosing iteration exists, so each nesting level is one more pass at load (and when the outer repeat grows). Cross-iteration reads: a repeat whose count reads a cell *inside another repeat's iterations* (`length="$a[3].k"`) needs that repeat expanded first. Counts from inputs or from another repeat's `count` settle in the same pass, so a chain of such repeats loads in two passes whatever its length, and a structural tick rebuilds once. The builder measures the *structural depth* (per repeat and as a document maximum; load takes depth + 1 passes) and reports it with the load timings; it warns only for cross-iteration reads, the avoidable kind. Nesting's extra pass could be removed by evaluating an inner count eagerly when its inputs are fixed (an iteration index) or already settled, which is the natural next cut if nested repeats turn out to be the common case.

The renderer finding is the one predicted in the plan (Q22): after a rebuild every cell index and component index is new, and the React tree is O(document) to bring up to date. Keying children by stable identity (DAST node plus scope, exposed as two more component-table columns) turned the rebuild from a remount into an update pass and cut its commit time by about 40 percent, but at 10,000 iterations (30,000 circles) the commit is still several hundred milliseconds, ten times the core's rebuild. At 1,000 iterations the whole structural tick, core plus React plus paint, lands in about 40 ms (`repeat-1000`: 2 ms core, 26 ms commit, 39 ms frame); at 100 iterations it is one vsync. At 10,000 iterations the core's rebuild is 18 ms in wasm and the renderer's commit 270 ms. Making the renderer's work proportional to the change needs index-stable allocation of cells and components across rebuilds, so that untouched components neither re-render nor re-subscribe; that is the follow-up, and it is renderer-side bookkeeping, not a change to the cell model.

Toggling a `booleanInput` bound to 1,000 points' `hide` is one changed cell and about 23 ms of React mounting or unmounting 1,000 circles (`hidden-1000`), again renderer cost, not core cost.

**Types: dissolved.** Nothing in the four areas needed a second storage type. Integer-valued cells are an invariant maintained by operators (`round`, `floor`, the slider's index, the repeat's count) and checked by inverses, and booleans are 0/1 cells (`booleanInput`, a point's `hide`): one `f64` array, several meanings. Chains made half of `round` operators run within 20 percent of plain chains (`intchain-100000`: 0.76 ms against 0.64 ms per full tick natively; `round` is a libm call where `offset` is an add), and there is no conversion anywhere because there is nothing to convert. The current core has no static types either: its `<integer>` is a rounding component. The question in the brief about laying out cells of different types did not arise.

**Symbolic math: pass as a design, with the experiment doing what it was meant to.** The core gained an expression arena and a `<math>` whose `expr` prop is a fixed handle into it. The deciding rule is ADR 0005: a math whose leaves are all numbers or numeric cells is *lowered* to operators at build time (`3$a + 2` is `Scale` then `Offset`, and inverts like them), and only a math with a free symbol is a math cell, with a `value` of NaN and an `expr` that `<evaluate function="$f" input="$t"/>` can apply to a number through an `EvalAt` instruction whose inputs include the expression's cell leaves. `<number>` children accept the same math text, lowered the same way. This answers the brief's question about distinguishing computational from symbolic math: the build can tell, so authors need not. A chain of 100,000 `<math>` elements costs the same tick as the `<op>` chain it lowers to (`mathchain-100000`, 0.70 ms against 0.64 ms, within noise of each other at 1,000). (Two side effects worth knowing: every `<math>` carries a second cell for its handle, so `mathchain-100000` has 200,000 cells against the op chain's 100,000; and the renderer shows a `<math>` where it shows nothing for an `<op>`, so that fixture's browser numbers are dominated by 100,000 rendered spans, not by the core.) Symbolic work happens at build time only; a tick evaluates, it never rewrites. Symbolic inverses, derivatives and simplification are the expression library's job and are out of scope here; the arena's interface (flat nodes, cell leaves, evaluate, substitute) is what the core needs from that library.

**Two concepts the round added to the core, both generic.** *Fixed cells*: constants that are not state (iteration indices, collect counts, expression handles, the missing-referent NaN); requests that reach one are dropped. *Scopes*: a naming region per repeat iteration, stable across rebuilds. Every other addition is an operator or a component definition expressed as operators.

**Against the current core.** The baseline table runs the same slider and repeat documents in the current core through its own `changeValue` action. A slider bound through 100 numbers to a mathInput takes about 124 ms per change there and about 2.3 s through 1,000 numbers; here the 1,000-number slider chain is 0.07 ms of core and under 2 ms to the frame. Changing the length of a 100-point repeat takes about 840 ms in the current core (its replacement update), against 17 ms to the frame here (1.7 ms of core); the 1,000-point repeat did not finish initializing in the current core within five minutes, where the prototype's structural tick is 39 ms. The comparison is not like for like (the current core also carries math expressions, a worker round trip and JSXGraph), but it is the comparison the prototype exists to make.

**Verdict.** No fatal snag. Two noted concepts (fixed cells, scopes with rebuild), one renderer follow-up (index-stable rebuild so React's work is proportional to the change), and the follow-ups listed in `docs/history/plan-2.md`.

## Plan 3: line, circle and polygon as operator chains

_The third round asked whether local operator inverses can match the current core's hand-written inverses for its most complicated components, and what context an inverse inherently needs (`docs/history/plan-3.md`, ADR 0006). The oracle is the current core's own vitest suites, run unmodified against this core through an adapter (`DOENET_TEST_CORE=cells`, branch `cells-prototype-adapter` of the DoenetML fork, `src/test/utils/test-core-cells.ts`); the per-test results and first errors are in `results/raw/plan3-adapter-2026-10-05.txt`. The bar is unchanged from plan 2._

**Build time or compute time: almost all of it is build time.** The current `<circle>` has nine ways to be specified and six branches in its radius inverse alone; `<line>` has five modes and an inverse that reads which attributes exist before every write. Here each specification is a different operator chain chosen when the document is built (`plan_circle`, `plan_line`, `plan_polygon` in `build/geometry.rs`), and no inverse ever asks how its component was specified. The chains use eight vector operators with hand-written inverse rules, listed with their rules in one table at the top of `geo.rs`: `Shape` (identity on n points), `CircleCenterPoint`, `CirclePoints`, `CircleTwoPointsRadius`, `PolarSlope`, `PolarDirection`, `LinePointsFromCoeffs`, `ProjectCircle`/`ProjectLine`. Everything else is the scalar operators from plans 1 and 2: a circle's radius clamp is the slider's `Clamp`, a grid constraint is `Offset`, `Scale`, `Round` and back, and an equation such as `5x-2y=3` lowers at build time to three coefficient cells (`linear_coeffs` in `expr.rs`), so dragging the line writes coefficients and never rewrites an expression. The table below classifies every inverse branch of the current `Line.js` and `Circle.js`.

| current-core inverse branch | here |
|---|---|
| line `points`, equation mode: recompute coefficients; translation keeps `coeffvar1/2` | `LinePointsFromCoeffs` inverse, same rule (local) |
| line `points`, slope mode: write slope and signed distance, point 1 fixed | `PolarSlope` inverse (local, fan-out to two inputs) |
| line `points`, parallel/perpendicular mode: write unit direction and distance | `PolarDirection` inverse (local, fan-out) |
| line `points`, two-point mode: each key to its through point | aliases: the line's points are the points (no inverse at all) |
| line `equation`/`coeff*` inverse: fails for point-based lines | coefficients are derived from points and invert through them (deviation, more permissive) |
| line `slope`, `xintercept`, `yintercept`: no inverse | invertible through `Div`/`Sub` (deviation, more permissive) |
| line guard: `initialChange && !draggable` | renderer/action concern; `fixed` makes the cells fixed (build time) |
| `moveLine` second pass: one point constrained, move the other by the same delta | point-group rule in the request engine, with lookahead |
| circle `numericalRadius` 1: prescribed radius, `max(0, r)` | `Clamp` projection (ADR 0003) |
| circle `numericalRadius` 2, 5: essential radius | essential cell behind the same `Clamp` |
| circle `numericalRadius` 3: center + 1 point, move point along saved angle | `CircleCenterPoint` inverse (local; angle recomputed) |
| circle `numericalRadius` 4: center + 2 points, fail | NaN circle at build time (over-determined) |
| circle `numericalRadius` 6: re-place all points at saved angles | `CirclePoints` inverse scales about the center (local; angles recomputed) |
| circle `numericalCenter` 1: prescribed center | alias (no inverse at all) |
| circle `numericalCenter` 2: essential center | essential cells |
| circle `numericalCenter` 3: move every through point | `CirclePoints`/`CircleCenterPoint`/`CircleTwoPointsRadius` inverses translate (local, fan-out) |
| circle `radius`/`center` dispatch (finite? prescribed? zero points?) | dissolved: the build chose the chain |
| `throughAngles` essential written by the forward pass | not needed: angles come from current cells (deviation in degenerate configurations) |
| `moveCircle` second pass: center or through point constrained | the circle inverses produce a point group; same engine rule |
| polygon rigid: one vertex rotates/dilates about pivot, several translate; `allowRotation`, `allowDilation`, `minShrink`, `rotateAround`, `rotationCenter` | `Shape` (rigid) inverse with the same options (local; pivot as two extra inputs) |
| polygon `rotationReferenceMapping` cache of pre-constraint vertices | not reproduced (sticky groups are a gap) |

**Context: one kind, and only inside a tick, and it belongs to the request, not the inverse.** Every inverse above is local. The constrained-sibling cases need exactly what ADR 0006 allows: the realized values of the points requested together. Charles's observation that this is an interaction preference, not a document constraint (nothing in a document says a line through two free points keeps its slope), moved the rule out of the operators: a whole-shape drag is a *point group* (`Document::request_points`), an inverse that moves several points produces one, and the request engine (`Engine::push_group` in `invert.rs`) runs lookahead (`Program::realize`: invert on a scratch copy, evaluate forward, write nothing) and shifts the free points when a strict subset is held back by one shift. With it, the four constrained-shape tests that the current core passes only through its compare-and-correct second pass pass here in one inversion (`circle with center and through point, center constrained` and `through point constrained`, `circle through three points, one point constrained` and `two points constrained`), as does `line through two points, one constrained to grid`. Nothing needed state from an earlier tick: the current core's `throughAngles` and `lastPointsFromInverting`, both essentials written by inverses or definitions, have no counterpart here. A free line, segment or polygon consequently has no instruction at all; only a `rigid` polygon keeps one, because the document asked for the coupling.

**Against the suites.** 46 circle tests: 30 pass, 9 are declared gaps (styles, warnings, theme, `<boolean>`, `<coords>`, `constrainToInterior`, dynamic `propIndex`, vector-valued `<mathInput>`), 7 deviate. 69 line tests: 31 pass, 30 are gaps (labels and text, `<vector>`, `<ray>`, `<sequence>`, `<function>`, 3D, an equation typed into a mathInput, a line's symbolic `equation` prop), 8 deviate (four of them self-referencing lines that load and differ only in write order, below). 49 polygon tests: 21 pass, all 11 rigid and similarity transformation tests among them; 24 are gaps (reflection, sticky groups, `attractTo`, constraining to a polygon, area and perimeter), 4 deviate. The first run passed 14 circle tests; the rest of the distance was syntax the builder did not yet accept (tuples with references in attributes, `$l.points[1][1]`, container copies, `(x,y)` children) and semantics worth knowing:

- *JavaScript rounds halves up; Rust rounds them away from zero.* `constrainToGrid dy="2"` on −3 gives −2 there and −4 here until `Round` used `floor(x + 0.5)`.
- *A copy that overrides one attribute shares the rest of the original's essential state.* `<line extend="$l" through="(4,-2)"/>` has its own first point and the original's second; dragging it moves the original. Copies here re-plan with merged attributes and alias every default they did not override (`roles` in `build/geometry.rs`).
- *A slope-based line with no through point starts at the origin,* not at (1, 0): the current core uses its second essential point for it.
- *`<number>3</number>` cannot be moved* by a drag in the current core; `<math>3</math>` can. Both were essential here; number literals are now constants.
- *A center copy of a circle with a prescribed center drags the center alone;* a drag of the circle carries the through point. The same two cells cannot do both, so `center` as a reference is the prescribed center's cells and `numericalCenter` the derived ones.

**Deviations, recorded once each.** (1) Self-referential circles (`radius="$circle1.throughPoint1.y/2"`, `center="(1, $circle1.radius)"`, four more): the current core's answers are artifacts of its correction pass fighting the self-reference (its own test comments say so); this core gives the geometrically consistent single-pass answer. (2) A center copy of a through-points circle dragged while a point is constrained: the current core moves the free points by the requested delta (no correction runs for `movePoint`), this core keeps the shape; the constrained three-point tests pass for the same reason. (3) Angles are recomputed, so a circle whose radius is dragged to zero cannot recover its points (`triangle inscribed in circle`). (4) The slope of a vertical line reports −∞ where the current core reports +∞ (sign of a zero denominator). (5) Under-determined documents (`line from points with strange constraints`, a point built from another's coordinates and dragged with it) resolve in request order here and in the current core's dependency order there. (6) `relativeToGraphScales` on a constraint is ignored. (7) Symbolic values (`radius="a"`, a vertex `(a,b)`, area as `pi`) are NaN, not expressions. (8) Line coefficients, slope and intercepts are invertible here and read-only there; an equation line whose constant is a literal translates here and cannot there. (9) When two requests in one tick land on one essential cell (a point whose x and y are the same cell, dragged to (7, 13)), the later one wins here and the first one there; six self-referencing line and polygon tests differ only in this.

**Two findings the suites forced, one of them since resolved.** First, the initial build gave every free shape one identity instruction so the constrained-sibling rule could live in its inverse. A vector instruction couples all its outputs to all its inputs, so a shape whose own vertex is defined from another of its vertices (`parallelogram based on three points`, `line through point referencing own component`, seven tests) was a dependency cycle here and legal there. Moving the rule onto point groups removed the instruction and the cycle: all seven documents now load and six differ only in write order (deviation 9). Second, `moveCircle` and `movePoint` on a center copy request the same cells but the current core treats them differently (deviation 2); here the difference is whether the renderer sends a point group or single points, which is the distinction the current core's two actions encode implicitly.

**Cost.** Ten thousand circles through three points each, with every first point bound to one input (`circles3-10000`: 40,003 components, 160,005 cells, 50,000 instructions, 7 MB on the wire), load in about 290 ms natively from JSON (187 ms of it the build, 4.7 µs per component against 1.5 to 3 for plan 2's fixtures). Dragging one circle's center, which through the shared input moves all 10,000 circumcenters, is 0.70 ms per tick with full recompute, 1.1 ms with the dirty scan and 2.8 ms with the dirty closure (table under "Tick"); at 1,000 circles the three are 53, 90 and 200 µs. The fan-out inverse and the lookahead are not visible in those numbers; lookahead's one real cost is a copy of the cell array per realized request, which is proportional to the document, not to the drag, and would want a dirty overlay if it ever showed.

**Verdict.** No fatal snag: no component-specific code in the core's tick path, every inverse a local rule on an operator, and the constrained-shape behavior reproduced without a second pass. Two noted concepts (multi-output instructions with gathering, and point groups with lookahead in the request engine as the only context a request gets), no structural limitation left, and the deviations above. Build-time variety was the whole of the circle's complication and most of the line's; the rest was the second pass, which point groups replace, and which turned out to be about the interaction rather than the document.

## Plan 4: sticky groups

_The fourth round added `<stickyGroup>`, the first relation across components, and asked which of two wirings is simplest given equal behavior (`docs/history/plan-4.md`, ADR 0007): (A) one `Sticky` identity instruction per group, whose inverse snaps, or (B) a pre-pass that snaps requests on member cells before inversion. Both called one snap kernel (`sticky.rs`), a line-for-line port of the current core's rule minus the rigid-rotation fallbacks, behind a build-time switch. Raw outputs are in `results/raw/plan4-2026-10-06/` (local)._

**Behavior: identical, so the gate passes for both.** The oracle is the current core's `stickygroup.test.ts`, run unmodified through the adapter. Both wirings pass the same 3 of 6: the translate scene, line segments, and the symbolic vertex. The other three fail at load on general gaps, not on snapping: an `extend` of a component that does not exist (`$g1.sg.A` in test 2), `$pg1.vertices` rendered inside `<p>` (tests 3 and 4), and `<polyline>` (test 4). Two further checks look past those gaps:

- A copy of the test file with only those lines removed passes 4 of 6 under both wirings. Test 2, parallel edges snapping on translate, passes in full: the ported edge stage covered it, though the brief had put it under Tier 3. Test 3 stops at its first step, a rigid rotation (Tier 3, as declared).
- A differential test replays test 3's ten non-rigid single-vertex drags (Tier 2) from the state the current core reaches after the rigid steps. Both wirings match the current core at 1e-9 on all ten steps.

**What separated them.**

| criterion | A: `Sticky` instruction | B: request pre-pass |
|---|---|---|
| oracle (unmodified / patched / Tier 2) | 3/6, 4/6, 10/10 | 3/6, 4/6, 10/10 |
| new mechanisms | rewrites sources after resolution; a key map for moved essential values; unbounded vector arity; memoized reference evaluator | one pre-pass in `Document::request_with_groups` |
| new limitation | a member computed from another member is a cycle | requests reaching members only through inversion are not snapped |
| code outside the kernel | ~320 lines; 8 existing modules + 1 new file | ~160 lines; 1 existing module + 1 new file |
| cells, `sticky-1000` (36,002 without the group) | 53,001 | 36,004 |
| whole-polygon drag, `sticky-100` / `sticky-1000` | 0.16 ms / 1.2 ms | 0.05 ms / 0.4 ms |
| one-vertex drag, `sticky-100` / `sticky-1000` | 0.06 ms / 0.53 ms | 0.05 ms / 0.33 ms |
| load, `sticky-1000` | 11.6 ms | 9.8 ms |

Drags are full-recompute averages over 300 ticks, from `cargo run --release -p cells-bench --example sticky_tick`. The same drag in `stickyfree-1000`, the same polygons with no group, takes 16 µs. B's cost is the kernel itself: it scans every other member, a linear scan over about 5,000 vertices and edges. That is two orders of magnitude inside the budget, so there is no spatial index. A was slower because its lookahead inverted through the group a second time, and it copied every coordinate forward.

**Two things only the build showed.** First, copied groups: the oracle scenes copy each group three times, and under A each copy's instruction re-snapped the previous one's result. Snapping is not idempotent (2.55 instead of 2.25), so both wirings now record a group whose points equal an earlier group's only once. Second, the cycle: a single instruction over all members couples them all, the same finding that removed per-shape instructions in plan 3 (ADR 0006). Charles asked then that interaction behavior not limit what documents can say, and that decided it.

**Deviations, recorded once each.** (1) A member sharing a point with the dragged member does not attract it; the current core excludes by child index only and snaps a polygon onto its own member vertex. (2) Requests that reach a member only through inversion are not snapped (ADR 0007). (3) A rigid or similarity shape dragged by one vertex is not snapped (Tier 3, declared).

**Verdict.** B, kept; A deleted after measurement (it is in commit 461639b). Sticky groups need no new concept in the cell graph or the inversion engine. They need a group table on the document and one pass over a tick's requests, beside the point groups of plan 3, and the inverse system stays exactly as plan 3 left it. The snap kernel is the only sticky-specific code, a pure function of current and requested points with no state from earlier ticks. Tier 3's rotation snapping is the open question. In the current core it depends on a pre-snap cache, which would be the first state carried between ticks.


## Plan 5: symbolic math

_The fifth round put symbolic math into the tick (`docs/history/plan-5.md`, ADR 0008) behind one engine interface, `SymEngine` in `cells-sym`, and built two engines for it: A, a flat hash-consed arena written for the prototype, and R, math-expressions-rs (the engine the current core calls through wasm), linked natively. R is also the behavior oracle: `cells-sym-mer/tests/oracle.rs` checks A against it, `tests/core_r.rs` runs the core's symbolic tests on R, and one test checks that both engines reach the state the current core reached on `symchain-10`. Raw outputs are in `results/raw/plan5-*` (local). Numbers are from 2026-10-07._

**Q1, best case: symbolic work does not threaten the budget except where it multiplies into sampling.** Per operation, A is 3 to 17 times faster than R natively (geometric means over one corpus, `examples/ops_bench.rs`), and R through `@doenet/math` in Node pays another 2 to 4 times for the wasm boundary:

| op | A | R native | R via `@doenet/math` |
|---|---|---|---|
| parse | 2.2 µs | 7.6 µs | 32 µs |
| simplify | 1.3 µs | 10 µs | 22 µs |
| expand | 5.9 µs | 18 µs | 32 µs |
| derivative | 3.3 µs | 32 µs | 59 µs |
| equals (sampling) | 0.5 µs | 8.9 µs | 18 µs |
| evaluate | 0.14 µs | 0.9 µs | 3.5 µs |
| sample 200 points | 17 µs | 15 µs | 330 µs |

A's `equals` samples 8 real points where R samples complex ones; that is the one known behavioral difference (`sqrt(x^2) = x`, recorded in the oracle). Ticks of the three fixtures, full recompute, native (wasm in Node is 1.0 to 1.5 times this; `examples/sym_tick.rs`, `bench/sym-wasm.mjs`), against the current core through its own actions in Chromium (`web/baseline/symbolic.mjs`; its worker runs math-expressions-rs in wasm):

| tick | current core | A | R |
|---|---|---|---|
| answers-100: keystroke (+ commit in the current core) | 16 ms | 0.006 ms | 0.011 ms |
| answers-100: submit | 8 ms | 0.004 ms | 0.017 ms |
| curves-100: drag the shared coefficient | 2,050 ms | 2.0 ms | 4.3 ms |
| curves-100: drag one function's coefficient | 116 ms | 0.05 ms | 0.11 ms |
| symchain-100: keystroke | 560 ms | 0.33 ms | 4.8 ms |
| symchain-100: drag `t` | 550 ms | 0.22 ms | 2.2 ms |

At about 10,000 components, `symchain-4300` keystrokes take 15 ms with A and 220 ms with R. The budget miss is `curves-3400`: dragging a coefficient shared by all 6,800 curves takes 72 ms with A and 159 ms with R, which is 1.36 million point evaluations per tick. That is a limit on how many curves one drag may re-sample, like plan 1's 10,000 moving circles, not a cost of the cell architecture; nothing in the core is specific to curves. Compiling curves at build time removes the miss (follow-up below). The current core takes 2 s for 200 curves. Going from the current core to R inside the cell core gains 100 to 500 times on the same engine, and going from R to A gains another 2 to 15 times. Most of the gain is the architecture, not the engine.

**Q2, the interface: a handle in an ordinary cell, and an engine behind a trait.** A math cell is an `f64` cell holding a `u32` handle. Every symbolic operation is one instruction family, `Op::Sym`, with its inputs in `Program::extra` like the vector operators, so scheduling, dirty tracking, cycles, rebuilds and the reference evaluator needed no symbolic special case. The engine sits in the `Program` behind `RefCell<Box<dyn SymEngine>>` and is chosen at load (`Document::from_bytes_with`); it survives rebuilds, so an essential math cell's handle stays valid. Three things the shape buys, and one it did not:

- *Gating for free.* A symbolic instruction keeps the input values it last ran on and its outputs, and reruns only when an input differs. Keying the memo on values rather than dirty flags makes stepping on a scratch copy (lookahead, the reference evaluator) give the same answer. An unrelated drag runs no symbolic work, and a submit runs exactly one `equals`.
- *No boundary.* The engine is called in process with integer handles; R natively against R through `@doenet/math` is the 2 to 4 times in the table above.
- *A renderer that never reads the engine.* A tick carries `(cell, LaTeX)` for each changed math cell.
- *The equal-handle cutoff saved nothing on these fixtures.* A and R ran exactly the same number of symbolic instructions per tick on all three, because every recomputed expression really changed. The cutoff only fires when simplification absorbs a change (`0 $n + x`, tested). Hash-consing earns its place through memory and cheap `equals_syntax` (18 ns against 2 µs), not through cutoff.

Inverses: an `Evaluate` writes a constant expression into an essential math cell, which is how a number typed into, or dragged onto, an unbound `<mathInput>` lands. Every other symbolic instruction drops the request, as decided.

**Q3, memory layout: flat and shared works; never reclaiming does not.** A stores 12-byte nodes with a separate child array, hashes and a bucket chain: about 53 bytes per node with tables and capacity slack. R stores one boxed tree per handle. Math cells are cells like any other, so the expression layout is independent of the cell layout; they meet only at the handle. Growth over 10,000 keystrokes and then 10,000 drags of `t` through `symchain-100` (`examples/sym_growth.rs`), where every keystroke types a different expression:

| | after 10,000 keystrokes | after 10,000 more drags |
|---|---|---|
| A | 3.5 M nodes, 185 MB | 6.8 M nodes, 369 MB |
| R (estimate: nodes × `size_of::<Expr>`) | 4.0 M expressions, 2.2 GB | 6.0 M, 3.1 GB |

That is about 18 KB per keystroke with A, several megabytes per minute of typing, so the condition the plan set for building mark-and-compact is met for documents like fixture 3. Answer checking grows by 3 nodes per keystroke and would never need it. Tick time did not drift as either engine grew.

**Q4, what is bounded at build time.** A survey of the current core (`doenetml-worker-javascript/src/components`; file:line in `results/raw/plan5-classification.md`) puts its symbolic props in three classes. None of the optimizations was built.

| class | current-core props (examples) | what would apply |
|---|---|---|
| build-time only | Math parse and inverse maps; Award's parsed correct answer; Point dimensions; Sequence values; Substitute; PiecewiseFunction, ODE latex | parse and cache once at build |
| tick-time, fixed shape with numeric leaves | Point.coords `expand().simplify()` on every drag; Line.equation (about four `simplify` plus a `substitute` into `a x + b y + c = 0`) and slope/intercepts; Vector, Ray, Rectangle (about 9 `simplify` per evaluation), Circle radius/center/area, Polygon center, Parabola; Number/Integer/Sum etc.; Math.value with leaves; Evaluate with a numeric input (full `simplify` by default); Boolean/When on numeric operands; every rendered latex | lower to a numeric chain (what ADR 0005 already does for numeric `<math>`), template expressions with cell leaves, latex templates with numeric holes, compiling a function once with parameter slots |
| unbounded (student or author supplies the expression) | MathInput (a LaTeX parse per keystroke); answer checking (checkEquality, HasSameFactoring, MatchesPattern) on submit; `<math>`/`<function>` with author formulas and the symbolic function calls; FunctionIterates; SolveEquations; Text.math | nothing beyond caching the author side; gate on the event |

The finding is that most of the current core's per-drag symbolic work is in the middle class: fixed shapes with numeric leaves that a build step could compile away. The cell core already lowers numeric `<math>` and plans geometry as operator chains (plan 3), so it does none of it. What remains genuinely symbolic at tick time is what the student or author types, and that is rare per tick.

**Q5, interleaving: no special case.** Symbolic and numeric instructions share one schedule. `symchain` alternates math → number (`<evaluate>`) → math, and a drag of the number reruns exactly the part of the chain downstream of it (228 of 434 instructions in `symchain-100`). A numeric leaf that changes is substituted and its math re-simplified, as decided. A reference inside math names a math cell when its referent holds an expression (a symbolic math, an unbound mathInput, a function), else a number.

**Follow-up: compiling curves whose shape is fixed.** After the verdict, Charles asked for the first of the build-time changes the plan had deferred, applied to `<function>` and `<derivative>` only. When a curve's expression has only numeric cell leaves (its shape cannot change at tick time), the build takes the derivative of the template once, with the leaves as parameters. It then compiles the expression into a small stack program, run a column of 200 samples at a time, whose parameters are the coefficient cells (`cells-sym/src/tape.rs`). The `Sample` instruction becomes `SampleTape`, which reads the cells and runs the program without calling the engine, and a derivative's own expression becomes an `Instantiate` of the derived template. A curve over a mathInput's expression keeps the engine path. Both engines export a handle back to a builder tree, so one compiler serves both. `CELLS_COMPILE_CURVES=0` turns it off; `tests/curve_tapes.rs` checks that the tapes sample what the engine samples (to 1e-9, across polynomials, `sin`, `exp`, `ln`, `tan`, roots and odd roots) and that the derivative's text is unchanged.

| drag of the shared coefficient, native | A before | A compiled | R before | R compiled |
|---|---|---|---|---|
| curves-100 | 2.1 ms | 0.42 ms | 4.6 ms | 2.7 ms |
| curves-1000 | 21 ms | 4.9 ms | 46 ms | 28 ms |
| curves-3400 (about 10k components) | 73 ms | 18 ms | 163 ms | 99 ms |

In wasm, A's `curves-3400` drag is 30 ms compiled. One curve's 200 samples cost 0.6 µs from a tape against 11 µs from A's tree walk on `1.5x^2 + 2x + 3` (3 against 55 ns a point); with `sin` and `exp` the gap is 7.6 against 21 µs, because the functions themselves dominate. So the tapes are now about 3 ms of A's 18 ms. Most of the rest, and nearly all of R's 99 ms, is keeping each curve's `expr` math cell current, a re-instantiation and simplification per curve per drag, though only display and references to the expression read it. Computing that on demand is change 3. A drag of one function's own coefficient is unchanged at about 2 ms under full recompute, which copies every curve's 200 memoized samples back into the cells, and 0.01 ms under the dirty closure. Engine growth during these drags barely changes (about 47 nodes per drag with A), because the expression cells are still rebuilt.

**Choices and deviations, recorded once each.**

1. A numeric `<math>` keeps `expr` NaN: it is not a math cell (ADR 0005).
2. A curve's x-values are implicit, evenly spaced over its graph's `xmin..xmax`, so a curve owns 200 cells, not 400.
3. `<answer response="$mi">correct</answer>` is prototype syntax; the baseline uses the current core's own form.
4. A forward reference inside math to a later symbolic math is treated as numeric.
5. A prototype keystroke updates what reads the input at once; the current core does so on commit. The baseline's keystroke row includes the commit for that reason.
6. Every symbolic `<math>` also evaluates its `value` on each change even when nothing reads it, which doubles the symbolic runs in `symchain`. Left as is (no optimizations without asking).
7. Plan 5 added about 0.1 ms per tick to the 100,000-cell numeric chains (the LaTeX check and one branch), measured against the commit before it. Separately, inverting a drag through a 100,000-step chain had grown to about 11 ms, from before this round. Plan 3 replaced the plain walk from a request down its chain with a request engine that gathers requests per instruction. That engine paid six SipHash map operations and a heap push and pop on every step, even for a lone request, where there is nothing to gather. It now walks straight down a chain while a single request is pending and nothing else is queued, handing back to the queue at the first vector or symbolic operator, and its maps hash indices with a multiply-shift hash. `chain-100000` inverts in 0.7 ms again (1.3 ms for the whole tick, against 12 ms). `tests/invert_walk.rs` checks the walk against the queue on every cell of four documents; sticky and point-group drags are unchanged.

**Verdict.** Pass, with one noted limit and one open item. Symbolic math fits the cell architecture as one more instruction family: no component-specific code in the core and no new concept beyond the math cell and its engine. Every fixture meets the 50 ms budget at 10,000 components except the shared-coefficient drag over 6,800 curves, which is bounded by sampling volume; compiling curves whose shape is fixed (follow-up above) brings that drag to 18 ms natively and 30 ms in wasm. A is the engine to keep: it is faster per operation and an order of magnitude leaner in memory. Its cutoff advantage did not show on these fixtures. The open item is reclamation. The arena grows by megabytes per minute of typing through a symbolic chain, which is the threshold the plan set for building mark-and-compact. Whether to build it is Charles's call; B (a postfix buffer per cell) is not needed.

## Plan 6: conditional content

_The sixth round added choices (`docs/history/plan-6.md`, ADR 0009): `<select>` as a load-time choice drawn from a document seed, and `<conditionalContent>` as a reactive one, both under one rule, the branch interface. The core is `crates/cells-core/src/build/choice.rs`; tests are `tests/choice.rs`. Measurements come from `examples/choice_bench.rs` (native, full recompute) and the Playwright flip in `web/e2e/perf.spec.ts` (wasm, dirty closure), and are stored in `results/raw/plan6/` (local). The oracle is the current core's `conditionalcontent.test.ts` and `select.test.ts` through the adapter, plus `oracle/plan6-rewrites.test.ts`. Numbers are from 2026-10-08._

**How a choice is built.**

- **Branches.** Each case or option is its own template, as a repeat's body is, so its names are private. A reference reaches a name inside only through the interface: the names every branch declares, each with the same kind. The build checks the interface once every element is planned. A violation is an error that names the reason: "'x' is a `<math>` in case 1 but a `<text>` in case 2", "case 2 has no 'x'", or "it has no `<else>`, so no branch is active when every condition fails".
- **Selects.** A select picks options while the document is built. Its random stream mixes the document seed with the select's element and the chain of iterations it sits in, so it draws the same way in every build, including inside a repeat that rebuilds. Unchosen options are compiled but never expanded.
- **Conditional content.** Its conditions become ordinary comparison operators (`<`, `<=`, `=`, `!=`, `and`, `or`, `not`, all with no inverse). Its `choice` cell is a `First` vector operator over them.
- **Built mechanism.** Every case is expanded inside a `Case` component whose `active` cell is `choice = k`. An interface name is a component whose props are `Choose(choice, x₁ … xₙ)`; its inverse writes the active branch only.
- **Rebuilt mechanism.** `choice` is a structural cell, registered like a repeat's count (ADR 0004), and only the active case is expanded. In both mechanisms a branch's essential cells keep their essential keys, so a branch the student leaves and returns to comes back as it was.

**Q1, both use cases: supported.** Plan 6 added fixtures for each:

- **`wording-N`:** N three-way choices, each with a sentence, a math and a number, both copied outside.
- **`adventure-K`:** a chain of K four-way choices, 2,000 components per branch, each choice's conditions reading the previous choice's interface.
- **`select-N`:** N selects of four options.

Native results, built mechanism (each `*all` baseline holds every branch's content with no choices; `*flat` holds only the shown content):

| fixture | load | memory | flip every choice | unrelated drag |
|---|---|---|---|---|
| wording-1000 | 25 ms | 3.0 MB | 0.61 ms | 0.12 ms |
| wording-10000 | 309 ms | 30.0 MB | 5.6 ms | 1.2 ms |
| wordingall-10000 | 236 ms | 16.6 MB | – | 0.44 ms |
| wordingflat-10000 | 79 ms | 8.1 MB | – | 0.15 ms |
| adventure-5 (40k components) | 40 ms | 8.3 MB | 0.001 ms | – |
| select-10000 | 220 ms | 16.3 MB | – | – |
| selectall-10000 | 345 ms | 19.8 MB | – | – |
| selectflat-10000 | 72 ms | 6.3 MB | – | – |

In wasm (Chromium), a flip of every choice in `wording-10000` takes 18 ms of core time, and `wording-1000` takes 1.5 ms. The React commit is a different matter: 573 ms at 10,000 choices and 46 ms at 1,000. One flip changes about 20,000 shown maths (each case's and each copy's), and each one asks the engine for its text. Keeping inactive cases mounted and hidden, so a flip would be a style change, measured no faster (480 ms), and that variant was dropped. The renderer cost scales with how many shown values change in one tick, which would hit any document that changes that many displayed values at once.

**Q2, separate tags: split by timing, not by shape, and the shape split dissolves.** Once both mechanisms obey the branch interface, an author cannot tell them apart, so the question became which mechanism the core should pick. The sweep (`choicesweep-SxB`: one four-way choice with S derived points per branch, beside B background points) answers it:

| | built flip | rebuild flip | built memory | rebuild memory |
|---|---|---|---|---|
| 10 pts/branch, 100 background | 0.001 ms | 0.34 ms | 0.05 MB | 0.05 MB |
| 10,000 pts/branch, 100 background | 0.24 ms | 93 ms | 11.7 MB | 7.0 MB |
| 10 pts/branch, 10,000 background | 0.001 ms | 25 ms | 2.6 MB | 3.1 MB |
| 10,000 pts/branch, 10,000 background | 0.30 ms | 107 ms | 14.0 MB | 10.1 MB |
| 10,000 pts/branch, 50,000 background | 0.27 ms | 256 ms | 24.5 MB | 23.1 MB |

What this shows:

- **Built flips.** A built flip stays under 0.3 ms at every size. Inactive branches still recompute, but even 30,000 inactive derived points add only 0.1 ms to an unrelated drag under full recompute.
- **Rebuild flips.** A rebuild flip costs a whole-document build, which misses the 50 ms budget beside 10,000 to 50,000 other components whatever the branch size. A chain of rebuilt choices pays one build pass per link: `adventure-5` flips in 163 ms rebuilt (6 passes) against 0.001 ms built, and `adventure-3` takes 59 ms. A rebuilt choice also loads in two passes.
- **Memory.** Rebuilding only saves memory when the branches are most of the document, and then by at most 1.7 times. With a large background it uses more, for the value store and the scope table it keeps.
- **Curves.** Built branches carry a real ongoing cost in one case: curves, which an inactive branch keeps resampling when a value they read changes. In `choicecurves-100` (four branches of 100 curves that read a dragged point), a drag takes 1.05 ms built against 0.26 ms rebuilt. At Plan 5's 3,400 curves per branch, that would be about 72 ms a drag.

So the threshold weighs elements, with a curve counting as 50, and rebuilds only above 200,000. Every fixture in this round stays built; branches heavy with curves go to rebuild.

My recommendation, for you to decide: this is close to "always built". The rebuild mechanism is about 40 lines (its registration as a structural cell, and the generalization of the repeat count to `structural_prop`). It earns them only for curve-heavy or enormous branches. It could be dropped, together with the part of ADR 0009 that has the core choose, if you would rather have one mechanism.

**Q3, banned flexibility.** Every ban is a build error that names the reason. In the oracle, 13 of the 66 tests use something banned, and 12 of their rewrites pass on the cells core (table below).

| banned | why | oracle tests |
|---|---|---|
| a name whose kind depends on the branch (`$cc.x` a math in one case and a text in another) | the brief's example; one name, one type | none in these files (found in `functionTag`, `factoringOldAlgorithm`) |
| a name not in every branch, or reached when there is no else (`$cc.c` optional, `$cc.a` in the single-case form) | it would silently become nothing | 2 |
| a name that exists in no branch (`$cc.d`) | the current core accepts it and gives nothing | 1 |
| `extend` of a `<conditionalContent>`, `<case>`, `<else>` or `<select>`, or a copy of a whole choice (`$cc`) | a second copy path of replacement arrays in the current core; the copy can be written out or reached through the interface | 9 |
| `<text extend="$cc">` | a choice coerced to a type | 2 |
| content by position (`$s[1][2]`, `$cc[1][3]`) | position is not part of the interface | 2 |
| `numToSelect` (and weights) from a reference | a load-time choice depends only on the seed and literals | 2 |

Some tests have more than one. The JavaScript core passes 12 of the 13 rewrites. The thirteenth crashes it: an empty `<text>` inside a case inside a `<p>` breaks its `textFromComponent`. That is a current-core bug the rewrite exposed, not a difference in meaning.

**Q4, cost.**

- **No change for documents without choices.** On ten existing fixtures, against the commit before this round (`examples/regress.rs`, run at both commits), memory is byte-identical, loads are within 2%, and ticks are within run-to-run noise. Interleaved runs of `chain-100000` gave 0.98–1.31 ms at the baseline and 1.02–1.42 ms now.
- **Choices cost what they contain, plus a small per-choice overhead.**
  - *Select.* A select's live state equals the shown content's: cells 0.32 MB, program 0.52 MB, components 1.85 against 1.52 MB. What it adds is the source of the unchosen options: compile time (145 against 47 ms at 10,000 selects) and the retained DAST (12.3 against 3.6 MB). It loads faster than writing every option out.
  - *Built conditional content.* It costs what holding every branch costs (`wordingall`), plus about 11 instructions and 1.3 KB per choice: conditions, `First`, one `Eq` per case, one `Choose` per prop of each interface name used, and the `Case` components and scopes. The scope table is 2.2 MB of the 13 MB difference at 10,000 choices. Load is 31% over `wordingall`. About 45 ms of that is freeing the builder's many small per-template allocations (one name table per branch template).
- **Ambient complexity.** The round added about 1,100 lines to `cells-core`. 670 are `build/choice.rs`, about 180 of those the condition parser. Outside it:
  - three scalar comparison operators and `Truthy`/`Not`
  - two vector operators (`First`, `Choose`)
  - four component kinds (`text`, `conditionalContent`, `case`, `select`; `group` also stands in for `section` and `label`)
  - one new `Step` in reference paths (`Iface`)
  - the generalization of the repeat count to `structural_prop`

  The tick, the scheduler, the evaluators and the inverse engine are unchanged. The rule that makes this possible is the interface: because a name means one kind in every branch, nothing downstream of a choice ever asks which branch is active.

**Oracle.** Results of the 66 tests in `conditionalcontent.test.ts` and `select.test.ts`, run unmodified:

- **Pass: 17.** The sign-of-number tests, blank strings between tags, `hide` on a select, and most select tests, including the weighted draw over 200 picks.
- **Banned: 13.** 12 of the rewrites pass. The other fails on a gap: math nested in math.
- **Gap: 36**, by cause:

| cause | tests |
|---|---|
| `<selectFromSequence>` | 4 |
| `<variantControl>` and variant names | 5 |
| `<sequence>` | 3 |
| `<asList>` | 3 |
| `<division>` | 3 |
| `<boolean>` | 2 |
| copies of containers across scopes | 3 |
| core internals (`activeChildren`, diagnostics, `isInactiveCompositeReplacement`, enumerating components) | 4 |
| `<textInput>`, `<updateValue>`, `<shortDescription>` | 3 |
| `<booleanInput prefill>` | 1 |
| `<math extend>` | 1 |
| `<text>` mixing text and references | 1 |
| `hide` given as an expression (`hide="!$h"`) | 1 |
| `<pointList extend>` of a non-shape | 1 |
| a non-option child of `<select>` | 1 |

None is a choice mechanism failing. The adapter changes did not move the earlier suites: line 31/69, polygon 21/49 and stickygroup 3/6 as recorded, and circle 31/46, one more than recorded.

**Choices and deviations, recorded once each.**

1. The renderer does not reuse a `hide` cell for inactive branches, because `hide` is a point prop in the prototype. Inactive branches sit in `Case` components with an `active` cell, and the renderer mounts only active cases.
2. A choice inside a typed parent (Q11: `<math>`, `<function>`) is rejected as unsupported rather than built when every branch yields the same type. No fixture or oracle test here needed it.
3. Interface kinds exclude curves, answers and containers (`Unsupported`): a `Choose` per prop does not fit a 200-cell sample block.
4. `<text>` is literal-only (its value is the string id), or a single reference to another text. Text never meets a numeric operator because the interface keeps kinds apart.
5. Attribute names now ignore case everywhere, as in DoenetML (`withreplacement`). Whitespace between inline items on one line is now kept as content (`The $animal $verb.`); whitespace containing a newline is still dropped.
6. The adapter reads a `<number>`'s value as a plain number, as the current core does. It sends a non-numeric entry in an unbound `<mathInput>` to its expression cell; a number keeps the numeric path.
7. `_mechanism="built|rebuild"` on a choice, and `CELLS_CHOICE`, force a mechanism; both are prototype-only, for tests and the sweep.
8. Scheduling: the first build had `choice` in slot 0 reading conditions created after it, which sent every document with a reactive choice to the general sort. `choice` now aliases a hidden slot created after its conditions, so creation order stays the evaluation order.

**Verdict.** Pass, with one renderer limit and one open question.

- **Both use cases work** under one rule. The brief's type-changing example and five related flexibilities are build errors that name their reason, and 12 of the 13 oracle tests that relied on them pass once rewritten.
- **Ticks and loads.** Every reactive flip meets the 50 ms core budget at 10,000 components when built (5.6 ms native, 18 ms in wasm). Load-time choices cost less than writing every option out. Documents without choices are unchanged.
- **Renderer limit.** Flipping 10,000 shown choices in one tick is a 573 ms React commit, from the volume of changed display rather than from the core.
- **Open question.** The open question is whether to keep the rebuild mechanism: the sweep says built wins on every tick, and rebuilding only pays for branches heavy with curves.

**Follow-up: the rebuild mechanism is gone.** Charles chose to drop it after the verdict. Every reactive choice is now built; the size threshold, `CELLS_CHOICE`, the `_mechanism` attribute and the registration of a choice cell as a structural cell are removed, and the repeat count is again the only structural cell. The core lost about 85 lines net. Built-mechanism numbers above are unchanged, and the oracle still passes 29 of 79 (17 originals, 12 rewrites). The rebuild columns above stay as the record of why. The known limit this leaves is hidden curves: an inactive branch keeps resampling curves that read a dragged value, about 1 ms per drag for 300 hidden curves (`choicecurves-100`), and on the order of 70 ms at plan 5's 3,400 curves per branch.

**Follow-up: credit and section numbers through choices (2026-10-09).** Two features the current core gets from inactive cases not being components: `creditAchieved` that ignores answers in inactive cases, and section numbers that do not jump. Both are now cells wired after expansion (`build/scoring.rs`, tests `tests/scoring.rs`); behavior follows the current core's `scoredSection.js`, `Document.js` and `SectioningComponent.js`, and the scenarios follow `document.test.ts`, `sectioning.test.ts` and the paginator Cypress test.

- **Mechanism.** Each answer or section in a case is *gated* by the product of the `active` cells of the cases around it. Credit is a weighted mean over gated weights (`VecOp::WeightedMean`, chunks of 32 combined by their total weights); a section's `number` is 1 plus the gates of the sibling sections before it. A flip is an ordinary tick that changes gates, then credits and numbers. A document with nothing scored has two constant cells and no instruction.
- **Rules kept from the current core.** The document always aggregates; a section aggregates when `aggregateScores` is set (default on for `<problem>` and `<exercise>`) and is otherwise looked through, with credit 0. Nothing scored, or nothing active, is credit 1. `<setup>` is not scored. `hide` excludes nothing: hidden answers count and hidden sections keep their number. Sections, problems, exercises and examples share one counter among siblings, counted through choices, cases, groups, repeats and collects; `<section>`s include their parent section's number (2.1), the others do not. Only picked select options exist, so only they are scored or numbered.
- **Deviations.** A case that becomes active again keeps its answers' submitted credit (ADR 0009); the current core recreates them, so their credit resets. `aggregateScores` and `includeParentNumber` must be literals, since they decide the wiring. Out of scope: `<title>`, `includeAutoNumber`/`includeAutoName`, `initializeCounters`, list numbering (`asList`, `<part>`), `sectionWideCheckWork`, `creditAchievedIfSubmit` and the other credit variants, and division types other than section, subsection and subsubsection.
- **Parser note.** The parser writes `<section>` as `<division type="section">`, so before this change a section did not load at all; `division` is now read through its `type`.
- **Cost.** Each counted cell in a case costs one multiply per enclosing case, and each section after a case one add. Numbers are read as a chain of cells (`Document::section_number`), so a flip early in a long document changes every later section's cell; the cells involved are one per section.

## Simplification pass (October 2026)

A pass over the core, the wasm binding, the web app, the docgen and the
benches to simplify without changing behavior or slowing the tick, in four
avenues, each audited and agreed before it was applied: logic that need not
be there, logic that can be combined, seams against combinatorial growth,
and files and types. The math engines (`cells-sym`, `cells-sym-mer`) were
out of scope; they sit behind the `SymEngine` trait. 9a2ce12..HEAD on main.

**Checks.** `scripts/golden-diff.sh` dumps every component's props by tree
path (math cells as text, `<text>` as its string) after load and after a
fixed script of drags, inputs, toggles, typing, submits, a case flip and a
rebuild, on 11 hand-written documents and the smallest fixture of each
shape, and diffs a base commit against the working tree; it also reports
whether the built programs are identical. `scripts/perf-diff.sh` runs the
`regress` example on 10 fixtures, interleaved with a base commit. Every
refactor commit left the dump identical, and all but renames left the
programs identical.

**Bugs found and fixed**, each in its own commit:

- A circle emitted its hidden `r²` cell and area operator once per prop
  definition instead of once (9e40169). circles3-10000: heap 22.8 → 15.5 MB,
  load 240 → 185 ms, drag tick 1.79 → 0.81 ms. Plan 3's circle numbers
  above predate the fix.
- A copy's own `hide="false"` did not reveal a hidden point (59b0251).
- Sticky groups did not count points inside a `<select>` or an active
  `<conditionalContent>` case as members; the current core does, and drops
  members of an inactive case (62635ed; checked with a probe on the
  current core).
- The tick bench and `regress` had no drag target for the plan 4–6
  shapes, so the full sweep had not completed since plan 6 (18c33fc,
  9ba653a, 6d73985, 599a85e).

**Removed:** dead functions and wasm exports, `Tick::latex` (a LaTeX string
per changed math cell per tick that nothing read: symchain-1000 tick ×0.29,
curves-1000 ×0.59), the `DirtyScan` evaluator, four one-off bench examples,
and the `CELLS_COMPILE_CURVES` environment variable (now
`LoadOptions::sample_with_engine`, which also survives rebuilds).

**Combined and reorganized:** one `Document::load(bytes, LoadOptions)`
instead of eight constructors; a `KINDS` table, one row per component kind,
instead of thirteen per-kind matches (`copyable` was a negative list, so a
new container defaulted to copyable); `components::prop` constants checked
against the kind tables when compiled, instead of hard-coded prop
positions; `ScopeTable`, and a `Prior` that carries the last build's
`Structure`; `build/plan.rs`, `build/expand.rs` and `document.rs` split by
concern; `OpSpec::Gate` renamed `Hold` (CONTEXT's gate is something else);
CONTEXT.md brought up to date. In-scope code went from 15,918 to 15,644
lines; the gain is mostly in structure, since the prop constants and new
documentation added lines back.

**The tick's speed depends on code layout.** With the program identical
(same instructions, inputs and cells), repeat-10000's tick moved between
about 0.09 and 0.12 ms as unrelated code was edited or moved, with the
default codegen units and with `codegen-units = 1` alike (the two settings
flip at different commits). `-C llvm-args=-align-loops=64` put every commit
in the fast mode; it was used during the pass to keep comparisons honest and
then removed. Two merges were reverted because they cost speed through this
effect: the projection arms of `VecOp::eval` (wording-10000 tick +8%) and an
early-return merge in `invert::walk` (chain-100000 +10%). Earlier, removing
a loop after the inlined full recompute made repeat-10000's tick ×1.34;
`run_all_tracking` is now `#[inline(never)]`. A tick difference of up to
about 30% between two builds is therefore not evidence of a change in work
unless the programs differ.

**Speed at the end.** Against the start of the pass (9a2ce12), the drag
tick is ×0.93–0.97 on chain-100000, chain-1000, aliases-1000 and
points-10000 (`perf-diff.sh 9a2ce12`), with memory identical. RESULTS.md
is regenerated from a full sweep at the end of the pass; it was last
generated at 692f7b6 (plan 2). Between the two, during plans 3–6, the
tick grew: chain-100000's full recompute 637 → 1,542 µs (criterion mean),
an aliases document's tick 0.02 → 0.18 µs. That growth is not from this
pass and was not investigated; it is an open item.

## The SIR simulation (October 2026)

`fixtures/sir.doenet`, a real course document: a discrete SIR model
iterated 200 steps by `<functionIterates>`, three `<repeat for>`s turning
the iterates into points, three polylines, three draggable initial-value
points on a grid, a 201-row spreadsheet of the iterates, and inputs for
the parameters, the number of iterates and the graph's bounds, with a
reset button. Supporting it added these, each as data in the existing
pipeline:

- **`<functionIterates>` is a repeat.** Its body template holds one hidden
  tuple; iteration `k`'s entries are the initial value when `k` is 1
  (`SourcePlan::FirstIteration`, chosen per instance like `IterIndex`) and
  otherwise the function's text with each variable replaced by a
  reference to entry `j` of iteration `k - 1` (an index plan `Iter(0) - 1`),
  lowered to numeric operators. `count = floor(numIterates) + 1` is its
  structural cell, so changing the number of iterates is a rebuild, as for
  any repeat. The function itself (several variables, a tuple value) gets
  no math cell; its references resolve from the `<functionIterates>`.
- **`<repeat for>`** takes a `<functionIterates>`' list: `count` aliases its
  length and the item `$x` is a tuple aliasing iteration `k`'s. Repeat
  counts are now looked up per type (`ComponentType::count_prop`).
- **Tuples** of three or more entries (a `<math>`, an iterate) are a
  component type with a `coords` view over up to eight entries, so `$x[2]`
  and `Sel::Coord` work as they do for points.
- **`prefill="$n"`** on a mathInput is a seed, not a binding: the essential
  expression starts as `$n`'s value when first built (emit fills it from the
  source cell, which must be essential or fixed) and carries over rebuilds.
  Before, it bound the input to the number, so typing was dropped.
- **`<clampNumber>`** is a prop table (max then min, projection inverses);
  **`<polyline>`** gathers points as a `<collect>` does; **`<triggerSet>`**
  is one request per `<updateValue>` (`Document::trigger`; the renderer
  sends the same requests). Text and layout containers are plain container
  types; their presentation (`styleNumber`, `displayDecimals`, `layer`,
  widths) is read by the renderer from the element's literal attributes
  (`Document::attr_text`, `literal_attrs`), not kept as state.
- The test oracle (`testing/reference.rs`) now memoizes: recursion without
  it is exponential on an iteration chain where each step reads the last
  one several times.

`scripts/golden-diff.sh` showed every existing document unchanged.

**Size.** 5,488 cells (622 essential, 2,037 fixed), 2,829 instructions,
4,952 components (1,209 points, 1,006 tuples); two build passes on load.

**Native** (`sir_perf`, release, this container; 50 loads, 200 ticks):
load from bytes p50 2.4 ms (build 3.2 ms for both passes on the first
load); dragging the infectives' point changes 2,004 cells in 0.009 ms
(full recompute) or 0.025 ms (dirty closure); typing `b` 0.03 ms;
typing the number of iterates (200 ↔ 199, a rebuild) 1.9 ms; the reset
button from 100 to 200 iterates 1.8 ms.

**Chromium** (`web/e2e/sir-perf.mjs`, JSXGraph renderer, asides open so
the spreadsheet is in the DOM; p50, ms; `results/raw/e2e-sir-2026-10-12.json`):

| | main thread | worker (SAB) |
|---|---|---|
| load: core (2 passes) | 7.5 | 4.9 |
| load: first render | 62 | 63 |
| drag tick: core | 0.11 | 0.13 |
| drag tick: commit / frame / painted | 4.8 / 5.9 / 20 | 7.5 / 21 / 25 |
| type `b` (2,000 cells): commit / painted | 3.8 / 17 | 6.5 / 20 |
| type iterates 200↔199 (rebuild): core / painted | 3.2 / 20 | 3.8 / 24 |
| reset 100→200 (rebuild): core / painted | 3.2 / 38 | 4.1 / 42 |

The core is under 0.2 ms of a drag tick; the rest is React (the 603
spreadsheet numbers and the polylines' 1,200 vertex cells) and the
browser's paint. A rebuild costs about 3 ms in the core; the reset is
slower than a ±1 change because 100 iterations' rows and points mount.
The renderer's first try dragged the wrong point: R₀ and I₀ sit 0.3 px
apart and only `layer="1"` puts I₀ on top, so `layer` is now honored.

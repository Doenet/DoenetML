# Composed and handwritten inverses

This core inverts a prop by *composition*. The prop lowers to a chain of
operators, each with its own inverse rule, and the core walks a request
back through the chain. Both other DoenetML cores give each prop a
*handwritten* inverse: the JavaScript core an `inverseDefinition`, the
Rust core a `PropUpdater::invert`.

Before the remaining components are ported (ADR 0016), this report asks
three questions:

- What do the handwritten inverses actually do, and how much of it can
  composition express?
- Does composition give the right answer on real documents?
- Where it does not, what does the JavaScript core do instead?

The plan that follows from the answers is ADR 0024.

**In short.**

- **About 70% of the JavaScript core's 221 state-variable inverses** are
  things composition already does:
  - passing a value through (80);
  - choosing an input from the document's structure (40), which this core
    decides when the document is built;
  - arithmetic (11) and projection (11);
  - entry by entry over an array (14).

  The 13 that move several inputs together are what this core's vector
  operators and point groups do. Hand-writing costs show in the survey:
  72 inverses carry conditional failure paths, and four return
  `{ sucess: false }`, a typo nobody noticed.
- **The 96 array inverses (`inverseArrayDefinitionByKey`, about 7,200
  lines) need nothing composition cannot give.**
  - 63 are composable and 10 are what this core's vector operators and
    point groups already do.
  - 10 need new vector operators. Each is a pure function of the
    requested and current values: about nine operators, such as a
    centroid, a rectangle's span, a regular polygon and a parabola's
    vertex.
  - 6 rebuild math expressions, which is outside composition's scope.
  - None needs history or the cause of a request in a way this core
    lacks a mechanism for.
- **On real documents, composition is right wherever a request's written
  value reaches the requested cell along one path.** A sweep made 18,248
  requests on every interactive number cell of the golden documents and
  `fixtures/sir.doenet`. Every one-path request came out:
  - exact;
  - projected (asking again changes nothing);
  - unchanged;
  - dropped;
  - or rebuilt.

  No one-path request came out *unstable*.
- **All 10,733 unstable requests reach their written value along more
  than one path.** An operator writes one input and holds the others
  fixed, which is wrong when the others move with it (`max(f / b, n) + a`
  with `a`, `b` and `f` computed from `n`, or `S − b·S·I`). The request
  then misses, and asking again moves the cell elsewhere. 10,724 of them
  are in `sir`'s iterates; 9 are in the golden `ops` document.
- **The JavaScript core's `<math>` inverse is composed too, with two
  better rules.** It writes the operand whose variables include a
  modifiable child, wherever that operand stands. It refuses when both
  operands contain one. This core writes the first argument whatever it
  is, and does not refuse.

## How a composed inverse works here

A request on a derived cell goes to the instruction that produces it.
That instruction's operator inverts it, and the value is passed to its
input, until an essential cell is written (`tick/invert.rs`):

- **A scalar operator writes its first input** and reads the others as
  they are (`program/scalar.rs`, `const A: usize = 0`). Each inverse is
  one of:
  - exact (`Add` writes `a = d − b`);
  - a projection: `Round`, `Clamp`, `Min` and `Max` apply themselves to
    the requested value (ADR 0003);
  - a drop (`Pow`).

  An inverse that is undefined for the current values drops the request
  (`Div` by 0, an empty other input).
- **Author variety is chosen when the document is built.** A circle with
  a center and one through point lowers to a different chain from a
  circle with a radius. A slider's table orders each operator's inputs
  so the first leads back to its state (`components/inputs/mod.rs`).
  Math lowering folds literals so the cell stays first (`k + x` becomes
  `Offset{k}(x)`).
- **`fixed`, `fixLocation` and `fixAxes` are `Hold` gates** wrapped
  around the writable sources (`compile/fix.rs`), not code in any
  component.
- **Moves of several inputs together are vector operators with
  handwritten inverses.** There are about a dozen (`program/vector.rs`):
  - a circle's center and radius against its points;
  - a line by slope or by coefficients;
  - a rigid or similar polygon;
  - a projection onto a circle or a line.

  Each is written once, not once per component that uses it.
- **Point groups.** Points dragged together keep their shape. When some
  of them are held back, lookahead finds the shift the free ones take
  (ADR 0006). Sticky groups snap requests before inversion (ADR 0007).
- **Inverses are checked one operator at a time.** The `inverses` tests
  check each scalar operator over a table of values, with its inputs
  bound to distinct cells. Nothing checks a composed chain, or a vector
  operator's round trip (ADR 0018).

## What the JavaScript core's handwritten inverses do

**Method.** Every `inverseDefinition` in
`packages/doenetml-worker-javascript/src` outside tests was extracted by
brace matching:

- That gives 222 sites. One of them is the shared body of `Graph.js`'s
  `returnScaleInverseDefinition`, so 221 state-variable inverses were
  classified.
- Two sites name a function, which was read with them: `Math.js`'s
  `invertMath` and `Slider.js`'s `invertSliderValue`.
- Each inverse was put in one category by what it does. The cited lines
  were checked to be inverse definitions.
- The `inverseArrayDefinitionByKey` sites are in the next section.

Paths below are under `packages/doenetml-worker-javascript/src/`.

| What the inverse does | Count | Example |
|---|---:|---|
| Passes the value through to one input or its stored value | 80 | `components/Line.js:272`: `setEssentialValue` of the desired value (19 copies of the same body) |
| Routes by structure: attribute if given, else `bindValueTo`, else stored | 40 | `components/TextInput.js:286`: text child, else `bindValueTo`, else essential |
| Undoes arithmetic | 11 | `components/Circle.js:2182`: diameter → `radius = diameter / 2` |
| Clamps, rounds or snaps | 11 | `components/chemistry/OrbitalDiagramInput.js:180`: `min(numRows, max(0, round(d)))` |
| Entry by entry over an array | 14 | `components/abstract/ValueListComponent.js:961`: each entry written to `values[key]` |
| Depends on run-time context | 22 | `components/Graph.js:1138`: the parent graph's bound if any, else fail if `fixAxes`, else the stored bound |
| Symbolic | 20 | `components/Substitute.js:347`: reverses a substitution |
| Moves several inputs together | 13 | `components/LineSegment.js:1666`: length → both endpoints about the midpoint |
| Other | 10 | `components/FractionInput.js:433`: a numerator lens over the current denominator |

The 13 that move several inputs together:

| Site | Prop | What the request moves |
|---|---|---|
| `components/MatrixInput.js:485`, `:675` | `numRows`, `numColumns` | the stored size, and truncates or pads the value from remembered entries |
| `components/Parabola.js:867` | a, b, c together | the vertex, or through points moved onto the curve, by which of them the author gave |
| `components/Vector.js:2210` | `magnitude` | every displacement component, keeping the direction |
| `components/LineSegment.js:1666` | `length` | both endpoints, symmetrically about the midpoint |
| `components/LineSegment.js:1995` | `slope` | both endpoints, rotated about the midpoint and kept in the current orientation |
| `components/Rectangle.js:554`, `:619` | `width`, `height` | two vertices, symmetrically about the center |
| `components/Circle.js:1291` | `numericalRadius` | the prescribed radius, the stored radius, one through point radially, or every through point about the center, by what the author gave |
| `components/Graph.js:1727`, `:1759` | `xScale`, `yScale` | both bounds, about their midpoint |
| `components/RegularPolygon.js:1031` | the center | the center and the one size attribute given, or one or two vertices |
| `components/RegularPolygon.js:1805` | `circumradius` | vertex 1 along its ray from the center |

Each of these is a vector operator or a point group here. A circle's
radius against its through points already is (`CircleCenterPoint`,
`CirclePoints`). The rest are vector operators the remaining ports will
need, unless a chain of existing ones expresses them. Scaling about a
midpoint, for example, could be `Offset`s and `Scale`s from the
midpoint, inverted by a point group; step 2 of ADR 0024 decides each.

**Run-time context, the 22.** They depend on:

- `initialChange`: whether the change is the first after load (8);
- `fixAxes` or `canBeModified` (6);
- the request's source or the display mode (5);
- whether the author gave an attribute (`usedDefault`, 2);
- whether the current and desired radius are numbers (1).

`fixAxes` and `fixed` are `Hold` gates here. `canBeModified` is the
JavaScript `<math>` rule, below. `initialChange` and the display modes
come from how the JavaScript core applies changes, not from how an
inverse is written; ADR 0024 leaves them out.

**What writing them by hand cost.**

- 72 of the 221 (33%) return `success: false` under some condition. Each
  failure path is its own code.
- `components/RegularPolygon.js:638`, `:687`, `:736` and `:784` return
  `{ sucess: false }`. The core reads `success`, so these four failures
  are silently something else.
- 10 inverses, and `invertMath`, use `workspace` to carry partial writes
  between passes.
- Six files have more than 240 lines of inverse code each, led by
  `RegularPolygon.js` (588), `MatrixInput.js` (562) and `Parabola.js`
  (489).
- The Rust core's `<math>` inverse (`doenetml-worker-rust/…/math_prop.rs`)
  handles a math with no input or one, and returns `CouldNotUpdate` for
  more (a TODO).

### The JavaScript core's `<math>` inverse is composed

`invertMath` inverts the expression tree of a `<math>`, operator by
operator (`checkForScalarLinearExpression`,
`utils/valueFunctions/math.js:757`):

```js
if (me.variables(operands[0]).every((v) => !variables.includes(v))) {
    // if none of the variables appear in the first operand, subtract off operand from inverseTree
    inverseTree = ["+", inverseTree, ["-", operands[0]]];
    return checkForScalarLinearExpression(operands[1], variables, inverseTree, components);
} else if (me.variables(operands[1]).every((v) => !variables.includes(v))) {
    inverseTree = ["+", inverseTree, ["-", operands[1]]];
    return checkForScalarLinearExpression(operands[0], variables, inverseTree, components);
} else {
    // neither operand was a constant
    return { foundLinear: false };
}
```

That is composition with two rules this core lacks:

- **It writes the operand that contains a variable**, a child whose
  `canBeModified` is true, wherever the operand stands. Here the first
  argument is written, so an author orders operands for the inverse's
  sake, and `k / $a` is dropped because its first input is the fixed `k`.
- **It refuses when both operands contain one.** Here the first is
  written regardless, which the sweep below shows is wrong when both
  contain *the same* variable.

## What the JavaScript core's array inverses do

An array state variable (a shape's vertices, a point's coordinates, a
list's entries) has its own inverse, `inverseArrayDefinitionByKey`,
which gets the requested entries by key. These are where polygons,
polylines, rectangles and segments keep their shape.

**Method.**

- A search for `inverseArrayDefinitionByKey` outside tests finds 108
  lines, of which 99 begin a definition.
- Read by hand in three groups, they are 96 sites:
  - calls to an inner function were merged with the function;
  - the core's dispatcher (`core/StateVariableInitializer.ts:973`) and
    shadow factory were kept as plumbing.
- Together they are about 7,200 lines in 37 files.
- Each was put in one class:

| Class | Meaning |
|---|---|
| C1 composable | what operators and build-time lowering already do: a pass-through, routing by structure, arithmetic, a projection, or these entry by entry |
| C2 existing vector operator | what one of `program/vector.rs`'s operators does |
| C3 engine mechanism | a point group with lookahead (ADR 0006), sticky snapping (ADR 0007), a `Hold`, or gathering every request on an instruction |
| C4 new vector operator | a joint move that is a pure function of the requested and current values, not yet among the vector operators |
| C5 beyond composition | depends on history, on the cause of a request, or on the order of separate requests, with no mechanism here for it |
| C6 symbolic | rewrites a math expression or matches text |
| C7 plumbing | a generic factory or wrapper |

These decisive claims were checked against the code:

- this core's inverses read their inputs from the current cells;
- `CirclePoints{n: 2}` is a midpoint;
- the two JavaScript bugs and this core's two differences listed below.

| Class | Sites | Lines |
|---|---:|---:|
| C1 composable | 63 | 3,313 |
| C2 existing vector operator | 5 | 1,137 |
| C3 engine mechanism | 5 | 295 |
| C4 new vector operator | 10 | 1,103 |
| C5 beyond composition | 0 | 0 |
| C6 symbolic | 6 | 948 |
| C7 plumbing | 7 | 422 |
| All | 96 | 7,218 |

**No site is C5.** The run-time context the array inverses read maps
onto mechanisms this core has:

- **`workspace`** (23 sites) merges the partial writes of one request.
  The request engine gathers every request on an instruction before it
  inverts it once (`tick/invert.rs`).
- **The `draggable` guard** (`initialChange && !draggable`, 8 sites)
  refuses a request that starts at the component. This core refuses the
  attribute at load today. `principles-alignment.md` plans it as a rule
  in the bridge, which builds requests from renderer actions.
- **`initialChange` that admits only submissions** (`Answer.js:2080`,
  `Pretzel.js:451`) is this core's cells written by an action.
- **Shape-keeping across two updates.** `Triangle.js:99` and
  `Polyline.js:550` record the requested vertices for a second update,
  which shifts the free vertices by the shift of the held ones
  (`_attemptConstrainedRigidTranslationReconciliation`). That is ADR
  0006's lookahead, done in one tick here.

Three behaviours inside other sites come closest to C5:

- **A rigid shape dragged by one vertex is snapped after its rotation**
  (`Polyline.js:1276`, `rotationReferenceMapping`). It caches the
  unsnapped vertices across ticks. ADR 0007 records not snapping rigid
  one-vertex drags as a declared gap.
- **A reflected polyline's request is taken as it is**
  (`Polyline.js:1204`, `overrides.isReflection`, set by the
  `reflectPolyline` action). Here an action writes the cells it writes
  itself, so a reflection need not pass through an inverse.
- **A multiple-select `choiceInput`** replaces its selection when the
  request is a whole array, and merges into it when it is keyed
  (`ChoiceInput.js:1031`). That depends on the request's form. This
  core refuses `selectMultiple` today.

**Ten sites need new vector operators.** Each sketch is from the survey,
not a design:

| Site | Operator | Forward → inverse |
|---|---|---|
| `Polyline.js:2063`, `RegularPolygon.js:1716` (center) | `Centroid{n}` | n points → their mean; a requested center translates every point by the difference, as one point group |
| `Rectangle.js:1142` (vertices) | `Span`, per axis | (position, size) → (lo, hi) from an anchor or a center; a request on lo alone translates, on lo and hi writes both |
| `LineSegment.js:926` (unconstrained endpoints) | a segment by slope, length or midpoint | `PolarSlope` with the first point also an output, plus a midpoint mode, so one request can move both |
| `RegularPolygon.js:1514` (vertices) | `RegularPolygon{n}` | (center, first vertex direction) → n vertices; one vertex keeps the center, several set it to their mean |
| `ChoiceInput.js:1004` (`selectedIndices`) | `SelectedSet{n}` | n choice flags → the ascending positions of the set ones; requested positions replace entries, deduplicated |
| `abstract/ValueListComponent.js:690` (sequence entries) | `Override` | (value, written, basis) → the written value while the basis is current; a request writes the value and the current basis |
| `Parabola.js:1399` (vertex) | `ParabolaVertex` | (a, b, c) → the vertex; a requested vertex writes b = −2ah and c = k + ah², never a. A parabola stored in vertex form would make it C1 |
| `dynamicalSystems/CobwebPolyline.js:693` (vertices) | `Attract{t}` | (point, attractor, lock) → the attractor when within t or locked, else the point; a request writes the point |
| `abstract/DirectionComponent.js:304` (direction) | `Normalize{n}` | u → u / \|u\|; a request writes u = d·\|u\|, keeping the magnitude, with unrequested entries taken from the current output |

They are needed for two reasons:

- **An inverse reads its inputs from the current cells.** A request on a
  point and a request on a value derived from it, made in the same tick,
  do not see each other (`tick/invert.rs` reads `self.cells`). A
  rectangle composed as `hi = lo + size` would get a single-vertex drag
  right. On a whole-rectangle drag it would write the size against the
  old position, so the rectangle would grow by the shift. That is
  reasoned from the code; this core has no rectangle yet. One operator
  owning both outputs sees both requests. Otherwise the port must choose
  which cells a whole-shape drag requests, as the JavaScript core's
  `moveVector` sends a tail and a displacement rather than a head.
- **Composed, they reach a value along several paths.** The vertex `k =
  c − b²/4a` reaches b twice, and `u / |u|` reaches each entry twice. ADR
  0024's refusal would drop these requests, where the JavaScript core
  moves them.

**Six sites are symbolic.** They are `MatrixInput.js` ×3,
`utils/mathVectorMatrixStateVariables.ts` ×2 (rebuilding a vector or
matrix tree) and `ChoiceInput.js:1147` (matching a choice's text).

- They are outside composition, as ADR 0005 leaves symbolic inverses.
- This core stores a numeric tuple as one cell per entry, so a request on
  an entry is an alias, not a rebuilt expression.

**This core's behaviour differs in places the survey found:**

- **`choiceInput`'s `selectedIndex` accepts any number.**
  - With three choices, requests of 2.5, 7 and −1 are written as they
    are (`components/inputs/choice_input.rs`: `attr(0.0) { interactive,
    rendered }`; checked by running them).
  - The JavaScript core drops all three (`ChoiceInput.js:1018–1022`).
  - The sweep would class these "exact": an inverse can round-trip and
    still accept a value outside the prop's domain. The round trip does
    not check domains; a prop with a domain needs its projection
    (`Clamp`, `Round`) in its chain.
- **A line by equation flips its coefficients' signs after a rotation.**
  This core writes `a = y2 − y1, b = x1 − x2` (`program/vector.rs`,
  `LinePointsFromCoeffs`). The JavaScript core writes `a = y1 − y2, b =
  x2 − x1` (`Line.js:1058–1059`). It is the same line, but the shown
  equation differs in sign.
- **A line by equation recomputes its two points from the
  coefficients.** The JavaScript core places them at the projections of
  the last dragged points (`Line.js:1106`, `lastPointsFromInverting`),
  so the dragged handle stays under the pointer.
- **A point takes one constraint here** (`components/geometry/point.rs`
  refuses more). The JavaScript core chains several
  (`utils/constraints.js:379`).

**Two more silent JavaScript bugs**, of the `sucess` kind:

- **`Point.js:1319`** writes `dependencyNamesByKey[arrayKey].xs`, but the
  dependency is named `x` (`Point.js:1271`).
- **`Extrema.js:665`** writes `.extremumChild`, but the dependency is
  named `child` (`Extrema.js:617`).

The core skips an instruction whose dependency is undefined and still
reports success, so these writes do nothing.

## What composition does on real documents

**Method.** `crates/cells-bench/examples/round_trip.rs` loads every
document `cells_bench::script::sources` names: the golden set,
`fixtures/sir.doenet`, and the generated fixtures when present (they
were not). For every interactive number cell it requests several values
on a fresh copy:

- a single cell at −3.7, 0.5, 2, 7.25 and 100;
- an x/y pair of one component (`x` and `y`, `x1` and `y1`, …) as a point
  group, as a renderer drags a point, at (−3.7, 0.5), (2, 7.25),
  (100, −2) and (0.3, 0.3).

Each request comes out in one class:

| Class | Meaning |
|---|---|
| exact | the cells hold what was asked |
| projected | they hold something else, and asking again for that or for the first value changes nothing |
| unchanged | they hold what they held, and nothing was dropped: the inverse projected back onto where they are |
| dropped | they hold what they held, and the tick reports the request dropped |
| rebuilt | the request changed the structure |
| unstable | anything else: asking again moves the cells |

A class is marked *multipath* when the request wrote an essential cell
that reaches a requested cell along more than one path through the
program.

| Class | Golden set | `sir` | All |
|---|---:|---:|---:|
| exact | 791 | 218 | 1,009 |
| projected | 147 | 50 | 197 |
| projected, multipath | 7 | 476 | 483 |
| unchanged | 1 | 3,963 | 3,964 |
| dropped | 224 | 1,613 | 1,837 |
| rebuilt | 10 | 15 | 25 |
| unstable, multipath | 9 | 10,724 | 10,733 |
| all | 1,189 | 17,059 | 18,248 |

**What it shows.**

- **Every request whose written value reaches the requested cell along
  one path was exact, projected, unchanged, dropped or rebuilt.** That
  includes everything the golden documents test:
  - rigid and similar polygons;
  - points constrained to circles and lines;
  - a polygon whose fourth vertex is computed from the other three;
  - sliders and step snapping;
  - sticky groups;
  - circles in every mode;
  - `fixed`.
- **Every unstable request is multipath, and none is anything else.**
  - In `ops`, `i = max(f / b, n) + a`, where `a = n + 1`, `b = 2a`
    and `f = round(clamp(−b, −9, 9)) + n`, so `n` reaches `i` along
    several paths.
  - `i` is 3. Asking for 2 gives −1.67, and asking for 2 again gives 7.
    The first inverse wrote `n = −2.5` while holding `a` and `b` at
    their old values, which then moved with `n`.
  - In `sir`, each iterate is `S − b·S·I` and its kin, so S and I reach
    every later point along many paths.
- **Some multipath requests happen to settle.** 483 came out projected
  (476 in `sir`, 7 in `ops`): a clamp or a `max` caught the value. They
  are right by accident of the values asked.
- **`sir`'s 3,961 unchanged requests on its R column are correct
  projections.**
  - R grows from `R0`, an essential cell clamped at 0 and set to 0.
  - R is in the thousands, so every value asked needs a negative `R0`.
    `R0` is projected back to 0, and R stays where it is.
- **`sir`'s 1,598 dropped requests are on points whose x is the
  iteration index**, which no student can write. The x/y pair is dropped
  as a group. The golden set's 224 drops are cells a student cannot
  write: `fixed` ones, a repeat's computed values, and an evaluated
  function's value.

## Composed against handwritten

| | Composed (this core) | Handwritten (both other cores) |
|---|---|---|
| What a component author writes | a table of operators, or a planner choosing a chain, plus a vector operator for a joint move | an inverse per prop |
| How much code | one entry per operator kind, about a dozen vector operators (about twenty with those the ports need), one request engine | 221 `inverseDefinition`s and 96 `inverseArrayDefinitionByKey`s, about 14,100 lines |
| What is checked | each operator over a table of values, generated; nothing for chains or vector operators yet | each component's tests, by hand |
| What the build knows | every inverse's writes, statically (ADR 0018's writable walk) | nothing until it runs |
| A value that feeds both sides of an operator | writes a wrong value, and asking again moves it | the `<math>` inverse refuses; the Rust core refuses any math with two inputs |
| Which operand is written | always the first | the `<math>` inverse writes the one that can be modified |
| Run-time policy (`initialChange`, the request's source) | none; build-time choices and `Hold` gates | anywhere |

Composition does more with less code, and the build can see it. Its two
defects are the rules it lacks: it writes the wrong operand when the
first is not the state, and it gives a wrong answer instead of refusing
when a value feeds both sides. Both are decidable when the document is
built. ADR 0024 plans the fixes, and the sweep above as a standing test.

## What was not covered

- **The JavaScript core's behaviour on the swept documents.** The sweep
  runs this core only. Its comparison with the JavaScript core is from
  the code: refusal for a `<math>` whose operands share a variable. No
  request was replayed on the JavaScript core.
- **Generated fixtures.** The sweep reads them when they exist
  (`npm run fixtures`); they were absent here, so only the golden set and
  `sir` were swept.
- **Requests other than a value or a point.** Submits, triggers and
  text or math requests are not swept.
- **The array inverses' classes were not run.** They are read from the
  code; most of the components they belong to (vector, ray, curve,
  parabola, rectangle, regular polygon, matrix input, the lists) are not
  in this core yet.

## Tools

```bash
cargo run --release -p cells-bench --example round_trip
cargo run --release -p cells-bench --example round_trip -- path/to/doc.doenet
ROUND_TRIP_SHOW=ops cargo run --release -p cells-bench --example round_trip
```

The first sweeps every golden document and `sir`, the second named
documents. The sweep itself is `cells_core::testing::round_trip`, which
`tests/round_trip.rs` and the spec harness also run (ADR 0024, step 3). With `ROUND_TRIP_SHOW`, the program also prints each unstable
request on a row containing the text.

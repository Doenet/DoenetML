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
- The 94 `inverseArrayDefinitionByKey` sites (about 6,800 lines in 34
  files) are not in this survey; ADR 0024's step 2 surveys them. They
  are where polygons, polylines, rectangles and segments keep their
  shape.

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
| How much code | one entry per operator kind, about a dozen vector operators, one request engine | 221 `inverseDefinition`s and 94 `inverseArrayDefinitionByKey`s, about 13,700 lines |
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

- **The 94 `inverseArrayDefinitionByKey` sites.** That is where most of
  the JavaScript core's shape-keeping code is; ADR 0024's step 2.
- **The JavaScript core's behaviour on the swept documents.** The sweep
  runs this core only. Its comparison with the JavaScript core is from
  the code: refusal for a `<math>` whose operands share a variable. No
  request was replayed on the JavaScript core.
- **Generated fixtures.** The sweep reads them when they exist
  (`npm run fixtures`); they were absent here, so only the golden set and
  `sir` were swept.
- **Requests other than a value or a point.** Submits, triggers and
  text or math requests are not swept.

## Tools

```bash
cargo run --release -p cells-bench --example round_trip
cargo run --release -p cells-bench --example round_trip -- path/to/doc.doenet
ROUND_TRIP_SHOW=ops cargo run --release -p cells-bench --example round_trip
```

The first sweeps every golden document and `sir`, the second named
documents. With `ROUND_TRIP_SHOW`, the program also prints each unstable
request on a row containing the text.

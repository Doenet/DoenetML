# Components are written by people who do not know the core

Status: proposed 2026-10-20. Nothing is built yet; see Migration.

A component should be writable, and changeable, by a Rust developer who
does not know cells, slots, roles, the probe or the renderer, without
costing load time or tick time. This ADR says what such a contributor
writes, what the core team owns, and how a contributor learns that a
component is done.

## Context

Today a component type is one of two things. A type whose props are
attributes, children, defaults and operator chains is a prop table and one
`Props` arm in `Compiler::planner`, and its inverses come from the
operators (ARCHITECTURE.md, "Add a component type"). That path is pleasant.
The other is a planner function (`Geometric`, `Whole`, `PropsThen`), which
28 of the 64 types need and most of what remains to be ported from the
JavaScript core (193 component files, 10.7% of its tests passing on this
core) will need. A planner is ordinary Rust, but it keeps contracts nothing
enforces:

- **Slot arithmetic.** `through_slot(i, j) = THROUGH_X1 + 2*i + j`;
  `set_vec(head, ..)` takes the `n_out - 1` slots after `head`. Reordering
  a prop table changes values, not compilation.
- **Every public slot planned**, checked by a panic in `ElemPlan::finish`;
  hence the NaN-filling loops.
- **Roles are strings.** `"r"`, `"cx"`, `POINT_ROLES[i]` are how a copy
  with overrides shares essential state with its base
  (`compile/geometry/mod.rs`). Two planners that spell a role differently
  stop sharing, silently.
- **Unsupported combinations become NaN** with a comment ("the current core
  warns"), not a diagnostic.

Beyond planners, a contributor meets:

- **Fixed maximum layouts.** A polygon has `1 + 2 * MAX_VERTICES` props
  whatever its vertex count, and each unused slot becomes its own fixed
  NaN cell. Measured on 2000 triangles: 66,006 cells of which 52,000 are
  padding; the same triangles at their real size take 14,006 cells, 56%
  less memory and 20-25% less load. The tick is the same either way.
- **Operators in ten places.** One scalar operator touches `Op`, its
  `eval`, `invert` and inputs arms, `OpSpec`, its arity group, `bind`, a
  numeric code, a test list (`program/`) and the `<op>` name map
  (`compile/attrs.rs`). Exhaustive matches catch most; nothing checks that
  an inverse is right, and a wrong inverse is a drag that goes slightly
  wrong.
- **A renderer per type in TypeScript**, reaching the core through prop
  names checked at run time, raw `f64`s (a text prop reads as its string
  id), typed arrays that detach when wasm memory grows, and hand-built
  requests. `renderers/index.tsx` switches on component type and on
  attributes, deciding again what the build already decided.

The benchmark (`packages/benchmark`, run `2026-10-19-claude-cloud-*`) says
where the time goes. A drag's core tick is 0.1-0.4 ms on every fixture but
`symbolic`; the renderer's commit is 4.8 ms when 1000 values change, and a
rebuild's renderer work reaches 270 ms at p90 (`rebuild-10000`). On
`homework`, render is 100 ms of the first render (boards 76 ms, React
commit 22 ms) against 49 ms for the whole core. What a contributor can
make slow is mostly the renderer.

## Decision

### Who

The contributor is a Rust developer who does not know this core. Nothing a
contributor writes runs as JavaScript or as an interpreted description in
the build or the tick: a component is Rust, compiled with the core.

### Plans are typed

The prop table stays the source of truth. A `macro_rules!` macro (a proc
macro only if its errors prove hard to read) turns each table into a plan
struct, one field per prop, list props as lists of point or scalar slots,
and roles as declared fields. A planner returns that struct as a literal,
so a prop left unplanned does not compile, and a vector operator's outputs
are typed values, not positions. The macro expands to the same `const`
tables the core reads today, so it costs no wasm size and no load time.

**No silent NaN.** A planner never produces NaN for a combination of
attributes it does not support: it raises a diagnostic (ADR 0013). A NaN
that a value computes at run time (a division by zero) is not this rule's
concern.

### Lists have the length the author gave

A list prop (a polygon's vertices, a circle's through points, a tuple's
entries) has the length planning finds for that element, with a header
saying where each list starts and how long it is. A reference such as
`$poly.vertex5` resolves to a cell at build time, so the tick never sees
the header; a renderer reads it once per build. `MAX_VEC_IN` still caps a
vector operator's inputs.

### Structure follows state only through core components

A count that follows state (ADR 0004) belongs to `repeat`,
`repeatForSequence`, `conditionalContent` or `select`, which the core team
owns. A contributor's component whose length follows state is planned as
one of them, as `functionIterates` is already a repeat. `View`, the probe
(ADR 0012, ADR 0014) and the rebuild are never a contributor's concern.

### Operators are one declaration

An `ops!` entry per operator generates the `Op` and `OpSpec` variants,
arity, bind, numeric code, `<op>` name and dispatch arms; its author writes
`eval` and declares the inverse as one of:

- `exact(fn)`: must pass a generated round-trip test,
  `eval(invert(desired)) == desired` where the inverse succeeds;
- `projection`: must be idempotent and pass the same test against the
  projected value (ADR 0003);
- `drops`: requests stop here. Legal, and listed by a test so that a
  non-invertible operator on a draggable path is visible.

The tests run over a fixed table of values per argument kind (0, ±1,
negative, tiny, huge, NaN, ±∞), not random inputs. Anyone may add an
operator. The macro produces the `enum` and `match` the core has now, so
the tick dispatches as it does today.

### The tick never formats

No instruction produces a formatted string. Formatting (a number's
digits, a math expression's LaTeX or text) happens where requests come in
or values go out: the renderer, export, and `submit`. The formatter is in
Rust, called by the core at those points and by the viewer through wasm.
Text answers stay as they are: an award of a `type="text"` answer is
literal text (`compile/answer.rs` refuses references), until a document
needs more.

### The renderer is a view tree of primitives

The interface between core and renderer (ADR 0001) gains a **view tree**:
the build emits, alongside the component table, a flat, columnar tree of
view nodes, each a primitive bound to cells. The viewer renders every
component through it; there is no per-component renderer.

- A component's view is written in Rust, with its props, as a `view![..]`
  of primitives. A planner chooses among a type's **view shapes** as it
  chooses among operator chains (CONTEXT.md, build-time variety): a
  `<number>` with and without `displayDecimals` is two shapes, and the
  viewer never branches on attributes.
- A shape is static (`const`): its primitives and, for each, the prop
  positions it binds. A view node is a kind, its subtree's end, and its
  component (or, for a text leaf, a string id); its cells are the
  component's, through `prop_cells[prop_base[c] + i]`, the indirection a
  reference already takes. A view binds only its own component's props:
  a label whose text refers to another component is a child component.
- The viewer keys view nodes by component identity (DAST node, scope), so
  a rebuild reconciles rather than remounts.
- TypeScript types for each shape's bindings are generated from the Rust
  tables, with the schema and the language server's data. The viewer
  reaches cells only through generated code; `store.comps.cols`, raw
  `useCell` and raw `store.request` are linted out elsewhere.

Measured with a pass over the loaded document that bounds emitting the
tree in the build (`crates/cells-bench/examples/view_tree_cost.rs`, every
fixture): 0.1-4.8% of the load in time (repeat documents highest), and in
the layout above 0.4-24% of the document's memory. A tree that copied
each node's cells and identity would have cost 2-74%.

### Primitives are the core team's

The primitives (about 20: text, number, math, ref; block, section, list,
table; number, text, math, boolean, choice and range inputs; board, point,
curve, polygon, segment, circle, label) are TypeScript the core team owns.
A primitive is admitted when it has:

1. **In-place updates**: each bound cell maps to a direct DOM or JSXGraph
   update, without a React render on the tick path. React mounts and
   reconciles rebuilds.
2. **Accessibility**: a role, a name from a label child or
   `shortDescription`, keyboard operation for anything writable.
3. **A performance test** in `packages/benchmark` within the budgets
   below.
4. **An export arm in Rust**: how it is written to PreTeXt and print,
   with the Rust formatter. Export reads the same view tree as the
   viewer.

`widget(name)` is the way out for a bespoke interface (a spreadsheet, a
code editor, PreFigure): anyone may add one. A widget declares a shape
like a primitive, gets its own React subtree, is exempt from the in-place
rule, is listed by a test, and is outside the drag budgets.

### Budgets

From the benchmark run above (one machine, CPU ×1), and read on that
machine; they are measured again, not carried over, on another:

| Measurement | Budget | Today |
|---|---|---|
| Commit per changed bound leaf, on a drag | ≤ 2 µs | about 4.8 µs (4.84 ms for 1000 values, `depth-1000`) |
| Mount per view node outside a graph | ≤ 80 µs | about 180 µs per component (`homework`'s React commit) |
| `homework` render (boards and commit) | ≤ 30 ms | 100 ms |
| Board initialization | ≤ 10 ms | 30 ms |
| Frame latency of a rebuilding drag, p90 | ≤ 50 ms on `rebuild-1000` and `rebuild-10000` | 38 ms; 270 ms |

The product budgets in METHOD.md (16 ms a frame, 50 ms a rebuilding
frame, 100 ms to `homework`'s first render) stay the goals; these are what
they ask of a primitive. Shapes that change 10,000 values on screen are
tracked, not budgeted: the browser's paint alone exceeds a frame.

### Done is a green spec

A component is done when its **spec** passes. A spec is a set of
`spec!{}` blocks in Rust, run by `cargo test`, each a case: DoenetML, a
script of requests and drags, and what must then hold, in an author's
terms: public prop values, diagnostic codes, the view shape chosen, the
PreTeXt written. A spec says what an author sees; the tables, plans and
views say how. A refactor of the second is checked against the first.

Every case also feeds the generic guards, which a contributor does not
write: `extend` variants of the case (a copy, a copy overriding each
attribute) checking that roles are shared exactly; `every_count` and the
probe's coverage where the case has a repeat; the view bindings against
the shape; the primitives' budgets for the shapes it renders; round trips
of the operators its program uses.

Each case records a **cost snapshot**: cells, essential, fixed,
instructions and view nodes per element. A changed snapshot is approved by
the core team (CODEOWNERS on the snapshot directory). This is the check
that would have caught the padding above.

The JavaScript core's tests, through the parity harness, are an aid to
porting, not a gate.

## Migration

Two pilots, `<slider>` (a prop table and an operator chain: the easy path)
and `<circle>` (a planner by attributes, roles under `extend`, padded
through points, vector inverses, a graph primitive, an over-determined
case), carry every piece before anything is opened to contributors:

1. `spec!{}`, with the cost snapshot, and specs for both pilots written
   against today's behavior. They are the refactoring guard for what
   follows, with `golden-diff`.
2. Typed plans and roles; the circle's NaN cases become diagnostics.
3. Lists with per-element lengths, for the circle's through points, then
   the polygon's vertices.
4. `ops!`, moving every operator; the round-trip tests.
5. View shapes, the view tree and the primitives the pilots use (range,
   number, board, point, circle), with the generated TypeScript and the
   keyed reconciliation; the budgets measured in the browser layer.
6. The Rust formatter and the export arm for those primitives.
7. The contributor guide (ARCHITECTURE.md, "Where to change things"),
   written from the pilots.

Each step is measured with `scripts/perf-diff.sh` and, from step 5, the
browser layer.

## Consequences

- A component that fits the declarative vocabulary is Rust only: a prop
  table, perhaps a planner returning a typed plan, a `view![..]`, a spec.
  TypeScript is written by the core team, and by whoever needs a widget.
- The core team's surface grows: primitives, structural components, the
  macros, the guards, the snapshot reviews. That is the price of keeping
  the hot paths in few hands.
- The view tree costs memory per node and a little load time; export and
  the viewer stop being two descriptions of each component.
- Reading a list prop takes one more lookup at build time and in the
  viewer, and padding's cells, memory and load go away.
- Text answers with references, and lengths that follow state without a
  repeat, are not supported; either can be revisited when a document needs
  it.

## Considered options

- **JavaScript or interpreted component definitions.** Approachable, but a
  call across wasm per instruction in the tick, or interpretation at every
  load.
- **Positional plans with a conformance test** instead of typed plans.
  Cheaper to build; a contributor learns of a mistake from `cargo test`
  instead of the compiler, and role mismatches are the silent kind.
- **Fixed maximum layouts.** Simpler indexing, at the measured cost above
  and a cap per type.
- **Operators owned by the core team only.** Safer, and the core team in
  the path of every port; the round-trip tests are the safety instead.
- **Per-component renderers with generated types** (today's design,
  typed). Two languages per component and a TypeScript switch that
  repeats the build's choices.
- **An adapter to the JavaScript core's `stateValues` renderers.** Rebuilds
  objects for every changed component on every tick.
- **The core writing the DOM**, or **draw buffers per tick.** Slow calls
  from wasm to the DOM, and the loss of JSXGraph and the accessibility
  tooling; a draw buffer remains possible inside the board primitive if
  JSXGraph becomes the tick's bottleneck, invisible to contributors.
- **Bindings in every view node.** General, at 2-74% of a document's
  memory.
- **The JavaScript core's tests as the definition of done.** Most of their
  failures on this core are reads of that core's internals.

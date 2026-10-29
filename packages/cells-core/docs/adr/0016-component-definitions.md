# Components are defined without knowing the core

Status: proposed 2026-10-20. Migration steps 1 to 4 and 8 are done, step
4 for the scalar operators; see Migration. The renderer interface and where numbers
are formatted are not decided here (see The renderer). Amended 2026-10-22:
a spec tests its component, and the language's rules are kept by the core
(see Done is a green spec, and Migration step 8). Amended 2026-10-23: a
prop declares whether a renderer may request it (`interactive`, ADR 0017;
see Plans are typed).

Terms: what this ADR first called a *role* is *shared state* now
(`SharedState`, declared in a component's `shared_state { .. }`); see
`CONTEXT.md`. The Context below keeps the old word for what it
describes. The planner kind first called `Geometric` is `Plan` now, and
`plan_geo`, which runs it and applies the copy rules around it, is
`plan_with_extend` (`compile/copies.rs`): nothing in either is
geometric (renamed 2026-10-22). `compile/geometry/mod.rs` went then too:
its copy rules to `compile/copies.rs`, its point lists to
`compile/points.rs`, its math helpers to `compile/attrs.rs`. Text
written before then keeps the old names.

A component should be writable, and changeable, without knowing cells,
slots, shared state, the probe or the renderer, and without costing load time or
tick time. This ADR says what a component's definition holds, what the
shared machinery does around it, and how its author learns that a
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
- **Every public slot planned**, checked by a panic in `ElemWiring::finish`;
  hence the NaN-filling loops.
- **Roles are strings.** `"r"`, `"cx"`, `POINT_ROLES[i]` are how a copy
  with overrides shares essential state with its base
  (`compile/geometry/mod.rs`). Two planners that spell a role differently
  stop sharing, silently.
- **Unsupported combinations become NaN** with a comment ("the current core
  warns"), not a diagnostic.

Beyond planners, a component's author meets:

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

The benchmark (`packages/benchmark`, run `2026-10-19-claude-cloud-*`) says
a drag's core tick is 0.1-0.4 ms on every fixture but `symbolic`; most of
a frame is the renderer's, which this ADR leaves to a later one. A
component's definition must keep the tick where it is.

## Decision

### Components are Rust

Nothing in a component's definition runs as JavaScript or as an
interpreted description in the build or the tick: a component is Rust,
compiled with the core.

### Plans are typed

The prop table stays the source of truth. A `macro_rules!` macro (a proc
macro only if its errors prove hard to read) turns each table into a plan
struct, one field per prop, list props as lists of point or scalar slots,
and shared state as declared fields. A planner returns that struct as a literal,
so a prop left unplanned does not compile, and a vector operator's outputs
are typed values, not positions. The macro expands to the same `const`
tables the core reads today, so it costs no wasm size and no load time.

The table also says which props a renderer may request: such a prop is
marked `interactive` (`x: by_planner { interactive }`), and a list whose
points a drag moves, one point or the whole shape, is marked
`interactive: true`. These are the document's inputs that saved state is
checked against (ADR 0017); `Document::interactive_cells` lists their
cells, and the viewer's test fails for a request on any other (amended
2026-10-23).

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

### Structure follows state only through structural components

A count that follows state (ADR 0004) belongs to `repeat`,
`repeatForSequence`, `conditionalContent` or `select`. Any other component
whose length follows state is planned as one of them, as
`functionIterates` is already a repeat. `View`, the probe (ADR 0012, ADR
0014) and the rebuild are never another component's concern.

### Operators are one declaration

An `ops!` entry per operator generates the `Op` and `OpSpec` variants,
arity, bind, numeric code and dispatch arms; its author writes
`eval` and declares the inverse as one of:

- `exact(fn)`: must pass a generated round-trip test,
  `eval(invert(desired)) == desired` where the inverse succeeds;
- `projection`: must be idempotent and pass the same test against the
  projected value (ADR 0003);
- `drops`: requests stop here. Legal, and listed by a test so that a
  non-invertible operator on a draggable path is visible.

The tests run over a fixed table of values per argument kind (0, ±1,
negative, tiny, huge, NaN, ±∞), not random inputs. The macro produces
the `enum` and `match` the core has now, so the tick dispatches as it does
today.

### The tick never formats

No instruction produces a formatted string. Formatting (a number's
digits, a math expression's LaTeX or text) happens where requests come in
or values go out: the renderer, export, and `submit`. Where the formatter
lives is not decided here.
Text answers stay as they are: an award of a `type="text"` answer is
literal text (`compile/answer.rs` refuses references), until a document
needs more.

### The renderer

How the viewer draws components, and whether its interface to the core
changes, is not decided here. Renderers stay per component type in
TypeScript, as in ADR 0001, until a later ADR decides otherwise.

### Done is a green spec

A component is done when its **spec** passes. A spec is a set of
`spec!{}` blocks in Rust, run by `cargo test`, each a case: DoenetML, a
script of requests and drags, and what must then hold, in an author's
terms: public prop values and diagnostic codes. A spec says what an
author sees; the tables and plans say how. A refactor of the second is checked against the first.

A spec tests what is particular to its component: what each combination
of its attributes means, which state an attribute supplies (and so what a
copy overriding that attribute shares), where a request lands through its
chain of inverses, the diagnostics for what it cannot be, and its cost. A
composed chain is the component's even when each operator in it is
right: a slider whose `to` is off the step's grid stays within
`[from, to]` because its chain clamps the index, not the value, and no
operator's test sees that.

A spec does not test the language's rules, which hold for every
component: a bare copy shows its referent; a rebuild keeps essential
state; an element behaves the same in a repeat at any count and in any
document order; a schedule computes what its program says; an operator's
inverse is right. Tested per component, these re-test the shared
machinery once per component, through only the combinations some spec
happens to use, and a broken rule is reported as a failing component.
They are kept in three layers instead:

- **By construction.** Where a component could break a rule, breaking it
  does not compile, or the rule is out of the component's reach. A bare
  copy is planned before the component's planner runs
  (`plan_with_extend`, and `compile/mod.rs` for the other kinds); `View`,
  the probe and the rebuild are never a component's concern (above). What
  is still a convention moves into the definition. A planner names an
  attribute by a typed handle its block declares (`attributes { .. }`,
  `attr::radius`), both to read it and to say it supplied a piece of
  shared state (`Wire::essential_from(shared_state::R, attr::radius, v)`),
  so a misspelling does not compile; it was a string that
  `plan_with_extend` compared with a copy's own attributes, and a
  misspelling silently shared the base's value where the copy's own was
  asked for (amended 2026-10-22, see Migration step 8). A plan cannot
  hold a literal NaN, so an
  unsupported combination goes through `PlanCtx::warn`. What a copy
  inherits is the machinery's: the point's own `Source::Inherit`, and
  its rule for `hide` (`point.rs`), move there.
- **Unit tests of the core.** Each rule is tested where it is
  implemented, in `compile/` and `build/`, against test-only components
  (`#[cfg(test)]` entries of `component!` with only what a rule needs,
  in `components/test_only.rs`) and documents built in Rust (a DAST
  builder in `testing/`). A test
  needs neither the parser nor a real component, reaches combinations no
  component has yet, and fails at the rule rather than at a spec. The
  tests hold the contracts at the machinery's boundaries (`compile/api.rs`
  and `PlanCtx`, a compile's program, a build's cells), not its private
  helpers, so a refactor inside it does not churn them. An operator's
  round trips, generated by `scalar_ops!`, are already of this kind.
- **Integration tests over documents.** `every_count.rs`,
  `compile_purity.rs` and the golden diff stay the end-to-end check that
  the layers fit together.

The spec runner keeps the reference evaluator after the load and after
every tick: a check of the schedule that every case gets for nothing,
not what a spec is for.

Each case records a **cost snapshot**: cells, essential, fixed,
instructions and components per element. A changed snapshot shows in the
diff and is reviewed with the change that made it. This is the check that
would have caught the padding above.

The JavaScript core's tests, through the parity harness, are an aid to
porting, not a gate.

## Migration

Two pilots, `<slider>` (a prop table and an operator chain: the easy path)
and `<circle>` (a planner by attributes, roles under `extend`, padded
through points, vector inverses, drawn in a graph, an over-determined
case), carry every piece before other components follow:

1. `spec!{}`, with the cost snapshot, and specs for both pilots written
   against today's behavior. They are the refactoring guard for what
   follows, with `golden-diff`. **Done**: `testing/spec.rs`,
   `tests/specs/`. The derived guards
   are the reference evaluator after every tick and the cost snapshot;
   the other guards this step first listed (`extend` variants of each
   case, `every_count` and the probe's coverage, operator round trips) are
   the core's own tests instead (step 8). Writing the slider's spec found
   one deviation from the JavaScript core: with no `initialValue` the
   slider started at the grid point nearest 0, not at `from`; fixed
   since.
2. Typed plans and roles; the circle's NaN cases become diagnostics.
   **Done for the circle**: `component!` (`components/define.rs`) gives
   a table its `Props<T>`, and the circle's planner gives its props as a
   `Props<Wire>` (`compile/plan.rs`), a plan with its role, as a struct
   literal; roles are `SharedState` constants everywhere; a planner warns
   through `PlanCtx::warn`, and the circle's five NaN cases carry the current
   core's warnings (`doenet-w0028` to `w0033`). The golden diff's
   programs are identical. The other planners move with the steps that
   touch them.
   **Done for every component, amended 2026-10-21**: a component's
   definition and its planner are one file, in its family's directory
   under `components/` (`geometry/circle.rs`, `values/text.rs`,
   `structure/collect.rs`, ...); a type planned from its table alone, or
   whose planner only refuses it (a tuple, a response, a point list, an
   error), is in its family's `mod.rs`, which also holds what the
   family's members share as behavior (the line's and segment's default
   points, the choices' refusal of `extend`). `compile/planner.rs` is
   only the table naming each type's planner. Every planner is a
   function given a `PlanCtx` (`compile/ctx.rs`), whatever its kind:
   `Geometric` returns a plan that `plan_geo` wraps in the handling of
   `extend` every shape shares, `PropsThen` adjusts the table's plan,
   passed beside the context, and `Whole` writes the element's plan
   through it. A `PlanCtx` gives the source read-only (the DAST), the
   element's attributes and children planned the ways every component
   shares, and the writes that make the element's plan; a planner uses
   only what `compile/api.rs` exports. `compile/api.rs` is the line
   between a component and the machinery; what two planners share is
   added there once, so a component never reimplements it.
   A type built on machinery several components share (answer, the
   choices, the repeats over lists) has a thin planner: its file holds
   its definition, its own decisions (an award outside an answer, a
   choice that extends another, are refused there) and a call naming the
   machinery (`PlanCtx::plan_answer`, `plan_choice`, `plan_repeat_for`,
   `plan_function_iterates`), which stays in `compile/`.
   A component's shared state is declared with its props
   (`shared_state { .. }`), as constants of its own `shared_state`
   module: a copy extends only its own type, so a name need be unique
   only within it, and a misspelled one still does not compile.
   `compile/plan.rs` declares none of a component's; `shared_point_state`
   names a list's points. Every plan is typed: a planner, or the machinery a
   thin planner names, builds its element's props as its type's
   `Props` struct `component!` makes, so a prop left unplanned does not compile, and
   no code sets a slot by position (`ElemWiring::set` is gone). A
   `PropsThen` planner, which adjusts the table's plan, reaches it
   through `Props::AT`. How a point, math or tuple is made from parts is
   its component's (`point::props_of`, ...), which the machinery calls.
   A typed plan is passed to `set_public` as an array iterator, not a
   `Vec`: allocating one per element cost geometric documents about 75
   ns an element at build. Measured against the commit before this step
   (7581113): programs, cells and memory identical on every fixture; a
   load's instruction count (callgrind) at most 1.4% higher (a point),
   most within 0.6%; `packages/benchmark/scripts/perf-diff.sh` tick and
   memory unchanged, its load ratios within run-to-run noise (0.94 to
   1.09 across reruns).
   A type's whole definition is one `component!` block
   (`components/define.rs`): tags, flags, props (each named once, as an
   identifier), combined props, list, alternate names, shared state and
   planner. It makes the definition row (`ComponentDef`), which carries
   the planner, so `compile/planner.rs` is only the planner kinds; the
   table, the typed plan and the shared state. A type with no file of its
   own has an inline module in its family's `mod.rs`.
   The test-only `<op>` tag, which named an operator directly, and the
   `derived` prop source behind it are gone: tests and golden documents
   reach operators through math (`<number>2 * $a</number>` is
   `Scale { k: 2 }`) or `fixed` (`Hold`), as documents do. `Default` and
   `Lerp`, which only `<op>` reached, went with it.
   A nonlinear line equation still makes a line of NaN
   without a diagnostic, as before. The golden diff is identical through
   every move. The segment and the line, which had no specs, have them
   (`tests/specs/geometry/segment.rs`, `line.rs`); the line's passes, cost
   snapshot included, on the commit before it moved too.
   The specs are laid out as the components are
   (`tests/specs/geometry/circle.rs` for `components/geometry/circle.rs`),
   and stay integration tests so that a spec can use only the public API.
3. Lists with per-element lengths, for the circle's through points, then
   the polygon's vertices. **Done for the circle**: a type's one list
   (`ListProp`, `ComponentType::prop_at`) follows its table's props; an
   element's public count is planned (`NPublic`), or its referent's for
   a bare or cloned copy (`place_list_copy`); a branch interface holds
   the longest member's list. Every circle without three through points
   has 2 fewer cells per missing point; the golden dump, which reads lists
   through `prop_cells`, is identical. **Done for the polygon**: its
   vertices are its list, and a sticky group reads them as such; 2000
   triangles load in 14,006 cells (66,006 before), 0.66 MB (1.49 MB),
   7.6-9.0 ms (10.9-11.4 ms). The cap is now what an element's byte-
   numbered slots hold, 100 vertices (`MAX_VERTICES`), and 31 for a
   rigid polygon, whose one `Shape` instruction reads two inputs per
   vertex (`MAX_RIGID_VERTICES`). The viewer reads a component's props
   up to the next one's (`ComponentTable.props`).
4. `ops!`, moving every operator; the round-trip tests. **Done for the
   scalar operators** (`scalar_ops!`, `program/ops.rs`); vector and
   symbolic operators keep their own rules. The tests found one class of
   wrong inverse: through `Add`, `Sub`, `Mul`, `Div` and `Lerp` whose
   other input is NaN or infinite (an emptied input), a request wrote NaN
   into the input it reached; it is dropped now.
5. The renderer: left to a later ADR (see The renderer).
6. Where numbers are formatted: left to a later ADR, with the renderer.
7. The guide to writing a component (ARCHITECTURE.md, "Where to change
   things"), written from the pilots.
8. The language's rules out of the specs (amended 2026-10-22; see Done is
   a green spec). A DAST builder in `testing/` and test-only components;
   unit tests of the copy rules in `compile/copies.rs` (a bare
   copy, an override that keeps its own state, an override that shares
   the base's) and of inheritance in `build/expand/`; shared state bound
   to its attribute by a typed handle from `component!`; the point's copy
   handling moved into the machinery, under those tests; no literal NaN
   in a plan. A test generated from the definitions fails for a component
   with no spec at `tests/specs/<family>/<name>.rs`, unless it is on a
   list of components still without one, which only shrinks.
   **Done: the DAST builder** (`testing/dast.rs`). A tree is written as
   elements, text and references (`el("circle").name("c")
   .attr("radius", mac("r"))`) and loaded without the parser. It writes
   nodes and strings through `dast::DastWriter`, which the JSON loader
   now uses too, so a tree written as the parser produces it is the same
   DAST, byte for byte (`tests/dast_builder.rs`). It does not normalize:
   a test writes the normalized form. The JSON loader's deserialize time
   is unchanged (`stats`, 7 runs, on `points-10000`, `fanout-10000` and
   `chain-100000`).
   **Done: the test-only components** (`components/test_only.rs`):
   `<testValue>`, planned from its table, and `<testShape>`, planned by a
   function inside `plan_with_extend`, with two pieces of shared state
   each supplied by an attribute. They are in `components/` because only it
   can define a component, and are registered in `component_types!`'s
   `#[cfg(test)]` section, after every other type: they exist only in
   this crate's unit tests, not in its integration tests, `cells-bench`
   (which enables the `testing` feature) or the wasm build, and no other
   type's discriminant moves. The golden diff is identical.
   **Done: the copy rules' unit tests**, in `compile/copies.rs`
   (`plan_with_extend`) and `compile/attrs.rs` (`plan_attrs`): a bare
   copy, an own attribute keeping its state and sharing the rest both
   ways, state the referent defaulted, an own reference, an attribute
   supplying no state, a copy of a copy. Breaking either half of
   `plan_with_extend`'s rule (never keeping a copy's own state, or never
   sharing the base's) fails them. `<testMisspelled>`, a third test-only
   component, named `aa` as the attribute supplying its `A`, and its test
   recorded the hole: a copy's own `a` was silently replaced by its
   referent's. Writing them found that a copy with a literal `fixed` (`<point extend="$P" fixed/>`, as for a circle
   or a `numberInput`) passes a request through to its referent, where
   `fixed="$b"` drops it: `fix_literals` left aliased state alone. Fixed
   since (3c2b440): a literal `fixed` holds those slots by a constant flag.
   **Done: attributes and the typed binding.** `component!` takes an
   `attributes { .. }` section, the attributes a planner reads itself,
   and makes a module `attr` of `Attr` handles (`attr::radius`), which
   only the macro can make. `PlanCtx`'s readers of the element's
   attributes (`attr`, `has`, `text`, `is_reference`, `math`, `point`,
   `scalar`, `scalar_of`, `points`) take an `Attr`, so a planner reads
   only attributes its type declares. A piece of shared state says where
   its value was given (`Given`): by an attribute (`Attr`), by the
   element's own children, or by its referent's; `plan_with_extend`
   keeps the first when the copy gives the attribute, always keeps the
   second, and shares the third. The binding is made where the value is
   planned, not declared in `shared_state { .. }`: a point's `X` comes
   from `x`, from `coords` or from children, as the author wrote it.
   `<testMisspelled>` cannot be written now and went, with its test.
   This found one more of the same hole: a point's coordinates from its
   children were bound to `"children"`, which no attribute matches, so
   `<point extend="$P">(3,4)</point>` showed `P`'s coordinates. It keeps
   its own now (`tests/requests.rs`), as its planner always meant: it
   chose its own children over the referent's, and only the sharing
   undid that. The five `Plan` types declare their attributes; planners
   that read the DAST directly (`d.attr(el, "prefill")`), and
   `attr_flag`/`attr_on`, which take any node, still name attributes by
   string. The golden diff is identical.
   **Done: a copy's inheritance is the machinery's.** The point's rule
   for `hide` (the copy's own attribute, else its referent's, else
   `Source::Inherit`) is `PlanCtx::flag` (`Compiler::plan_flag`,
   `compile/copies.rs`), and no component writes `Source::Inherit`.
   Unit tests in `compile/copies.rs` cover the flag rule with
   `<testShape>`'s `hide`, and in `build/expand/mod.rs` the build's side
   with `<testList>`, a third test-only component with a list: a bare
   copy of a list holds its referent's points, a copy giving its own list
   its own, copies in a repeat alias the referent outside or in their own
   iteration, and a copy gated by `fixed="$f"` reads its referent through
   the hold (`InheritFrom`). Breaking `InheritFrom` or the list copy's
   placement fails them. The golden diff is identical.
   **Done: no silent NaN.** `PlanCtx::warn` returns a `Warned`, which only
   the compile makes, and `Wire::undefined(warned)` /
   `Source::undefined(warned)` are how a planner leaves a value it cannot
   define: its NaN always comes with its diagnostic. A value not given (an
   attribute's default, an emptied input, an answer not submitted, an
   entry past a tuple's end, an operator input left out) is `NO_VALUE`,
   `Wire::absent()` or `Source::absent()`. `Wire::fixed` refuses NaN, and
   a test finds any `f64::NAN` a component writes (`define.rs` aside).
   A literal NaN in a plan is not refused outright, since a value not
   given is one. Two silent cases now warn: a line whose equation is not
   linear (`doenet-w0004`, as the current core; the line spec states it),
   and a symbol in a point list (`through="A"`), for every type that
   takes one (`cells-point-not-numerical`, in `compile/points.rs`, tested
   with `<testList>`). The golden diff is identical: only diagnostics are
   new.
   **Done: every component has a spec, or is listed without one.**
   `component_types!` names where each type is defined
   (`geometry::circle::DEFINITION`), which is where its spec is
   (`tests/specs/geometry/circle.rs`); a unit test in `components/mod.rs`
   fails for a type an author writes (not `internal`) with no spec there,
   unless it is in `WITHOUT_SPEC`, and for one in `WITHOUT_SPEC` that has
   a spec, so the list only shrinks. It starts with 54 types; the
   circle, line, polygon, segment and slider have specs. Step 8 is done
   but for that list.

Each step is measured with `packages/benchmark/scripts/perf-diff.sh`.

## Consequences

- A component's core side is Rust that can be written without knowing
  the core: a prop table, perhaps a planner returning a typed plan, and a
  spec.
- The shared machinery grows: the macros, the guards, the planning
  context. That is the price of keeping the hot paths out of each
  component.
- A spec changes only with its component. A change to a language rule is
  tested once, in the core, which gains test-only components and a DAST
  builder to do it.
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
  Cheaper to build; an author learns of a mistake from `cargo test`
  instead of the compiler, and role mismatches are the silent kind.
- **Fixed maximum layouts.** Simpler indexing, at the measured cost above
  and a cap per type.
- **The JavaScript core's tests as the definition of done.** Most of their
  failures on this core are reads of that core's internals.
- **Derived variants of every spec case**: a copy of each named element,
  the case inside a repeat, a rebuild after each step, its elements
  reordered. No author writes them, but they test the shared machinery
  once per component, through only the combinations specs use, and
  report a broken rule as a failing component.
- **Spec documents as a corpus for the core's integration tests.** Cheap,
  and it would catch a component that works around a rule; making the
  workaround impossible catches it without depending on which documents
  exist.

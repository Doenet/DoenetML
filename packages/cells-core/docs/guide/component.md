# Adding a component or an operator

For someone adding a tag, or an operator a tag computes with. A component
type is declared once, in [`components`](crate::components), and the
compile and the build read the declaration; the worked example is
`<circle>`: [`components::geometry::circle`](crate::components::geometry::circle)
(`components/geometry/circle.rs`) and its spec beside it,
`circle.spec.rs`. Paths below are relative to `crates/cells-core/src/`.

The vocabulary: a type's row is a
[`ComponentDef`](crate::components::ComponentDef), its props are
[`PropDef`](crate::components::PropDef)s, and each prop says where its
value comes from with a [`PropFrom`](crate::components::PropFrom): an
attribute, the children, an operator over the type's own props, or the
type's [`Planner`](crate::compile::api::Planner), which is the type's
prop table (`Props`) or a function of the element's record (`Plan`).

## Add a component type

A component type is one [`component!`](crate::components::define::component)
block ([`components::define`](crate::components::define)) in one of the
family directories under `components/`: `containers/`, `geometry/`,
`inputs/`, `structure/` or `values/`.

**A type built entirely from its prop table** (attributes, children,
defaults, and operators over its own props) goes in an inline module of the
family's `mod.rs`:

```rust,ignore
pub mod clamped {
    use super::*;

    component! {
        /// `<clamped lo="0" hi="1">`: its `value` held between `lo` and `hi`.
        tags: ["clamped"],
        flags: [copyable],
        default_prop: clamped,
        props {
            value: attr(0.0),
            lo: attr(0.0),
            hi: attr(1.0),
            atLeastLo: computed(OpSpec::Max, [value, lo]),
            clamped: computed(OpSpec::Min, [atLeastLo, hi]),
        }
        planner: Props,
    }
}
```

Then register it with one line in the `component_types!` list in
[`components`](crate::components) (`components/mod.rs`): `Clamped => values::clamped::DEFINITION,`. Nothing else
is needed; a request on `clamped` inverts through the operators' own
inverses. If other code reads a prop by position, name it in the module
(`pub const VALUE: usize = Props::AT.value;`) and re-export the module from
`components/prop.rs`.

**A type whose wiring depends on which attributes the author gave** names a
planner of its own as the block's last section:

- `Plan(plan)` to return the element's plan, with the copy rules
  (`extend`), `fixed` and its list's length applied around it
  (`plan_with_extend`, `compile/stages/plan/copies.rs`); the points, lines and circle
  are planned this way,

Such a type lives in its own file, block and planner together (for
example `values/text.rs`, registered as `values::text::DEFINITION`).
`geometry/circle.rs` and `geometry/line.rs` are the models. A planner is a
function of its element's record (ADR 0034): given a [`PlanCtx`](crate::compile::api::PlanCtx), it reads
the attributes and children the compile parsed (`Attrs::of(ctx.record())`),
picks which ports are leaves and through which operators the rest derive,
and returns its wiring from a `Props<Wire>` struct literal
([`ElemWiring::set_public`](crate::compile::api::ElemWiring::set_public), ADR 0016). It reaches no DAST, node or `extend`:
a test keeps those out of `components/`, and another counts `PlanCtx`'s
methods. Rules for planners:

- Use only what [`compile::api`](crate::compile::api) (`compile/api.rs`) exports. Logic two planners both need
  belongs in `compile/` behind `api.rs`, once. Behavior a family shares
  belongs in the family's `mod.rs`.
- Name a value of the wiring by its *port* (`CONTEXT.md`, ADR 0032), as
  the wiring hands it out: a table prop by `Props::PORTS.radius`, a list
  point's coordinates by `wiring.item(k)`, a helper value by what made it
  (`wiring.hidden(..)`). A planner never computes a position: `Props::AT`,
  the table's positions, is for what reads a built component (the build,
  the document), and a test holds `components/` to it.
- A type built on shared machinery names it in its block and has no
  planner (`machinery: Answer`, `Choice`, `RepeatFor`,
  `FunctionIterates`, `Collect`; ADR 0034): the compile calls it. A type
  only what owns it plans (an `<award>` by its `<answer>`, a constraint in
  its point's record) says `flags: [owned]` and `owner: Answer`, and the
  compile refuses one standing free. A type that cannot be extended says
  `flags: [not_extendable]`, and the compile refuses the extend; no
  planner sees `extend` (its record is the merge).
- What a planner would know about another type belongs to that type: a
  point constrained to a component wires what the target declares
  (`constrain_target { ports: [cx, cy, radius], op: ProjectCircle }`,
  ADR 0034), and matches on no `ComponentType`.
- Declare the attributes the planner reads, each with its kind
  (`attributes { center: Point, radius: Scalar, through: Points(3) }`,
  ADR 0032), and read them typed from the element's record
  (`let attrs = Attrs::of(ctx.record())`), never from the source: the
  compile parsed them before planning, the element's own or its `extend`
  referent's, each where its writer sits. Say what gave a given leaf
  (`Wire::given_by(attr::radius, v)`, `Wire::point(p, attr::through, k)`,
  `Wire::scalar(source, GivenId::Attr(attr::x, 0))`), so a copy giving
  the same attribute keeps it as its own and one not giving it shares
  the referent's. A value the planner introduces that no attribute gives
  is a parameter (`params { DIST }`, `wiring.param(param::DIST, 1.0)`);
  one the children give is `GivenId::Children(k)`.
- Declare how the type reads its children (`children: Value`, ADR 0034):
  `None` (read and built as nothing, a shape's), `Math` (math text, as
  written: a `<math>`'s, a point's `(a, b)`), `Value` (a blank, a literal,
  one reference or math text: a `<number>`'s, a `<text>`'s), or, the
  default, `Rendered` (built as components). Groups of element children
  follow the kind (`children: Math { constraints: [ConstrainTo,
  ConstrainToGrid] }`): each member is parsed into a record of its own, as
  its type declares, written directly under the element or inside a
  wrapper named as the group is (`<constraints>`). The compile parses them
  into the record beside the attributes, and the planner reads them typed
  (`attrs.children`, `attrs.constraints`), never the source.
- A `<label>` or `<shortDescription>` child is a component of the element
  on every type, for the renderer to read (ADR 0024); the parse of the
  children passes over it.
- What an extend omits comes from its referent, planned where the
  referent sits (ADR 0023): the record is merged (ADR 0032), its children
  part by part (the referent's math text when the element has none, the
  referent's members of a group the element has none of), and `ctx.tuple`
  and the rest pick the referent's scope for the referent's math text, so
  a planner need not think about it.
- A type a bare reference reads as a value says so in its block
  (`reads_as: Math` on `<mathInput>`, ADR 0025); the build then makes a
  `<math>` aliasing the input's props for `$mi`, and `<math
  extend="$mi"/>` or `<mathInput extend="$n"/>` is the extend of the
  referent's default prop ([`ComponentType::extends_as`](crate::components::ComponentType::extends_as)).
- A type the core makes or recognizes without a tag says which part it
  plays (`roles: [Root]` on `<document>`, `roles: [ImplicitInput]` on
  `<mathInput>`, ADR 0038): the root, a refused element's box, an
  iteration's index, value and item, a list's point, a case, an answer's
  response and implicit input. The core names the
  [`Role`](crate::components::Role) (`Role::Root.ty()`,
  `ty.plays(Role::Refused)`), never the type, and each role is claimed by
  exactly one type, checked when the crate compiles.
- A type that is structure rather than content says which kind
  ([`StructureKind`](crate::components::StructureKind), ADR 0038):
  `structure: Transparent` on `<group>` and `<collect>`, `Transparent {
  choice: choice }` on `<conditionalContent>`, `Gate { active: active }`
  on `<case>`, `Repeat { count: count }` on the repeats. Scoring, section
  numbers, a sticky group's members, a component's text and the input
  signature look through it by its kind, so a new container that behaves
  like one of these declares it and is looked through everywhere.
- `fixed` is not the planner's: `plan_elem` records, beside the plans,
  what holds the element ([`ElemPlan::hold`](crate::compile::ir::ElemPlan::hold), from the table `HOLD_ATTRS`): the
  element's own setting, else the nearest container's (ADR 0022). The
  build holds every cell of a held element ([`Program::holds`](crate::program::Program::holds)), and the
  inversion refuses a request on a held cell; the plans are never
  rewritten. A type whose every value is a location says `located` among
  its flags, and `fixLocation` then holds it the same way.
- A combination of attributes the planner cannot honor is a warning
  ([`PlanCtx::warn`](crate::compile::api::PlanCtx::warn)), never a silent NaN: what it cannot define is
  `Wire::undefined` (or `Source::undefined`) of what `warn` returns. A
  value not given (an attribute's default, an emptied input, an entry
  past a tuple's end) is `NO_VALUE` or `Wire::absent()`. `Wire::constant`
  refuses NaN, and a test (`components/mod.rs`) finds any `f64::NAN` a
  component writes.
- An attribute the planner never looks up is refused: the check boxes any
  element carrying an attribute nothing read while the document was
  planned (`compile/stages/link/unread.rs`, ADR 0021), so an author's attribute never
  does nothing silently. Reading an attribute (`ctx.attr`, `d.attr`) is
  what accepts it; an attribute a renderer reads from the literal
  attributes instead, and the core never does, is declared in the block
  (`presentation { to }`) or, for one every type may carry, in
  [`PRESENTATION_ATTRS`](crate::components::PRESENTATION_ATTRS) (`components/mod.rs`).

The renderer for the new type goes in `packages/cells-viewer/src/renderers/`.
Mark every prop it requests `interactive` in the block (`value: attr(0.0) {
interactive }`; a list whose points it drags, `interactive: true`): these
are the document's inputs (ADR 0017), and the core refuses a request on any
other (ADR 0018), which the viewer's test (`src/interactive.test.tsx`)
catches first. A prop an action writes instead is `written_by_action`. A
spec reaches a prop no renderer requests (a circle's `radius`) through an
input bound to it, `<mathInput bindValueTo="$c.radius"/>`, as a document
does; never mark a prop interactive for its spec. Mark every prop the
renderer reads `rendered` (a list whose points it draws, `rendered:
true`), a score a grader reads `score`, and a prop an action reads
`read_by_action`; a type drawn only in a graph, or nowhere, says so with
`renders: InGraph` or `renders: Never`. These are the document's outputs
(ADR 0019), and the viewer's test fails on a renderer's read of any
other cell.

## Add an operator

Add one entry to `scalar_ops!` in `program/scalar.rs` (ADR 0016) giving its
inputs (at most two, so an instruction stays 16 bytes; a literal is an
input, a constant), its evaluation, and its inverse, declared `exact`,
`projection` or `drops`. An operator that reads more is a vector one
([`VecOp`](crate::program::VecOp), as `Clamp` is), whose inputs a program parks in its operands. The macro (`program/ops.rs`) generates the
[`Op`](crate::program::Op) and [`OpSpec`](crate::program::OpSpec) variants and every match arm. The tests in
`program::scalar::inverses` check each inverse against what its entry
declares, over a fixed table of values for each input,
and that it writes only an input it declares ([`OpSpec::writes`](crate::program::OpSpec::writes), ADR 0018:
an `exact` or `projection` inverse its first, a `drops` one none). The
compile finds what a student can write by those declarations, so a vector
operator declares its own in [`VecOp::writes`](crate::program::VecOp::writes), the last column of the table
in `program/vector.rs`, checked by the `writes` tests there.

A document reaches an operator through a component's prop table or planner,
or through math lowering (`build/expand/math.rs`). Operators over several
cells are `VecOp`s in `program/vector.rs`.

## Change how a request inverts

Scalar inverse rules are [`Op::invert`](crate::program::Op::invert), vector rules [`VecOp::invert`](crate::program::VecOp::invert). The
engine that orders requests and keeps point groups together is
[`tick::invert`](crate::tick::invert) (`tick/invert.rs`).

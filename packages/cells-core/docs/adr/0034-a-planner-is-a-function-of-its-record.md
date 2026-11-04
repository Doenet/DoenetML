# A planner is a function of its record

Status: accepted 2026-11-04. Steps 1 to 5 are done (see Migration). Builds on ADR
0016 (components are defined without knowing the core), ADR 0029 (a
planner reads no other element's plan) and ADR 0032 (decision 3, a
planner is a function from typed attributes to a wiring), and finishes
what ADR 0032's step 4 left for later. How children and attribute
content are matched by the kind of value they hold rather than by tag
is deferred to an ADR of its own (see Considered options).

A planner today is a function given a `PlanCtx` that reaches the whole
compiler: the DAST, the element's node, its referent's node, its
`extend`, and forty-seven methods over them. This ADR shrinks it to a
function of the element's *record*, the attributes and children the
compile parsed before planning, with nothing else in reach; reduces the
planner kinds to two, a table and a function; makes `extend` a thing no
planner sees; and moves what a planner knows about another type into
that type's definition. What a planner is left to do is the one thing
nothing else can: pick, from which givens the author wrote, which ports
are leaves and through which operators the rest derive.

## Context

### What the JavaScript core decides in the tick

The JavaScript core decides a state variable's dependencies at run time
(`stateVariablesDeterminingDependencies`, 193 sites in
`packages/doenetml-worker-javascript/src/components`), re-deciding them
whenever a determining variable changes. Tallied by what the determining
variable is:

| The determining variable is | Sites, about | The cells core's form |
|---|---:|---|
| a reference's or composite's resolution (`unresolvedPath`, `templateAnalysis`, `referentInfo`, `extendedComponent`, `attributeComponent`, `targetComponentIdx`) | 45 | outlining |
| which attributes or children were given (`basedOnThrough`, `havePrescribedCenter`, `isInterpolatedFunction`, `mathChildName`, `identicalAxisScales`, `evaluateSymbolically`) | 60 | the planner's case split |
| a size (`numRows`, `numThroughPoints`, `numControls`) | 20 | a list's length from the source, or a structural cell |
| a collection (`scoredDescendants`, `inputsForAnswer`, `answerAncestor`) | 15 | an aggregate in the table (ADR 0032, decision 4) |
| spreadsheet and matrix indexing, variants, the rest | the remainder | an escape hatch or a seed |

Every row but the matrix and spreadsheet sizes is a fact about the
source. The JavaScript core runs a general fixpoint because it never
separates source facts from student state. The cells core compiles once
and re-plans only through a rebuild gated by a structural cell (ADR
0004), which is that fixpoint's bounded form: the rebuild is the
planner's second run.

### What the Rust prototype decides once

The Rust prototype (`packages/doenetml-worker-rust`) gives every prop a
type-level updater: a fixed list of `DataQuery`s, a `calculate` over
their results and an `invert` over the same. The updater is chosen per
prop of a *type* (`PropGetUpdater::get_updater` takes no element), so no
code decides a prop's inputs for a particular element. Three mechanisms
make that possible:

- queries name the *kind* of value wanted, not a tag: a number prop asks
  for "the children whose prop matches Number, Math or String"
  (`PropProfile`, `pick_prop`), and the child decides which of its props
  answers;
- every prop carries a `State` leaf beside its inputs, and `calculate`
  branches on how many inputs matched and on provenance flags
  (`came_from_default`, `changed`: 127 reads across the general props
  and components), so the case split over which givens exist runs at
  evaluation time over the union of every case's inputs;
- queries resolve lazily, once, with a resolve stack for the one dynamic
  case (`PropSource::StaticComponentRef`, used by `<xref>` alone), and
  nothing un-resolves.

So the prototype made the cells core's choice: dependencies are a
function of structure, settled at load. Two facts bound what it shows.
It has 17 components and 16 general props, and its only shape is a point
with `x` and `y` attributes, no `coords`, no children and no constraint.
It never met a prop that is a leaf under one given set and derived under
another.

### What planners do today

Of the 67 `component!` blocks, 36 say `planner: Props` and need no
function. The 31 that name one:

| Kind | Types | What the function does |
|---|---|---|
| `Plan` (8) | circle, line, segment, triangle, polygon, point, two test-only | a case split over the givens, returning the wiring |
| `PropsThen` (5) | mathInput, choiceInput, section, selectFromSequence, repeatForSequence | adjusts the table's plan where the table cannot say it |
| `Whole` (18) | ten are a refusal (`<award>` outside an answer) or a call naming machinery (`ctx.plan_answer()`); two register a collect; six plan content (text, boolean, math, curve, textInput, the tuple) | |

Read against ADR 0016's goal (a component written without knowing the
core) and ADR 0032's decision 3 (a planner is `fn wire(attrs, children)
-> Wiring` with no DAST in reach), the irreducible part is small:

- **A case split over the given set that changes the direction of
  dataflow.** A circle's `cx` is a given leaf when `center` is written
  and a derived value through one of four vector operators otherwise
  (`geometry/circle.rs`). The formula per case is canonical; which case,
  and so which ports are leaves, is not, and no single definition of
  `cx` can hold both.
- **A diagnostic for a combination the type cannot honor** (ADR 0016,
  no silent NaN).
- **Intermediate ports and projections around the leaves**: the hidden
  squared radius, a constrained point's raw coordinates.

The rest is accidental, and it is most of the surface:

- **Planners read the DAST.** Eleven files under `components/` call
  `ctx.dast()`, `d.attr(..)` or `d.children(..)`, naming attributes
  (`"bindValueTo"`, `"prefill"`, `"from"`, `"vertices"`) and child tags
  (`"constrainToGrid"`, `"constraints"`) by string. ADR 0032's step 4
  landed "with bounds", and the bound is this: children are not
  declared, so the record does not hold them, so a planner that reads
  children reads the source.
- **Planners handle `extend`.** Text, textInput and boolean branch on
  `ctx.extend()`; `plan_choice` refuses it; point reads `ctx.base()`'s
  children and chooses between its own and the referent's. The merged
  record (`Record::merged_over`) and the given-leaf aliasing rule exist
  so that none of this is a planner's.
- **Three planners re-implement the children parse.** Text, boolean and
  textInput each decide literal against single reference against mixed
  content, as `plan_attrs` does for `PropFrom::Children`.
- **Planner kinds leak into the driver.** `PropsThen` exists because the
  table cannot say "absent when bound, else a seed"; `plan_attrs`
  carries a list of six types whose `by_planner` props it must leave
  blank for a `PropsThen` to fill; `Whole` exists so that a refusal and
  a call into machinery can be written as a function.
- **A planner matches on another type.** The point's `<constrainTo>`
  matches the referent's type (circle, function, line, segment) to pick
  a projection operator and the ports it reads: a fact about each of
  those types, held by the point.
- **`PlanCtx` is forty-seven methods**, most of them readers of the DAST
  that exist only because the record is incomplete.

## Decision

### 1. A planner is a function of its record

A planner is

```
fn plan(ctx: &mut PlanCtx) -> Result<ElemWiring>
```

where `PlanCtx` gives the element's record (`Attrs::of(ctx.record())`
as now, and the children, decision 2), the port makers (`ElemWiring`,
`Wire`, `Source`), `warn`, and the planning of what the record already
holds parsed (`plan_expr` over a parsed math, a reference the record
carries). It gives no DAST, no node, no referent node and no `extend`:
`dast`, `node`, `base`, `extend`, `attr_text`, `attr_flag`, `attr_on`,
`single_macro`, `is_blank`, `is_presentation_child`, `is_not_content`,
`math_children`, `child_math`, `referent_child_math` and `literal_number`
leave it. A planner is then a pure function of source facts the compile
settled before planning, which is what ADR 0029 made it in principle.

A source-scan test beside `components_compute_no_slot_positions`
(`components/mod.rs`) keeps `.dast()`, `.node()`, `.base()` and
`.extend()` out of `components/`, as that test keeps slot arithmetic
out.

### 2. Children are declared, and parsed into the record

The `component!` block says how an element's children are read, and the
parse stage (`compile/record.rs`) parses them into the record beside the
attributes, each in the scope it was written in, the element's own or
the referent's under the merge rule:

```
children: None                       // a container reads none as a value
children: Math                       // a <math>'s, a <number>'s text
children: Value                      // a literal, or one reference: <text>, <boolean>, an input's initial state
children: Components { constraints: [ConstrainTo, ConstrainToGrid], .. }
                                     // named groups by type, as the current core's child groups
children: Rendered                   // a container's content
```

`Value` is what `plan_attrs` reads for `PropFrom::Children` today, made
once: a blank, a literal, a single reference, or math text, with a
`<label>` or `<shortDescription>` passed over (ADR 0024). Sugar that
today lives in `outline/answer.rs` is one more rule the declaration
names, as ADR 0032 said. A `Components` group gives the planner the
member elements' records and references, typed by group, never their
nodes.

Matching a child by the kind of value it holds rather than by its type,
the Rust prototype's `PropProfile`, is deferred: it is the same
declaration with a different key, and it lands with the coercion table
(ADR 0032, decision 1) in an ADR of its own. Nothing here depends on
which key is used.

### 3. Two planner kinds, and machinery that is named, not called

`Planner` has two variants: `Props`, from the table, and `Plan(fn)`, the
function of decision 1, with the copy rules and the list's length
applied around it as `plan_with_extend` does now. `PropsThen` and
`Whole` go.

- A type planned by machinery several types share names it in its
  block (`machinery: Answer`, `Choice`, `RepeatFor`, `FunctionIterates`,
  `Collect`), and the compile calls the machinery; the thin wrappers in
  `values/answer.rs`, `structure/select.rs` and their kin go. The
  type's own refusals (a choice cannot be extended) are flags the
  machinery reads (decision 4).
- A type only its owner plans (`<award>`, `<when>`, a response, a
  `<pointList>`, `_error`) says `flags: [owned]`; the compile refuses a
  free one with the diagnostic the wrapper raises today.
- A `PropsThen` type becomes a `Plan` over its record, or a table.
  MathInput's bound-or-seeded decision is a case split over
  `bindValueTo` and the children's kind, which is what `Plan` is for.
  A section's per-tag defaults are read from the record's tag. The
  list in `plan_attrs` of types whose `by_planner` props are left blank
  goes with the kind.

### 4. No planner sees `extend`

The merged record is the planner's whole view of a copy. `ctx.extend()`
and `ctx.base()` go, and with them the branches in text, textInput,
boolean and point and the refusal in `plan_choice`:

- a type that cannot be extended says `flags: [not_extendable]`, and the
  compile refuses the extend before planning;
- a text or textInput that extends another plans from its merged record
  as any element does, and the given-leaf rule aliases what it did not
  write;
- `<boolean extend="$x"/>` where `x` is not a boolean is a coercion of
  the referent's default prop, one row of ADR 0032's table; until the
  table lands, the compile keeps that rule where `extends_as` is, never
  the planner;
- a point extending a point with `(a, b)` children reads the children
  of its merged record, which are the referent's when it wrote none.

### 5. What a planner knows about another type belongs to that type

A constraint target declares how a point is projected onto it:

```
constrain_target { ports: [cx, cy, radius], op: VecOp::ProjectCircle }
```

on the circle, the line and the segment, and the function's evaluation
rule the same way. The point's planner asks the record for the
referent's declaration and wires it; it matches on no `ComponentType`.
A type without the declaration cannot be a constraint target, which is
the refusal the point raises today. The same move applies to any later
planner that would match on a referent's type.

### 6. The case split stays a Rust `match`

A planner's case split over its record is written as a `match`, as
circle's `match (over, hc, hr, n)` is. No case language is added to
`component!`. What the machinery needs to know about the dataflow a
planner chose, it reads from the wiring after planning (ADR 0033), not
from the planner.

## Considered options

- **Superset wiring with a chooser.** The Rust prototype's model in
  cells: wire every case's operators, select by a constant case cell,
  and let folding (ADR 0028) drop the dead branches. It works for value
  routing (attribute, else children, else default), which the table's
  `attr`, `children` and `attr_or` already do. For a port that is a leaf
  in one case and derived in another it needs a shadow state cell and a
  chooser on every such port, inverses that branch the same way, and
  essential-ness becomes an output of folding rather than a plan fact
  the writable walk reads (ADR 0018). The prototype's textInput `value`
  is the warning: forty lines of flag comparisons to report no change,
  with a note that it still gets it wrong while typing. The cells tick
  has no such path because the plan chose one wiring.
- **A relational declaration oriented by the machinery.** Declare the
  circle's relation and let the given set choose the leaves; ADR 0026
  already orients binary operators. A center and one point, two points
  and a radius, and three points are different algorithms with
  different inverses, not one relation read backwards. Orientation
  handles arithmetic chains; the table already has those.
- **A case table in `component!`** (`cases { given(center, radius) =>
  .. }`). The same split as data. It would let the machinery read which
  outputs depend on which givens, which ADR 0033 gets from the dataflow
  after planning without touching a planner; and ADR 0016 rejected
  interpreted definitions. A `match` is the table.
- **Keep `Whole`.** It is the kind that lets a planner reach the source,
  and every accidental read above is in a `Whole` or a `PropsThen`.
  Keeping it keeps the hole.
- **Profile-matched children in this ADR.** It is the right key, and the
  prototype shows it working; it also decides the coercion table, which
  touches references and extends beyond planning. Deferred so that this
  ADR's steps each land with the golden diff unchanged.
- **Lazy resolution with a resolve stack**, as the prototype. It exists
  there because a query's source may be a prop's value. The cells core
  resolves names when outlining, before planning, so there is nothing
  to resolve late.

## Consequences

- A planner reads a typed record and writes named ports, and nothing
  else: ADR 0016's component written without knowing the core, and ADR
  0032's decision 3 in full. Reordering children, renaming an attribute
  in the source, or a change to how `extend` merges records changes no
  planner.
- Two planner kinds, no driver list of types, no wrapper functions. A
  type is a table, a table with a function, or a table naming
  machinery.
- `PlanCtx` is the record, the port makers and `warn`; `compile/api.rs`
  exports that and no DAST type.
- The eleven files that read the DAST read the record; the three
  children parses are one; the five `extend` branches are none.
- A new constraint target is a declaration on the target type, not a
  match arm in the point.
- The golden diff is unchanged by every step: every decision moves where
  a fact is read, not what is planned from it.
- What is not changed: the case split, which is the planner's one job;
  the rebuild as the only second run of a planner; and the superset
  routing the table already does for values.

## Migration

Each step lands alone, with the golden diff unchanged.

1. **Children declared and parsed into the record.** The `children:`
   section, its kinds, and the parse into `Record` beside attributes,
   with the merge rule covering them; `Attrs::of` gives the children
   typed. Text, boolean, textInput, math, curve and point read them
   from the record. Test: `compile/record.rs` unit tests for each kind,
   own against referent's under the merge; the children-parse tests
   that `plan_attrs` has move to the one parse.

   *Done.* As landed: `children: None | Math | Value | Rendered`, the
   last the default, optionally followed by groups (`children: Math {
   constraints: [ConstrainTo, ConstrainToGrid] }`). Whether children
   are built as components is now read from the declaration, not from
   the planner kind or a `PropFrom::Children` prop
   (`ChildrenDecl::built`). A group's members are component types of
   their own (`<constrainTo>` and `<constrainToGrid>`, `internal` until
   step 3 gives them `owned`), parsed into records of their own, written
   directly under the element or in a wrapper named as the group is.
   `Value` plans its one reference when parsing, where it was written,
   and `plan_attrs` reads `PropFrom::Children` from it. Three new
   attribute kinds: `Literal(default)` (a literal number, its error
   kept for the planner), `On` (`simplify`, `simplify="full"`) and
   `Written`. Line also reads its children from the record (`children:
   Math`). Children read through a path (`Referent::Path`) are not
   merged, as before: their math text names nodes planned where the
   referent sits. Two edge cases changed: a point with `x` or `y` and
   `(a, b)` children of its own takes the coordinate it omits from them
   (it took 0), and a line with children and `through` or a direction
   is planned from the latter (its children won). The golden diff is
   identical.
2. **`Plan` for the `PropsThen` types.** MathInput, choiceInput,
   section, selectFromSequence, repeatForSequence as `Plan` over their
   records, or as tables; the `by_planner` list in `plan_attrs` goes.
   Test: each type's spec unchanged; `plan_attrs` matches `ByPlanner`
   only to refuse it.

   *Done.* As landed: mathInput, choiceInput, selectFromSequence and
   section are `Plan` types; repeatForSequence is a table, and the
   compile plans the hidden elements of any table type's repeat body
   (`plan_iteration_names`). Three more attribute kinds: `Content` (a
   value as children are one: a mathInput's `prefill`), `LiteralFlag`
   (a section's `aggregateScores`, refused when not literal) and, for a
   keyword, a raw identifier (`r#type`). The record carries the tag the
   element is written with (`division`). A choiceInput's choices are a
   group of its `Rendered` children (`choices: [Choice]`), built as
   components and counted from its record; text among a type's groups
   is refused. A container copy of a `Plan` type is planned through
   `plan_with_extend`. `plan_attrs` refuses a `by_planner` prop; only
   `plan_function_iterates` asks for them blank (`plan_table`), and a
   test finds none in a table type (`<case>`, built by its choice,
   aside until step 3). The golden diff is identical.
3. **Machinery named, owned types flagged, `Whole` gone.** `machinery:`
   and `flags: [owned]` in `component!`; the thin wrappers removed;
   `Planner` is `Props | Plan(fn)`. Test: `tests/diagnostics.rs`'s
   refusals (an award outside an answer, a free response) unchanged.

   *Done.* As landed: `machinery:` and `owner:` sections in
   `component!`, and the `owned` flag; a block naming machinery, or
   owned, writes no `planner:` (it is `Props`, never run). The compile
   dispatches before the planner kind (`plan_owned`, `plan_machinery`
   in `compile/planning/mod.rs`); the collect wrapper's reads of `from`
   and `vertices` moved there. The owned types are award, when,
   response, tuple, point list, `_error`, case and the two constraints
   (which are no longer `internal`: a free one is refused naming its
   owner, not an unknown tag). The refusal names the owner (`an <award>
   outside an <answer>`); a free `<pointList>` keeps its own. Since
   `Whole` went here, text, textInput, boolean, math and curve became
   `Plan` types in this step, which brought forward part of step 4:
   their `extend` branches went, a text or textInput extending another
   is planned by `plan_with_extend`, and `<boolean extend="$x"/>` reads
   `x`'s `value` by the rule beside `extends_as` (`plan_extend` in
   `compile/refs.rs`). The choice's refusal of `extend` moved into the
   machinery's dispatch until step 4's flag. The golden diff is
   identical.
4. **`extend` out of planners.** `flags: [not_extendable]`; the text,
   textInput and boolean branches and point's `base` reads removed;
   boolean's cross-type alias kept by the compile beside `extends_as`.
   Test: `tests/extend.rs` and the copy-rule tests in
   `compile/planning/copies.rs` unchanged.

   *Done.* As landed: what remained after step 3 was the flag.
   `flags: [not_extendable]` on conditionalContent and select; the
   compile refuses their extend before dispatching to the machinery,
   with the message the choice wrapper raised. Point's `base` reads
   went in step 1, and the text, textInput and boolean branches in
   step 3. No planner in `components/` names `extend`. The golden diff
   is identical.
5. **Constraint targets declared.** `constrain_target` on circle, line,
   segment and function; the point's match removed. Test: the point's
   and circle's specs unchanged; a test-only type with no declaration is
   refused as a target.

   *Done.* As landed: `ComponentDef::constrain_target`, a
   `ConstrainTarget` of `Project { props, op }` (circle: `[cx, cy,
   radius]` by `ProjectCircle`; line and segment: `[x1, y1, x2, y2]` by
   `ProjectLine`) or `Graph { expr }` (function, and derivative, which
   shares its definition: `constrain_target { graph: expr }`).
   `PlanCtx::constrain_target` reads the referent's declaration; the
   point wires it in two arms. The golden diff is identical.
6. **`PlanCtx` shrunk and sealed.** The DAST readers removed from
   `PlanCtx` and `compile/api.rs`; the source-scan test of decision 1.
   Test: the scan finds nothing; the count of `pub(crate)` methods on
   `PlanCtx` is recorded in the test so that growth is deliberate.

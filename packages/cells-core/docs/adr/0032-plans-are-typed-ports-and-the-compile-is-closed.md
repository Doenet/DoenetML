# Plans are typed ports, and the compile is closed over its own IR

Status: proposed 2026-11-03. Steps 1 to 7 of the Migration are done,
and the first two parts of step 8; see Migration. Builds on
ADR 0027, ADR 0029, ADR 0030 and ADR 0031, which gave the compile its
stages and its tables, and takes the step ADR 0023 deferred (aliasing
what an extend does not override) and the one ADR 0016 removed (lists of
a fixed maximum), each in a bounded form.

The compile's stages are now in order and its tables are now by stage.
What they hold is still positional and untyped: a plan names a slot by
its offset, a reference names a prop by a name the build looks up again,
a cell's type is decided by whichever stage first needs it, and two
plans are holes the build fills. This ADR replaces the plan IR with
**typed ports**, splits `Source` into the three things it mixes, makes a
planner a function from typed attributes to a wiring, gives collections
and aggregates a place in the IR, and resolves every reference to a port
at compile. The compile then produces a *closed* IR: one the build only
binds to cells, and one the compile's own analyses (ADR 0012, ADR 0018,
ADR 0019, ADR 0028) can run over without a build.

It also records which components of the JavaScript core break this
design, or the current one, and what form each takes here.

## Context

Reading the compile after ADR 0031, with the JavaScript core's
mechanisms beside it (`core/dependencies/*.ts`, `CompositeComponent.js`,
`Copy.js`, the attribute definitions of `utils/dast/types.ts`), the
same few facts are carried by several mechanisms each.

### `Source` mixes five concerns

Its seventeen variants are value provenance (`Given`, `GivenText`,
`GivenMath`, `Const`), dataflow (`Alias`, `Op`, `VecOut`), scope
dependence (`IterIndex`, `SequencePick`, `FirstIteration`,
`GivenMathFrom`), math lowering (`Math`, `MathHandle`, `MathValue`,
`SymExpr`) and late binding (`Inherit`, `Deferred`). Every reader
matches on all seventeen: the build's `BuiltSource`, the abstract
build's `gives_document_constant`, the arity check, the keys.

### Slots are positions

`Arg::Own(u8)` is an offset into the element's own props, `Arg::Elem(e,
u8)` into another's, `VecOut(head, k)` the `k`-th output after a vector
operator's head, a hidden slot the next offset after the public ones, a
list's points two offsets per point after the table's props, and
`NPublic::{Table, Planned, AsReferent}` says how many public slots there
are. Planners do the arithmetic (`list_slot`, a circle's `tp(k, j)`),
and a saved-state key names a hidden slot with a bit (`HIDDEN`) and a
shared-state name.

### Nothing says what type a slot holds

Whether a reference is text is read off the referent's tag
(`macro_is_text`); whether a `<math>` is a point off its tokens
(`settled_type`); whether a point-valued reference has two coordinates at
build time (`ArityMismatch`, raised in `build/expand/resolve.rs` and
caught only by the abstract build); and whether a math is numeric or
symbolic once per build, through a memo with a *deciding* state
(`is_symbolic`, `build/expand/math.rs`). The coercions between types are
hand-written rules (`reads_as`, `extends_as`), where the JavaScript core
has a table of adapters per class.

### Copies are five mechanisms

A bare copy (`Source::Inherit` in every prop), an extend of a prop
(`plan_extend_prop`, a match on component types), a container copy with
outline-time clones, a prop-table extend (`plan_attrs` defaulting to
`Inherit`), and `plan_with_extend`, which reruns the planner over the
referent's DAST subtree (`PlanCtx::base`, `scope_for`), tracks where
each given value came from (`Given`), and names what the copy shares
(`SharedState`) for linking to tie. Shared state exists only because a
planner folds attributes into hidden slots and vector operators, so no
source per attribute is left to alias. ADR 0023 names the alternative
and defers it.

### Two plans are holes

Credit, percent credit, a section's number and a collect's count are
`Source::Deferred`, filled by `build/expand/scoring.rs` and
`expand_collect` from the expanded tree. The compile cannot reason about
them, so the abstract build has a category of its own for them (*counted
values*, ADR 0028), and `Deferred::of` is one more match on component
types.

### The driver knows components

Outlining matches on `FunctionIterates`, `RepeatFor`,
`RepeatForSequence`, `Collect`, `PointList`, `ConditionalContent`,
`Select`, `Answer`, `Award` and `When` to decide how an element's
children are read; `plan_extend_prop` on `Point`, `MathInput`, the
value types, `Math` and `PointList`; `plan_attrs` keeps a list of types
whose planner fills `ByPlanner` props. Each is a fact about the type
that its definition could state.

### Reference paths are a state machine, resolved twice

`plan_ref` (`refs.rs`, 865 lines) walks a path with three states (at an
element, inside an iteration, after a select's pick), deciding list
items, coordinates, combined props and alternate spellings as it goes.
ADR 0031 made the prop it ends at a `RefProp`, resolved at compile when
the referent's type is known; past a choice interface or a collect it is
still a name the build looks up (`RefProp::Named`).

### The check needs a build

Cycles, writable, live, counted and document-constant records come from
running expand and emit through the abstract build's view, with
stand-ins for choice branches, `later_sources` for iterations after the
first, and labelled reference edges. The compile is not closed over its
own IR: what it knows about a document, it learns by building it.

### The JavaScript core's dynamic machinery

The JavaScript core decides at runtime what the cells core decides at
compile: a composite's replacements (`readyToExpandWhenResolved`,
`calculateReplacementChanges`), a reference's target when its index is a
value (`refResolution`), a copy's type (`setCreateComponentOfType`),
array sizes, adapter insertion, and dependencies themselves
(`stateVariablesDeterminingDependencies`, some 250 uses). The cells core
has chosen to fix all of that at compile, with structural cells and
rebuilds for counts (ADR 0004), choose operators for reactive choices
(ADR 0009) and seeded scope constants for picks. The abstractions below
keep that choice; the last section says where it cannot be kept.

## Decision

### 1. Every element's plan is a record of typed ports

An element declares *ports*: its public props, its private intermediates
(today's hidden slots), and its list's items. A port has a name and a
*type* from a small lattice:

```
Num | Bool | Text | Math | Point | Tuple(n) | List(T, len) | Bundle(op)
```

A wiring names a port by identifier, never by offset: `Port { elem,
name }`. A vector operator writes one `Bundle` port whose fields are its
outputs, so `VecOut` goes. A list is a port of type `List(Point, len)`
with `len` fixed by planning (a polygon's vertices), by the referent (a
bare copy, today `AsReferent`), or, for the cases in the last section, a
cap with a live length port. `NPublic`, the hidden-slot offset, the
`HIDDEN` key bit and every slot computation in a planner go; a saved-state
key names a port by its name. The build numbers ports into slots once,
at emit, as it numbers slots into cells today.

Ports carry types, so a **type inference pass** after planning settles
every port's type once: a math whose leaves are all `Num` is `Num`
(lowered, ADR 0005), one with a free symbol or a `Math` leaf is `Math`; a
`<math>` whose text is a pair is `Point`; a reference to a text input is
`Text`. Through a repeat the type is the template's, so the pass is a
fixpoint over templates; through a choice it is the join of the
branches, which the branch interface already requires to agree. What
reads a type then reads the port: `macro_is_text`, `settled_type`, the
build's `is_symbolic` memo and `MathMode` go, and a coordinate of a
non-point is a compile error, not an `ArityMismatch` the abstract build
catches.

**Coercions are one table.** `reads_as`, `extends_as`, a `<number>`
feeding a `Math` slot, `$mi` read as a math, a `<text>` holding a math:
each is a row `(from, to) -> how` in one table the type pass consults,
which is the cells core's form of the JavaScript core's adapters
(`static adapters`, `substituteAdapter`) and `createComponentOfType`
shadowing.

### 2. `Source` is three things, and none of them is a hole

A port's definition is:

- a **dataflow expression** over ports: an alias, an operator over
  ports, a lowered math tree whose leaves are ports, or a symbolic
  template whose leaves are ports;
- or a **leaf**: a given value (essential when writable, ADR 0018), a
  constant, or a *scope constant* (an iteration's index, a sequence
  pick, a seed from another port when first built);
- optionally wrapped in a **scope specialization**: `Specialize(pred,
  a, b)`, where `pred` is a structural predicate of the scope the
  template is stamped in (its first iteration, its last, inside a
  graph). `FirstIteration` is the one instance today; a function
  iterate's initial value and a repeat's first-item rules are the same
  thing, and a component need not know it is in a repeat to use it.

`Inherit` and `Deferred` do not survive the compile. An extend's
un-overridden ports are aliases made by planning (decision 3); credit,
numbers and collect counts are aggregates (decision 4). The build
receives a closed IR, and emit becomes a binding of ports to cells with
no case for "filled later".

### 3. A planner is a function from typed attributes to a wiring

The `component!` block declares attributes with a type as well as a
name:

```
attributes {
    center: Point?,
    radius: Scalar?,
    through: Points(max 3),
    hide: Flag = false { inherited },
    equation: Math?,
    function: Ref(Function),
}
```

The compile parses every declared attribute into a typed record
(`Attrs`, generated), handling literal against reference against math
text, the three attribute forms of VAL-6 to VAL-8, a flag's spellings,
a point list's items, and the scope each value was written in. An
undeclared attribute is an error on the element, with no read-recording
side channel (`Dast::attr_read`, `link/unread.rs`): ADR 0021's rule is
kept by construction. Presentation attributes are declared the same way
with no type (`presentation { .. }` as now).

A planner is then `fn wire(attrs: &Attrs, children: &Children) ->
Wiring`, with no DAST in reach. `PlanCtx` shrinks to what reads the
parsed record and what makes ports.

**An extend with overrides is a merge, then the same function.** The
element's attribute record is the referent's record with the element's
own attributes written over it, each value keeping its scope (ADR 0023),
and `wire` runs on the merged record. A port whose definition is a given
leaf is identified by the attribute or parameter port it came from, so
*a copy shares every given leaf whose attributes it did not override*,
by aliasing it to the referent's port of the same name. `SharedState`,
`Given`, `Share`, `link_shared_state`, `PlanCtx::base` and `scope_for`
go. A parameter a planner introduces that no attribute gives (a line's
distance along its direction, `DIST`) is a named parameter port with a
default, shared by the same rule. An extend across a scope (`<point
extend="$r[2].P" y="5"/>`), refused by ADR 0023, works: the referent's
record is a template fact, and its references already carry their hops.

**Inherited attributes are a schema flag.** `fixed`, `fixLocation`,
`fixAxes` (`HOLD_ATTRS`), `hide`, and the JavaScript core's `disabled`
and `styleNumber` (`fallBackToParentStateVariable`,
`addContextAttributeDefinitions`) are attributes marked `inherited`,
which the record fills from the nearest element around that gives them,
through repeats and choices, as `nearest_attr` does for the hold
attributes alone. `compile/planning/fix.rs` becomes one row's effect.

**Children are declared.** How an element reads its children is a
section of its block: `children: Math` (a number's, a math's value),
`children: Components { inputs: [MathInput, ..], awards: [Award] }`
(the JavaScript core's child groups), or `children: Rendered`
(containers). Outlining reads the declaration instead of matching on
types, and sugar that today lives in `outline/answer.rs` is one more
rule the declaration names.

### 4. Collections and aggregates

A **collection** is a compile-time description of a set of components:
the descendants of a type under an element, the iterations of a repeat,
the picks of a select, the preceding siblings of a type, each reaching
through containers, repeats and choices with a *gate* per choice branch
(a case's `active`). An **aggregate** is an operator over a collection's
ports: a weighted mean for `creditAchieved`, a count for a section's
`number` and a collect's `count`, a gather for a `<collect>`'s children
and a polyline's vertices, a permutation for `<sort>` and `<shuffle>`.

A collection is a plan, not a hole. The build materializes it (as
`expand_collect` and `scoring_sources` do today, in one place), and the
abstract build counts it: a *counted value* (ADR 0028) is an aggregate
over a collection that crosses a repeat, found by looking, not recorded
by the build. `Deferred`, `Deferred::of`, `Body::Collect`'s special
cases in `plan_ref`, and `build/expand/scoring.rs` as a separate wiring
pass go. The JavaScript core's `descendant`, `child`, `replacement`,
`countAmongSiblings` and `recursiveDependencyValues` dependencies, and
its `Collect`, `Sort`, `Shuffle`, `Split` and `Substitute` composites,
each have a static form here.

### 5. One path language, resolved to a port at compile

A reference is a sequence of steps:

```
Up(n) | Child(elem) | Iter(affine index) | Branch(choice, iface name)
     | Item(collection, affine index) | Port(sel)
```

Resolution to a port, with list items, coordinates, combined props and
alternate spellings, happens once, when the path is planned, so
`RefProp::Named` goes and the build only evaluates affine indices and
walks arrays. The `At` state machine in `plan_ref` becomes a fold over
steps that each ask one question of the outlined table or a collection.
A select's pick and a collect's item are both `Item` on a collection; a
choice's interface name is `Branch`.

A **dynamic index** whose expression is not an iteration index
(`$r[$n].x`, `$l.points[$k]`), refused today (`DynamicIndex`), is `Item`
with a port in its index, built as a choose operator over the
collection's items. Its inverse writes the chosen item, which the vector
operator table already has (`VecOp::Choose`). This is the static form
of the JavaScript core's `refResolution` with runtime index values.

### 6. A facts graph with recorded reads, so a box needs no restart

Each element contributes facts, by stage: its outlined row, its
attribute record, its ports and their types, its wiring, its references.
Every read of another element's facts goes through one recorder, as
`referent_readers` does for the one read ADR 0029 kept. An error boxes
the element, and a fixpoint boxes every reader of its facts, as
`box_readers_of_boxes` does for referent types. `plan_and_check`'s
restart (`Compiler::restart`, a clone of what is under a box) and the
abstract build's `Failure` with an element to box both become reads the
recorder already holds, so a document compiles once however many
elements fail. `diagnose` is the same pass with the records kept and the
rest dropped.

### 7. The abstract build is an analysis over the template graph

With decisions 2, 4 and 5 the IR is closed: every port's definition
names ports, collections and leaves, and nothing names a component the
build will make. The abstract build then need not build. It stamps each
template once in the abstract, labels reference edges with the affine
shifts its `Iter` steps carry (`Coord::Keep`, `Coord::Reset`, as
`index_coord` does now), joins a choice's branches, and counts a
collection by the repeats it crosses. Over that graph the compile runs
the cycle check (ADR 0012), the writable and live walks (ADR 0018, ADR
0019), the counted and document-constant classing (ADR 0028) and the
structural depth, as passes over port attributes rather than records
of slot bitsets (`Record`). `View::Probe`, `stand_ins`, `later_sources`,
`Plans::Both`, `counted_slots`, `document_slots` and `labels` leave the
build. This is the largest change here and the last to land.

## What the JavaScript core's components ask

Of its 193 component files and 19 composites, most fit the design above
as is, some strain it, and a few break the premise both designs share:
that the graph and the component count are fixed by the source and
change only through a structural cell and a rebuild.

### Breaks the premise

- **Counts that follow values.** A `<function>`'s `minima`, `maxima` and
  `extrema`, an `<intersection>`'s points, `<solveEquations>`'
  solutions, `<subsetOfReals>`' intervals and `<split>`'s pieces have a
  count that follows the current values, not an attribute. As structural
  cells they would rebuild the document on every drag of the function or
  the circle, against "the tick never consults structure". The form here
  is the third list kind of decision 1: `List(T, cap)` with a live length
  port, padded to the cap, which is the fixed-maximum layout ADR 0016
  removed for polygons on memory grounds and which is right where the
  cap is small and known from the types (two conics meet in at most
  four points; a line meets an *n*-gon in at most *n*). Where no cap
  exists (solutions, pieces) the count is a structural cell and a
  rebuild, acceptable because nothing drags them.
- **`<spreadsheet>`.** The student types the formulas, so the dependency
  graph among its cells is authored at runtime (HyperFormula). No compile
  can see it. Its only honest form is one opaque vector operator over
  every cell, with no inverse and no liveness inside: an escape hatch,
  declared as such.
- **Actions that add components.** A graph, a sticky group and a
  section have an `addChildren` action, reached by `<callAction
  actionName="addChildren">`, which inserts a serialized snapshot at
  tick time. Neither design makes components after compile. The nearest
  static form is a declared *pool*: a repeat whose count is a structural
  cell an action writes and whose iterations seed from the snapshot.
  This is the one structural action, and it needs a decision of its own
  before any document relies on it.

### Strains the design, with a static form

- **`<sort>`** reorders by value, so rendering order changes on a tick.
  A permutation aggregate (decision 4) carries the values; the component
  table's child order is fixed per build, so a renderer reads an order
  port. `<shuffle>` is seeded and needs nothing.
- **Runtime-typed values.** `<substitute type>`, `<split type>` and the
  selectable-type base class choose a type from a `type` attribute,
  which is a literal in every document seen; `type="$t"` is refused. A
  copy whose type depends on which branch is active is already refused
  by the branch interface (ADR 0009). Mixed-type children of the boolean
  and math operators are coercions (decision 1).
- **Sizes bound to inputs.** A matrix input's rows and columns, a
  sequence's length, a random sample's count, an ODE's step count and
  Bezier control counts are structural cells. Right, and a rebuild per
  change: a student resizing a matrix input pays one per click.
- **Modules.** A `<module>` copied with new parameters is a container
  copy with attribute overrides, decision 3's merge: a fit.
- **External sources.** `<copy uri>` and a `<ref>` to another document
  load content asynchronously; the compile must be handed inlined
  sources, which is the parser's concern.

### Fits as is

Answers with partial and unordered matching, feedback and responses
gathered through copies (an aggregate over the answer's inputs);
inherited `hidden`, `disabled`, `fixed` and `styleNumber` through
sources and adapters (schema flags); paginators and postponed rendering
(a gated choice); variant enumeration (a count the compile produces);
animation, triggers and chained actions (the tick's); and the remaining
composites, each a repeat, a choice, a gather or a clone in disguise.

The current design has the same breakers and two more that this ADR
removes: any type whose public prop count the table cannot state, and
anything that needs a port's type before the build.

## Considered options

- **Keep positions, add types beside them.** A type per slot, with
  offsets kept. Cheaper, but every leak in Context that is not about
  types (hidden slots, lists, vector outputs, keys, shared state) stays,
  and planners keep doing arithmetic the macro could do.
- **Alias un-overridden props without the attribute record** (ADR
  0023's option 1). A planner that decides its wiring from attributes and
  children together cannot tell, from a finished wiring, which given
  leaf an attribute became. The record is what makes the merge well
  defined; without it shared-state names are needed, as now.
- **Infer types in the build, per build, as now.** A document's types
  do not depend on counts or picks, so inferring them per build does
  work that is the same every time and makes a compile-time fact a
  build-time memo.
- **Keep the abstract build a build.** It works, and it is tested
  against real builds at every count (`tests/every_count.rs`). The
  cost is that every analysis is written as bookkeeping inside
  expansion, and the compile cannot answer a question about a document
  without expanding it. Decision 7 is last and separable: everything
  before it stands with the abstract build as it is.
- **Make the JavaScript core's runtime mechanisms available.** Dynamic
  dependencies, runtime-typed copies, replacements that follow values.
  Rejected: they are what the cell model gives up to make the tick a
  program over cells (ADR 0015), and the last section shows the price is
  three components, each with a bounded form.

## Consequences

- A planner reads a typed record and writes named ports. Reordering a
  prop table changes nothing; a port left unwired or a coordinate of a
  non-point does not compile or is a compile error, never a build-time
  arity error.
- A cell's type is a compile-time fact, read from its port. The build's
  math-mode memo, `macro_is_text`, `settled_type` and the
  `ArityMismatch` path go.
- Copies are one rule with one data structure, and an extend with
  overrides works across scopes. `SharedState`, `Given`, `Share`,
  `link_shared_state`, `plan_extend_prop`'s match on types,
  `PlanCtx::base` and `scope_for` go.
- The IR the build receives is closed. `Inherit`, `Deferred`,
  `Deferred::of`, `scoring_sources` as a separate pass and `expand_collect`'s
  count rules go; emit binds ports to cells.
- Every reference ends at a port. `RefProp::Named`, the `At` state
  machine and the second prop lookup in the build go; dynamic indices
  are allowed.
- A document with *n* independent errors compiles once.
- With decision 7, the compile answers cycles, classes, liveness and
  depth without a build, and `build/abstract_build.rs` with its view
  goes. Until then the abstract build runs over the new IR unchanged in
  what it checks.
- Memory: a capped list pads to its cap, for the few types that need
  one. Every other list has the length the author gave (ADR 0016).
- The golden diff is unchanged by every step but the ones that fix a
  refusal (an extend across a scope, a dynamic index), which add
  documents rather than change values.

## Migration

Each step lands alone, with the golden diff unchanged unless it says
otherwise. Decisions 1 to 3 come first and together make the others
cheap; 4, 5 and 6 are independent of each other; 7 is last.

1. **Ports by name.** Give `ElemWiring` named ports and make
   `Arg::Own`, `Arg::Elem`, `VecOut` and hidden slots name them; the
   macro's `Props<T>` already has the names. Emit numbers ports into
   slots. Keys name a hidden port by its name, dropping `HIDDEN`.
   `NPublic` goes with the list as a port. Test: every planner compiles
   with no `list_slot` or offset arithmetic; the cost snapshots are
   unchanged.
   Done, with one choice to record. A port is a handle (`Port`,
   `compile/plan.rs`) that only the type's table (`Props::PORTS`) and
   the wiring hand out (`ElemWiring::item` for a list point's
   coordinates, `hidden` and its kin for a helper value): a planner
   cannot make one from a number, so `list_slot`, `own_slot`, a circle's
   `tp(k, j)` and every slot computation in a planner are gone, and a
   source-scan test in `components/mod.rs` keeps them out. `Arg::Own`,
   `Arg::Elem` and `Source::VecOut` hold a port; a `PropsThen` planner
   adjusts its table's props by port (`TableProps`, `props[ports.expr]`).
   The handle is the port's position in the wiring's order (the table's
   props, the list's points, the hidden ports), which is what the build
   numbers its slot by; a port is not yet carried by name through the
   compile, so step 4's merge rule will identify a given leaf by the
   attribute it came from rather than by a port name. `NPublic` is
   `ListLen`, how many points the list holds, from which the public
   count follows; `Props::AT`, the table's positions, stays for what
   reads a built component by position. A saved-state key names a port
   by its number with no `HIDDEN` bit: the keys record each element's
   public count, so a port past it is hidden and named by the shared
   state it holds (`Keys::prop_key`). The golden diff is unchanged.
2. **A type per port, inferred once.** The lattice, the inference pass
   after planning, and the coercion table. Replace `is_symbolic`,
   `MathMode`, `macro_is_text`, `settled_type`'s use after outlining and
   the build's `ArityMismatch` with reads of the port's type. Test: the
   type pass agrees with what every build decided on the golden set and
   every fixture, at every count.
   Done, in the bounded form the single-cell ports of step 1 allow. The
   lattice is `Num | Text | Math`, what a cell holds (`PortType`,
   `compile/plan.rs`): a point, a tuple and a list are shapes of the
   selector that names them, which the type table already states, not
   types of a port, and `Bool` stays within `Num` as the build's value
   types have it. The pass (`compile/seal/types.rs`) runs when sealing,
   once every element is planned and linked and every choice's
   interface is known: a fixpoint from `Num` up over every template at
   once, each port typed from its source and the ports it reads, a
   reference followed as far as the templates tell (into a repeat's
   body, a collect's candidates, a select's options, an interface's
   elements in every branch) and joined over where it may land. Every
   build reads the result (`Compiled::port_type`): what a cell holds
   (`typed_slots`), whether a `<math>`'s handle is a math cell, and
   whether a leaf inside math stands for an expression, so `MathMode`,
   the `is_symbolic` memo and the build's walk of plans for a value's
   type are gone. `macro_is_text` is a read of the prop's declared kind
   (`PropDef::text`, a `<text>`'s and `<textInput>`'s `value`), which is
   what a planning-time read can have before the pass runs. The shape
   checks the build made move to the pass where the abstract build is
   sure to land on a component: a reference read as one cell names one,
   a coordinate is of a point, a leaf inside math names one cell and no
   text, and an interface name or a whole pick holds text in every
   branch or in none (a math cell and a number join to a math cell, as
   the build's stand-in has always held them); an index into a collect
   that gathers from no repeat,
   or into a point list, may be past the end at every count, which the
   build reads as the missing value, so the build keeps its arity check
   for that path alone. The settling of a `<math>`'s shape (point, tuple
   or math) stays outlining's, since it decides the element's prop table
   before anything is planned. Test: `tests/port_types.rs`, which checks
   every template slot's cell type against its port type on the golden
   set and every fixture, at load and at every count of every repeat.
   The golden diff is unchanged.
3. **`Source` split.** Expression, leaf and specialization as three
   types; `FirstIteration` becomes `Specialize`. `Inherit` and `Deferred`
   stay until steps 4 and 5. Test: `gives_document_constant` and the
   arity check are matches on the leaf and expression types alone.
   Done. `Source` is `Leaf`, `Flow` (the dataflow expressions) or
   `Specialize(ScopePred, then, else)`, with `Inherit` and `Deferred`
   beside them until their steps; `FirstIteration` is
   `Specialize(ScopePred::FirstIteration, ..)`, and a `prefill="$n"`
   seed is the scope constant `ScopeConst::Seed`. The build's
   `plan_source`, the type pass and the arity check each match the leaf
   and the expression kinds once; a unit test in `compile/plan.rs` holds
   `gives_document_constant` to the kinds. The golden diff is unchanged.
4. **Typed attribute records and two-phase planners.** The `attributes`
   section carries types; the compile parses the record; `PlanCtx`
   exposes the record and the port makers only. Then the merge rule for
   extends; `SharedState`, `Given`, `Share` and linking's shared-state
   pass go; `Inherit` goes. The hold attributes and `hide` become
   `inherited` rows. Test: `tests/extend.rs` and the copy-rule tests
   in `compile/planning/copies.rs` unchanged, plus an extend with
   overrides across a scope that ADR
   0023 refused, now giving the referent's values. Changes the golden
   diff only by documents that loaded with that refusal.
   Done, with these bounds. The `attributes` section carries kinds
   (`Scalar`, `Value`, `Point`, `Points(max)`, `Flag(default)`,
   `Bool(default)`, `Number(default)`, `Text`, `Math`, `Ref`); the
   compile parses every declared attribute into the element's record in
   a parse stage after the maths (`compile/record.rs`), and the planner
   reads the record typed (`Attrs::of(ctx.record())`). The merge rule is
   `Record::merged_over`; a referent in another template has its record
   rebased through the extend's path (`compile/rebase.rs`), which
   composes the referent's reference plans with the path and names an
   iteration index the referent's paths carry as the path names it. A
   given leaf is identified by what gave it (`GivenId`: an attribute's
   leaf, the children's, or a parameter from `params { .. }`), and a
   copy shares every one whose attribute it did not write, across a
   scope through `Sel::Port` on the path. `SharedState`, `Given`,
   `shared_point_state` and `Inherit` are gone: a bare copy's or a table
   type's un-overridden prop aliases the referent's port by position.
   What stays, for later steps: the tie between a copy's port and the
   referent's is still made when linking, keyed by the identity, since a
   port is not yet carried by name through the compile (step 7's
   recorder is where a planner could read the referent's wiring);
   `PlanCtx` still reads the referent's children for a planner, until
   children are declared; an undeclared attribute is still refused by
   the recorded reads of ADR 0021, since the table-planned types and
   the compile's own machinery (answers, choices, repeats) read theirs
   outside any declaration; and the hold attributes stay the one table
   of `compile/planning/fix.rs`, with `hide` keeping its scope, so no
   attribute is marked `inherited` yet. The golden diff changes by no
   document.
5. **Collections and aggregates.** `Collection` and `Aggregate` in the
   IR; credit, numbers, collect and polyline through them; `Deferred`
   goes. The abstract build finds counted values by the collections it
   crosses. Test: `tests/scoring.rs`, `tests/repeat.rs` and the counted
   record on every golden document unchanged.

   Done, in this form. A type's table declares an aggregate as a prop
   source, `aggregate(op, collection)` (`PropFrom::Aggregate`), with the
   operator (`AggOp`: `Credit`, `PercentCredit`, `Count`) and the
   collection (`Collection`: `ScoredItems`, `SectionsThrough`, which a
   section's number counts, and `Gathered`, the components of the type
   a collect or polyline gathers under what `ElemPlan::from` names, so
   the collection is the row's body and the plan's `from` together
   rather than a reference carried in the port). The planner's wiring
   is `Flow::Aggregate`, set from the table wherever an element's props
   are planned, a bare copy's included, so nothing overrides it; the
   build materializes every aggregate in `build/expand/aggregate.rs`
   (`expand_collect` for the gathered items and their count, since a
   reference into a collect is placed before the other aggregates are
   wired, then `aggregate_sources` for credit and numbers), and finds a
   counted value by the repeats the collection's items sit in, as
   before. `Deferred` and `Deferred::of` are gone. A percent is listed
   as an operator of its own so the build keeps wiring it from the
   credit cell, which keeps the golden set identical; `Body::Collect`'s
   special cases in `plan_ref` and the type pass's `collected` walk stay
   for step 6, where `Item` on a collection replaces them. The golden
   diff changes by no document.
6. **Paths to ports.** The step language, resolution to a port at
   compile, `RefProp::Named` gone, `Item` on collections, and dynamic
   indices as choose. Test: every reference in the golden set resolves
   to the same cell as before; a document with `$r[$n].x` loads and a
   request on it writes iteration `n`.

   Done, in this form. A step is `Elem` (a child), `Iter` (into a
   repeat's iteration), `Item(collection, index)` (a gathered item, a
   point list's point, or a select's pick, `Collection::Picks`) or
   `Iface` (a branch), its kind decided when the path is planned from the
   outlined row; `Up(n)` stays the plan's `hops`. The build's walk
   dispatches on the step and asks no component's type. The port is a
   `RefProp { of, sel }` resolved when planned; `RefProp::Named` is
   gone, and a prop a planner names on a path is resolved on the type
   the path reaches (`ref_target_type` now follows an interface name
   into the first branch carrying it, a bare `$r[k]` to the one
   component of the iteration, and `$s[k]` to the one type every option
   holds), refused at compile when the type lacks it. What stays: a
   path that names no port takes the referent's default prop in the
   build, by the type the build reaches (the same type), and the type
   pass alone still finds a prop by name on a branch of another type,
   which the interface check refuses. A dynamic index is one reference
   as the whole index (`IndexTerm::Cell`), on a repeat, a collect or a
   point list: the walk keeps every item (`Resolved::Chosen`) and a value
   read through it is a `VecOp::Choose` over the items' slots by the
   cell, chunked past one choose's inputs, with the walk's label on
   each item edge and a reset at the entered level, so the abstract
   build sees a read of any iteration; its inverse writes the item the
   cell names. `$l.points[$k]` (a port of one element, not a
   collection) and a cell plus a literal are left refused. The golden
   diff changes by no document.
7. **Recorded reads.** One recorder for cross-element reads; boxing as
   a fixpoint; `restart` and the abstract build's element-naming
   failure become reads. Test: `tests/diagnostics.rs` unchanged, and the
   compile count in its restart tests is one.

   Done, for the compile's own reads. One recorder (`record_read`) takes
   every cross-element read: an extend's or constraint's of its
   referent's type (as `referent_type` recorded before), a container
   copy's of what it clones, and now each clone's of its original, which
   `clone_children` records with the clone's `CopyOf` plan. Linking's
   fixpoint (`box_readers_of_boxes`) boxes every reader of a box, a
   clone silently (it has no node; its original's error explains it),
   so `box_in_place` no longer restarts the compile when a cloned
   subtree is boxed: the copy and its clones are boxed when linking, and
   the restart tests count one compile. `Settled::cloned` is gone. What
   stays: a failure no element can carry (a synthetic element's, an
   unread attribute on a node with no element) and sealing's failures
   still end the compile at the stage boundary, and the abstract
   build's element-naming failure still boxes the element from the
   start of a new compile; these become in-place boxes when step 8 makes
   the abstract build a pass of the compile, where the fixpoint already
   runs. The golden diff changes by no document.
8. **The abstract build as analysis.** Stamp templates in the abstract,
   label edges, join branches, count collections; the four records
   become port attributes; `build/abstract_build.rs` and the view go.
   The attributes keep ADR 0036's rule: a stamped build reads the IR
   and its attributes, never the abstract analysis's graph.
   Test: `tests/every_count.rs` and `tests/live.rs`, which check the
   records against real builds at every count and seed, unchanged.

   It lands in six parts, each alone with the golden diff unchanged. The
   order follows from ADR 0036: what the abstract build hands over stays
   facts about ports, never an edge, so the template graph is the
   compile's own from its first part, made from the IR, and is tested
   against the abstract build while both exist; no part reads the graph
   off the abstract builder.

   1. **Port attributes.** The four records become attributes of
      ports, a bit per fact by template slot, in a table of the check's
      own (ADR 0031). Test: every test unchanged.

      Done. `PortAttrs` (`compile/plan.rs`) is `WRITABLE`, `LIVE`,
      `COUNTED` and `DOCUMENT_CONSTANT`; each template carries the
      check's table, `Checked`, beside sealing's, and a build reads a
      port's attributes through `Plans::port_attrs`
      (`Builder::port_attrs` for a slot), so `Plans::classes`,
      `Plans::live`, `Plans::counted`, `Plans::document_constants` and
      the bitset `Record` of `compile/plan.rs` are gone, which leaves
      `Record` naming only an element's attribute record (ADR 0034). The
      classing off marks every port writable rather than leaving the
      record out. A stamped build classes by the attributes
      (`Defined::by_attributes`, `Builder::live_by_attributes`). The
      abstract build still finds them, by its walks over its own slots,
      and gives each port what its slots were found to be
      (`AbstractFindings::attrs`). The golden diff is unchanged.
   2. **The template graph.** The compile stamps each template once in
      the abstract from the closed IR: a node per port and per value a
      plan makes inside one (an operator of lowered math, a constant),
      an edge per read, labelled by the reference's steps (an `Iter`
      step's affine shift, `Coord::Keep`, or `Coord::Reset`, as
      `index_coord` decides now), a choice's interface a join over its
      branches, a collection's items and counts by the repeats it
      crosses, and a specialization giving both of its sources. Nothing
      reads it yet. Test: between element ports it has the dependencies
      the abstract build has, with the same labels
      (`testing::abstract_edges`), on the golden set and every fixture,
      and it covers every stamped build at every count and seed
      (`tests/every_count.rs`'s `admits`).

      Done, in this form. `compile/graph/` stamps every live template
      once from the plans (`template_graph`): a node per port of every
      live element and of every component the abstract build makes
      beside them (an interface's or a whole pick's stand-in, a case, a
      `$ref` child, a collect's copy, a point list's point, kept in one
      table, `TemplateGraph::made`), and per value a read goes through
      (a reference leaf inside math, a choose over a dynamic index,
      chunked as the build chunks it, an answer's credit, a case's gate,
      a mean). A read keeps the label of the reference that made it when
      that is not the identity (`TemplateGraph::labels`); any other read
      keeps the levels its two ends' templates share and resets the
      rest, as `edge_label` does, so the two graphs compose a path's
      label the same way. The stamping runs in resolve's order, since
      what a later step sees is what an earlier one made: copies of a
      list type take their referent's ports, `$ref` children with no
      index are placed, collects gather and count, point lists get their
      points, indexed `$ref` children are placed, then the choices'
      stand-ins, every port's reads, the aggregates and the holds
      (`compile/graph/expand.rs`). References are walked as resolve
      walks them in the abstract view (`compile/graph/walk.rs`), a
      walk returning its label as resolve's does, and credit and section
      numbers are stamped over the stamped tree, where a copy of an
      answer scores through its own ports (`compile/graph/aggregate.rs`).
      `Coord`, `Label` and `index_coord` moved to the compile, and the
      abstract build reads them there. `tests/template_graph.rs` checks
      it on the golden set, `sir.doenet`, every fixture and documents of
      its own, one for each construct above: on every document that
      compiles, the two graphs have the same dependencies between
      element ports, with the same labels, and each document of its own
      compares some. Breaking any one construct's reads fails it. One
      thing it cannot see is a `$ref` child's own label: only an indexed
      one has a label that is not the identity, and an element reaches
      an indexed one only through a whole reference, which resets, or a
      collect, which runs before it is placed and gathers nothing (a
      document of its own pins that order). Since the abstract build's
      graph covers every stamped build (`tests/every_count.rs`), so does
      the template graph. The golden diff is unchanged.
   3. **The cycle and count checks over the graph.** The Tarjan walk
      with its Bellman-Ford per component (ADR 0012), the loop on the
      graph of repeats and the structural depth are passes of the
      compile over the template graph; `check_loops`, `check_scc` and
      `check_counts` leave the builder. Test: `tests/cycles.rs`,
      `tests/rebuild_cycles.rs`, the depths of `tests/repeat.rs` and
      `tests/load_errors.rs`, and `tests/every_count.rs`, unchanged.
   4. **Define over the graph.** Which nodes merge into one cell, each
      cell's definition, what it needs and where a request on it goes
      (`Def`), and from them the writable and live walks, the counted
      and document-constant classing, the prefill rule and the refuse
      warnings (ADR 0026), as passes that set the ports' attributes.
      Test: `tests/writable.rs`, `tests/live.rs`, `tests/refuse.rs` and
      the classing checks of `tests/every_count.rs`, unchanged.
   5. **The input signature over the graph.** ADR 0035's signature
      reads the graph's definitions instead of the abstract build's.
      Test: `tests/safe_edits.rs` unchanged.
   6. **The abstract build goes.** What expand and resolve raise in the
      abstract build today, an element that cannot be built, is raised
      by the template pass and boxed in place, as step 7's fixpoint
      boxes; `build/abstract_build.rs`, `View::Abstract` and the fields
      that exist for folding (`later_sources`, `stand_ins`,
      `pick_stand_ins`, `labels`, `counted_slots`, `document_slots`,
      `Plans::Both`) leave the build, and `tests/every_count.rs` checks
      every stamped build against the template graph. Test:
      `tests/diagnostics.rs` and `tests/every_count.rs`, unchanged.
9. **Capped lists.** `List(T, cap)` with a length port, for
   `<intersection>` first, as the test of the form the last section
   needs. The spreadsheet operator and the pool for `addChildren` are
   decisions of their own, not steps here.

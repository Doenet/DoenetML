# Relations between components are declared: context, items and actions

Status: proposed 2026-11-10. Draft; no migration step is done. Builds on
ADR 0034 (a planner is a function of its record), ADR 0038 (the core
names no component type) and ADR 0039 (the declaration language has two
tiers), whose `action` hook this gives its shape and whose reconsidering
of the crate split this precedes.

A component that computes its values from its own attributes and children
is written without the core today. One that relates to another component
is not: it reads a prop of what encloses it, it makes children nobody
wrote, or it acts on a component it names. Each of the three gets one
declaration, written beside the type, so the next type of the kind needs
no edit to the core.

## Context

On 2026-11-10 five unported components were each ported by an author who
had the component guide and nothing else of the core. `<integer>` and
`<vector>` needed no core read and no core edit. The other three each
needed an edit to the core, of a different kind:

| Type | What it needed | The edit it made |
|---|---|---|
| `<solution>` | Scoring to stop at a closed solution while section numbering treats it as a boundary; and so a wrapper child whose `active` is its solution's `open` | A new `PlanCtx::enclosing_prop(ty, port)`, a second `enclosing_graph_prop` |
| `<sequence>` | One number per iteration that no one wrote | The `Repeat` arm of outline makes a hidden value when `children: None`; `plan_iteration_names` is called for a `Plan` planner too |
| `<callAction>` | To submit the answer its `target` names | A `submits` flag on `Triggered`, and `Document::trigger` finds the answer by scanning every component for the cell the button aliases |

None of the three is rare in the vocabulary still to port. In the current
core's components, a state variable depends on a parent's 69 times in 26
files and on an ancestor's 43 times in 26 (a graph's bounds and scales, a
tabular's columns, a section's level, an answer's settings); 19 types
make their own children (`createSerializedReplacements`), and the
sequence, the samplers and the selectors of numbers make them through
shared code; 75 files define actions.

Each relation has one case in the core already, written for one type:

- **What encloses.** `PlanCtx::enclosing_graph_prop` reads a graph's
  bounds for the point inside it. `fixed` is inherited from the nearest
  container (ADR 0022).
- **What is made.** A repeat's `valueName` makes a hidden `sequenceValue`
  per iteration, which `plan_iteration_names` wires by filling
  `prop::sequence_value::Props` and reading the repeat's `from` and
  `step` by name (`own_prop_plan`). These are among the 37 lines in which
  the machinery fills a component's typed props (ADR 0039).
- **What is acted on.** `Document::submit` and `Document::trigger` are
  the two actions, read from `submit: Counted(..)`, `Copies(..)` and
  `triggered: Sets(..)`, three declarations with one type each.

Two rules were also found split where they were one:

- `StructureKind::Gate` says two things, that a type's children are
  there only while a prop is 1 and that the type is looked through. A
  case wants both. A solution wants the first without the second, and no
  declaration says it.
- A vector's rule for what a drag writes is one function in the current
  core (`moveVector`). In the port it is half in the planner (which prop
  derives from which) and half in the renderer (which props to request,
  by `basedOnHead` and `basedOnDisplacement`), because a request on a
  prop is the only gesture a type can receive.

## Decision

### 1. A gate is its own declaration

`gate: active` names the 0/1 prop a type's children are there by.
`StructureKind` loses `Gate` and keeps what it is about, whether a
type's children count as its parent's: `Transparent` and `Repeat`.

| Type | Declares |
|---|---|
| `<case>` | `structure: Transparent`, `gate: active` |
| `<solution>` | `gate: open` |

`ComponentType::gate_prop` reads the new field, so the scoring walk
(`gate_through`), the paths (`document/paths.rs`) and the text
(`document/table.rs`) do not change. The numbering walks' `Gate` arm (both
`aggregate.rs` files) and the signature's become the `Transparent` arm
with the gate passed through. A type with a gate and no structure is a
numbering boundary, as every plain container is, and gates what is scored
inside it.

The rule this follows: a declaration answers one question. When a second
type wants half of a declaration, the declaration is split, not given a
flag.

### 2. A container provides props, and a planner reads the nearest one

A container lists the props its descendants may read:

```rust,ignore
// <graph>
provides: [xmin, xmax, ymin, ymax],
```

A planner asks by the prop's name and names no type:

```rust,ignore
let xmin: Option<Source> = ctx.provided("xmin");
```

`provided` gives the prop of the nearest enclosing element whose type
provides one of that name, looking through `Transparent` types, or None.
It replaces `enclosing_graph_prop`, so `PlanCtx` keeps 19 methods. A name
two containers provide is the nearest's, as `fixed` is (ADR 0022).

What a planner would know about another type belongs to that type (ADR
0034): the container says what it offers, as a `constrain_target` says
what a point may wire. A planner that asked for "the `open` of a
`Solution`" would name a type, which is why the trial's
`enclosing_prop(ty, port)` is not taken.

`encloses: Graph(..)` stays. It is what the core reads of a graph;
`provides` is what a planner may.

### 3. A repeat declares the item it makes

A type that makes one component per iteration says which type, and wires
it with a function beside itself:

```rust,ignore
// <sequence>
structure: Repeat { count: count },
item: Number(item),
children: None,

fn item(ctx: &ItemCtx) -> number::Props<Wire> {
    let at = Props::PORTS;
    let scaled = Source::computed(OpSpec::Mul, vec![ctx.index_from_zero(), ctx.owner(at.step)]);
    number::Props { value: Wire::computed(OpSpec::Add, vec![ctx.owner(at.from), scaled]) }
}
```

`ItemCtx` has two things: the iteration's position, and `owner(port)`,
a port of the repeat one scope up. The item is the body's child. With
`children: None` it is the only one (a `<sequence>`); with written
children it is the hidden element `valueName` names (a
`<repeatForSequence>`), and the author's children follow it.

The compile makes the element while outlining and calls the function
while planning the repeat, for a `Props` planner and a `Plan` one alike.
What owns an element plans it, as an answer plans its award (ADR 0034).

The item is of an ordinary type, so `<collect componentType="number">`
finds a sequence's numbers. `sequenceValue`, `Role::SequenceValue` and
the `SequenceValue` arm of `plan_iteration_names` go: a
`<repeatForSequence>` declares the same `item`.

This covers the types whose children are computed from a position and
the type's own props: the sequence, the samplers and selectors of
numbers, a split, an intersection's points. A type that gathers,
reorders or chooses among existing components (`<collect>`, `<sort>`,
`<shuffle>`, `<select>`) stays with the `Collect` and `Choice`
machinery, and one that adds or deletes components at a student's
request is not addressed here.

### 4. An action is a named function beside its type

A type lists its actions, each a function that returns requests:

```rust,ignore
// <answer>
actions { submitAnswer: submit }

// <updateValue>
actions { trigger: update }

// <callAction target="$ans" actionName="submitAnswer"/>
attributes { target: Component, actionName: Text }
actions { trigger: call }

fn call(view: &ActionView, _args: &[f64]) -> Vec<Request> {
    view.target().map_or_else(Vec::new, |t| view.act(t, view.attr_text(attr::actionName)))
}
```

`ActionView` is read-only over the built document and has five methods:
a prop's current value, a request on a prop of the component, its
children, its target, and another component's action. The document runs
`Document::act(comp, name, args)` as one tick. `Document::submit` and
`Document::trigger` stay as that call with a fixed name, so the wasm
interface and the renderers do not change.

- **What an action may write.** Only props of its own type marked
  `written_by_action` or `interactive`, or what another component's
  action writes. ADR 0018 holds: an action is a way to make requests the
  document would accept.
- **A target.** `target: Component` is an attribute kind. The compile
  records the reference on the element's plan, as a collect's `from`
  is, and the build resolves it to the component. A planner still
  reads the target's props through `ctx.with_prop`. An `actionName` its
  target's type does not list is a warning when the document loads.
- **A gesture.** A renderer may call an action with arguments in place
  of requesting props. A vector's `moveVector(tail, head)` then holds
  the whole drag rule beside the type, and `basedOnHead` and
  `basedOnDisplacement` are not rendered props.
- **What goes.** `triggered`, `submit` and their three variants; the
  `submits` scan; `Role::Response` in `document/sections.rs`, which the
  answer's `submit` reads as its children.

This is ADR 0039's `action` hook with three things settled: it has a
name, it takes arguments, and it may reach one other component.

Not decided here: an action fired by a condition (`triggerWhen`), an
action that changes which components exist (`addChildren`, `resample`),
and events for a host (`recordVisibilityChange`), which are the
viewer's.

## Considered options

- **`PlanCtx::enclosing_prop(ty, port)`**, the trial's edit. Rejected:
  the child names its parent's type and its typed ports, and each new
  pair is a line the parent's author does not see.
- **A boundary flag on `Gate`** (`Gate { active, boundary }`). Rejected
  for decision 1: it keeps two questions in one declaration and adds a
  third value to it.
- **`children: None` on a `Repeat` meaning "the body is my value"**, the
  trial's edit. Rejected: the item's type and wiring stay in the core,
  and the meaning is read off two declarations that say something else.
- **A general composite**, a type that returns the components it expands
  to, as the current core's `createSerializedReplacements` does.
  Rejected: it is the machinery's context, which the spike
  (`docs/machinery-context.md`) measured as most of two stages. An item
  is the narrow case most of those types are.
- **Find a target by the cell it aliases**, the trial's edit. Rejected:
  it is a scan per press, and it works only for a target with one cell
  that identifies it.
- **Keep `submit` and `triggered` as data and add a variant per
  action.** Rejected: each variant has one type (the field audit found
  42 of 51 declaration variants with one), and the document's code for
  each stays in the core.
- **An action on the renderer's side.** A renderer could hold a drag
  rule, as the vector port's does. Rejected: the rule is then in two
  languages, and a second renderer repeats it.

## Consequences

- The three trial ports need no core edit: a solution declares
  `gate: open`, with the parser's wrapper tag a `Transparent` type; a
  sequence declares its `item`; a call action lists `trigger`.
- `ComponentDef` gains `gate`, `provides`, `item` and `actions`, and
  loses `triggered` and `submit`. `StructureKind` loses `Gate`. Two
  roles go (`SequenceValue`, and `Response` from the document's side).
- A component's author has two more small contexts beside `PlanCtx`:
  `ItemCtx` (2 methods) and `ActionView` (5). Neither reaches the
  compile.
- The engine no longer fills a sequence value's typed props.
- Each rule named in Context is in one place: gating in `gate`; a
  submit beside the answer; a drag beside the shape; an item's value
  beside the type that makes it.
- An item is checked when the vocabulary is made: its type exists, and
  its function returns that type's `Props`, by its signature.
- A type that provides a prop of a name another already provides shadows
  it for what is inside. That is the rule, and a lint may warn of it.
- The component guide gains a section for each of context, items and
  actions, and its checklist's container, structure and input rows
  change.

## Migration

Each step lands alone with the golden diff unchanged.

1. **`gate`.** The field, `gate_prop` reading it, `Gate` removed, the
   case and the three walks. Test: `tests/scoring.rs`, `tests/homework.rs`
   and `tests/every_count.rs` unchanged.
2. **`provides` and `ctx.provided`.** The graph provides its bounds;
   `enclosing_graph_prop` goes. Test: the points' and shapes' specs.
3. **`item`.** `ItemCtx`; `<repeatForSequence>` declares its item;
   `sequenceValue` and its role go. Test: `tests/every_count.rs` and the
   repeat fixtures; the load cost (`load-diff.sh`) within noise.
4. **`actions`.** `ActionView`, `Document::act`, the `Component`
   attribute kind; `submit` and `trigger` become actions; `triggered`
   and `submit` go. The spec language gains an `act` step, so a button
   and a submit can be specced.
5. **The trial again.** Port `<solution>`, `<sequence>` and
   `<callAction>` with the guide alone, then five types not tried
   before. Accepted when four of five need no core edit; what the fifth
   needs is the next question.

# The declaration language has two tiers, and the machinery keeps its contracts

Status: proposed 2026-11-09. Draft; no migration step is done. Amends ADR
0038, whose steps 8 and 9 (`ComponentType` an id, the split into three
crates) it defers; builds on ADR 0034 (a planner is a function of its
record) and on the spike `docs/machinery-context.md`.

Other people will write components, so the interface is sized by what a
typical author has to learn, not by how many ways the core can be
configured. The declarations a typical component needs are the public
declaration language. One type's behavior is code beside that type, behind
a few hooks. A role states the ports the core requires of its type. The
machinery (answers, choices, repeats, collects) stays in the engine and
reaches the types it makes through those contracts, not their typed props.

## Context

ADR 0038 took the core to naming no component type (step 7,
`the_core_names_no_type`). It did so by answering each question the core
asked of a type with a declaration, so `ComponentDef` now has 31 fields.
Many of them serve one type: `numbered` is the section's, `submit` the
answer's and the response's, `triggered` the `<updateValue>`'s, `rewrite`
the group's, each `settle` variant and the `Point`, `Expr` and `List`
variants of `extend_value` one type's, `infinite` one prop's. Written as
data, they tell a reader of the definition nothing the code would not, and
they sit in the block every author reads. The component guide's checklist
(*Checklist for a typical component*) measures it: 28 items concern a
typical component, and 14 more beside them do not.

Every role is claimed by one type by construction. Some are the core's
parts, made where the core needs one (`Root`, `Refused`, `ListPoint`,
`Case`, `Value`, `TextValue`), and the core then addresses their ports by
`default_sel`, `scalar_prop`, `gate_prop` and prop names (17 lines). The
rest exist so the machinery can recognize its own types (`Award`, `When`,
`Choice`, `Function`, `Response`, `ImplicitInput`, `Item`,
`SequenceValue`, `Index`).

The machinery still fills components' typed `prop::<type>::Props`: 37
lines in `plan/answer.rs`, `plan/choice.rs` and `plan/iterates.rs`.
Moving the machinery to the components side was the obvious way to remove
them. The spike measured what it would need: it plans other elements, makes
templates and synthetic elements while outlining, builds reference plans
with iteration steps by hand, reads the source (17 times) and outlining's
rows (25). Exposing that is most of the outline and plan stages, which is
wider than what moving would remove.

## Decision

### 1. Two tiers

**The public declaration language** is what the checklist lists for a
typical component: the block's `tags`, `props` with their sources and
flags (`interactive`, `rendered`, `written_by_action`, `read_by_action`,
`score`, `infinite`, `expr_of`), `planner`, `attributes`, `children`,
`flags` (`copyable`, `container`, `located`), `default_prop`, `reads_as`,
`renders`, `list`, `combined_props`, `alternate_names`, `presentation`,
`sticky`, `constrain_target`, and the kinds: `structure` (`StructureKind`),
`text` (`TextKind`), `response` (`ResponseKind`), `needs` (`Needs`),
`extend_value: Scalar(..)`, `encloses` (`Encloses`, both variants: what a
container changes about its descendants is a question any container
author faces) and `scored` (`Skip` and `Aggregates`, which any grouping
container faces).

This moves three items the checklist now lists beyond a typical component
into the public language: `scored: Aggregates`, `encloses: Sticky` and the
prop flag `infinite`. Each is one question a whole family of types faces,
answered today by one type.

**Everything else** is one type's behavior or the machinery's, and leaves
the field list: to a hook (2), to a role's contract (3), or to a
machinery's contract (4). `expr_when` goes with the answer's contract;
`Scored::Item` with the answer's too.

### 2. Hooks for one type's behavior

A type may name a few hooks, functions in its own file, each with a default
that does nothing:

| Hook | Replaces | What it gets and gives |
|---|---|---|
| `outline` | `rewrite`, `settle` | The element's literal attributes and, when asked, its math text; gives the type it is (a group with `rendered` is a conditional content, a math a point) and what it collects, from which attribute. |
| `extend` | `extend_value: Point(..)`, `Expr(..)`, `List` | The reference `extend="$x.prop"` names, as a `PlanCtx` gives it; gives the wiring. `Scalar` stays data. |
| `action` | `submit`, `triggered` | A read-only view of the component's cells and children; gives the requests a submit or a trigger makes. |
| `title` | `numbered` | The same view; gives the full number and title. |

The engine knows a hook exists, not what it does. An ordinary component
names none.

### 3. Roles are contracts

A role names the ports the core requires of the type that plays it:
`ListPoint` requires `x`, `y` and `hide`; `Case`, `active`; `Value` and
`TextValue`, `value`; `Root`, the credit aggregates. The vocabulary check
that each role has one type also checks that the type has those ports, and
the core addresses them through the role (`Role::ListPoint.port("x")`,
resolved once), not by `default_sel`, `gate_prop` or a name at each site.
A role nothing makes and nothing addresses is removed.

### 4. The machinery stays, and states what it needs

The machinery is engine: answers, choices, repeats and collects are
DoenetML's structure, as math text is, and the spike found no narrow
context for it. Each `Machinery` variant, and each role its machinery makes
or recognizes (`Award`, `When`, `Choice`, `Function`, `Response`,
`ImplicitInput`, `Item`, `SequenceValue`, `Index`), states the ports it
requires, checked as in 3. The machinery wires a type it plans by those
ports (`ElemWiring::set_port`), and `ElemWiring::finish` refuses a wiring
that leaves a public prop of the type unset, so the completeness a typed
`Props` checked when compiling is checked when the vocabulary is made and
whenever a document loads. The machinery's types declare their
`attributes`, and it reads typed records as every planner does (ADR 0034).
The engine then names no `prop::<type>`.

### 5. Enforcement does not wait for a split

The boundary is held by visibility (`pub(crate)`, `unreachable_pub`),
`the_core_names_no_type`, and the source-scanning tests in
`components/mod.rs`. ADR 0038's steps 8 and 9 are deferred: a split is
worth its cost once the components side needs nothing of the engine beyond
`compile::api` and the hooks' contexts, and is reconsidered when this ADR's
migration is done.

## Considered options

- **Move the machinery to the components side.** ADR 0038's deferred
  option, and the one that removes the typed props with the machinery.
  Rejected on the spike: its context would be most of two stages.
- **Keep a declaration per question.** What ADR 0038 built. Each is
  checked and explicit, but a one-type declaration costs every reader of
  the block and buys nothing over the code beside the type.
- **A typed wiring hook for each type the machinery makes.** Each of the
  15 whole-wiring fills becomes a function beside its type, which keeps the
  compile-time check. Rejected: 15 functions on the components side that
  only the machinery calls widen the interface this ADR narrows, and the
  check moves to load time without losing a case, since every type the
  machinery makes is in specs and tests.
- **Split the crates now.** Deferred (5).

## Consequences

- The checklist's "beyond a typical component" list shrinks to `roles`,
  `machinery`, `owner` and `flags: [owned]`, `not_extendable`, and a
  `hooks` block: 5 items in place of 14.
- `ComponentDef` loses `rewrite`, `settle`, `submit`, `triggered`,
  `numbered`, the one-type variants of `extend_value` and `scored`, and
  `expr_when` as a prop option; it gains `hooks`. Roles and machinery gain
  their port lists.
- A missing port is an error when the vocabulary is made, naming the role
  or machinery and the type, where today it is a panic at a site.
- A machinery's wiring of a type is checked complete at load, not at
  compile.
- `components/prop.rs` re-exports only what components read of one
  another.
- ADR 0038's steps 8 and 9 wait; its step 10 (documentation) is done as
  each step here lands.

## Migration

Each step lands alone, with the golden diff unchanged and the checklist no
longer.

1. **Records for the machinery's types.** The answer, the award, the
   select, the conditional content and the repeats declare their
   `attributes`; the machinery reads records. Test: the 17 source reads
   are gone but an iterates' read of its function's text.
2. **Role contracts.** Roles state their ports; the vocabulary check
   verifies them; the core addresses the core's parts through the role.
   Unused roles go.
3. **Machinery contracts.** Each `Machinery` variant and its roles state
   their ports; `ElemWiring::set_port` and the completeness check; the
   machinery stops naming `prop::<type>`. A test like
   `the_core_names_no_type` refuses `prop::` outside `components/`.
4. **Hooks.** `outline`, `extend`, `action`, `title`, replacing `rewrite`,
   `settle`, the one-type `extend_value` variants, `submit`, `triggered`
   and `numbered`.
5. **The checklist again**, and ADR 0038's steps 8 and 9 reconsidered.

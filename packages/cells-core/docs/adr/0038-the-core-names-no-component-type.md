# The core names no component type, and components are a crate of their own

Status: proposed 2026-11-09. Steps 1 and 2 of the Migration are done. Builds on
ADR 0016 (components are defined without knowing the core), whose
converse this is; on ADR 0034 (a planner is a function of its record),
which made `compile::api` the one door a planner goes through; and on
ADR 0020 (cells behind the shared renderer interface), whose type column
this keeps.

The core runs without knowing which component types exist. Everything
the compile, the build, the tick and the document need to know about a
type they read from its definition: a flag, a declaration, or a **role**
the definition claims. With no type named outside `components/`, the
definitions and their planners move to a crate of their own,
`cells-components`, over the machinery, `cells-engine`. A thin
`cells-core` ties the two together and keeps today's API, so
`cells-wasm`, `cells-bench` and the worker's bridge do not change.

## Context

ADR 0016 set out that a component is written without knowing cells,
slots, shared state or the renderer, and `components/mod.rs` says it is
"the only place that knows DoenetML tag vocabulary". One direction of
that holds. A planner imports from `compile::api` (ADR 0034), and three
unit tests in `components/mod.rs` scan the component sources for what
it must not touch (`components_read_no_source`,
`components_compute_no_slot_positions`, `plan_ctx_grows_deliberately`).

The other direction does not. On 2026-11-09 (`eecc7a4`):

- About 230 lines outside `components/` name a type
  (`ComponentType::Graph`, `::Case`, `::Answer`, ...): 41 types, in 40
  files. The most are in `compile/stages/outline/mod.rs`,
  `compile/stages/plan/answer.rs`, `document/table.rs`,
  `compile/graph/mod.rs`, `build/expand/aggregate.rs`,
  `compile/graph/signature.rs` and `compile/stages/seal/types.rs`.
- The core reads 34 prop positions from `components::prop`
  (`prop::case::ACTIVE`, `prop::math_input::EXPR`, ...).
- It calls into five component modules by path:
  `values::math::settled_type`, `structure::collect::collected_type`,
  `geometry::polyline::COLLECTED`, `values::curve::variables` and
  `structure::select_from_sequence`.
- `compile/ir` is written in the declaration language (`AttrDecl`,
  `PropSel`, `PropFrom`, `Aggregate`, `Collection`, `ChildrenDecl`) and
  names `ComponentType` 24 times.

Several of those matches are one rule written more than once:

- Which props stand for an expression ("an answer's `response`,
  `correct` and `submitted`, a response's `submitted` and `value`, the
  `expr` and `value` of a math, a mathInput, a function and a
  derivative") is spelled three times: in `compile/graph/mod.rs`
  (`math_target`), in `compile/stages/seal/types.rs` and in
  `build/expand/math.rs`.
- Which containers are looked through, for scores and for section
  numbers, is spelled twice: in `build/expand/aggregate.rs` and in
  `compile/graph/aggregate.rs`.
- That a `<graph>` and a `<stickyGroup>` change where their descendants
  are is spelled in `document/table.rs` (`placement`) and in
  `compile/graph/mod.rs`.

A new type that should behave like one of these has to be added to each
copy by hand. Nothing tells its author which copies there are, so the
copies drift apart without anyone noticing.

The two halves cannot be separate crates while each names the other,
since Cargo refuses a cycle. Today that costs three things:

- **The boundary is a convention.** What a planner may reach is
  enforced by `pub(crate)` and by tests that scan the source for text.
  A test of that kind finds only the spellings it searches for.
- **Every edit recompiles everything.** `components/` is 6,400 lines and
  the rest 37,000. Editing a component's definition recompiles all of
  them, and porting components, which ADR 0016 expects most of the
  remaining work to be, is mostly editing definitions.
- **What a type does is in two places.** To know how a `<case>`
  behaves, reading `components/structure/conditional_content.rs` is not
  enough. Its behavior is also in six matches elsewhere.

## Decision

### 1. The core names no type

Outside the components, no code names a variant of `ComponentType` or
reads a `components::prop` constant. What the core needs to know about a
type is in its definition, in one of the forms below. A unit test counts
the remaining names outside `components/`, per file. Like
`WITHOUT_SPEC`, the list only shrinks, and once it is empty the test
refuses any new name.

The **machinery** (`Machinery::Answer`, `Choice`, `RepeatFor`,
`FunctionIterates`, `Collect`, in `compile/stages/plan/`) stays in the
engine. ADR 0016 made it the code several types share, and it reaches
compile internals beyond `PlanCtx`. It may name a `Machinery` variant
but no type. It finds the types it works with through roles and
declarations, as the rest of the core does.

### 2. The forms a definition says it in

Each match in the core becomes one of these. The table sorts every match
named in Context; the exact names are settled in each migration step.

| What the core asks | Today | In the definition |
|---|---|---|
| Which type the compile makes for a thing it synthesizes: the root, a refused element, an iteration's index, value and item, a list's point, a case, an answer's response and its implicit input | `ComponentType::Document`, `::Error`, `::Number`, `::SequenceValue`, `::Tuple`, `::Point`, `::Case`, `::Response`, `::MathInput` in outline, expand, graph and `plan/answer.rs` | A **role** the definition claims (`roles: [Root]`). Each role is claimed by exactly one type, checked when the vocabulary is made. |
| Whether a container is looked through, gates its children, or opens a scope per iteration | Matches on `Group`, `Collect`, `Select`, `ConditionalContent`, `Case`, `RepeatFor*`, `FunctionIterates` in `table.rs` (`sticky_members`), both `aggregate.rs` files, `signature.rs` and `count_prop` | A **structure kind**: `Transparent`, `Gate { active }`, `Repeat { count }`. The props it names replace `prop::case::ACTIVE` and `count_prop`'s three-type match. |
| Whether a component changes where its descendants are | `ty == Graph`, `ty == StickyGroup` (twice), and the graph's bounds in `signature.rs` (`domain`) | `encloses: Graph \| Sticky`, and `bounds: [xmin, xmax, ymin, ymax]` on the type that encloses a graph. |
| Which prop stands for an expression | Three copies of `math_target` | A prop's `expr_of`: the port that holds the expression when it is math (`submitted`, `expr`). |
| Which prop of an input an answer's response reads | `plan/answer.rs`, `outline/answer.rs`, `read/answer.rs`, `sections.rs` (`answer_inputs`) | `response: "expr"` on each input type, which also marks the type as an answer's input. |
| A component's text | `push_text` in `table.rs` | `text: Value \| Text \| Boolean \| Math \| Children`, and a `hide` the structure kind already names. |
| Accessibility lint | `lint.rs` (`accessibility`) | `needs: Description \| Label`. |
| What `extend="$x.prop"` makes of the value | `plan_extend_prop` in `plan/copies.rs` | `extend_value: Scalar \| Point \| Math \| Expr \| List`, beside the existing `reads_as`. |
| What a reference to the type settles while outlining | `settle_outline`, which calls three component modules by path | `settle: Collects(Point) \| CollectsByAttr("componentType") \| By(fn)`, the function written beside the type. |
| An answer's credit, a section's weight, which containers scores skip | `answer::CREDIT`, `WEIGHT`, `ty == Setup` | Ports the `Answer` machinery declares, and a `scored: Skip` flag. |
| `<group rendered>` is a conditional content; `<case>` only inside one | Outline (`add_elem_inner`) | `rewrite { rendered: ConditionalContent }` on the group. An `owner` type outside its owner is refused generically, for every owned type. |

Of these, a structure kind, `expr_of` and `encloses` each remove a rule
that is spelled more than once.

### 3. `ComponentType` is an id, and the vocabulary is installed

In the engine, `ComponentType` is a `u8` id, `#[repr(transparent)]`.
`ComponentType::def` reads its row from the **vocabulary**: every type's
`ComponentDef`, in id order, with the roles resolved. The roughly fifty
methods on `ComponentType` (`resolve_prop`, `sel_name`, `prop_at`,
`list_slot`, ...) already reach the type only through `def()`, so they
stay in the engine unchanged.

The vocabulary is a `&'static Vocabulary` that `cells-core` installs
once, before the first load, into a `OnceLock` in the engine. A load
with none installed panics. `def()` is one more pointer load than
indexing a constant table. Measured with `load-diff.sh` before step 9
lands, it costs nothing at tick time, since the tick consults components
only for a sticky group (`document/sticky.rs`).

The renderer's type column (ADR 0020) stays the id. `cells-wasm` reads
names through `ComponentType::ALL`, which iterates the vocabulary.

### 4. Three crates

```text
cells-engine       index, dast, the declaration language (decl.rs, the
  ▲   ▲            component! macro), compile, session, build, program,
  │   │            sym, tick, document, diagnostics, error, limits
  │   │
  │  cells-components   every type's definition, its planner, spec and
  │   ▲                 cost snapshot; builds the Vocabulary
  │   │
cells-core         installs the vocabulary; re-exports today's API;
                   the release id; tests/; the testing feature's spec!
```

The engine owns the declaration language. A definition is written in
it, and `compile/ir` is built on it.

`compile::api` becomes the engine's public `plan` module, which is what
a planner imports. Its items go from `pub(crate)` to `pub`. The rule
"`pub` means the API" (ARCHITECTURE.md, Keeping the shape) then has two
readers: `cells-core`'s consumers, and a component's author through
`plan`. `#![warn(unreachable_pub)]` keeps meaning what it means.

### 5. Specs stay beside their definitions

A spec stays in `components/<family>/<file>.spec.rs`, as ADR 0016's
amendment of 2026-11-05 put it. `cells-components` takes `cells-core`
as a dev-dependency, with the `testing` feature, for `spec!`. The test
binary then links two copies of `cells-components`: its own, under
test, and the one `cells-core` installs. A spec reaches the document
only through DoenetML text, public prop names and values
(`testing/spec.rs`), so the copy it was compiled in is never asked.
The spec runner's snapshot path (`testing/spec.rs`, `src/components/snapshots`
under `cells-core`'s manifest) points at `cells-components` instead.

## Considered options

- **Keep one crate and enforce the boundary with a test.** Steps 1 to 8
  below deliver nearly all of this ADR's design within one crate: rules
  stated once, types read through declarations, and a count that only
  shrinks. Not rejected. It is where the migration stands after step 8,
  and the split may be declined there. The split adds what a test
  cannot: the compiler refuses a forbidden reach, and an edit to a
  component recompiles one crate instead of all of them.
- **Components below the core.** Put the IR, the operator enums and
  `Shape` in a bottom crate, make `PlanCtx` a trait, and let the core
  depend on the components and name them. That is less refactoring.
  Rejected: the core still names types, so the duplicated rules remain,
  and editing a component still recompiles the whole core.
- **Pass the vocabulary as a value or a type parameter.** Holding
  `&Vocabulary` in `Compiled` and `Document` and passing it to every
  stage would touch nearly every signature, for one value that never
  varies within a process. A `V: Vocabulary` type parameter would make
  the whole engine generic and multiply its compile time. Rejected for
  the installed `OnceLock`, which allows one vocabulary per process.
  There is one DoenetML.
- **Move the machinery to the components.** The answer, choice and
  repeat machinery is DoenetML-specific code. Deferred: it reaches
  outlining and planning internals that `PlanCtx` does not expose, and
  its types find each other through roles once step 7 lands, which is
  the coupling that mattered.
- **Specs back under `tests/specs/`.** That would avoid the second copy
  of `cells-components` in a spec's test binary. Rejected: ADR 0016 moved
  them beside their definitions so a component reads in one tree, and
  the second copy is harmless while specs reach the document through
  text alone.

## Consequences

- Each rule that is spelled more than once today is spelled once, in
  the declaration it reads. A new type that behaves like a case, a
  graph or a math gets that behavior by declaring it.
- To know what a type does, read its definition. The core holds what
  every type shares.
- Editing a component recompiles `cells-components` and `cells-core`,
  not the engine. A release build is unaffected: with `lto = "fat"` and
  one codegen unit the crate boundary costs the wasm nothing. A native
  build without LTO may want `#[inline]` on small helpers of `plan`.
- Three source-scanning tests in `components/mod.rs` retire, since
  visibility now does their job: `components_read_no_source`,
  `components_compute_no_slot_positions` and
  `plan_ctx_grows_deliberately`. `components_write_no_nan_of_their_own`
  and `every_component_has_a_spec` stay.
- The test-only types (`TestValue`, `TestShape`, `TestList`) are
  `#[cfg(test)]` entries in the type list, which do not cross a crate.
  They move behind a `testing` feature of `cells-components`.
- About forty of the engine's unit tests load a document and check
  internals: in `build/expand/mod.rs`, `compile/stages/plan/` (`copies`,
  `attrs`, `mod`, `fix`), `compile/stages/share.rs`, `seal/keys.rs`,
  `outline/copies.rs`, `compile/ir/record.rs`, `compile/ir/boxes.rs` and
  `compile/read/points.rs`. They cannot stay in the engine, which has no
  vocabulary of its own. They move to `cells-core`'s `tests/`, reaching
  internals through a `testing`-feature module of the engine, or are
  rewritten against the API.
- The release id (`RELEASE`, `build.rs`) moves to `cells-core` and covers
  all three crates. Saved state depends on the prop layouts the
  definitions declare, so a change to a definition is a new release.
- The core's public API is unchanged. The engine's grows by `plan`,
  whose reader is a component's author.
- `ARCHITECTURE.md` (the module map, Keeping the shape, the table of
  types), `CONTEXT.md` (*role*, *structure kind*, *vocabulary*),
  `docs/guide/component.md`, the crate docs in `lib.rs` and the
  cells-core entries in `AGENTS.md` change with the steps that change
  them.

## Migration

Each step lands alone, with the golden diff unchanged and the count of
step 1 lower than before.

1. **The count.** A unit test lists, per file outside `components/`,
   how many lines name a `ComponentType` variant or read a
   `components::prop` constant, and fails if any count rises.
   Done: `NAMING_TYPES` and `the_core_names_types_ever_less` in
   `components/mod.rs`, at 297 lines in 41 files. A count that falls
   fails too, until the list is lowered, so it only shrinks.
2. **Roles.** The types the compile synthesizes are found by role:
   outline's root and refused elements, an iteration's index, value and
   item, a list's points, cases, an answer's response and implicit
   input. `boxes.rs`' and `fix.rs`' test assertions name roles too.
   Done, with two departures. A definition writes `roles: [Root]`, a
   list, so a type may play more than one part. `Role::ty` reads a table
   built and checked when the crate compiles (`ROLE_TYPES`), which step 8
   moves into the vocabulary. The count fell from 297 to 248. Left for
   later steps: the stand-ins a reference to a prop's value is placed as
   (a `<number>` or a `<text>`, in both `expand.rs` files), which are not
   a role this table names; `<case>` as a gate (step 3); and the answer's
   input lists (step 4). `fix.rs` names its types by tag, as its
   documents do.
3. **Structure kinds.** `Transparent`, `Gate` and `Repeat`, read by
   `sticky_members`, `push_text`'s hiding, both `aggregate.rs` files,
   the signature's seeds and `count_prop`. The two `aggregate.rs` walks
   read the same declarations. Test: `tests/scoring.rs`, `tests/homework.rs`
   and `tests/every_count.rs` unchanged.
4. **Prop declarations.** `expr_of` replaces the three copies of
   `math_target`. `response` replaces the input lists in the answer
   code and `answer_inputs`. `text` replaces `push_text`'s arms.
5. **Context.** `encloses` and `bounds`, read by `placement`, the
   graph's own walk and `domain`.
6. **The rest of the table.** `needs` for lint, `extend_value`,
   `settle`, `rewrite`, `scored`, and the owned-type refusal. The five
   component paths the core calls go with `settle` and `extend_value`.
7. **Machinery.** `plan/answer.rs`, `plan/iterates.rs`,
   `plan/copies.rs`, `outline/answer.rs` and `read/answer.rs` find their
   types through roles and declarations. The count reaches zero, and
   the test now refuses any name.
8. **`ComponentType` an id, the vocabulary installed**, still in one
   crate. `COMPONENT_DEFS` becomes the `Vocabulary` that
   `components/mod.rs` builds and `lib.rs` installs. Test: `load-diff.sh`
   shows no load regression past noise. Here the split may be declined
   (Considered options).
9. **The split.** Make `cells-engine`, `cells-components` and the thin
   `cells-core`. Make `plan` public. Move the test-only types behind
   `testing`, the engine's document-loading unit tests to
   `cells-core/tests/`, the snapshot path, and `build.rs`. Retire the
   three source-scanning tests. Update the workspace's `Cargo.toml` and
   `npm run doc`, which names `-p cells-core`. Test: every
   test passes in its new place; `npm run build:rust` gives a wasm of the
   same size, within a kilobyte.
10. **Docs.** ADR 0016 gets a note pointing here, then ARCHITECTURE.md,
    CONTEXT.md, the guide and AGENTS.md.

# Plan: make the Rust docs show the crate's structure

Status: plan, 2026-11-06. Not an ADR: it decides no behaviour, only
where code and docs sit. Each step below is one PR, in order; an
implementer can stop after any step and the docs are better than before.

## The problem

The crate (`crates/cells-core`, 41k lines of non-test source in 146
files) is well documented at the item level: 28 types have no doc
comment, out of several hundred. Its structure, though, lives in the
file tree and in the ADRs (0027, 0031), and `npm run doc` throws both
away. Rustdoc shows types, and the crate's biggest types are context
structs that every stage of a pipeline mutates, whose methods rustdoc
gathers from dozens of files onto one page, in file order, with no
headings.

What a reader meets today (measured at `91b127b`):

| Measure                                                                           | Value                                           |
| --------------------------------------------------------------------------------- | ----------------------------------------------- |
| HTML pages `npm run doc` generates                                                | 1,610                                           |
| Submodules of `compile`, listed alphabetically, all but one locked                | 23 (8 are stages, 15 machinery; nothing says which) |
| Top-level items in `compile`                                                      | 22 `pub`, 103 `pub(crate)`, 76 private          |
| Methods on the `Compiler` page, and the files they come from                      | 177, from 31 `impl` blocks in 28 files          |
| Methods on the `Builder` page; the struct's doc comment                           | 115, from 12 files; none                        |
| Methods on `Stamp`, `Document`, `Built`                                           | 94, 92, 50                                      |
| `impl` blocks of those five types that carry a doc comment                        | 1 of 65                                         |
| `missing_docs` warnings (public items only)                                       | 454, mostly enum variants in `components`, `error` |
| Paths that `cells-wasm`, `cells-bench` and `tests/` import from the crate         | about 40                                        |
| Commits to the crate in the last 90 days; file renames, all under `compile/`      | 86; 14                                          |

So a newcomer lands on a good front page (`lib.rs`, the pipeline by
type), clicks `compile`, sees 23 locked modules with no sign which are
stages, opens `Compiler`, and reads a 177-method wall. ADR 0027's stages
and ADR 0031's per-stage tables exist in the code and are invisible in
the docs.

What is already right, and must stay right:

- The layering. `components` reaches the compile only through
  `compile::api` (13 lines), a facade a planner imports and nothing else
  of the compile. Copy that pattern; do not weaken it.
- The front page. `lib.rs`'s pipeline diagram and stage table, every name
  a link, with CI failing on a broken link
  (`.github/workflows/cells-core.yml`, "Build the API docs").
- Item-level docs. Every new item gets one; the step that turns on
  `missing_docs` (step 3) makes that enforceable.

Steps 1 to 4 are documentation and lints: they move no code and survive
every rename, so they go first and can land during the current churn.
Step 7 is a few small moves. Steps 5 and 6 are rename storms over
`compile/` and `build/` and should wait for a lull in the commits there;
step 1 draws the lines step 5 cuts along.

## How to measure

Every step says what changes in these numbers. The commands, run from
`packages/cells-core`:

```bash
# The contributor docs, as CI builds them (private items, -D warnings).
npm run doc

# Methods per type page and the file each comes from.
python3 - <<'EOF'
import re
from collections import Counter
D='target/doc/cells_core/'
for page in ['compile/struct.Compiler.html','build/expand/struct.Builder.html',
             'compile/graph/struct.Stamp.html','document/struct.Document.html']:
    h=open(D+page).read()
    secs=re.findall(r'<section id="method\.(\w+)"(.*?)</section>',h,re.S)
    c=Counter()
    for name,body in secs:
        m=re.search(r'src/cells_core/([\w/]+\.rs)\.html',body)
        c[m.group(1) if m else 'derived']+=1
    print(page, len(secs))
    for f,n in c.most_common(): print(f"   {n:4d} {f}")
EOF

# impl blocks of a type with and without a doc comment above them.
python3 - <<'EOF'
import os,re
for T in ['Compiler','Builder','Stamp','Document','Built','Outlining','Planning','Seal']:
    tot=doc=0
    for root,_,fs in os.walk('crates/cells-core/src'):
        for f in fs:
            if not f.endswith('.rs'): continue
            L=open(os.path.join(root,f)).read().split('\n')
            for i,l in enumerate(L):
                if re.match(r"^impl(<[^>]*>)?\s+%s\b"%T,l) and ' for ' not in l:
                    tot+=1
                    if i>0 and L[i-1].startswith('///'): doc+=1
    print(f"{T:10s} {doc}/{tot} impl blocks documented")
EOF

# Public-only missing docs (step 3 turns this into a gate).
(cd crates/cells-core && cargo rustc -q --features testing --lib -- -W missing-docs 2>&1 \
  | grep -c '^warning: missing documentation')
```

The refactoring guard for steps 5 to 7, which move code: `npm run
golden-diff -- <base rev>` must report `golden: identical`, and `npm test`
and `npm run lint` must pass. Steps 1 to 4 need only `npm run doc`, `npm
run lint` and `npm test`.

## Step 1: a doc comment on every `impl` block of a stage-spanning type

Rustdoc renders a doc comment above `impl Compiler<'_> { .. }` as a
heading over that block's methods on the `Compiler` page. One line per
block turns the 177-method wall into sections, one per stage or helper,
and does the same for `Builder`, `Stamp`, `Document` and `Built`. This
is 65 comments and moves nothing.

What to write: the stage or role the block serves, in the words the
module header of its file already uses, and what the block reads and
writes. Rustdoc shows the blocks in source order per file and the files
in the order the compiler saw them, so the heading must say which stage
it is; it cannot rely on position. Examples, from the files the methods
come from today:

| File                                 | Blocks | Heading                                                                                                          |
| ------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------- |
| `compile/outline/mod.rs`, `copies.rs`, `answer.rs`, `choice.rs` | 4 | "Outlining: elements, templates and names from the DAST; plans nothing (ADR 0030)."                   |
| `compile/parse.rs`                   | 1      | "Parsing: every `<math>`'s text, once, as outlining settled its type."                                            |
| `compile/planning/*.rs`              | 10     | "Planning, `<thing>`: reads the record and what outlining settled, never another element's plan (ADR 0029)."     |
| `compile/link/mod.rs`, `unread.rs`   | 2      | "Linking: readers of boxes boxed to a fixpoint; unread attributes refused (ADR 0021)."                            |
| `compile/seal/mod.rs`                | 1      | "Sealing: the handoff to `Seal`."                                                                                |
| `compile/refs.rs`                    | 1      | "Reference plans: name lookup through template scopes and `$a.b[k].c` paths, run by outlining, parsing and planning (ADR 0031, 'Code more than one stage runs')." |
| `compile/source.rs`, `values.rs`, `maths.rs`, `points.rs`, `rebase.rs`, `answer.rs`, `record.rs` | 7 | "Reading the source: `<what>`; run by `<which stages>`."                                 |
| `compile/boxes.rs`                   | 1      | "Boxing: writes only the boxes table (ADR 0031)."                                                                |
| `compile/mod.rs`                     | 2      | "The driver: the stages in order, and the retry with a failed element boxed."                                     |
| `build/expand/mod.rs`, `math.rs`, `aggregate.rs`, `resolve.rs`, `choice.rs` | 5+ | "Expand: `<what>`" per file.                                                                    |
| `build/define.rs`, `emit.rs`, `live.rs`, `writable.rs`, `orient.rs`, `coverage.rs` | 6 | "Define: ..", "Emit: ..", and so on.                                                        |
| `compile/graph/*.rs`                 | 6      | "Stamping, `<what>`" per file.                                                                                   |
| `document/*.rs`                      | 14     | The file's role: loading, requests, the table as a renderer reads it, saved state, sections, outputs, paths, sticky groups. |

Also in this step: `Builder` (`build/expand/mod.rs`) gets a struct doc
comment; it has none. The other 27 undocumented types are listed by this
script, and each gets one line:

```bash
python3 - <<'EOF'
import os,re
for root,_,fs in os.walk('crates/cells-core/src'):
    for f in fs:
        if not f.endswith('.rs'): continue
        p=os.path.join(root,f); L=open(p).read().split('\n')
        for i,l in enumerate(L):
            m=re.match(r'^(?:pub(?:\([a-z: ]+\))?\s+)?(struct|enum|trait)\s+(\w+)',l)
            if not m: continue
            j=i-1
            while j>=0 and L[j].startswith('#['): j-=1
            if j<0 or not L[j].startswith('///'): print(f"{p}:{i+1} {m.group(2)}")
EOF
```

Done when: the second measuring script reports every `impl` block of
`Compiler`, `Builder`, `Stamp`, `Document`, `Built`, `Outlining`,
`Planning` and `Seal` documented; the third script prints nothing;
`npm run doc` passes. Add the impl-block rule to the "Rules" section at
the end of this file, in `ARCHITECTURE.md` under "Checking a change".

## Step 2: `unreachable_pub`, so `pub` means the API

Inside a private module, `pub` and `pub(crate)` compile the same, so
`pub` on an item in `compile` or `document` says nothing to the compiler
and something misleading to a reader: it looks like API. The reader's
only cue today is rustdoc's lock glyph.

Turn on the rustc lint that decides it mechanically. In `lib.rs`:

```rust
#![warn(unreachable_pub)]
```

`unreachable_pub` warns on every `pub` item that is not reachable from
the crate root. Fix each warning by changing `pub` to `pub(crate)`
(or narrower). Do not fix one by widening the module: that is a change
to the API and belongs to step 3's decision. `npm run lint` runs clippy
with warnings denied, so the lint is a gate once the warnings are gone.

The meaning of each visibility is then:

- `pub`: the API. What `cells-wasm`, `cells-bench` and `tests/` may
  import, and what the public docs (step 3) show.
- `pub(crate)`: the interface between stages and modules. This is where
  the crate's medium-level structure lives; it should be small.
- `pub(in crate::compile)` and friends: the interface between a parent
  and its submodules, as today.
- private: inside one module.

Done when: `npm run lint` passes with the lint on; no module's
visibility changed. Record how many items moved from `pub` to
`pub(crate)` in the PR.

## Step 3: two doc builds, and `missing_docs` on the public one

Today there is one build, with private items, and it is the only one.
Add the public one and make it the entry for the reader who is not a
contributor to the core: a renderer author, the bridge in
`packages/doenetml-worker/src/cells`, a test author.

In `package.json`:

```json
"doc": "RUSTDOCFLAGS='-D warnings' cargo doc -p cells-core --no-deps --document-private-items --features testing",
"doc:public": "RUSTDOCFLAGS='-D warnings' cargo doc -p cells-core --no-deps --features testing"
```

and both in CI, in the "Build the API docs" step of
`.github/workflows/cells-core.yml`. The two builds write the same
`target/doc`, so run `doc:public` first and let `doc` overwrite it, or
give one a `--target-dir`; the public one is only checked, not kept.

Then, in `lib.rs`, after `unreachable_pub` is clean:

```rust
#![warn(missing_docs)]
```

`missing_docs` warns only on public items, so after step 2 it covers
exactly the API. The 454 warnings today are mostly enum variants
(`components`: 127, `error.rs`: 59, `program`: 58, `sym`: 40, `index.rs`:
30, `document`: 28, `dast`: 27); for a variant, one line saying what the
variant means. Where a module is `pub` only so that `tests/` can reach a
helper (`testing`, `trace`), its items are API too and get docs. If a
documented-at-the-module level enum has many self-explanatory variants,
`#[allow(missing_docs)]` on that enum alone is acceptable; say why above
the attribute.

Decide, and record in `lib.rs`'s module list, which modules are `pub`
because a consumer needs the path and which are `pub` by accident. From
the roughly 40 paths consumers import today: `dast::{load, Dast, NodeId}`,
`testing::*`, `trace::{start, finish}`, `session::{Counts, MathStore,
Session}`, `program::{SAMPLES, SymRun}`, `components::ComponentType`,
`tick::invert::invert_requests`, `diagnose`, `lint`, and the re-exports
at the crate root (`Document`, `LoadOptions`, `Request`, `PointRequest`,
`CellIdx`, `CompIdx`, `Child`, `DiagnosticKind`, `Error`). `build`,
`limits`, `sym`, `tick`'s submodules and `program`'s instruction types
are `pub` today; if no consumer imports them, make them `pub(crate)` and
let the contributor build show them. The decision is the step's
deliverable; one PR comment listing the modules each way is enough.

`#![allow(rustdoc::private_intra_doc_links)]` stays: a public doc that
links a private item renders the link as plain text in the public build
and as a link in the contributor build, which is what we want.

Done when: `npm run doc:public` and `npm run doc` both pass in CI;
`missing_docs` is on and clean; `lib.rs`'s module list marks which
modules are API.

## Step 4: a guide module, so the newcomer material is in rustdoc

`ARCHITECTURE.md`'s "What happens when…" and "Where to change things"
are the best newcomer material in the repository and are not in rustdoc
at all. `lib.rs` points at the file by name, unlinked. Put the chapters
into rustdoc as doc-only modules, the way `clap` ships `clap::_tutorial`
and `clap::_cookbook`, with each chapter's text in a markdown file under
`docs/` so it stays readable on GitHub.

In `lib.rs`:

```rust
/// Reading paths through the crate, by what you came to do. The text of
/// each chapter is a file under `docs/guide/`.
pub mod _guide {
    #[doc = include_str!("../../../docs/guide/renderer.md")]
    pub mod renderer {}
    #[doc = include_str!("../../../docs/guide/component.md")]
    pub mod component {}
    #[doc = include_str!("../../../docs/guide/compile.md")]
    pub mod compile {}
    #[doc = include_str!("../../../docs/guide/what_happens_when.md")]
    pub mod what_happens_when {}
}
```

Intra-doc links in an `include_str!`'d file resolve in the scope of the
item the doc is attached to, so a chapter writes
`` [`Document::request`](crate::Document::request) `` and CI checks it like any
other link. The leading underscore sorts the module first in rustdoc's
alphabetical list and marks it as not code.

The chapters, each a page, each starting with who it is for:

- `renderer.md`: for someone drawing a document. `Document::load`, the
  `ComponentTable` (type, name, children, the cell of each prop),
  `Request` and `PointRequest`, `TickOutcome`, saved state, outputs
  (ADR 0001, 0019, 0020). Mostly links into the public API.
- `component.md`: for someone adding a tag. Move "Add a component type"
  and "Add an operator" from `ARCHITECTURE.md` here (they are 170 lines,
  the longest and most useful section), linking `components::define`,
  the `component!` macro, `compile::api`, `Planner`, `PropFrom`, and one
  existing component as the worked example (`components/geometry/circle.rs`
  with its `.spec.rs`).
- `compile.md`: for someone changing the compile. The stages in order
  with, for each, the module, the entry function, the table it makes and
  the ADR that set it (0027, 0029, 0030, 0031, 0032, 0033). This is the
  table `compile/mod.rs` already has, with module links added, plus the
  boxing rule and the retry.
- `what_happens_when.md`: the "What happens when…" section of
  `ARCHITECTURE.md`, moved, with links.

`ARCHITECTURE.md` keeps "The idea", "The pipeline", "The main types",
"The other crates" and "Checking a change", and links the chapters it
lost. `lib.rs`'s front page gets one line under the pipeline table:
"New here? Start at [`_guide`]." Do not duplicate text between a chapter
and `ARCHITECTURE.md`; move it.

Done when: the four chapters exist and `npm run doc` checks their links;
`ARCHITECTURE.md` is shorter by what moved; the front page links the
guide.

## Step 5: finish moving the stages off `Compiler` and `Builder`

ADR 0031 made a view struct per stage (`Outlining` in `outline/mod.rs`,
`Planning` in `planning/mod.rs`, `Seal` in `seal/mod.rs`, `Parsed` in
`parse.rs`) and says planning's machinery is `impl Planning`. It is not
yet: `Planning` has 7 methods and `Compiler` 177, of which the planning
files hold 44, the outlining files 21, the readers (`refs`, `values`,
`source`, `maths`, `points`, `rebase`, `answer`, `record`) 71, boxing 8,
the driver 15, link 4, parse 2, seal 1. A planner reaches the compile
through `PlanCtx`, which is narrow, but behind it the machinery is
`impl Compiler` and can write any table.

This step moves every method to the struct of the stage that runs it,
so that which stage may write what is a compile-time fact. The target,
by the file the method is in today (the step-1 headings are these
groups):

| Methods in                       | Move to                                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `outline/*.rs`                   | `impl Outlining`                                                                                                             |
| `parse.rs`                       | a `Parsing` view, or free functions over `&Settled` returning `Parsed`                                                       |
| `planning/*.rs`                  | `impl Planning` (ADR 0031, "The planner context")                                                                            |
| `link/*.rs`                      | a new `Linking` view: reads outlining's and planning's tables, writes the boxes and `Planned::shares`                         |
| `seal/*.rs`                      | `impl Seal` (already)                                                                                                        |
| `boxes.rs`                       | `impl Boxes`, taking the tables it reads as arguments; it writes only its own (ADR 0031, "Boxing")                           |
| `refs.rs`, `source.rs`, `values.rs`, `maths.rs`, `points.rs`, `rebase.rs`, `answer.rs`, `record.rs` | a read-only `Source<'a>` context (the DAST, the name table, outlining's rows) that every stage view holds and that `plan_ref` runs over (ADR 0031, "Code more than one stage runs"); methods that also write the reference arena take it `&mut` as a parameter |
| `mod.rs`                         | stays: the driver, which constructs each view from the previous stages' tables and runs it                                   |

The same for `Builder` (`build/expand/mod.rs`, 115 methods from 12
files): `expand/*.rs` stays `impl Builder` (it is expand's struct); the
methods in `define.rs`, `emit.rs`, `live.rs`, `writable.rs`, `orient.rs`
and `coverage.rs` (21 methods) move to those stages' own types
(`Defined` exists; emit gets an `Emit` or works over `&Defined`), so a
`Builder` is expand's and nothing after expand holds one.

Order of work: outlining first (fewest cross-reads), then the readers
into `Source`, then planning, then link, then boxing; each its own
commit, each `golden: identical`. `Stamp` (`compile/graph`, 94 methods)
is one stage's struct already and is not split; its 43 methods in
`graph/mod.rs` versus 51 in the other files is fine once step 1's
headings are on them.

Done when: `Compiler` holds the driver's methods only (today's 15 in
`mod.rs`); no `impl Compiler` outside `compile/mod.rs`; no `impl Builder`
outside `build/expand/`; `golden: identical`; the step-1 headings now
sit on the stage views instead.

## Step 6: a second level under `compile`

Rustdoc lists modules alphabetically, so pipeline order can only be
shown by nesting or by prose. The prose is there (`compile/mod.rs`'s
stage table). Make the nesting say the same, so the module list reads
as the table does. Three kinds of module, and a module's parent says
which kind it is:

```
compile/
  mod.rs            the driver: compile(), Failure, Attempt, the stage order
  api.rs            the planner-facing facade (unchanged)
  compare.rs        the edit-safety API (unchanged, it is public API)
  stages/
    lint.rs, outline/, parse.rs, plan/ (today planning/), link/, seal/,
    share.rs, check.rs
                    one module per stage; each exposes pub(super) one entry
                    function and its output table, and nothing else
  ir/               what stages write and later stages and the build read:
    plan.rs split along ADR 0031's tables:
      template.rs   Template, TemplateRef, Tables, Outlined, Sealed, Elem, ElemPlan
      source.rs     Source, Leaf, Flow, ScopeConst, ScopePred, Arg, Sel, Hold
      refs.rs       RefPlan, Step, IndexPlan, RefProp, RefChild, RefChildPlan
      choice.rs     ChoiceDef, ChoiceSeal, Body
      port.rs       Port, PortType
      math.rs       MathText, MathSrc, SymText, ParsedMath
    record.rs, expr.rs, names.rs, boxes.rs (moved, unchanged)
  read/             reading the source, run by several stages (the Source
                    context of step 5): source.rs, values.rs, maths.rs,
                    points.rs, rebase.rs, answer.rs, refs.rs
  graph/            the template graph (unchanged)
```

`ir` is the word ADR 0032 uses ("the closed IR"). `plan.rs` is 1,671
lines and `ir/` is where its split pays; keep the `pub(crate) use` list
in `compile/mod.rs` so `crate::compile::plan::X` paths outside the
compile keep working for one step, then fix them.

`build/` is already in this shape (`expand/` plus one file per stage),
so it needs only its module docs to list the stages in order. `program/`,
`document/`, `tick/`, `sym/`, `dast/` are small enough to stay flat.

Each `mod.rs` lists its submodules in reading order with one line each,
as `lib.rs` does for the crate; that list is where the pipeline order is
told, since rustdoc's own list is alphabetical. Both `compile/mod.rs`
and `build/mod.rs` get one.

Done when: `compile`'s page shows `api`, `compare`, `graph`, `ir`,
`read`, `stages` and nothing else; every module under `stages/` has at
most one `pub(super)` function and one output type; `golden: identical`.

## Step 7: small moves

Each is one commit, `golden: identical`.

- `CellIdx` and `CompIdx` are defined in `document/mod.rs`, so
  `program`, `build`, `sym` and `tick` import
  from the top layer. Move them to `index.rs` beside the other index
  types (`index_type!`), re-exported from `document` and the crate root
  as today. `ARCHITECTURE.md`'s "main types" row for the index types
  already says `index.rs`.
- `compile` imports `build::signature::{Domain, Input, Signature}` and
  `build::TemplateSlot`: the one compile-to-build dependency. The input
  signature is computed from the template graph
  (`compile/graph/signature.rs`, a compile product) and read by
  `compile/compare.rs` and `compile/check.rs`; nothing in `build/` reads
  it. Move `build/signature.rs` to `compile/signature.rs` (or under
  `compile/graph/`), and see whether `TemplateSlot` belongs in `ir/`.
- `components/mod.rs` (1,328 lines) holds the declaration types
  (`ComponentDef`, `PropDef`, `PropFrom`, `AttrDecl`, `ChildrenDecl`,
  `Flags`, `Renders`, and so on, 20 types) and the `component_types!`
  list. Move the declaration types to `components/decl.rs` so the
  module page is the vocabulary (the families, the type list) and the
  declaration vocabulary is one page.
- `program/vector.rs` (1,180 lines) and `tick/snap.rs` (786 lines): leave
  unless a seam is obvious; both are one topic each.

## Rules, once the steps are done

To go into `ARCHITECTURE.md` under "Checking a change", so the next
contributor keeps the shape:

1. A module is one of: a stage (one entry function, one output table),
   a table or IR type the stages share, or a reader run by several
   stages. Its parent directory says which. A module that is none of
   these is a file in its parent.
2. A submodule is private unless its parent re-exports what others
   need. `unreachable_pub` enforces that `pub` means the API.
3. Every `impl` block of a type whose methods span files carries a doc
   comment naming the stage or role; rustdoc shows it as a heading.
4. Every `mod.rs` lists its submodules in reading order, one line each.
5. A method lives on the struct of the stage that runs it; a stage holds
   earlier stages' tables read-only and owns its own.
6. New prose for people goes in a `_guide` chapter under `docs/guide/`,
   linked; `ARCHITECTURE.md` is the map, not the manual.

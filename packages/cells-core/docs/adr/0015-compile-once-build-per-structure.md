# Compile once, build per structure: a hard line between the two

Status: accepted 2026-10-17. Steps 1, 3 and 5 of the migration are done; see Progress.

The core works in three stages that differ in how often they run and what
they may depend on, and this ADR makes the line between them hard: each
stage has its own types, its own files, its own data that lives as long as
it does, and a rule for what it may read.

| Stage | Runs | Depends on | Produces |
|---|---|---|---|
| **Compile** | once, at load | the source and the seed | `Compiled`: templates, plans, element keys, diagnostics and boxes |
| **Build** | at load, then on every structural change | `Compiled`, the `Session`, iteration counts | cells, program, component table, `Structure` |
| **Tick** | per request | the build's program and cells | changed cells |

A **load** is a compile, then builds until the structure settles. A
**rebuild** is builds until it settles again. Nothing about the source is
redone after load.

## Context

The line exists in the code's vocabulary (`build/compile/`, ADR 0012's
"once per document", ADR 0014's "a function of the source") but not in its
types or its data, and most of the bugs a review of the core found
(`tests/known_bugs.rs`, history) sat on it:

- Every rebuild compiles the document again from the DAST, and lints it,
  because `Compiled<'a>` borrows the DAST and cannot be kept. On a large
  document with one small repeat, most of a rebuild is that compile.
- Work that depends only on the source runs per instance per build: a
  math's text is parsed for every iteration it is stamped in, on every
  build.
- Errors were found inside the build loop, so a build after load could box
  an element (fixed by ADR 0014 with a `Pass` flag that makes the first
  build of a load behave differently from the rest).
- `Carryover` mixes three lifetimes: what the source fixed (boxes,
  diagnostics), what the session accumulated (essential values, the scope
  table, strings interned at runtime, the math engine) and what the last
  build produced (its repeats and essential slots). A rebuild moves all of
  it out of the document and moves it back on failure; the bug where a
  failed rebuild restores an intermediate build's structure is a bug in
  that move.
- A rule placed on the wrong side is invisible until a student reaches the
  count or pick that breaks it, as ADR 0014's survey showed.

## Decision

### Compile: everything about the source, once

`compile(dast, seed) -> Arc<Compiled>`. `Compiled` owns its DAST (`Arc`),
has no lifetime parameter, and the `Document` keeps it for its life when
it can rebuild, that is when it has a repeat; one without never builds
again, and its compile, several times the size of the built document, is
dropped after load. It holds:

- the templates, reference plans, choices and expression arena (today's
  `Compiled`), with math text parsed to trees once;
- per element its key (saved state, ADR 0014's element key) and per
  template its owner;
- the canonical string ids (`extra_strings`);
- **the boxes and the diagnostic list**: lint, then the compile's own
  errors, then the **check**, the probe build (ADR 0012, ADR 0014) that
  stands for every count and every pick and is discarded. Boxing and
  retrying happen here and nowhere else.

Compile has two steps, named for what they do: **plan** (DAST to templates
and plans, today's `build/compile/`) and **check** (the probe). A rule
whose answer cannot differ between two instances of the same source
belongs to plan; one that can, to check, which sees every instance (ADR
0014). Whatever compile can work out, it works out: a build never asks a
question of the source twice.

The check reuses the build's expand and resolve code through the probe
`View`. That is a dependency of compile on build's machinery, not on its
data: the `View` trait is the seam, and the probe's output never leaves
compile.

### Session: what a student's session accumulates

`Session` holds what must survive every build and nothing a build can
recompute: the scope table, every essential value by key (and values
parked for scopes no build has stamped yet), strings interned at runtime,
the math engine whose handles those values hold, and the seed. Saved state
is `Session` serialized: `save_state` writes it and `restore_state` fills
it, with no knowledge of builds.

A build reads the session; it does not move it. When a build succeeds, its
new essential values and scopes are written back to the session in one
step. When it fails, there is nothing to undo, because nothing was taken.

### Build: the document's shape at given counts

`build(&Compiled, &Session, &Structure) -> Result<Built, BuildError>` is
the one function a load and every rebuild run: expand, resolve, emit,
schedule. `Structure` is what one build made that the next starts from:
its repeats and their iteration counts, and its essential slots. A build
finds no authoring errors: `BuildError` has no variant for one, only the
gaps ADR 0014 calls `Unchecked`, a cycle and an unsettled structure. The
`Pass` flag goes away, since every build is the same kind.

Because boxes are fixed in `Compiled`, every build compiles to the same
templates and slot offsets, so essential keys are stable by construction.

### Tick

Unchanged: it reads the program and writes cells, and when a structural
cell changes it asks for a rebuild.

### Files

```
src/
  dast/        the parsed source and its wire formats
  components/  the tag vocabulary
  compile/     plan (today's build/compile/), check (cycles.rs, the
               probe view), lint.rs, diagnostics.rs, element keys;
               `Compiled`
  build/       expand/, resolve, emit, the stamped view, `Structure`
  session.rs   `Session`, saved state
  program/     the instruction set
  tick/        the request engine
  document/    `Document`: an Arc<Compiled>, a Session, the current build
```

The rule a contributor follows: code that needs only the source goes in
`compile/` and runs once; code that needs counts goes in `build/`; data
that must outlive a build goes in `Session`, and nothing else does.

## Terms

The stages keep the words the code and the ADRs already use, given one
meaning each:

- **Compile**: the once-per-load stage (was the first third of a build).
  Its steps are **plan** and **check**.
- **Build**: one pass from `Compiled` and a session to cells (was compile,
  expand and emit; now expand, resolve, emit and schedule). **Stamp** stays
  the verb for one template made once in one scope, inside a build.
- **Settle**: build until every repeat's count matches its count cell. A
  load is compile, then settle; a **rebuild** is settle.
- **Session**: replaces the persistent half of `Carryover`.
- **Structure**: what one build made, which the next starts from (narrowed
  from today's, which also holds session data).
- **Carryover** and `Pass` are retired.

## Migration

Each step keeps the golden diff identical and is measured against the one
before, load and tick:

1. **Compile once.** `Compiled` owns its DAST; the document keeps an
   `Arc<Compiled>`; a rebuild skips plan, lint and check.
2. **Diagnostics in `Compiled`.** Boxing moves into compile; `Pass`
   goes; `BuildError` loses the authoring variants.
3. **`Session` from `Carryover`.** A build reads the session and writes
   back on success; the take-and-restore in `Document::rebuild` goes, and
   with it the failed-rebuild bug in `known_bugs.rs`.
4. **Hoist per-instance work into compile**: math parsed once, plan value
   types, prop lookups by name.
5. **Move the files** to the layout above; update ARCHITECTURE.md and
   CONTEXT.md.

## Progress

**Step 1, compile once (done).** `build::compile` compiles, checks and boxes,
and returns the `Compiled` with the first build; `build::build` stamps a
kept `Compiled` and nothing else. `Compiled` owns its DAST and holds the
source's diagnostics (lint and boxed errors), so step 2's diagnostics and
the end of `Pass` landed with it. The document keeps the compile only
when it has a repeat, after dropping what only compiling reads (name and
role tables). Measured against the commit before:

- rebuild of a document with a large flat part and a small repeat
  (2,000 numbers and maths, a repeat of 3): 33–37 ms to 17–18 ms;
- rebuild of a 1,000-iteration repeat, in instructions: −0.2%;
- load, in instructions, ten fixtures: −2.3% (sir, whose later passes
  no longer compile) to +0.5%;
- heap held by a loaded document: unchanged without a repeat; +0.3% to
  +2% for the repeat fixtures, +11% for sir, a mixed document, whose
  compile is large beside its one small repeat.

**Step 3, `Session` from `Carryover` (done).** `Carryover` is gone.
`Session` (`session.rs` since step 5) holds the seed and sampling option, the
scope table, the value store (shared, written only by `Session::record`
before a build), parked restored values and runtime strings; `Counts`
holds what each repeat is stamped with; `Structure` keeps only what one
build made. `build(compiled, session, counts, reseed, engine)` reads the
session and returns the next one in its output, so `Document::rebuild`
moves nothing out of the document but the math engine, which goes back on
failure: the failed-rebuild bug of `known_bugs.rs` is gone with the
take-and-restore, and its test is in `tests/rebuild_cycles.rs`. The engine
stays in the program, which the tick reads; moving it into the session is
left for later. The function that compiles and returns the first build is
`build::compile`, since compiling is its job; `Document::load` is a load.

**Step 4, per-instance work (done).** A math template's text is parsed
once per compile, not once per instance per build: in a document with
repeats, `Compiled::sym_trees` holds each text's parse, filled by the
first build that finds the math symbolic (numeric math is never parsed
this way). A document without repeats builds each template once and
parses without keeping the tree, which would only raise its load's peak
heap. Whether math parses is still asked by the build, since only math
the build finds symbolic is parsed; the answer depends on the text alone,
so the probe finds it as before. Two costs the profile showed in every
build went with it: the cycle-error labels no longer copy every
component's name into a `String` (they read the DAST when a cycle is
reported), and the seeds' math check and the repeat-depth scan no longer
hash every math cell and every scope. Measured against the commit before,
in instructions:

- rebuild of a 1,000-iteration repeat: −43%;
- load: −4.6% (repeat-1000), −2.2% (sir) to −0.03%; ticks within ±1.5%,
  except sir's, which rebuild: −19%;
- peak heap of a load: −3.7% (repeat-1000, repeat-10000) to 0; heap held
  unchanged.

Plan value types and prop lookups by name were not hoisted: after the
above the rebuild's profile is flat, and resolving a math reference's
kind (`math_ref`) is 2% of it.

**Step 5, files (done).** `src/compile/` is today's plan (the old
`build/compile/`), `lint.rs`, and `check.rs`, which holds `compile::compile`
and `compile::diagnose`: the boxing loop, the probe check, and for a
document checked by its one stamped build, that build, which the load
keeps. `compile::compile` returns the compile, that first build when there
is one, and the check's time; a load with repeats then builds its first
pass with `build::build` like every other. `src/build/` keeps expand, emit,
the view and the probe (`probe.rs`, the old `cycles.rs`), since the probe
is build's machinery run through another view; it offers compile exactly
`build::probe` and `build::first_build`. `src/session.rs` holds `Session`
and `Counts`, which both stages read. Compile's items are visible only
inside `compile` except the plan types and the expression arena, which the
build stamps; build uses nothing else of compile's.

Not done: a build's error type still has the authoring variants. A
build maps any element failure to `Error::Unchecked`, which enforces the
rule; splitting the enum was judged not worth the churn.

## Consequences

- A rebuild costs expand, emit and schedule only. Load does the same work
  as before, in a different place.
- `Compiled` is immutable and shared. If the check is made seed-free
  (build every select's options in the probe, not only those in repeats),
  `Compiled` depends on the source alone: one per document, shareable
  across students and cacheable by the host, and the load's diagnostics
  equal `diagnose`'s. That costs the probe the options of selects outside
  repeats; it is left open here and measured before it is decided.
- The take-and-restore dance and the `Pass` flag disappear; a failed
  rebuild leaves the document untouched by construction.
- More of the code's rules become visible in where the code sits. A check
  placed in `build/` that can fail for an author is wrong on its face.

## Considered options

- **Keep one pipeline and cache the compile.** Smaller change, same speed
  for rebuilds, but `Carryover` and the boxing loop stay, and the line
  remains a convention.
- **Other names.** `Blueprint`, `Module` or `Schema` for `Compiled`;
  **instantiate** or **stamp** for build; `State` for the session.
  Rejected: "build", "compile" and "stamp" are already used this way across
  the ADRs and the code, so keeping them costs the least relearning;
  "instantiate" collides with `SymKind::Instantiate`; `State` collides with
  DoenetML's state variables and with saved state, which is the session
  serialized.
- **Make the check independent of build's code.** Rejected: the probe's
  value is that it runs the very resolution the build runs, so the two
  cannot disagree about what a reference reaches.

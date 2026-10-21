# Diagnostics are a product of one exhaustive build, never of a tick

Status: accepted 2026-10-16.

Every diagnostic the core reports about a document (an error, a warning,
an info, an accessibility finding) is computed by one pure function of the
parsed text, `diagnose`, which builds the document once through a view
that stamps every template the document has: one iteration per repeat,
every option of every select, every branch of every choice. The list is a
function of the DoenetML text alone. The same text gives the same list at
every seed, at every iteration count, with any carried-over state, and
after any sequence of requests. A tick produces no diagnostic; what a tick
cannot do it reports in its outcome, as data for the renderer, and nothing
is appended to any list. `diagnose` is not part of a load: the language
server calls it, on the text the author is editing, and a viewer loading a
document for a student never pays for it.

We chose this because the current JavaScript core's diagnostics are a side
effect of evaluation, and so depend on what the user has done. A state
variable's definition returns diagnostics that are recorded when the
variable is first computed, which may be at render, after an interaction,
or never; inverse definitions and actions do the same, so a warning can
appear only after a student edits an input. Composites expand on demand,
unchosen `<select>` options are never expanded, and hidden components skip
attribute validation, so the set of components that can raise anything
depends on the trajectory. The queue itself is an accumulating, deduped,
capped stream drained incrementally. An author running the diagnostics
panel sees the problems of the branch they happened to reach, and an
editor or language server cannot ask for the problems of the whole file.

This core is most of the way there by construction. Build time does every
piece of string work and every piece of reasoning about the document's
shape, and a tick never consults components, tag names or the DAST
(`ARCHITECTURE.md`). The cycle check already builds the document once
through a probe view that folds every iteration into one and discards the
result (ADR 0012). What is missing is that errors abort the build at the
first one, warnings are an afterthought derived from `Structure` as
strings with no code and no position, positions never reach the core
(ADR 0002), and three holes keep load-time problems per seed and per
count.

## The holes

- **Load-time choices.** Unchosen branches of a `<select>` are never built
  (ADR 0009), so an error expand or resolve raises (an unknown prop, an
  arity mismatch, math that does not parse) fires only for the options a
  seed draws. The probe builds every option inside a repeat but keeps the
  real draw outside one, explicitly so that load errors stay per seed.
  (Since ADR 0014's amendment the probe builds every option everywhere,
  and load errors no longer depend on the seed.)
- **Repeats at a count that stamps nothing.** A body whose repeat loads at
  count zero never expands, so its errors surface on the first rebuild
  that stamps it, inside a student's tick, as `rebuild_error`.
- **Rebuilds in general.** Any expand-time error that holds at one count
  and not another is count-dependent. ADR 0012 closed this for cycles
  only; a failed rebuild for any other reason is an interaction-dependent
  diagnostic.

Reactive choices have no hole: every branch is built behind a gate, and a
flip is an ordinary tick.

## The design

- **Collected, not thrown.** The build carries a `Vec<Diagnostic>`
  (`src/diagnostics.rs`). A diagnostic is a kind (error, warning, info,
  accessibility with its level 1 or 2), a stable code, its arguments as
  data, and the node it is about. The code is the i18n registry's
  (`packages/i18n/src/diagnostics.ts`) where it names the same situation,
  whatever letter the current core gives it (an unknown reference is its
  warning `doenet-w0104` and our error, since the element did not build);
  a `cells-` code otherwise, to be registered. `Error::code` is the map.
  A `Result` is kept for what the build cannot continue past: a malformed
  wire format, a cycle.
- **Recovered, not aborted, by building again.** The compiler and the
  builder keep raising errors as they do; what changed is who catches
  them. Each records the innermost element the error is about (the
  element being planned, the macro being resolved, the choice whose
  interface failed), and `build` boxes that node and builds again: the
  node compiles as an `_error` element with no name, no children and no
  props; its DAST node names its diagnostic. A reference to a boxed
  element fails in turn and is boxed on the next round, so a document
  with k faulty elements compiles k + 1 times, which only documents with
  errors pay and only once: the errors ride in the carryover and seed
  the boxes of every rebuild. This is simpler than unwinding a half-built
  element out of the compiler's name tables and side tables, and the
  golden diff is identical, since a document without errors builds once
  as before. One bad element no longer renders nothing and no longer
  masks every other problem. The renderer shows the box
  (`cells-viewer/src/renderers/index.tsx`).
- **Taken from an exhaustive build, by the language server.** The probe
  view (`build/probe.rs`) gains one switch, `every_option`: with it,
  every option of every select is built, inside a repeat or not.
  `diagnose(dast) -> Vec<Diagnostic>` runs the one box-and-retry loop
  a load runs (`compile/check.rs`), through that view with the probe's
  checks, and returns the list; the build itself is discarded. The list is seed- and count-independent
  because the view's answers do not depend on either. A load does not
  call it. The real build still collects diagnostics for the elements it
  stamps, which the viewer needs to render error boxes; they are a subset
  of `diagnose`'s, which the tests check. The cycle check keeps running
  at load, as ADR 0012 requires: a cycle is the one finding a load cannot
  proceed past, and it is reported with no node.

  Two of the three holes turned out narrower than described above.
  Compile walks every branch, so a name that does not exist is found
  whatever a select draws; only what expand and resolve raise (an arity
  mismatch, an unknown prop, math that does not lower) stays per seed.
  And the cycle probe stamps every repeat body once at load, so a body at
  count zero is already boxed by the load. What `diagnose` adds over a
  load is the unchosen options, and a list for a document that has no
  load at all, in the language server.
- **Static where the current core is dynamic.** Whether a prop can be
  written is known when its producing operator is bound (an `Op` carries
  its inverse or does not); whether an action's target prop exists is
  known at resolve. So "cannot change the radius of a circle through
  non-numerical points" and "no state variable named `bad` on a
  `<number>`" are load-time diagnostics here, not findings of a later
  request. Neither is emitted yet: the first needs a rule for which
  essential cells an author expects to be writable, the second an
  `<updateValue>` planner that reports instead of refusing. What is
  genuinely dynamic stays in `TickOutcome`: a dropped request, an
  infinite value, a rebuild that failed. The renderer may show it; the
  document's list never grows. The tick's contract gains one line beside
  "never consults the DAST": never produces a diagnostic.
- **Positions outside the core.** A diagnostic names a node, not a
  position. The viewer and the language server hold the parser's DAST and
  map a node to its position; the binary format needs only to keep node
  ids in correspondence, which its parallel arrays already do. The core
  stays free of positions (ADR 0002).
- **Accessibility checks are structural.** A `<graph>` without a
  `<shortDescription>` child or `decorative` (`doenet-a0001`), an input
  without one or a `<label>` child, a `label` attribute or `labelIsName`
  (`doenet-a0003`): each is a fact about the DAST and is found by
  `lint` (`src/compile/lint.rs`), one walk over the elements before anything is
  compiled, so a document whose build fails outright still has them.
  Every DAST-only rule belongs there as it arrives; the image, video and
  contrast rules wait for those types. There is no
  exemption for hidden content: `hide` is a cell, so an exemption would
  make the list depend on state. (A literal `hide="true"` could be
  exempted statically if wanted; it is not proposed.)
- **Two wire calls, one package.** `crates/cells-wasm` has a free
  function `diagnose_json(bytes)`, the typed list for a wire-format
  document, with no `Core` constructed; and `Core::diagnostics_json()`,
  the real build's own findings, which replaced `warnings_json`. Both
  carry what the current core's `DiagnosticRecord` needs, kind, code,
  message and arguments, so the i18n catalogs can render them in the
  reader's language and the code-based parity tests can pass. Everything
  here, the view switch, `diagnose`, the binding and the tests, lives in
  `packages/cells-core`; the viewer (`packages/cells-viewer`) reads the
  load's list and renders the boxes. The language server
  (`packages/lsp`) already spawns one core per open document and merges
  what it reports into its own diagnostics (`features/validate.ts`,
  `additionalDiagnostics`); pointing that at `diagnose_json` is the only
  change still outside this package.

## Cost

Measured on the generated fixtures (`npm run stats`, release build), a
load is deserialize plus build in roughly equal parts, and compile is half
to four fifths of build (chain-100000: 199 ms deserialize, 474 ms build,
330 ms of it compile; select-1000: 14, 20 and 13 ms). The probe stamps
each template once, so its cost follows the source, not the document:
repeat-10000, sixty thousand components, builds in 19 ms and probes in
0.2 ms. An exhaustive build therefore costs about one compile plus one
template-sized stamping, a few milliseconds for a hand-written document.

Where it runs decides whether a reader pays it:

- A viewer loading for a student calls only `Core::new`, which runs the
  real build and, with a repeat present, the cycle probe it already runs.
  Load time does not change.
- The language server calls `diagnose` once per edit, in the sub-worker it
  already spawns per document, where a few milliseconds beside the parse
  is nothing. It needs no `Core`, no state and no seed.
- The editor's live preview is a viewer; its diagnostics panel reads the
  language server's list, not the preview's.

## How it is tested

All in `packages/cells-core`, under `cargo test`:

- `tests/diagnostics.rs`: for every golden document and fixture,
  `diagnose` returns the same list each time, and what a load at four
  seeds reports, before and after every repeat's count is driven to 0 and
  to 3, is within it. A select reports the problems of an option no seed
  draws; a repeat body at count zero is reported; a boxed element leaves
  the rest of the document loading, with its box where it stood; a
  reference to a boxed element is boxed in turn, in document order; a
  rebuild keeps the boxes and adds nothing; a cycle is reported with no
  node; the accessibility findings are the same from `diagnose` and from
  a load.
- The tests that asserted a load *fails* on an authoring error
  (`build.rs`, `choice.rs`, `math.rs`, ...) now assert the error
  diagnostic the load reports, through `test_utils::load_error`.
- `crates/cells-wasm`: `diagnose_json`'s JSON shape is pinned by one
  test that parses its output; the names of its fields are the contract.

## Considered options

- Report diagnostics from the real build only. Rejected: that is the
  per-seed, per-count behaviour this ADR exists to remove, and the
  rebuild-time error the first hole describes stays.
- Run the exhaustive build inside every load. Rejected: it is the right
  list, but a student's viewer pays for an author's panel. For a document
  with a repeat the probe already runs and the cost is nothing; for one
  with a load-time select the unchosen options are new work; for one with
  neither the real build is already exhaustive. The language server is
  the one caller that always wants the whole list, and it has its own
  process.
- Defer the exhaustive build to an idle callback after first render.
  Rejected for the viewer, since the list is still the viewer's to hold
  and the language server will compute it anyway; kept as the fallback
  for a host with no language server.
- Report from the real build and add the unchosen branches' diagnostics
  by compiling them without expanding. Rejected: compile does walk every
  branch (one template per branch), but most of the errors that matter
  (unknown prop, arity, math) are raised in expand and resolve, so the
  list would still be per seed.
- Build the document at every count and seed. Rejected for the reason in
  ADR 0012: the product of the counts.
- Keep positions in the core. Rejected: the only consumer that needs them
  already has the DAST, and the binary format would grow for every
  document to serve the editor.
- Keep raising diagnostics from ticks and dedupe them. Rejected: dedupe
  makes the stream shorter, not deterministic; the list would still depend
  on which branches a user reached.
- Keep an exemption for hidden content, as the current core has. Rejected:
  `hide` is reactive, so the exemption makes the list a function of state.
  The parity test that expects silence inside a hidden component is to be
  changed, not matched.

## Consequences

- An author sees the problems of every branch, including ones a given
  student never draws. The viewer must distinguish an error box in
  rendered content from a diagnostic that is only in the panel: the
  component table says which error components the real build stamped.
- A document with an error now loads and renders around it instead of
  failing to construct. `Core::new` stops returning an error for
  authoring mistakes; the parity adapter's "load error" rows become
  documents with `_error` components.
- Load time is unchanged: `diagnose` is a separate entry point the viewer
  never calls. The language server pays one compile and one template-sized
  stamping per edit.
- A viewer's own list, from the real build, is per seed and per count by
  nature. It is for rendering error boxes, not for an author, and the
  panel must not present it as the document's diagnostics.
- A rebuild cannot fail with a diagnostic the load did not already report
  (made a rule, and enforced, by ADR 0014),
  because every template it can stamp was stamped once at load. The
  rollback of a failed rebuild (`rebuild_error`) stays as a safety net.
- `tests/every_count.rs` gains the invariant: for every golden document
  and fixture, the diagnostics are identical at counts 0 to 4, at four
  seeds, with carried-over state, and after the golden request script.
- The parity test for hidden components changes its expectation; the
  tests that assert a diagnostic appears only after an interaction become
  tests that it is present at load.
- A document with k faulty elements compiles k + 1 times at load. Errors
  are rare and compile is milliseconds; a document that compiles clean
  pays nothing.
- `CONTEXT.md`: a diagnostic is a function of the document text alone,
  computed by `diagnose` from the exhaustive build; a tick never produces
  one.

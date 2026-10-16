---
status: proposed
---

# Diagnostics are a product of one exhaustive build, never of a tick

Every diagnostic the core reports about a document (an error, a warning,
an info, an accessibility finding) is computed once, at load, by a build
that stamps every template the document has: one iteration per repeat,
every option of every select, every branch of every choice. The list is a
function of the DoenetML text alone. The same text gives the same list at
every seed, at every iteration count, with any carried-over state, and
after any sequence of requests. A tick produces no diagnostic; what a tick
cannot do it reports in its outcome, as data for the renderer, and nothing
is appended to the document's list. The list is immutable after load.

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

- **Collected, not thrown.** The build carries a `Vec<Diagnostic>`. A
  diagnostic is a kind (error, warning, info, accessibility with its
  level 1 or 2), a stable code from the registry the i18n catalogs
  already define (`doenet-eNNNN`, `doenet-wNNNN`, ...), its arguments as
  data, and the node it is about (a `NodeId`, and the attribute when it
  is about one). `Result` is kept only for what the build cannot continue
  past: a malformed wire format, a cycle.
- **Recovered, not aborted.** An element that fails to compile becomes an
  error component in the component table, carrying the index of its
  diagnostic, and the rest of the document builds and reports. One bad
  element no longer renders nothing and no longer masks every other
  problem. This is what the current core does with `_error`, and what the
  parity suite's error tests expect.
- **Taken from an exhaustive build.** The probe view (`build/cycles.rs`)
  becomes, or gets a sibling that is, the *exhaustive* view: one iteration
  per repeat and `Options::Every` everywhere, inside and outside a repeat.
  Its build runs on every load, not only when a repeat is present, and
  never on a rebuild, since templates do not change. The document's
  diagnostics are that build's diagnostics. They are seed- and
  count-independent because the view's answers do not depend on either.
  The real build still collects diagnostics for the elements it stamps;
  they must be a subset of the exhaustive build's, which the tests check.
  Cost: one extra build per load, which documents with a repeat already
  pay for the cycle check.
- **Static where the current core is dynamic.** Whether a prop can be
  written is known when its producing operator is bound (an `Op` carries
  its inverse or does not); whether an action's target prop exists is
  known at resolve. So "cannot change the radius of a circle through
  non-numerical points" and "no state variable named `bad` on a
  `<number>`" are load-time diagnostics here, not findings of a later
  request. What is genuinely dynamic stays in `TickOutcome`: a dropped
  request, an infinite value, a rebuild that failed. The renderer may show
  it; the document's list never grows. The tick's contract gains one line
  beside "never consults the DAST": never produces a diagnostic.
- **Positions outside the core.** A diagnostic names a node, not a
  position. The viewer and the language server hold the parser's DAST and
  map a node to its position; the binary format needs only to keep node
  ids in correspondence, which its parallel arrays already do. The core
  stays free of positions (ADR 0002).
- **Accessibility checks are structural.** A `<graph>`, `<image>` or
  `<video>` without a short description, an input without a label, a
  contrast failure in authored styles: each is a fact about the DAST and
  is checked in compile, once per template. There is no exemption for
  hidden content: `hide` is a cell, so an exemption would make the list
  depend on state. (A literal `hide="true"` could be exempted statically
  if wanted; it is not proposed.)
- **One wire call.** `warnings_json`, a list of strings, is replaced by a
  `diagnostics_json` that returns the typed list, computed at load. The
  viewer maps each entry to the `DiagnosticRecord` the current core
  emits, with code and arguments, so the i18n catalogs render it in the
  reader's language and the code-based parity tests can pass.

## Considered options

- Report diagnostics from the real build only. Rejected: that is the
  per-seed, per-count behaviour this ADR exists to remove, and the
  rebuild-time error the first hole describes stays.
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
  authoring mistakes.
- Loads without a repeat pay one extra build. Loads with one pay nothing
  new, since the probe build already runs.
- A rebuild cannot fail with a diagnostic the load did not already report,
  because every template it can stamp was stamped once at load. The
  rollback of a failed rebuild (`rebuild_error`) stays as a safety net.
- `tests/every_count.rs` gains the invariant: for every golden document
  and fixture, the diagnostics are identical at counts 0 to 4, at four
  seeds, with carried-over state, and after the golden request script.
- The parity test for hidden components changes its expectation; the
  tests that assert a diagnostic appears only after an interaction become
  tests that it is present at load.
- `CONTEXT.md`: a diagnostic is a function of the document text alone,
  computed once at load from the exhaustive build; a tick never produces
  one.

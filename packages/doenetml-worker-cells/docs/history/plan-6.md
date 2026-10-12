# Plan 6: conditional content in the cell architecture

This file records the decisions reached before implementation
(`docs/history/instructions6.md` is the request). Vocabulary is in `CONTEXT.md` (**Branch**,
**Load-time choice**, **Reactive choice**, **Branch interface**, **Choice
cell**, **Document seed**). The language decision is ADR 0009. The verdict
goes in the "Plan 6" section of `results/NOTES.md`.

## The questions

1. Can the prototype support both author use cases: local variations whose
   branches roughly mirror each other, and choices that change the document
   drastically?
2. Would separate tags for the two cases keep the system simpler and faster?
3. Which flexibility of the current core can be banned without losing what
   authors need?
4. What does it cost in load time, tick time, memory and ambient complexity?

## Background found before planning

- **`<select>` and its relatives choose once.** `selectedIndices` is
  immutable essential state drawn from the variant RNG; `<selectFromSequence>`,
  `<selectRandomNumbers>` and `<selectPrimeNumbers>` are the same. A test
  checks that a select never changes after load.
- **Only `<conditionalContent>` and `<group rendered>` change structure at
  runtime.** With several cases, a flip deletes the old branch's replacements
  and re-serializes the new one, so state inside a branch is lost.
- **References reach into branches through the composite's current
  replacements** and are re-resolved when they change. A name present in
  only one branch, or with a different type per branch, is accepted
  (`factoringOldAlgorithm.test.ts`, `functionTag.test.ts`).
- **Test patterns.** In `conditionalcontent.test.ts` (20 tests) about 7 use
  the single-case form, about 6 reference names inside branches, and named
  branches almost always share names and types. `select.test.ts` (44 tests)
  mostly selects options of one type.
- The prototype has no randomness yet.

## Decisions

- **Choices split by timing** (ADR 0009).
  - **Load-time choices** (`<select>`, `<selectFromSequence>`, ...) are made
    by the build. Each draws from a stream derived from the document seed
    and its essential key, so a choice inside a repeat iteration or a
    reactive branch draws the same way whenever it is built. Picks are not
    stored. Unchosen options are never built. `numToSelect`,
    `withReplacement` and weights must be literals.
  - **Reactive choices** use one tag, `<conditionalContent>`. Its choice cell
    is the index of the first case whose condition holds.
- **One branch interface for every choice.**
  - A name is visible outside a choice only if every branch declares it with
    the same component type. The build checks this.
  - A choice whose content feeds a typed parent (`<math>`, `<function>`)
    yields that type from every branch.
  - `$s[i]` and `$s[i].name` are allowed; positional references into option
    content (`$s[2][1]`) are not.
- **The core picks the reactive mechanism by size.**
  - **Built branches** (small): every branch is built. An interface name is
    a `Choose(choice, x1, x2, ...)` operator. Inactive branches keep
    recomputing; each branch root's hidden cell is derived from the choice
    cell, so the renderer needs nothing new.
  - **Rebuilt branches** (large): the choice cell is structural and a change
    rebuilds the document (ADR 0004).
  - The threshold is set from a sweep with both mechanisms forced.
- **Behavior.**
  - A branch that becomes active again returns with its state (the current
    core discards it).
  - A request on an interface name moves the active branch only. The choice
    cell has no inverse; a request reaching it is dropped.
  - Conditions may read any cell outside their own branches, including
    another choice's interface names. Reading inside its own branches is a
    cycle.
- **Sugar kept, parsed by the prototype:** `<else>`, the single-case
  `<conditionalContent condition>` form (which exposes nothing, since its
  implicit else is empty), `<group rendered>` as sugar for it, and the
  `<select>` string form. The DoenetML fork's parser is not changed.
- **Banned:** a name whose type depends on the branch; outside references
  that are not interface names; `extend` of a `<select>`,
  `<conditionalContent>` or `<case>`; `createComponentOfType` and
  `numComponents`; non-literal load-time attributes.
- **Out of scope:** variant naming (`selectForVariants`, `variantControl`),
  `<shuffle>`, `<cascade>`, `isResponse` passing through choices.

## Measurements

Each fixture has a baseline with the same visible content and no choices.

- `wording-N` (N = 100, 1k, 10k): N reactive choices of 2-3 small branches
  (a sentence plus a `<math>` and a `<number>` in the interface), all driven
  by one input. Flip tick, unrelated drag tick, load, memory.
- `adventure-K`: a chain of K reactive choices, 4 branches each, about 2,000
  components per branch, each condition reading an earlier choice's
  interface. Flip tick under both mechanisms, forced.
- `select-N`: N load-time selects of 4 options. Load and memory against a
  document of only the chosen content; they should match closely.
- Threshold sweep: branch size by branch count, both mechanisms forced.
- No regression: existing fixtures measured against the commit before this
  round show no change in load, tick or memory.

## Oracle

`conditionalcontent.test.ts` and `select.test.ts` run unmodified through the
adapter (`DOENET_TEST_CORE=cells`). Each test is classed as pass, fail (a
gap) or banned. Each banned test gets an allowed rewrite in a patched copy,
for example `hide` in place of a reference into a single-case form, or a
shared interface in place of a branch-dependent type, and the rewrite must
pass. The verdict reports banned, rewrite passes and rewrite fails
separately.

## Bar

As in earlier plans: fatal only if a feature needs component-specific code
back in the core, or an interactive tick (flip, drag or rebuild) at 10k
components misses 50 ms.

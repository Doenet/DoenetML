# Choices split by timing, with one branch interface

DoenetML's conditional tags are split by **when** they choose, not by how much
their branches differ. A load-time choice (`<select>` and its relatives)
draws once from the document seed while the document is built, so unchosen
branches never exist. A reactive choice (`<conditionalContent>`) is decided by
a choice cell and can change on any tick. Every choice obeys one rule, the
branch interface: a name is visible outside a choice only if every branch
declares it with the same component type, and content that feeds a typed
parent yields the same type from every branch. The core keeps every branch
of a reactive choice built: an interface name is a `Choose` operator over
the branches' cells, inactive branches are not shown, and a flip is an
ordinary tick.

We chose this because the brief's two use cases (small local variations, and
documents that change drastically) turned out to differ in cost, not in
meaning. The plan first had the core pick by size between keeping branches
built and rebuilding on a change (ADR 0004); measured, building won on
every tick (see Outcome), so rebuilding was removed. Timing is the
split that removes machinery: a load-time choice costs nothing after the
build.

## Considered options

- Two reactive tags, one for mirrored branches and one for drastic ones.
  Rejected: once both obey the branch interface, the tags only name a
  mechanism.
- Names from any branch resolving to the missing referent while that branch
  is inactive (as `$r[32]` does). Rejected: `$cc.x` would silently become
  NaN, and a referent's type would again depend on the branch.
- Rebuilding on a change, keeping only the active branch expanded, chosen
  by the core for large branches. Built and measured in plan 6, then
  removed: a rebuild flip is a whole-document build, and a chain of choices
  pays a build pass per link.
- Restricting branches to identical structure apart from literals. Rejected:
  too strict for changing an explanation's wording, and the interface alone
  gives the core what it needs.

## Consequences

- Banned relative to the current core: a name whose type changes between
  branches or options; references into a branch from outside other than
  interface names; positional references into option content (`$s[2][1]`);
  a branch-dependent type fed to a typed parent; `extend` of a `<select>`,
  `<conditionalContent>` or `<case>`; `createComponentOfType` and
  `numComponents`; load-time choice attributes (`numToSelect`, weights) that
  are not literals.
- The single-case `<conditionalContent condition>` form exposes nothing,
  since its implicit else is empty; `hide` covers "same content, sometimes
  invisible". `<group rendered>` becomes sugar for the single-case form.
- A branch that becomes active again returns with its state. The current
  core discards it.
- A request on an interface name moves the active branch only; a request
  cannot flip a branch.
- Load-time picks are derived from the seed and the choice's essential key at
  every build and never stored.
- Out of scope: variant naming (`selectForVariants`, `variantControl`),
  `<shuffle>`, `<cascade>`, and `isResponse` passing through choices.

## Outcome (plan 6 verdict, `results/NOTES.md`)

The sweep found the built mechanism faster on every tick: a built flip
stays under 0.3 ms, while a rebuild flip is a whole-document build (25 ms
beside 10,000 components, 256 ms beside 50,000) and a chain of rebuilt
choices pays a build pass per link. Rebuilding paid only where inactive
branches would keep resampling many curves (about 72 ms a drag at 3,400
curves per branch, four branches). Charles chose to drop the rebuild
mechanism (2026-10-08): every reactive choice is built, and a document with
that many hidden curves is a known limit, like plan 5's sampling volume.

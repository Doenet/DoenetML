# PR Review Guidelines

Review this PR. The first question is whether the code is **correct** — whether it does
what the PR, its documentation, and its own comments say it does. Everything else in this
document is secondary to that.

Look for the case that breaks the change, not the case that confirms it: a review that
sets out to agree will find agreement. Report only what you can substantiate, and say what
each finding rests on. A review that finds nothing real is a legitimate result and should
be reported as one — findings offered to look thorough cost more to disprove than they
were worth.

## Correctness

Trace the main path of the change by hand and satisfy yourself that it produces the
claimed result. Do not accept a comment, a test name, or a variable name as evidence of
what the code does.

Work the edge cases deliberately. These four recur in this codebase and are worth
checking every time:

- **Empty input** — not just an empty literal, but input that looks non-empty in the
  source and produces nothing: a reference that resolves to no components, a composite
  with no replacements, a filter that removes everything.
- **`NaN` and non-numeric values** — a value can satisfy a type check and still be
  meaningless, as a `<number>` whose content does not parse is numeric by type and `NaN` by
  value. Do not assume the converse either: `<number>` takes a `valueOnNaN` attribute
  (`Number.js`), so unparseable content yields whatever the author set, `NaN` only by
  default. Two properties of `NaN` break guards that look sound: every comparison against it
  is false, so a condition written as a negation ("nothing is out of order") admits a `NaN`
  that the positive form ("everything is in order") would reject; and it is equal to
  nothing, not even to itself, so anything that groups, deduplicates or caches by equality
  treats each occurrence as new.
- **Boundary values** — the first and last element, a value lying exactly on a cut point,
  equal or duplicate values, and collections of one and of zero elements.
- **Values that change over time**, especially anything driven by an input while a student
  is still typing.

Then ask what the change breaks that **is not in the diff**. Swapping a base class,
changing an attribute's `createComponentOfType`, or editing a shared utility can change
behavior entirely inside files the PR never touches. Name the behavior before and after,
and establish the "before" by reading the code that used to run, not by assuming.

## Run the code

Reading is not verification. Where a finding can be settled by executing a document — which
is most of them — write the smallest one that decides it, and report what it actually
rendered. Choose the input most likely to break the change rather than the one most likely
to show it working; a passing example proves less than a failing one. Delete any scratch
file before you finish.

Say how you established each claim: **ran it**, **read the code**, or **assumed**. A review
that does not distinguish these is hard to act on, because the reader cannot tell which
parts to re-check.

## Check prose against code, not against other prose

Every factual or quantitative claim — in the changeset, the PR description, the reference
documentation, the code comments, and the commit message — must be traceable to the code
that makes it true. Cite the file and line, or delete the claim.

This matters most when a claim appears on several surfaces. A sentence written once and
then paraphrased into each new place tends to get checked against the earlier wording
rather than against the code, so one error propagates and every later reader finds it
reassuringly consistent with everything around it. Go back to the code each time,
including for the copy you have already read somewhere else.

Claims about cost deserve particular suspicion, because they are easy to write and
expensive to check. A claim that a change reduces how much a document creates has to
account for how components actually come into being: a composite creates one replacement
per result, so removing N *operators* from the markup generally still creates N
*components*. Establish the count by running a document and measuring it, and say what is
saved and what is not.

## Scope

Prefer changes that live inside the PR's own diff. If you find a worthwhile refactor that
would mean editing files this PR does not touch — extracting shared machinery, folding
duplicated helpers together — **report it rather than performing it**. It probably belongs
in a PR of its own, and if this PR is part of a stack, editing a lower layer forces every
branch above it to be replayed.

## Simplification and maintainability

Once correctness is settled: look for code that can be made more concise, redundancy that
can be eliminated, and simplifications that would perform the same function. Abstract
repeated code into helper functions where that increases readability and where it stays in
scope as described above. Prefer conventions established in `AGENTS.md`.

Review the documentation and comments for consistency, clarity of intent, and accuracy.
Add doc strings to functions or code blocks where they would clarify intent and make the
code easier to maintain — and correct or remove any comment that no longer describes what
the code does.

## Schema freshness

If the PR adds or modifies any component class (files under
`packages/doenetml-worker-javascript/src/components/`) — including new state variables,
attributes, or component types — regenerate the schema and commit the result:

```bash
npm run build:schema -w packages/static-assets
git add packages/static-assets/src/generated/
```

The CI job `schema-freshness` will fail if the committed schema files are out of date with
the component source. Running `build:schema` locally and staging any changed files in
`packages/static-assets/src/generated/` prevents that failure.

## Test coverage

Review whether the PR includes adequate tests:

- New behavior or bug fixes should have at least one Vitest unit test (in `*.test.ts`), a
  Cypress e2e test (in `cypress/e2e/**/*.cy.js`), or a Cypress component test (in
  `test/cypress/component/**/*.cy.tsx` — present in `@doenet/codemirror`,
  `@doenet/doenetml`, and `@doenet/doenetml-iframe`), as appropriate for the change.
- If the PR modifies existing behavior, confirm that any existing tests covering that
  behavior have been updated to reflect the new expected behavior.
- Check that the tests actually exercise the scenario described in the PR — not just
  adjacent or unrelated scenarios.
- A test written for a bug fix should **fail without the fix**. Where it is cheap to do so,
  confirm that by reverting the fix and watching the test fail; a test that passes either
  way documents nothing.

## Documentation

These pages are written for **authors writing DoenetML activities**, not for developers
working on the implementation. That distinction is the first thing to check in any docs
change, because a PR's own author has just been reading the implementation and it leaks
into the prose easily.

Nothing should appear in a page that an author could not observe from the DoenetML side:
no source files, function names or internal state-variable identifiers; no walking through
what the runtime does internally; no componentTypes an author never writes. Attribute
names, child tags and properties are fine — those *are* the author-facing surface. The test
is whether an author could discover the statement by experimenting. Where a behavior does
come from something internal, describe the behavior, not the mechanism. The
[`doenetml-docs-authoring`](../.github/skills/doenetml-docs-authoring/SKILL.md) skill is the
authority here and covers the specific cases; consult it rather than working from this
paragraph.

Then review whether the PR updates or adds documentation as needed:

- If the PR changes user-visible behavior (new features, changed defaults, renamed
  attributes, etc.), check whether the corresponding page(s) in `packages/docs-nextra/`
  need updating.
- If the PR adds a new component, ensure a reference page exists or is created under
  `packages/docs-nextra/pages/reference/`.
- If the PR changes how an existing component behaves (e.g. new attribute, changed
  default, fixed edge case), update the relevant reference or guide page.
- Every DoenetML example on a page is a claim about what that markup renders. Run the ones
  the PR adds or changes, and confirm the surrounding prose describes what actually
  happens.
- Documentation changes are not required for purely internal refactors or fixes with no
  user-visible effect.

## Changeset and PR description

- The changeset must describe the user-visible behavior in the diff, and only behavior that
  is actually in it. Consult the `changesets` skill rather than copying a sibling changeset.
- The PR description must still describe everything in the diff. Check it explicitly
  rather than assuming an earlier pass left it accurate: it is the one surface that no
  test, no CI job and no reader of the code will catch when it goes stale.

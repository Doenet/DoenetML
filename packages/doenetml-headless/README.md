# @doenet/doenetml-headless

Run DoenetML without a browser, in plain Node: grade a saved state of a
document, check a document for problems, and drive a document's inputs from a
script or a test.

```bash
npm install @doenet/doenetml-headless math-expressions
```

`math-expressions` is a peer dependency, the math engine the core computes
with. Node 20 or later.

## What it is for, and what it is not

**`gradeState` reports the credit the document assigns to a stored state in a
given variant. It is not evidence of what the student did.** The saved state
comes from the student's browser, and everything in it can be changed there:
the input values, the random selections that made the variant, and any other
state the credit depends on. Nothing run in a student's browser can be made
tamper-proof, and this package does not make it so. What recomputing on a
server does buy is that the server no longer takes the browser's word for the
credit itself.

So, in a result:

- `credit` is the answer's `creditAchievedIfSubmit`, recomputed when the state
  is loaded, from the inputs as the state holds them. It ignores attempt
  limits (an answer whose attempts are used up is still graded) and it is not
  reduced by `creditByAttempt`.
- `stored.creditAchieved` and `stored.numSubmissions` are what the state
  itself says. They are restored exactly as stored, so they are the browser's
  claim, shown beside the recomputed credit for comparison and nothing more.
- `document.credit` is the document's own `creditAchievedIfSubmit`. The
  document weighs its parts itself, so a `<pretzel>` or a section with
  `sectionWideCheckWork` counts as the one part it is; read this, do not add
  up the answers. It is `NaN` (`null` in JSON) when the document weighs
  nothing (no answers, or every weight 0), and also when a `<problem>` or
  other aggregating section in it has no answers, whatever the rest earns
  (each divides by the weight of what it holds, with no guard for none).

`answers` are the document's `<answer>` components in the order a reader meets
them (a repeat's iteration by iteration, a select's in the order selected). A
copy of an answer is not reported beside it, an answer inside an unopened
`<solution>` does not exist yet, and a `<pretzel>` is not among them (nor is
the `<answer>` that gives each of its problems' answer, which it turns into
text): its credit is only in `document.credit`.

**Snapshot the state at the moment of submission.** `creditAchievedIfSubmit`
reflects the inputs as they were when the state was saved, not as they were
when the student last submitted. A state saved after the student changed an
input grades work they never submitted. The viewer reports a state in the same
update as each submission, marked `onSubmission: true` inside the payload; a
host that stores those reports as the snapshots of its checks, and treats the
other reports as the running state only, grades what was submitted. A graded
result carries `savedState.onSubmission` so a host can tell which it has.

**There is no grading from events.** The `response` in a `submitted` event is
what the author chose to show an instructor, and need not determine the
credit. In

```xml
<mathInput name="a" forAnswer="$ans" />
<mathInput name="b" />
<answer name="ans"><award><when>$a = $b</when></award></answer>
```

`b` decides the credit but is not part of the response, so no mapping from
responses back to inputs can be right in general. Grade from the saved state.

## Grading a saved state

```js
import { gradeState } from "@doenet/doenetml-headless";

const result = await gradeState(doenetML, variantIndex, savedState);
// result.answers: [{ stableKey, credit, stored: { creditAchieved, numSubmissions }, inputs, ... }]
// result.document: { credit, stored: { creditAchieved } }
// result.diagnostics, result.variantIndex, result.numVariants, result.savedState
```

`savedState` is the payload the viewer reports to its host, stored as it came,
as an object or as its JSON text: the `state` of `reportScoreAndState` (the
`SPLICE.reportScoreAndState` message's `state`, for the iframe). It carries
`data_format_version`, `cid`, `coreInfo`, `coreState`, `attemptNumber` and
`onSubmission`, among others.

Each grade runs a fresh core: the JavaScript core applies a saved state only
when it is created.

`gradeState` refuses, with a `HeadlessError` whose `code` says why:

| `code`              | when                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `invalidState`      | the state is not such a payload                                                           |
| `dataFormatVersion` | its `data_format_version` is not the one the core reads; the error names both             |
| `documentMismatch`  | it was written for a different document source (its `cid`, a hash of the source, differs) |
| `variantMismatch`   | it was written for a different variant than `variantIndex`                                |
| `attemptMismatch`   | with the `attemptNumber` option, it was written for a different attempt                   |

`data_format_version` marks the format of the saved state. It changes only
when an older state would no longer be read correctly, and states are never
converted between formats, so a state in another format is refused rather
than misapplied. It is not a runtime version: many releases share one format
version, so a match does not mean the same release wrote the state. Whether to
grade each state with the release that wrote it is the host's decision.

Options: `flags` (viewer flags, as `DoenetViewer` takes them; none of them
changes the credit, and `allowLoadState` is not consulted, since the state is
always applied), `attemptNumber` (a state that records no attempt is not
checked), and `coreFactory` (see [Cores](#cores)).

## Checking a document

```js
import { check } from "@doenet/doenetml-headless";

const result = await check(doenetML, { variantIndex: 1 });
// result.diagnostics: every diagnostic, of every type (error, warning, info, accessibility)
// result.answers: [{ stableKey, componentType, position, inputs }]
// result.answersWithoutStableKey, result.numVariants
```

## Stable keys

A component's stable key is a path from the document root that reaches it and
nothing else, each step resolving uniquely from the one before it: the same
condition under which the resolver gives a component a root name. It is
written as a reference without the `$`, such as `ans`, `p1.same` or
`r[2].inRepeat` (the shortest such path is reported).

Having a name is not enough. Two `<answer name="same">` in different
paragraphs have no stable key until each paragraph has a name of its own, and
an answer with no name has none. Inside a saved state components are keyed by
an index that stays the same only while the document does not change, so it
is not a key a file of expected answers can use; `componentIdx` in a result is
that index, for correlating within one run, never to store.

## Driving inputs

For tests and content checks: give inputs the raw values a student enters,
submit, and read the credit.

```js
import {
    createHeadlessCore,
    setInput,
    submit,
} from "@doenet/doenetml-headless";

const core = await createHeadlessCore({ doenetML, variantIndex: 1 });
try {
    await setInput(core, "x", "2x+1"); // by path
    await setInput(core, { answer: "ans", position: 1 }, "3"); // an answer's own input
    await submit(core, "ans");
    const answers = await core.getAnswers();
    const state = await core.serializeState(); // the state a viewer would report
} finally {
    await core.terminate();
}
```

The target is either a path from the root (`"x"`, `"$r[3].g.mi"`) or an
answer's path and the position of one of the answer's own inputs, numbered
from 1. The second form is the only way to reach an input that cannot be
named, such as the one `<answer name="ans">x</answer>` makes for itself, or an
unnamed `<mathInput/>` written inside the answer. Either way the target needs a
stable key, and an input reached through an answer needs the answer to have
one. A target without one is refused (`noStableKey`), never guessed; a path
that names nothing, an `answer` that names something other than an
`<answer>`, or a position the answer has no input at is refused as `notFound`. A string that is not written as
a path at all (names joined by `.`, literal indices) throws a plain `Error`.

| input             | value                                                                                                                                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<mathInput>`     | the LaTeX typed, a string                                                                                                                                                                                                                     |
| `<textInput>`     | the text, a string                                                                                                                                                                                                                            |
| `<booleanInput>`  | `true` or `false`                                                                                                                                                                                                                             |
| `<choiceInput>`   | the positions of the selected choices, numbered from 1 in the order the reader sees them (shuffled, if the choices are), as an array or one number; one position unless it has `selectMultiple`, each at most once, none of a disabled choice |
| `<fractionInput>` | `{ numerator, denominator }`, each the LaTeX typed                                                                                                                                                                                            |
| `<matrixInput>`   | the LaTeX of every cell, as an array of rows of the matrix's current size                                                                                                                                                                     |
| `<point>`         | its coordinates, `[x, y]` or `[x, y, z]` as the point has, moved as a drag moves it                                                                                                                                                           |

Each value is turned into the actions the input's renderer sends. Any other
type is refused (`unsupportedInput`), as are a disabled or fixed input, a disabled choice, or a point that
cannot be moved (`inputDisabled`, since it would ignore the value) and a value
of the wrong shape (`invalidValue`).

`submit(core, path)` submits an `<answer>` or a `<pretzel>`, or, for any other
component (a section with `sectionWideCheckWork`, the document), all the
answers under it, as its check-work button does.

## Command line

```bash
doenet-headless check <file> [--variant <n>] [--json]
doenet-headless grade <file> --variant <n> --state <state.json> [--attempt <n>] [--json]
```

Human-readable by default, JSON with `--json`. Standard output carries only
that report: anything the core logs while it runs (with `console.log`,
`console.info`, `console.debug` or `console.warn`) goes to standard error, as
do refusals and errors. Exit codes: 0 when the
document has no errors; 1 when it has an error among its diagnostics (the
report is still printed); 2 for a usage or file problem or any other failure;
3 when `grade` refuses the saved state.

## Cores

The package depends only on the `HeadlessCore` interface (in `@doenet/utils`):
create a core from a document, a variant, flags and an optional saved state;
dispatch an action; resolve a path; read a component's children and
properties; read the answers, the document credit and the diagnostics; read
the variant count; serialize the state; optionally load a state into a running
core (`loadState`, when `capabilities.loadState` is true); terminate. A
`HeadlessCoreFactory` makes cores and says which `data_format_version` they
read, so a state is checked before a core is made from it.

The default is the current JavaScript core, over the resolver WASM that ships
in this package beside its code (`lib_doenetml_worker_bg.wasm`, read from disk
when the first core is made). A host that keeps that file elsewhere names it
with the `DOENET_HEADLESS_RESOLVER_WASM` environment variable. Another core
plugs in by passing its factory as the `coreFactory` option of `createHeadlessCore`,
`gradeState` or `check`; making it the default is a change to one file,
`src/defaultCore.ts`.

The JavaScript core computes in English, even for a document that declares
another language with `lang` or that a viewer shows with a non-English
`documentLocale`, where the viewer computes the words the core writes into the
content (a boolean's text, for one) in that language; an answer that compares a
response with such words is graded here against the English ones. It has no
host to fetch external DoenetML from (a `copy="doenet:..."` reference is reported as an error, and
the document is graded without the content it names, where a viewer whose host
fetches it shows that content and its answers), and
runs with the viewer's default flags except that it sends no events (as the
viewer does by default, it keeps no local state and does not auto-submit).

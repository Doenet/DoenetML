# Diagnostics

This document covers what errors, warnings and infos mean, what a diagnostic says, and where it
is reported. Each principle cites the decision or PR it came from.

Paths: `T/` is `packages/doenetml-worker-javascript/src/test/` and `W/` is
`packages/doenetml-worker-javascript/src/`. Tiers are defined in the [README](README.md).

---

## 1. Levels

### DIAG-1: a diagnostic's level says what the author should do (Tier 2)
- **Error:** the DoenetML is invalid or cannot be honored as written. Something is not rendered,
  or is replaced by the error. The author must change it. Examples:
  - an extend that changes what a tag makes (REF-7, `doenet-e0056`–`e0061`);
  - an unrelated type change (REF-5), and a tag whose type the DoenetML doesn't guarantee
    (REF-0, D36, D37);
  - a cycle (NAME-7).
- **Warning:** the DoenetML is valid, but almost certainly not what was meant, or does nothing.
  The author should change it. Examples:
  - an attribute that is ignored, including one the tag doesn't have on a `copy`, `copyWithState`
    or `extend` (`doenet-w0187`, #2482);
  - a deprecated form;
  - an ambiguous name (`doenet-w0105`);
  - a literal `$l[0]`;
  - a `copyWithState` whose nested choices kept the source's, and a `copyWithState` of a URI,
    which has no state to carry (D33).
- **Info:** the DoenetML is valid, and with the values it has now, part of it is missing (a blank)
  or degenerate. The diagnostic only explains why, so that the author is not confused.
  Nothing needs to change. Examples:
  - an index that names nothing at the moment;
  - a construction from a blank input;
  - a collect from content that is not shown;
  - a value that does not convert to the tag written (`doenet-i0053`);
  - a list of texts whose brackets don't balance, read with them ignored (`doenet-i0058`,
    VAL-12).

A warning in a document means something should be fixed. A document that is waiting for the
reader has none.

Accessibility diagnostics (`doenet-a…`) are a category of their own, and this rule does not
cover them.

### DIAG-2: the level follows where the condition comes from, not the code (Tier 2)
One code can be reported at different levels. The code's letter records what it was first raised
as, and each call site picks the level (`packages/i18n/README.md`).
- **From what the author wrote** (literals, the structure of the document), a condition is a
  mistake: a warning or an error. `$l[0]` is a warning.
- **From values that can change** (inputs, references, which case or option is active, a random
  choice), it is an info. `$l[$i]` with `i` = 0 is an info.

Run-time detection alone does not make a diagnostic an info. D33's warning about a
`copyWithState`'s nested choices is found only at run time, but stays a warning, because the
author should write `copy` instead.

**Done by #2495** (closing #2422): every warning call site was classified as authored,
value-driven or both. Where one check covers both, the level is decided by where the offending
value comes from. No codes changed. Value-driven conditions now give infos: `w0104` for
`$l[$i]` with `i` from an input, `w0100`, `w0027`, `w0040`, `w0126` and the other sampling,
geometry, chart and function codes, `w0072` for a collect from a case whose condition can
change, and `w0043` for an action's target that holds nothing now. `$l[$i]` of a literal `i`
stays a warning.

**What "can change" means (Tier 2).** One definition, also used by D39's SEL-1. A value can
change when it is, or reads:
- an input, an answer, a slider, or a random choice;
- **anything the reader can write to:** what a `bindValueTo` references; an input's value child
  (`<mathInput>$a</mathInput>` writes `a`; `prefill` and a label don't); the target of
  `<updateValue>`, `<animateFromSequence>` or `<callAction>`; everything in a `<graph>` that
  isn't fixed, with what it references; a `<spreadsheet>` that isn't fixed. `fixed` (and
  `fixLocation` for a location) stops a write;
- state a reader sets by an action (opening a hint, solution or section; playing a video);
- what a composite makes, when its choice can change (a case's `condition`, a repeat's `for`).

What is written in place is the author's even when a reader can drag it; the write index is
consulted only for what a reference reaches. Code: `buildReaderWritableIndex` in
`W/utils/readerWritable.ts`, `canChange` in `W/utils/decidedByDoenetML.ts`, and the
`decidedByDoenetML` and `contentDecidedByDoenetML` dependencies. The approximations lean to
info: a whole write target's subtree counts as writable, `fixed="$b"` counts as not fixed, a
`fixed="false"` under a fixed ancestor counts as writable, and a reference from inside a graph
that isn't fixed is writable. New ways a reader can write must be added to the index.

**Known violations:**
- `doenet-w0181`, past the end of a repeat whose count is a value, on a bare reference
  (postponed to the new core; #1499, #2281); `w0125` and the per-descendant PreFigure codes
  (`w0085`, `w0099`, `w0170`, `w0172`) keep their level;
- infos lost or not coming back: a restored `<selectRandomNumbers>`, `resample()`, `w0072` once
  a case goes inactive again, and a tag of an iteration that isn't there (#2506);
- an authored warning given as a condition is reported only while its component is shown, and
  not before (#2506);
- `doenet-i0048` (an invalid primitive `type`) is authored but an info (#2506);
- every attribute of a value child decides the level, including a style attribute (#2506).

**A value-driven diagnostic tracks the value.** It follows from DIAG-1 and DIAG-2: an info
explains why nothing shows now, so it appears when the condition starts and goes away when it
ends. While the condition holds there is one of it. Done by #2444 (B33, closing #2442):
- a component reports what a condition gives now (`setConditionDiagnostics` in
  `DiagnosticsManager`), and `[]` withdraws it. A condition that nothing re-evaluates is watched
  (`watchCondition`) and decided again before each renderer update;
- a diagnostic is shown only while its component is shown, so not inside content a composite
  withholds, such as a case that isn't chosen. Content hidden with `hide` still counts as shown;
- a diagnostic is withdrawn when its component is deleted;
- **a `copy` keeps the diagnostic it was made with**, as it keeps what it shows (CPY-2), through
  a reload too.

**Known violations:** `doenet-w0181`, past the end of a repeat that shrank, is still decided in
`RefResolutionDependency` and reported only after a reload (#1499). Since #2495 a state-variable
definition can return `conditionDiagnostics`, so the chart, counting and list-index call sites
follow their values too.

Decided in D35.

---

## 2. What a diagnostic says, and where

### DIAG-3: a diagnostic names what the author wrote, never an internal type (Tier 2)
- A reference is quoted whole, as written: `$l[0]`, not `$l`, and `$$f(2)` (#2410, #2419).
- Tags and attributes are the author's, not internal ones (`_copy`, `_repeatValueList`, `s[2]`).
- An error says why and what to write instead. D32's extend errors are the model: "A `<repeat>`
  makes its content from `for`. An `extend` shows the same content as `$r2`, so it can't change
  `for`. … To make a new `<repeat>` with a different `for`, use `copy`." The message is how
  authors learn the rule, so it is part of the rule.

**Known violations:**
- `<p name="p" copy="$p"/>` reports an internal `<_copy>` (NAME-7);
- `<repeat for="">` gives an uncoded "Invalid empty attribute for" (#2488).

Since #2482 a function reference is quoted whole after an index (`$$f[2](2)`), and a missing
function's arguments are resolved for their own diagnostics: `$$f($a)` reports both (#2434).

### DIAG-4: a diagnostic is located where the author wrote the cause (Tier 2)
A reference's diagnostic is marked at the reference, also inside an `extend` or `copy`
attribute (#2410). An extend's error is marked on the extend (#2409). A cycle is marked at the
components involved, not reported as one message with no location (D14, #2418).

Since #2482 (closing #2449, B38), a reference to a component in error reports nothing more: the
error is reported once, at its cause, also at run time when a case holding it becomes active. A
copy of a component holding an error shows it without reporting it again.

### DIAG-5: an error does not stop the rest of the document (Tier 2)
The component in error shows nothing, or the error in its place. The rest of the document
renders. A reference to a component in error is missing (VAL-5): it shows a blank `＿`, and
reports nothing more. The error is reported once, at its cause (DIAG-4, #2449).

**Known violations:**
- state-variable cycles throw, and the document fails to load (D14, NAME-7);
- a loop where no composite can be singled out still stops the document (#2425);
- fixed: `bindValueTo` of a `<subsetOfRealsInput>` (B24, #2484), `<text extend="$cc"/>` of
  bare-text cases (B23, #2447), and a reload restoring a value to a component of another type
  (B36, #2481).

### DIAG-6: the diagnostics are the same after a reload (Tier 2)
A reload restores what the reader saw (SAVE-1), and that includes the diagnostics.

**Known violations:**
- an index past the end of a repeat that shrank adds a diagnostic only after a reload (#1499).
  Under DIAG-2 it is an info, reported the same way before and after. On a tag it is info
  `doenet-i0054` since #2447, which follows the index. A bare reference still has the late
  `w0181`: its info was postponed to the new core (#2281), because deciding it again after every
  update cost too much (REF-0);
- a copy that made nothing is not held in a save, so a reload can report a different info for
  why it shows nothing, when its source's case changed (B37, from #2443).

### DIAG-7: an error is decided at load, from the DoenetML alone (Tier 1; D38, #2463)
An error is decided when the document loads, from what the author wrote. It never comes from
values (inputs, references, the active case), from the reader's actions, or from the variant
(random choices, `requestedVariantIndex`). Two guarantees follow:
1. **No error appears while a reader works.** The set of errors is fixed once the document has
   loaded. An error the author sees at load, a reader sees at load too, and that is acceptable.
2. **Every variant has the same errors.** The variant is not part of the DoenetML, so it cannot
   change what is an error. An author who sees no error in one variant sees none in any.

A problem that depends on values or the variant is not an error. The component is missing
(VAL-5, D37) and the rest renders (DIAG-5). It gives an info, or a warning when the author should
write something else (DIAG-2).

**How it is guaranteed:**
- **Only load-time code reports an error:** the resolver, `W/utils/dast/typeChangeAtLoad.ts` and
  the DoenetML conversion. An error-level report after load is a bug. In development and tests
  it is an assertion. In production it is reported as a warning, so the reader sees no error.
- **A load-time check reads only the DoenetML and its literals**, never a state variable's
  value. That is why REF-5 says "`numToSelect` written as `1`" rather than "whose value is 1".
- **No variant sweep.** D39 decided that a sweep over today's variants is only a regression aid,
  not the guarantee, so none was built (#2491). Variant independence comes from the two rules
  above, and for selections from SEL.

**Done by #2491:** `DiagnosticsManager.markLoaded()`, called at the end of `Core.generateDast`,
records what was reported by then. A new error after it is handled by `errorsAfterLoad`:
- **`"assert"`** (the default under Vitest, and in Node with `NODE_ENV=development`): reported and
  recorded. A setup file (`T/setupErrorsAfterLoad.ts`) fails any test whose document leaves one,
  unless the test takes them with `takeErrorsReportedAfterLoad()`;
- **`"warn"`** (the default in a browser): reported as a warning, and an `_error` component made
  after load becomes a `_missing` one (`＿`). A reload decides it at load, where it is an error
  again (DIAG-6), but only for content that is already a bug.

The load-time checks of D22, D26, D32 and D36 follow it already, since each reads only the
DoenetML.

**Done by #2458:** an error decided from the DoenetML is reported at load wherever its content
is, also in a case not yet true, an iteration not yet made or an option not picked, and the same
error is kept once when the content is made (`T/diagnostics/errorsDecidedAtLoad.test.ts`). That
covers a tag's type errors there (`fixedTypeError` and `reportTypeChangesAtLoad` in
`typeChangeAtLoad.ts`), a bare reference of mixed types (`w0184`), a tag extending the
`<conditionalContent>` holding it (`e0005`), and a conversion error such as an unknown tag
(`e0002`).

**Known violations** (#2463). Each is now a warning with `＿` in production, and a test that
reaches it takes its error explicitly:
- **fixed by #2507** (closing #2493): an extend that would change what it extends
  (`e0056`–`e0061`), a `<select>` whose literals can't select (`e0035`), a scalar tag of a
  written list (`e0064`, counting entries by VAL-12), and `<module extend="$q"/>` of a non-module
  (`e0065`) are decided at load wherever their content is. Each decision reads only exact
  literals and is marked on the component (`extendErrorsAtLoad`, `choiceErrorAtLoad`,
  `typeChangeAtLoad`); run time reports the mark, so load and run time give the same error, kept
  once. Load marks only errors, so a miss falls back to run time. A scalar tag of a list whose
  `maxNumber` is a value is missing with an info, never an error;
- **left to run time** by #2507, so they can still error after load in content made later:
  `numToSelect` written as an expression, `withReplacement=""`, a list made from another list,
  `<math>` entries and entries holding an error, `mergeMathLists`, `maxNumber` written as an
  expression, a composite or index source that isn't one written tag, and `<module extend="$t"/>`
  where `t` is a name inside a case or holds an error;
- the choice errors of `<selectFromSequence>` and `<selectPrimeNumbers>` that a value decides,
  for SEL-5 (D39, #2508 part 3). A parameter reaching what can change, or a sampler, is `e0070`
  at load since #2511;
- a sequence extend through an index or a property throws, or gives a spurious `e0005` (#2501);
- **fixed by #2471 and #2513:** reference cycles are `e0005` at load over every branch and
  variant (B32, B40, #2430, #2473), including through a property, an input's starting value, an
  attribute a composite is made from, an index, a name every branch declares, a `<p>` and a
  `copy` in what it is of. Left: the shapes listed under NAME-7 (#2515), still found when
  reached;
- **fixed by #2468:** choice errors that depended on the variant or on values. A requested
  variant's choices are taken as given (`e0037`–`e0040`, `e0048`–`e0050` are retired). A failure
  is an error only when every attribute deciding it is written without a reference; otherwise it
  is an info and the selection is missing (`to="$a"` with a random `a`). Those variants are
  still broken, which D39 addresses. #2511 retired the fluke codes `e0052`/`e0053` and `coprime`'s
  `i0057`: a selection never fails by chance (SEL-4);
- state-variable cycles that throw (D14) through what #2513 doesn't cover: a property or
  attribute not in its tables, `$$f($n)`, an index into a `<repeat>` in its own template (#2515);
- exceptions during interaction (DIAG-5). B36's on reload was fixed by #2481.

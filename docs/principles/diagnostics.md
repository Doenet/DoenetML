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
  isn't fixed, with what it references, except that a component whose only location is its
  `anchor` (a `<number>`, `<math>`, `<m>`, `<text>`, `<label>`, `<image>`, an input or a button)
  is dragged only to place it, which writes its `anchor` (and what a written `anchor`
  references), not its value (#2576); a `<spreadsheet>` that isn't fixed. `fixed` (and
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
- **fixed by #2547** (#2506 items 1, 4, and 2–3 in part):
  - a restored `<selectRandomNumbers>` reports what its parameters give; `w0072` comes back when a
    case goes inactive again (an inactive source collects nothing, as on a reload); `resample()`
    and a tag of an iteration that isn't there were already right;
  - an authored warning in a case, option or iteration is a warning, not an info: `canChange`
    passes through the composites that hold written content (`writtenInPlaceCanChange`), and a
    value in a template stays an info;
  - an authored warning given as a condition stays once its component has been shown;
  - `i0048` for an invalid **primitive** attribute is a warning (`<slider type="banana"/>`);
  - only attributes of the value decide the level (`ATTRIBUTES_NOT_OF_THE_VALUE`: style, display
    and rounding attributes, `hide`, `fixed`, …), so `<number displayDigits="$n">` is a warning;
  - `w0181`/`w0188` follow the value when the index or the case shown comes from one (infos), and
    stay warnings when the DoenetML decides them;
- **left** (#2506): a warning a component decides (`w0027`, `w0144`, sampling, geometry and chart
  codes) in content never made isn't reported until shown (SEL-8; it needs content built without
  showing it, as the cells core does); `i0048` for an attribute **component** written as a literal
  (`<sampleRandomNumbers type="banana">`) stays an info, since a reader can write to it;
  `ATTRIBUTES_NOT_OF_THE_VALUE` is a denylist, so an attribute it doesn't list still decides the
  level, leaning to info.

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
- fixed by #2542: `<repeat for="">` gave an uncoded "Invalid empty attribute for"; an empty attribute
  that needs a value is now `doenet-e0072`.

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
- **fixed by #2625** (D57): a state-variable cycle thrown while the document loads is rebuilt as
  `e0005` at one authored node, and the rest renders; since #2639 (D61), up to five independent
  cycles at load. **Left:** a cycle after an update or first reached after load still stops the
  document (D14, NAME-7, for the cells core);
- a loop where no composite can be singled out still stops the document (#2425);
- **fixed by #2574** (closing #2536): an unknown name in `variantsToInclude` or
  `variantsToExclude` is ignored with **`doenet-e0079`** at the attribute, and the document loads
  with the other names (every variant, if `variantsToInclude` names none). A name past the unique
  variants is not a variant. **Fixed by #2610** (closing #2579, D47 decision 1): `<variantControl>`
  never stops the document. Valid names that exclude every variant are **`doenet-e0087`** (every
  variant is included); a repeated name in `variantNames` is **`doenet-e0086`** (the first is
  kept); an empty `variantsToInclude` is `e0072` (ignored); a reference in any of its attributes
  is **`doenet-e0085`** (the reference is ignored, the text beside it kept); a `<problem>`'s
  `<variantControl>` is followed, with unique variants, whether or not the document's variants
  are unique. **Fixed by #2616:** `numVariants=""` is `e0072` (ignored), and a `<variantControl>`
  made with `extend`, `copy` or `copyWithState` is **`doenet-e0088`**. **Fixed by #2635:**
  `numVariants="abc"` is **`doenet-e0089`** (not a number, ignored); a numeric character
  reference in any attribute (`&#x33;`) is decoded; a reference to a `<variantControl>` (`$vc`,
  `$vc.numVariants`) names nothing, with **`doenet-w0199`** saying it shows nothing and its
  attributes can't be read. `<lorem generateParagraphs="$s.sectionNumber"/>` is no longer a false
  `e0005`. **Fixed by #2640:** `e0065` for `<text extend="$vc"/>` no longer advises writing `$vc`;
- **fixed by #2573:** a reference to a component in error reports nothing more (no `w0104` for
  `$x.bar` of an `_error`);
- **fixed by #2609:** a document with millions of unique variants loads in any variant (it ran out
  of memory in variant 2: each unique variant is now computed at its index, not by listing every
  one before it); a composite after a section reading the section's `sectionNumber`
  (`<selectRandomNumbers mean="$s.sectionNumber"/>`, `<sequence to=…>`), and a tag extending a
  section's number written before the section, load (a number depends only on what comes before
  it); an `<updateValue>` on a `<textInput>` without `type` no longer throws (the update is still
  silent: D54, #2607);
- **fixed by #2618** (#2614 items 1–2): a `<document>` with an attribute it doesn't have loads,
  with `e0004` (or `e0003`) at the attribute, which is ignored; a composite before a section can
  read the section's number when, by the DoenetML, it can make no section, and a genuine cycle is
  `e0005` at load (NAME-7). Since #2625 (D57) a cycle the check misses is rebuilt as `e0005`, and
  since #2639 (D61) the section-number edges give no false `e0005`;
- fixed: `bindValueTo` of a `<subsetOfRealsInput>` (B24, #2484), `<text extend="$cc"/>` of
  bare-text cases (B23, #2447), and a reload restoring a value to a component of another type
  (B36, #2481).

### DIAG-6: the diagnostics are the same after a reload (Tier 2)
A reload restores what the reader saw (SAVE-1), and that includes the diagnostics.

**Known violations:**
- an authored warning that a component decides, once shown and then hidden, is kept, but a reload
  with it hidden doesn't report it (#2506; it goes with SEL-8 at load);
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
- **fixed by #2555:** the choice errors of `<select>`, `<selectFromSequence>` and
  `<selectPrimeNumbers>` that a value decides are proven at load (SEL-5): `e0073` in every
  variant. A parameter reaching what can change, or a sampler, is `e0070` at load since #2511.
  **Left** (#2563), still an error in some variants only:
  - a `<selectRandomNumbers>` reading another selection;
  - a failing selection with constant parameters in a `<select>` option, in the variants that
    pick it;
  - a `copy` of a selection with parameters of its own;
  - the 70% rule (`e0044`/`e0051`);
- fixed by #2542: a sequence extend through an index or a property threw, or gave a spurious
  `e0005`; it is `doenet-e0071` at load (REF-5);
- **fixed by #2471 and #2513:** reference cycles are `e0005` at load over every branch and
  variant (B32, B40, #2430, #2473), including through a property, an input's starting value, an
  attribute a composite is made from, an index, a name every branch declares, a `<p>` and a
  `copy` in what it is of. The shapes NAME-7 listed are `e0005` at load through the backstop
  since #2625;
- **fixed by #2468:** choice errors that depended on the variant or on values. A requested
  variant's choices are taken as given (`e0037`–`e0040`, `e0048`–`e0050` are retired). #2468 made
  a failure a value decides an info, with the selection missing. #2555 removed that info: every
  selection failure is an error, proven at load where a value decides it (above). #2511 retired the fluke codes `e0052`/`e0053` and `coprime`'s
  `i0057`: a selection never fails by chance (SEL-4);
- state-variable cycles that throw (D14) through what #2513 doesn't cover: a property or
  attribute not in its tables, `$$f($n)`, an index into a `<repeat>` in its own template (#2515).
  Since #2625 (D57) each is `e0005` when the load reaches it;
- exceptions during interaction (DIAG-5). B36's on reload was fixed by #2481.

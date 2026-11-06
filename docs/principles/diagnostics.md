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
  - an attribute that is ignored;
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
  - a value that does not convert to the tag written (`doenet-i0053`).

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

**Known violations:** many warnings fire for value-driven conditions. **[probe]** on main, built
from `7c2bb1f`:

| Document | Diagnostic |
|---|---|
| `$l[$i]` while the input `i` is blank or 0 | warning `doenet-w0104` |
| a `<circle>` through a point that uses a blank input | warning `doenet-w0027` |
| a `<function>` through a point that uses a blank input | warning `doenet-w0040` |
| a `<sampleRandomNumbers>` whose `standardDeviation` comes from a blank input | warning `doenet-w0126` |
| a `<collect>` from content in a case that isn't active | warning `doenet-w0072` |

Also:
- `doenet-w0181` ("the `<repeat>` made no iterations"), when the count comes from a value that
  can change;
- `doenet-w0100` for an index into a scalar, `$m[2]`, when `m`'s value can change. Since #2444
  it follows the value, but it is still a warning.


The audit of every warning call site is #2422.

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
`RefResolutionDependency` and reported only after a reload (#1499). The call sites in
`Chart.js`, `CountOperators.js` and `listIndexOperators.js` still use the add-only queue (#2422).

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
- a function reference with an index quotes only up to the index, `$$f[2]`, not `$$f[2](2)`
  (#2434);
- an index into a tag written with `extend` that reads itself,
  `<math name="m2" extend="$m">$m2[1]</math>`, gives an internal error (#2473). B29 was fixed by
  #2471;
- `<p name="p" copy="$p"/>` reports an internal `<_copy>` (NAME-7).

### DIAG-4: a diagnostic is located where the author wrote the cause (Tier 2)
A reference's diagnostic is marked at the reference, also inside an `extend` or `copy`
attribute (#2410). An extend's error is marked on the extend (#2409). A cycle is marked at the
components involved, not reported as one message with no location (D14, #2418).

**Known violations:** a reference to a component in error repeats the error where the
reference is written, quoting the cause: `$m $m` of `<math name="m" extend="$nothing"/>` gives
three errors, two of them at the `$m`s (B38, #2449).

### DIAG-5: an error does not stop the rest of the document (Tier 2)
The component in error shows nothing, or the error in its place. The rest of the document
renders. A reference to a component in error is missing (VAL-5): it shows a blank `＿`, and
reports nothing more. The error is reported once, at its cause (DIAG-4, #2449).

**Known violations:**
- state-variable cycles throw, and the document fails to load (D14, NAME-7);
- a loop where no composite can be singled out still stops the document (#2425);
- `bindValueTo` of a `<subsetOfRealsInput>` throws (B24, #2429). `<text extend="$cc"/>` of
  bare-text cases threw until #2447 (B23);
- a reload throws when a saved value reaches a component of another type (B36, #2446).

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
- **A variant sweep checks it:** a test helper loads a document at several variants (all of
  them when there are few) and asserts the same set of errors. The editor can offer the same
  check to authors.

The load-time checks of D22, D26, D32 and D36 follow it already, since each reads only the
DoenetML.

**Done by #2458:** an error decided from the DoenetML is reported at load wherever its content
is, also in a case not yet true, an iteration not yet made or an option not picked, and the same
error is kept once when the content is made (`T/diagnostics/errorsDecidedAtLoad.test.ts`). That
covers a tag's type errors there (`fixedTypeError` and `reportTypeChangesAtLoad` in
`typeChangeAtLoad.ts`), a bare reference of mixed types (`w0184`), a tag extending the
`<conditionalContent>` holding it (`e0005`), and a conversion error such as an unknown tag
(`e0002`).

**Known violations** (#2463):
- there is no assertion yet that no error appears after load;
- choice errors in content made later: `<select numToSelect="3">` with one option, in a case not
  yet true, gives `e0035` only once it is made. With literal attributes it can be checked at
  load;
- the errors of an extend that can't change content (`extendChangesContentErrors` in `Copy.js`:
  `e0061`, `e0059`, …), in content made later;
- `e0064` of an authored list whose count changes (`<mathList maxNumber="$n">` as a scalar tag):
  it depends on a value, so it should be a missing tag with an info;
- **fixed by #2471:** reference cycles through what is written are `e0005` at load over every
  branch (B32, B40, #2430). Left: cycles through a property, an attribute, an index or a list; a
  cycle through a name every branch declares, found when the case turns true (in a `<select>`,
  the variant that picks it doesn't finish loading); a cycle through a `<p>`; and a `copy` in
  what it is of (#2473);
- **fixed by #2468:** choice errors that depended on the variant or on values. A requested
  variant's choices are taken as given (`e0037`–`e0040`, `e0048`–`e0050` are retired). A failure
  is an error only when every attribute deciding it is written without a reference; otherwise it
  is an info and the selection is missing (`to="$a"` with a random `a`). The fluke codes
  `e0052`/`e0053` are always infos, and `coprime` draws that find nothing are info `i0057`.
  Those variants are still broken, which D39 addresses;
- state-variable cycles that throw (D14) through a property or an attribute,
  `<number name="n">$n.value</number>` (#2473). Whole-component cycles such as
  `<math name="z" extend="$z"/>` are `e0005` since #2471;
- exceptions during interaction, such as B36's on reload (DIAG-5).

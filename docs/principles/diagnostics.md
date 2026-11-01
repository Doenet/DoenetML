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
  - an unrelated type change (REF-5);
  - a cycle (NAME-7).
- **Warning:** the DoenetML is valid, but almost certainly not what was meant, or does nothing.
  The author should change it. Examples:
  - an attribute that is ignored;
  - a deprecated form;
  - an ambiguous name (`doenet-w0105`);
  - a literal `$l[0]`;
  - a copy whose nested choices kept the source's (D33).
- **Info:** the DoenetML is valid, and with the values it has now, part of it shows nothing or
  something degenerate. The diagnostic only explains why, so that the author is not confused.
  Nothing needs to change. Examples:
  - an index that names nothing at the moment;
  - a construction from a blank input;
  - a collect from content that is not shown;
  - a type change that does not match the active case.

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

Run-time detection alone does not make a diagnostic an info. D33's warning about a copy's nested
choices is found only at run time, but stays a warning, because the author should write the fresh
form instead.

**Known violations:** many warnings fire for value-driven conditions. **[probe]** on main, built
from `7c2bb1f`:

| Document | Diagnostic |
|---|---|
| `$l[$i]` while the input `i` is blank or 0 | warning `doenet-w0104` |
| a `<circle>` through a point that uses a blank input | warning `doenet-w0027` |
| a `<function>` through a point that uses a blank input | warning `doenet-w0040` |
| a `<sampleRandomNumbers>` whose `standardDeviation` comes from a blank input | warning `doenet-w0126` |
| a `<collect>` from content in a case that isn't active | warning `doenet-w0072` |

The audit of every warning call site is #2422.

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
- info `doenet-i0018` "Could not find prop n[1] on a component of type number", for `$n[1]`
  (#2421);
- the uncoded "Ref resolution error" for a function reference (B19, #2419);
- `<p name="p" copy="$p"/>` reports an internal `<_copy>` (NAME-7).

### DIAG-4: a diagnostic is located where the author wrote the cause (Tier 2)
A reference's diagnostic is marked at the reference, also inside an `extend` or `copy`
attribute (#2410). An extend's error is marked on the extend (#2409). A cycle is marked at the
components involved, not reported as one message with no location (D14, #2418).

### DIAG-5: an error does not stop the rest of the document (Tier 2)
The component in error shows nothing, or the error in its place. The rest of the document
renders.

**Known violations:**
- state-variable cycles throw, and the document fails to load (D14, NAME-7);
- an undetected replacement loop stops the document after 100 passes (B21, #2418).

### DIAG-6: the diagnostics are the same after a reload (Tier 2)
A reload restores what the reader saw (SAVE-1), and that includes the diagnostics.

**Known violation:** an index past the end of a repeat that shrank adds `doenet-w0104` only after
a reload (#1499). Under DIAG-2 it is an info, reported the same way before and after.

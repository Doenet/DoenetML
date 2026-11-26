# An answer compares booleans and numbers within an error, credits several awards, and a choice says whether it is chosen

Status: proposed 2026-11-25. Sweep 4's answers: refusals in
`answer.test.ts`, `answerValidation/*`, `choiceinput.test.ts` and
`feedback.test.ts`, each settled here by following the current core's
components (`Answer.js`, `Award.js`, `ChoiceInput.js`, `Choice.js`,
`utils/checkEquality.js`) where no earlier ADR or user decision covers it.

## Context

An `<answer>` refused `type="boolean"`, `matchPartial`, `numAwardsCredited`
other than 1, `allowedErrorInNumbers` and its two companions, an `<award
extend>`, a `<label>` child, and `referencesAreResponses`. A
`<choiceInput>`'s `selectedValue` named nothing (a reference to it was the
missing value), and a `<choice>` had no `selected`. An award's and a
choice's credit were not held from 0 to 1, as the current core holds them.

## Decision

1. **Numbers within an error.** `allowedErrorInNumbers` (a literal number;
   anything else is refused), `allowedErrorIsAbsolute` and
   `includeErrorInNumberExponents` on an answer or an award (the award's
   first) are part of how values compare (`CompareOpts`, carried by
   `SymKind::Compare`, as `matchPartial` is): the engine's own
   `allowed_error_in_numbers`. Compared as written (`symbolicEquality`),
   each side's constants are floats first (`pi` is 3.14159...), as the
   current core's `checkEquality` normalizes.
2. **An award that extends another** (`<award extend="$aw" credit="0.8"/>`)
   compares what the award it names compares, an award in the same scope
   whose content is an expression (one with a `<when>` is refused), under
   its own attributes and then that award's (`AwardForm::based_on`). One
   with content of its own is refused.
3. **Several awards credited.** `numAwardsCredited="n"` (a literal) makes
   the credit the sum of the `n` greatest awards' (`Reduction::TopSum`),
   and a sum within `1e-12` of 1, or above it, is 1, the current core's
   `CREDIT_ROUNDOFF_TOLERANCE`.
4. **A boolean answer**: `type="boolean"`, or with no `type` a lone
   `<boolean>` child or awards each holding a lone `<boolean>`. Its input is
   a `<booleanInput>` child or one the answer makes
   (`Role::ImplicitBooleanInput`, outlined as a text answer's is, ADR
   0067); its content or each award's is a condition (`not $b`) or a
   `<boolean>`; credit holds when the submitted value equals it. Nothing
   submitted is the missing value, so it earns nothing.
5. **Credit is held from 0 to 1**: an award's `credit` and a choice's are a
   `Clamp` of what is given, so a request projects onto the bounds.
6. **`$ans` is the submitted response** (the answer's default prop is
   `submitted`), as the current core's `variableForImplicitProp`
   (`submittedResponses`); `$ans.creditAchieved` is the credit.
7. **A `<label>` child is the answer's**, and the input the answer makes
   shows it: the bridge's `label` of a component the compile made under an
   answer is the answer's. A `<label>` or `<shortDescription>` child is no
   content of the answer.
8. **`referencesAreResponses`** is accepted when every reference names an
   input the award's `<when>` reads, which is a response already (an input
   a when names stands for its submitted copy). Naming anything else (a
   point, an index into a group) is refused: its value would have to be
   recorded at submit.
9. **What a choice input says of its choice.** A `<choice>` is planned
   (`Plan`): `text` its children's text joined in the tick (ADR 0053),
   `selected` whether its input's `selectedChoice` is its place among the
   input's choices (`PlanCtx::place_among`, a dependency in the tree, ADR
   0050). A choice input has `selectedChoice` (the place among its choices
   of the one `choiceOrder` names at `selectedIndex`, 0 for none) and
   `selectedValue` (that choice's text, the empty text for none; alias
   `selectedValues`). A prop may say it holds a boolean (`{ boolean }`,
   `PropDef::boolean`), so `$c.selected` shows as `true` or `false`.

## Consequences

- `feedback.test.ts` reads a `<feedback>`'s `hidden` as none of its cases
  active; the adapter reads the tag the author wrote from the source, since
  `<feedback>` and `<conditionalContent>` are one type.
- A copy of a choice input whose choices are its referent's has no
  `selectedValue` of its own (missing).
- A text join shows a boolean as its number (`cat 1`, not `cat true`): a
  `JoinWith` has no booleans mask, as a `Join` has.

## Left

- A `<choice>` among an answer's children (the sugar that makes a
  `<choiceInput>`): outlining would make a choice input with no source of
  its own, whose record, order draw and plan have no precedent.
- `<choiceInput selectMultiple>`, `bindValueTo` and `preselectChoice`.
- `forAnswer` (most of its tests also need `colorInputsSeparately`),
  `splitSymbols` bound to a value (a parse in the tick), `<award>
  feedbackCodes` and `<choice feedbackText>`.
- Questions for the user: `selectedIndex` is 0 for none where the current
  core's is undefined (shown as nothing); and an answer's credit follows
  what it compares with after the submit, where the current core keeps the
  credit the submit earned.

## Migration

2026-11-26 (ADR 0088), from "Left": a `<choice>` among an answer's
children is the `<choiceInput>` outlining makes and the answer plans,
and, the user's answer to the first question, `selectedIndex` is the
missing value for none (`selectedChoice` stays 0). Credit stays derived
from what is compared after the submit (the user's answer to the
second).

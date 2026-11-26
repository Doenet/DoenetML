# An evaluation in math is its function's formula inlined, an answer's choices are the input it makes, and no choice chosen is missing

Status: proposed 2026-11-26. Three user decisions of sweep 4, each
settling something ADR 0075, ADR 0081 and ADR 0077 left: an evaluation
inside math (decision (d)), a `<choice>` written directly in an
`<answer>`, and a `<choiceInput>` with nothing chosen.

## Context

- **`<math>$$f(x) + 1</math>`**, and an `<evaluate>` inside math text
  (a `<math>`, a `<function>`'s formula, a point's coordinates), was
  refused (ADR 0075): the evaluation would have to be a leaf of the
  expression, which no planner makes. The current core evaluates it
  symbolically in the tick and puts its value in the expression.
- **`<answer><choice>..</choice>..</answer>`** was refused (ADR 0077,
  "Left"): the current core wraps the choices in a `<choiceInput>` the
  answer makes (`Answer.js`'s sugar, with the answer's `shuffleOrder`
  and `preserveLastChoice`), an element with no source of its own whose
  record, order draw and plan had no precedent here.
- **`selectedIndex` with nothing chosen** was 0 here (`ChoiceIndex`)
  where the current core's is undefined: no entry of an empty list of
  selected indices.

## Decision

1. **An evaluation in math text is inlined when compiled.** Tokenizing
   reads an `<evaluate>` (a function macro is one, ADR 0075) as a
   placeholder; resolving the text's references replaces it with its
   function's formula, the formula's tokens read where the function sits
   (its references planned from there, rebased through the reference
   that names the function), each variable replaced by the input in its
   place in parentheses, the whole in parentheses
   (`SourceReader::inline_evaluation`). The math is then the text it
   would be had the author written the substitution: its kind follows
   ADR 0043's static rule, and its text for the engine is spelled from
   the tokens (`SymText::Spelled`). Its inputs are the `input`
   attribute's entries split at top-level commas (a function macro's
   arguments), else, for a function of several variables, at top-level
   spaces (`input="x 0 1"`), one tuple spread over the variables. An
   evaluation in the function's formula, or in an input, is inlined in
   turn, at most 8 deep (a function that evaluates itself is refused).
2. **Only a plain formula is inlined.** The function is a `<function>`
   named by a path of names (no index, no prop), written with a formula
   and literal variables (`x` when none), with no `domain`, no
   interpolation (`through`, `minima`, `maxima`, `extrema`,
   `throughSlopes`), no `numInputs` or `numOutputs`, no `extend`, and
   symbolic (`symbolic` absent or literally true). Every reference its
   formula reads must be a number (the type pass's kind, ADR 0076): a
   math it read could hold the variable, which a substitution of tokens
   would miss, so a function of a function (`<function>$g</function>`)
   is refused. A name in the formula the engine would split into letters
   one of which is a variable (`ax` in `x`) is refused for the same
   reason. A free symbol of the formula stays free where it lands, so
   one the variables of a `<function>` it lands in name (`t + x`
   inlined in a function of `x`) is refused: the substitution would
   capture it, where the current core keeps the two apart. The function
   planner says what its formula binds (`PlanCtx::set_formula_binds`:
   its variables as written, else `x`, `y`, `z`; any name when a
   reference gives them). Anything else (a piecewise or interpolated function, a
   derivative, a formula only known in the tick, inputs that do not
   match the variables in number, an `<evaluate>` with other
   attributes) is refused where the evaluation is written, as before.
   An evaluation inside a condition stays refused (COMP-1, on hold), and
   so does one in math read with `format`, `splitSymbols` or
   `functionSymbols`.
3. **An answer's choices are the input it makes.** An `<answer>` whose
   content is `<choice>`s alone (beside its `<label>` and
   `<shortDescription>`) holds a `<choiceInput>` made when outlining
   (`Role::ImplicitChoiceInput`), the choices outlined as its children.
   Its record is the answer's node read as a choice input's
   (`parse_record`): the answer's `shuffleOrder` and
   `preserveLastChoice`, and its choices. The answer plans it with the
   choice input's own planner (`plan_implicit_choice_input`), its order
   draw keyed by its element like any other, and then plans itself as
   an answer with a `<choiceInput>` child. The variants count its
   shuffle, reading the answer's attributes. Choices beside other
   content stay refused, as the current core refuses them.
4. **No choice chosen is the missing value** (ADR 0046): `ChoiceIndex`
   gives `MISSING` for an index that names no choice, so `selectedIndex`
   is missing while nothing is chosen, and a request for 0, NaN, a
   fraction or an index out of range stores and shows missing.
   `selectedChoice` stays 0 for none (`NanTo`), so a choice's `selected`
   and `selectedValue` are as before.

## Considered options

- **The evaluation as a leaf** (a hidden `SubstituteFunction` port the
  math reads as a cell, simplified in the tick as the current core's
  is). Rejected by the user's decision: inlining keeps the math one
  expression of the compile, its kind static.
- **Substituting through the engine at compile time** (parse the formula,
  substitute, print): rejected, the engine's printed text is not what
  the compile's tokenizer reads, and the formula's references are its
  leaves either way.
- **A role-less implicit choice input planned by its own planner from an
  empty record.** Rejected: its record is the answer's attributes and
  children; the user decided the answer plans it, as it plans the
  implicit math input.

## Consequences

- An inlined evaluation is not simplified: `$$f(2) + 1` of `x^2` is
  `(2)^2 + 1` (value 5) and `$$fs($v)` of `t^2 + a` is `v`'s value
  squared plus `a` as written, where the current core simplifies the
  evaluation by its function's `simplify` (full by default) and shows
  `4 + 1`, `a + 4`. Values agree; texts of the evaluations differ.
- Math text anywhere inlines an evaluation, an attribute read as math
  included (`<point x="$$f(2)"/>`, which ADR 0075 refused as an element
  in an attribute); a condition does not.
- The bridge shows the answer's short description on the input it makes,
  as it shows its label (`inputShortDescription`).
- A function with a domain is refused inside math even where the inputs
  hold a free symbol (`<math>$$f(x)</math>`), where the current core
  ignores the domain; inside a `<function>` the domain would have to
  carry over, which inlining cannot.
- A function boxed while it is planned is still inlined from its
  source; one boxed while outlining is refused.
- `<choiceInput>` text of a missing `selectedIndex` is the blank `＿`
  (ADR 0046), where the current core shows nothing; the parity tests
  that show it (`Selected index: `) still differ there.
- The bridge needs no change: a missing index is no integer, so no
  choice shows selected, and a request for none still sends 0.

## Migration

Done 2026-11-26, all four. Tested by `tests/inlined_evaluations.rs`,
`tests/function_macros.rs`, `tests/answer_choices.rs`,
`tests/choice_input.rs`, `tests/variants.rs` and the parity files
`evaluate.test.ts`, `functionTag.test.ts`, `answer.test.ts` and
`choiceinput.test.ts`.

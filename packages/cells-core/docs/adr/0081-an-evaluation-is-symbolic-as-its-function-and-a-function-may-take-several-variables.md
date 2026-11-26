# An evaluation is symbolic as its function is, and a function may take several variables

Status: proposed 2026-11-25. Builds on ADR 0049 (a function is its
pieces), ADR 0043 (an operator is numeric or symbolic by its operands'
types, decided statically) and ADR 0075 (a function macro is an
`<evaluate>`). Sweep 4's gaps in `functionTag.test.ts` and
`evaluate.test.ts`.

## Context

An `<evaluate>` was numeric only: its input a number, the function's
pieces at it (`EvalFunction`). The current core's is symbolic by default
(`Evaluate.js`, `evaluateSymbolically`: the function's `symbolic`, true
unless written false, or `forceSymbolic`, unless `forceNumeric`): the
function's formula with its variables replaced by the inputs, normalized
by the function's `simplify` (full by default) and `expand`, the blank
where every input is a number and one is outside the domain, or where the
inputs do not match the variables in number (a lone vector is spread over
them). So `<evaluate function="$f" input="z"/>` was NaN here and `z^2`
there, `symbolic` was refused, and the parity adapter had no
`symbolicfs`.

A function of several variables, or one returning a tuple, had no formula
here (`expr` was no value), `numInputs`, `numOutputs`, `variable` and
`variables="$v"` were refused, `x_1` did not tokenize, and `<function/>`
was blank where the current core's is 0.

## Decision

1. **An evaluation's kind is decided statically, as an operator's is
   (ADR 0043).** A function declares `symbolicExpr`: its formula when it
   evaluates symbolically (its literal `symbolic`, true by default), else
   no value. An `<evaluate>` plans both evaluations and the new
   `Flow::HeldBy(by, math, numeric)` picks: an alias of `math` when the
   type pass types the own port `by` (an alias of the function's
   `symbolicExpr`) math, else of `numeric`. As an operator over math, an
   `<evaluate>` has `expr` (the expression when symbolic, else no value)
   and `value` (`Flow::ValueOf`: its number), both `expr_of: expr`.
   `forceSymbolic` and `forceNumeric` decide instead. `symbolic` is read
   as written; a reference is refused (the kind is static). An
   interpolated function, which has no formula, is numeric; an evaluation
   of a `<math>` is symbolic as the math is.
2. **The evaluation at inputs is one instruction,
   `SymKind::SubstituteFunction { k }`**: a mode (1 symbolic, 0
   numeric), what follows the substitution (`substitutePost`, from the
   function's `simplify`, on unless `none` or `false`, and `expand`), the
   domain, the formula, the variables (one math cell, `variablesExpr`: a
   symbol or a tuple of them) and the `k` inputs (math cells). It spreads
   one input with entries over the variables, is the blank where the
   inputs do not match them in number, and outside the domains where
   every input is a number (NaN numerically); several outputs are a
   vector. Its result is math either way. A numeric evaluation of a
   function of one variable and one output stays `EvalFunction` (a
   number); one of several variables or outputs is math
   (`multiExpr`: the formula then, a forced numeric evaluation's kind).
3. **A function may take several variables and give several outputs.**
   Its variables are list entries (`variables="q r"`,
   `variables="$v1 $v2"`, `variables="$list"`; `variable` an alias): a
   name as written, a reference the math it names, a name that is no
   variable warned of (`cells-bad-variable`) and the default used.
   `numInputs` is its literal `numInputs`, else as many as its variables,
   at least one; `numOutputs` its literal `numOutputs`, else its tuple's
   entries. The variables not written are the current core's defaults
   (`x`, `y`, `z`; `x_1` ... beyond three). Its domain is an interval per
   variable (`(-4, 2] [1, 3)`, `PlanCtx::intervals`), one math cell of
   four numbers per variable (`SymKind::Pack`, `domainsExpr`). The math
   tokenizer reads a subscript of letters and digits as part of a name
   (`x_1`), and the engine matches a variable by its flat name
   (`subscripts_to_strings`), as the current core does.
4. **An `<evaluate>`'s inputs are list entries** (`input="2 3"`,
   `$a $b`, a list a reference names), text split at its top-level
   commas too (a function macro writes `input="2, 3"`).
5. **A function of a function** (`<function>$f</function>`) takes that
   function's variable and domain unless it writes its own. A function
   with no formula is 0 (state, as the current core's essential
   formula). `$f.formula` names its `expr`.
6. **An interpolated function evaluates through its pieces**:
   `EvalFunction` reads a piece whose expression is an interpolated
   function's `pieces` value (ADR 0061) as those pieces, so an evaluation
   reads the function's `evalExpr` (its formula, or its pieces).
7. **Readers**: `Document::function_symbolic` and `function_numeric`
   (wasm), the evaluation at given inputs as an `<evaluate>` computes it,
   for the parity adapter's `symbolicfs`, `fs` and `numericalfs` of a
   function of several variables.

## Considered options

- **Decide symbolic or numeric per tick**, as the current core does.
  Rejected by ADR 0043: a math cell and a number cell are told apart by
  type, and the program's shape cannot depend on a value.
- **Read the function's record from the evaluate's planner** (its
  `symbolic`, its variables' count). Rejected by ADR 0029: a planner reads
  no other element's plan; the type of a port the function declares is
  what the type pass already propagates.
- **Settle a function of several variables as a type of its own** at
  outlining, so an evaluate knows the instruction to plan. Rejected: the
  one instruction over a variables cell and a domains cell covers one and
  several variables alike, and an extend that changes `numInputs` needs
  no resettling.

## Consequences

- An `<evaluate>` of a symbolic function plans both instructions; its
  input is a math cell read as a number through an `Evaluate`. The
  golden set has 6 more instructions, 3 of them live (`tests/live.rs`).
- An evaluation of a symbolic `<math>` (`symbolic.doenet`'s `$e`) is an
  expression; a point reading it reads its `value`.
- A function has nine more props, mostly constants.

## Not done

- An evaluation inside math (`$$f(x) + 1`, ADR 0075) stays refused, and
  so does a `<math>` or `<number>` child of a `<function>` (COMP-1, on
  hold).
- `symbolic`, `numInputs` and `numOutputs` given by a reference, and the
  current core's `simplify` levels other than full and none (`numbers`,
  `numbersPreserveOrder`, `normalizeOrder`, read as full).
- An `<evaluate>`'s own `simplify`, and its text rounded by its
  function's display settings (the current core's
  `additionalAttributeComponent`); its text is the engine's.
- A function of a function in another variable than the one it names
  evaluates in the named function's variable only when it writes none.
- The engine evaluates `1/0` as NaN where the current core gives a signed
  infinity (`evaluate at asymptotes`).

## Migration

Done 2026-11-25, all of the decision. Tested by `curve.spec.rs`,
`tests/math.rs`, `tests/live.rs`, and the parity files
`functionTag.test.ts` and `evaluate.test.ts`.

2026-11-26 (ADR 0088): an evaluation inside math is inlined at compile
time when its function is a plain formula (the first item of "Not done").

# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** the pinned `vendor/math-expressions` submodule revision — `siefkenj/math-expressions@doenet`

This is the ledger the seam refers to: where the Rust engine diverges from the shape
`packages/math/src/vendored/math-expressions.d.ts` describes, the divergence is recorded here rather
than hidden behind a widened type or a local patch in `packages/math/src/engine-rust.ts`.

## Open — three items

### Odd roots of a negative number

**`x^(1/n)` is evaluated on the principal complex branch while `nthroot`/`cbrt` and the
perfect-power fold read it on the real one — so the branch depends on whether the radicand happens
to be a perfect power, and grading tells the same number apart from itself.** Re-measured at the
tenth review pass against pin `1f543c5`, and against `math-expressions@2.0.0-alpha93` from npm for
the legacy column:

| `equals(a, b)` | legacy 2.x | Rust engine |
| --- | --- | --- |
| `(-8)^(1/3)` = `-2` | true | true |
| `cbrt(-8)` = `-2` | true | true |
| `(-2)^(1/3)` = `cbrt(-2)` | **true** | **false** |
| `(-2)^(1/5)` = `nthroot(-2,5)` | **true** | **false** |
| `(-8)^(1/3)` = `(-2)^(1/3)·4^(1/3)` | **true** | **false** |
| `cbrt(-2)` = `-cbrt(2)` | **false** | **true** |

Numerically, on this engine:

```
(-8)^(1/3)  -> -2                  (-2)^(1/3) -> 0.6300 + 1.0911i
(-27)^(1/3) -> -3                  (-8)^(1/5) -> 1.2262 + 0.8909i
(-32)^(1/5) -> -2
```

**This is a regression from legacy, not a symmetric convention difference**, and the earlier
description of it as "both engines inconsistent in mirror images" understated it in one direction
and overstated the symmetry. Driven end to end through `<answer>` on both trees — `origin/main` at
the merge base with `math-expressions@2.0.0-alpha93`, against this branch — four cases that scored
**1** on legacy now score **0**:

| expected | typed | legacy | here |
| --- | --- | ---: | ---: |
| `cbrt(-2)` | `(-2)^{1/3}` | 1 | **0** |
| `(-2)^(1/3)` | `\sqrt[3]{-2}` | 1 | **0** |
| `nthroot(-2,3)` | `(-2)^{1/3}` | 1 | **0** |
| `(-2)^(1/3)` | `-1.2599210498948732` | 1 | **0** |

Two cases *improve* and must not be given back: `cbrt(-2) = -cbrt(2)` and
`cbrt(-2) = -1.2599210498948732` are both **true** here and were **false** on legacy. Legacy was
non-transitive — `(-2)^(1/3) = cbrt(-2)` and `(-2)^(1/3) = -1.2599…` were both true while
`cbrt(-2) = -1.2599…` was false — because its *simplifier* read `cbrt` on the real branch and its
*numeric evaluator* read it on the principal one. This engine fixed `cbrt` and left `^` split, so
the inconsistency moved rather than closing.

`(-8)^(1/3)` itself is *not* affected: it folds to the exact `-2` on both engines. That is what
makes this easy to spot-check wrongly — the perfect-power case, which is the one anybody tries
first, is the one that works.

Closing it means reading `Pow(negative real, 1/odd)` on the **real** branch, which is what the
perfect-power fold, `cbrt`, `nthroot` and `simplify`'s radical cluster already do. That restores
the four regressed cases and keeps the two improvements. The alternative — making the perfect-power
fold complex-principal instead — would break `(-8)^(1/3) = -2`, which both engines grade 1 and
which authors rely on, so it is not a real option. It is recorded here rather than fixed in a
review pass because it moves a branch every numeric path shares (plotting, `f()`, extrema, the
`equals` sampler) and has mathjs-parity consequences that want a maintainer's decision, not a
reviewer's.

### The recipe, so the follow-up does not start from scratch

An exploratory attempt was made during the tenth review pass and is **not** in either PR. It was
**never run against `cargo test --workspace`, the JS compat suite, or DoenetML**, so nothing below
is a validated change — but it flipped every target row the right way in direct crate probes, and
it found one thing that would otherwise cost the follow-up a day. Three sites, in order of how
surprising they are:

1. **`src/normalize/simplify.rs`, `rule_radical`'s `Expr::Pow` arm — the load-bearing one.**
   Pull the sign out at simplify time: `(-2)^(1/3) → -2^(1/3)`, beside the `fold_numeric_radical`
   that already handles the perfect-power case. **Fixing the evaluator alone does not work**, which
   is the finding: `evaluate_to_constant` runs `simplify_core` and then tries `certified_constant`
   *before* it ever reaches `eval_complex`, so the certified-digits tape keeps answering
   `(-2)^(1/3)` on the principal branch no matter what the evaluator does. Teaching the tape would
   mean a new `Op` threaded through `tape.rs`'s arity, four `pipeline.rs` sites, `float_bounds.rs`
   (real and complex) and `quad.rs`. Pulling the sign out first makes the base positive, and the
   tape then needs no change at all. It is also where the rewrite belongs: `simplify_root` already
   does exactly this pull for the `cbrt`/`nthroot` spellings, and the cluster's own header comment
   already claims `(-8)^(1/3) → -2` as the real branch — it just never fired when the radicand was
   not a perfect power.
2. **`src/eval_numeric/complex.rs`, `eval_complex_inner`'s `Expr::Pow` arm.** A real-branch case
   between the integer-exponent branch and the `powc` fallback, gated on `base.im == 0.0 &&
   base.re < 0.0` with an `Expr::Num(Number::Rat(p, q, _))` exponent whose `q` is odd; the result is
   `±(-base.re).powf(p/q)`, signed by the parity of `p`. `Number::Rat`'s lowest-terms invariant is
   what makes "odd `q`" a property of the *value*, so `(-8)^(2/6)` lands with `(-8)^(1/3)` while
   `(-8)^0.3333` — which is `3333/10000` — correctly does not.
3. **`src/special_functions/powers.rs`, `CBRT::eval1` and `NTHROOT::eval2`.** These are `powf`/
   `powc`, i.e. principal, and this ledger used to leave it there. The refinement: they are
   principal *in code* but masked by `simplify_root` for constant arguments, which is why
   `cbrt(-2)` measures `-1.2599…` end to end. They still decide *sampling* — `equals` on a
   non-constant argument, where `x` takes negative sample values — so leaving them principal while
   `x^(1/n)` went real would reopen the same split one level down.

`Facts::of_constant` and the real-base branch stay untouched, and a complex base still routes
through `powi`, so the `i`, `i^3`, `(1+i)^2`, `2i`, `i·10^(-300)`, `1 + i·10^(-300)` not-real pins
are unaffected by construction. Rows that must *not* move, and did not in the probe: `sqrt(-4)` and
`(-4)^(1/2)` stay `2i`; `nthroot(-8,4)` stays principal; `(-8)^0.3333` stays
`1.0001 + 1.7318i`; `(-8)^(2/3)` stays `4`; and `x^(1/3) = cbrt(x)`, `x^(1/3) = nthroot(x,3)`,
`x^(1/2) = sqrt(x)` stay true.

The same split has a second symptom on the public assumptions API: `is_real(cbrt(-8))` and
`is_real((-8)^(1/3))` both answer `false`, and `is_real(2 + cbrt(-8))` answers `false` although the
engine's own `simplify` folds that expression to `0`. `Facts::of_constant` classifies by
`eval_complex`, which is the principal branch. **This one is incompleteness, not a wrong answer, and
that is now checked rather than assumed.** DoenetML calls none of these predicates directly —
grepping `is_real|is_positive|is_negative|is_nonzero|is_integer` across `packages/*/src` returns no
hit outside `packages/math/src/generated/` and the vendored `.d.ts`. Inside the crate, every
realness consumer outside `src/assumptions/` was checked for polarity: the five `is_real` sites in
`normalize/simplify.rs`, the `is_nonnegative`/`is_nonpositive` pair beside them, the three in
`grade/linear.rs`, and the ones in `matrix/elimination.rs`, `matrix/linalg.rs` and
`equality/discrete_infinite.rs`. All but one require `Some(true)` and so merely decline; the one
that keys on `Some(false)` — the odd-root sign extraction at `normalize/simplify.rs:1502` — uses it
to *decline* the rewrite, which is sound on either branch. In practice the cost is near zero
because normalization runs first: `simplify(cbrt(-2))` is `-cbrt(2)`, and `is_real(-cbrt(2))` is
**true**, so the stale answer belongs to a spelling the simplifier has already replaced.

### The two earlier items

**`substitute_component` accepts a receiver that is not a container, and answers.** Legacy validated
the head at each level of the path and the index range, throwing `expected list, tuple, vector, or
array` / `component out of range`. The compat method validates nothing: `me.fromText("x*y")
.substitute_component(0, 5)` returns `5·y` where legacy threw, and an out-of-range index returns
`undefined` — breaking the "every method hands back an `Expression`" contract the rest of the port
keeps, so the caller fails one line later with `Cannot read properties of undefined`. `Math.js`'s
`substituteMathIntoExpression` walks a path built from the expression's own structure, so it should
not hit either case, but it has no guard of its own. `get_component` has the same shape: its
container check runs on the receiver only, and the rest of the path is delegated to a wasm entry
point that indexes the operands of *any* operator — `me.fromText("(x*y, 3)").get_component([0,0])`
answers `x` where legacy threw. (`@doenet/math`'s `getComponent` restores the legacy contract for
the one DoenetML call site that used the throw as a type test; nothing covers the nested path.)

**The vendored type surface is wider than the engine.** 48 of the 114 members
`packages/math/src/vendored/math-expressions.d.ts` declares on `Expression` are `undefined` at
runtime on the Rust engine: the elementwise numeric methods (`abs`, `exp`, `log`, `log10`, `sqrt`,
`sign`, `re`/`im`/`conj`, `factorial`, `gamma`, `erf`, and the whole trig/hyperbolic family
including `atan2`), the matrix/vector helpers (`perform_matrix_multiplications`,
`perform_vector_scalar_multiplications`, …), and a handful of one-offs (`clean`,
`common_denominator`, `substitute_abs`, `log_subscript_to_two_arg_log`,
`normalize_angle_linesegment_arg_order`, `equalsViaFiniteField`, `toGuppy`, `operators`).

Nothing in DoenetML calls any of them today — re-verified by grepping every one of the 48 across
`packages/*/src` and `packages/*/test`, whose only hits are `Math.atan2` and commented-out code — so
nothing is broken. But TypeScript accepts `expr.sin()` and it fails at runtime.

That second sentence has only just become true, and for a reason worth recording. Until this pass
the declarations reached no consumer at all: `vite-plugin-dts` generates a `.d.ts` per `.ts` source
but does not copy hand-written ones, so `packages/math/dist/types.d.ts` shipped a
`from "./vendored/math-expressions"` that resolved to nothing, `skipLibCheck` swallowed the
`TS2307`, and every `import me from "math-expressions"` was typed `any`. TypeScript accepted
`expr.sin()` because it accepted *everything*. `copyDtsFiles` fixes that, which is what puts the
width of this surface back in play. Reproduce with:

```bash
npm run build -w packages/math
node --input-type=module -e '
import me from "./packages/math/dist/index.js";
console.log(me.fromText("x+1").sin);   // undefined
'
```

Either port them, or narrow the vendored declarations to what the engine implements. Narrowing is
the safer half and does not need upstream — but it should be one edit, made deliberately, rather
than a member quietly disappearing each time the snapshot is refreshed.

## Closed

Every other *behavioral* request previously filed here has landed upstream. Re-verified against the
current pin by probing the built package directly:

```bash
npm run build -w packages/math
node --input-type=module -e '
import me from "./packages/math/dist/index.js";
console.log(me.fromText("0/0").simplify().tree);            // NaN, not 0
console.log(me.fromText("floor(55.33)").simplify().tree);   // 55
console.log(me.fromText("abs(-3)").simplify().tree);        // 3
console.log(me.fromText("log_2(2^3)").simplify().tree);     // 3
console.log(me.fromText("1+x+2").evaluate_numbers({skip_ordering: true}).tree);
console.log(me.fromAst(me.fromText("3")).tree);             // 3 — Expression accepted
console.log(me.simplify(me.fromText("x+x")).tree);          // context-level family
console.log(typeof me.fromAst(Infinity).tree);              // "number", not a {"$":…} tag
console.log(me.fromAst(5.252e-13).toString());              // scientific notation is used
'
```

Concretely, all of the following once had entries here and no longer reproduce:

| Was | Now |
| --- | --- |
| `simplify()` folded no numeric-function applications | folds them |
| `0/0` simplified to `0` | `NaN` |
| `evaluate_numbers({skip_ordering: true})` threw | returns `["+", 1, "x", 2]`, order preserved |
| `log_b(b^n)` was not simplified | `log_2(2^3)` → `3` |
| `fromAst` rejected an `Expression` where a tree was expected | unwrapped by `astReplacer`, recursively |
| no context-level operation family (`me.simplify(expr)`) | present |
| `.tree` handed back `{"$":"Inf"}` / `{"$":"NaN"}` | untagged to JS `Infinity` / `NaN` |
| the Rust printer never used scientific notation | uses it |
| `default_order` was a compat-layer no-op | backed by `normalize::default_order` |
| `substitute` replaced bindings left-to-right, so one could capture the next | simultaneous, as legacy was |
| `variables(true)` ignored its argument, reporting `x_1` as `x` | reports the subscripted name |
| `f()` threw `Invalid ast` on any tree holding `±Infinity`/`NaN` | compiles and evaluates them |

## Not upstream's — ours to decide

These are behavioral differences, not defects, and the decision belongs to DoenetML:

- **Sparse arrays reaching `fromAst`** — *settled, not open.* `Point.js`, `Ray.js`, `Vector.js` and
  `DirectionComponent.js` build a vector AST component-by-component and leave holes in it;
  `JSON.stringify` turns those into `null`, which the engine correctly rejects with `unexpected
  value null`. A hole means "no desired value for this component", and rather than ask the engine to
  guess, DoenetML now says so explicitly: `markUnspecifiedComponents` writes the
  `UNSPECIFIED_COMPONENT` marker into the empty slots, and `preprocessMathInverseDefinition` and
  `EssentialValueWriter` read it back. See `packages/doenetml-worker-javascript/src/utils/math.ts`.
- **`evaluate_to_constant` answers `null`, not `NaN`, for an expression it cannot evaluate.** Legacy
  answered `NaN` unless asked for `null` with `{nan_for_non_numeric: false}`; the compat layer
  always behaves as `false`, and does not read the option. Keeping the two apart is worth having —
  `NaN` is a value an expression can genuinely evaluate *to* (`0/0`), and DoenetML's undefined-slope
  grading depends on the difference — but `null` is the more dangerous one to leak into arithmetic,
  because it coerces to `0` rather than propagating. DoenetML tests for it at every boundary through
  `isNumericConstant`/`evaluateToNumber` (`src/utils/math.ts`); a new call site that forgets will
  fail silently, not loudly.
- **Text output no longer pads container delimiters** — `(0, 0)` where the legacy printer wrote
  `( 0, 0 )`. `toLatex` is unchanged (`\left( 1, 2 \right)` keeps its spacing); only the text
  renderer moved. Test expectations were updated to match.
*(An "ODE float-precision assertions" entry stood here — tests comparing two independent
integrations with an exact `.eq()` were said to differ in the last couple of bits. It no longer
reproduces and is retired rather than restated: `src/test/dynamicalsystem/` is 5 files / 16 tests,
all passing at the current pin, and the only change this diff makes to that directory is container
delimiters in `cobwebpolyline.test.ts`. No assertion was loosened to get there.)*

## Adding an entry

Reproduce it from `import me from "math-expressions"` alone, note the submodule revision you
checked against, and say what the legacy library did. An entry that cannot be reproduced without
DoenetML's own code is a DoenetML bug, not an upstream request.

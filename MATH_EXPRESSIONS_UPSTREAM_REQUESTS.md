# math-expressions: what DoenetML needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** `siefkenj/math-expressions@doenet`, `cdc5343`
**Date:** 2026-08-03

DoenetML has switched permanently to the Rust engine. There is no JavaScript engine to fall back to,
so everything below is on the path to shipping.

Every engine claim in this document was verified by calling the built package directly, not inferred
from test output. Where we could not reproduce a failure at the library boundary we say so and keep
it on our side of the line — see [§9](#9-what-is-ours-not-a-request).

## Current state

`packages/doenetml-worker-javascript` is the suite that exercises the engine hardest:

**448 failures out of 3,435 tests executed — 87.0% passing.**

The suite runs in four tag groups because it exhausts the heap in a single process. That is a
DoenetML memory problem, not an engine difference.

Failures by signature, for scale:

| Count | Signature |
| ---: | --- |
| 63 | coordinate/array mismatch (`vector` 21, `ray` 9, then `point`, `subsetofreals`, `circle`, …) |
| 22 | `evaluate_numbers({skip_ordering:true})` throws |
| 16 | `matchesPattern` over-matching |
| 11 | tagged `{"$":"Inf"}` / `{"$":"NaN"}` reaching `.tree` consumers |
| 9 | `avoidScientificNotation` |
| 9 | sparse arrays rejected by `fromAst` |

---

## 1. A throw across the WASM boundary aborts the Rust core

**Severity: highest. This is a crash, not a wrong answer.**

Two of `doenetml-worker-rust`'s browser tests die with a bare WASM trap:

```
Test simplify_math failed with message: unreachable
Test arithmetic_on_math failed with message: unreachable
```

`simplify_math` is explained. It exercises `MathSimplify::NumbersPreserveOrder`, which our Rust core
bridges to JavaScript as:

```js
mode === "numberspreserveorder"
    ? expr.evaluate_numbers({ skip_ordering: true })   // ← throws
    : …
```

That call throws by design (see §6). The exception unwinds into Rust, which is built
`panic = "abort"`, and the trap takes the whole core with it. In production that is a student losing
their session mid-problem.

So the `skip_ordering` throw is not only a missing feature we could route around — **it is reachable
as a crash.**

`arithmetic_on_math` traps too and we have **not** diagnosed it. It uses `NormalizeParams::default()`,
which the same test asserts is equivalent to `MathSimplify::Full`, so `skip_ordering` is not
involved. Reported here because the failure mode is identical and the two are worth investigating
together.

Independent of the specific cause: while `panic = "abort"` stands, any reachable `throw` in the
compat layer is a crash for us. Either a `Result`-shaped return, or simply not throwing for a mode we
are documented to support, would fix this one.

---

## 2. `fromAst` must unwrap an `Expression`

**The highest-value item you could hand back, and it is three lines.**

```js
const e = me.fromText("3");
me.fromAst(e).tree                      // legacy: 3        current: throws
```

Compat serializes the `Expression` as-is, so it reaches Rust as a bare JSON object with no `$` key
and `try_from_js` rejects it.

**The error message is actively misleading.** It reads `unknown special None`, but that `None` is the
`Option<&str>` from `value.get("$").and_then(Value::as_str)` — not the `{"$":"None"}` special, which
works correctly. We spent real time chasing the wrong feature. A message that distinguishes "no `$`
key" from "unrecognized `$` value" would have saved it.

This is not test hygiene on our side. `PiecewiseFunction.js`, `StateVariableEvaluator.ts` and
`Dependency.ts` all depend on the behaviour: a math-valued state variable *holds* an `Expression`,
and code that re-wraps one hands it straight back to `fromAst`. With ~675 call sites we cannot find
them all by inspection.

`astReplacer` already visits every node on the way through `JSON.stringify`, so unwrapping there is
free:

```js
function astReplacer(_key, value) {
  if (value instanceof Expression) return value.tree;   // ← add
  if (typeof value === "number" && !Number.isFinite(value)) { … }
  return value;
}
```

We have the equivalent in our seam, but ours costs a second full traversal because we cannot hook
yours. Nesting matters: an `Expression` can also sit *inside* a tree under construction
(`["+", someExpr, 2]`).

---

## 3. `simplify()` folds no numeric-function applications

```js
me.fromText("floor(55.33)").simplify().tree   // → ["apply","floor",55.33]   legacy: 55
me.fromText("log10(10^3)").simplify().tree    // → ["apply","log10",1000]    legacy: 3
```

The same holds for `ceil`, `abs`, `sum`, `prod`, `mean`, `variance`, `std`, `count`, `max`, `median`,
`min` and `log`.

`evaluate_to_constant()` handles `floor`/`ceil`/`abs`/`log` correctly — so the capability is present,
it is simply not reached from `simplify`. The aggregates (`sum`/`mean`/`std`/…) return `null` from
`evaluate_to_constant` as well, so those need the evaluation itself.

This surfaces directly to students: `<math simplify>sum(3,17,5-4)</math>` renders the unevaluated
application instead of `21`.

---

## 4. `0/0` simplifies to `0`; it must be `NaN`

```js
me.fromText("0/0").simplify().tree   // → 0             legacy: NaN
me.fromText("1/0").simplify().tree   // → {"$":"Inf"}   ✓ correct
```

`evaluate_to_constant` inherits it.

This is how DoenetML computes an undefined slope, so a degenerate line reports slope `0` — a wrong
number rather than a visible failure, which is the worst possible shape for a grading path. The
`has_undefined_leaf` guard handles the *blank* case (`0*＿`, `(＿-＿)/(＿-＿)`) correctly; this is the
same class reached through arithmetic rather than through a hole.

---

## 5. `evaluate_numbers` combines like symbolic terms

```js
me.fromText("x^2+3x^2").evaluate_numbers().tree   // → ["*",4,["^","x",2]]
me.fromText("1x+4x").evaluate_numbers().tree      // → ["*",5,"x"]
```

Folding `x² + 3x²` into `4x²` is a correct simplification, but it is not a *numeric* one, and it
erases a distinction DoenetML exposes as a documented public attribute. `simplify="numbers"` is
specified as "fold numeric constants, leave the symbolic structure alone". With this behaviour it has
become indistinguishable from `simplify="full"`.

Our suite pins the difference directly: one test asserts that under `simplify="numbers"` the response
`sin(2π+5x+π+6)` should *not* match a target written `sin(2π+1x+4x+π+6)`, while the very next test
asserts that under full simplification it *should*. Both now return the same answer.

Related to §6 but distinct — that one is an unimplemented mode, this one is an implemented mode doing
too much.

---

## 6. `evaluate_numbers({skip_ordering:true})` is unimplemented — 22 failures

```
Error: math-expressions-js-compat: evaluate_numbers({skip_ordering:true}) is not implemented
       — the core pass always orders; only the ordering form is available
```

This backs DoenetML's `simplify="numberspreserveorder"`, a documented public attribute.

Throwing beats silently reordering — `1+x+2` coming back as `x+3` would be worse — but we need the
feature: combine adjacent numeric terms without applying the canonical `cmp`. Concentrated in
`parabola.test.ts` (13) and `symbolicEquality.test.ts` (3).

**See §1**: this throw is also a hard crash when reached from the Rust core.

---

## 7. Symbolic simplify misses log, combinatoric and inverse-trig identities

```js
me.fromText("sin^(-1)(1)").simplify().tree   // → ["apply","asin",1]
```

```
sin^(-1)(1) = pi/2      cos^(-1)(1) = 0      tan^(-1)(1) = pi/4
log10(10^3) = 3         log_2(2^3) = 3       log_7(7^3) = 3
log_b(a) = log(a)/log(b)
nCr(5,3) = 10           nPr(5,3) = 60        binom(5,3) = 10
```

Each of these passes numerically; only the `simplifyOnCompare` path fails.

Worth saying that your **parse is better here**: legacy read `sin^(-1)(1)` as `(1/sin)(1)` —
reciprocal, not inverse. We would rather keep your reading and have simplify evaluate it.

---

## 8. Two smaller asks

**`setWasmModule` has an ordering trap.** The `Context` object literal contains
`_assumptionsHandle: new wasm.Assumptions()`, which touches the WASM *while the barrel's module body
is evaluating*. Any consumer that imports `setWasmModule` from the package root therefore forces that
body to run first, and the injection can never win — it silently falls through to the node loader. We
import from `lib/_wasm` instead, which works but reaches past your public surface. Making the handle
lazy would make the documented usage actually usable.

**`panic = "abort"` and WASM32 stack safety.** Beyond §1: deep expressions can overflow the ~1 MB
shadow stack, including on `Drop`, and student input is adversarial by construction.
`STACK_SAFETY_PLAN` items 21 and 23–26 are open. The `Number::parse` fallback in `decimal.rs` is
exactly the right shape — it needs to be the rule rather than the exception.

---

## 9. What is ours, not a request

Listed so it is not mistaken for a complaint. In several of these we were ready to file against you
until a direct probe said otherwise.

**Blank comparisons scoring full credit.** Three tests fail because an *empty* answer scores 1 — the
awards are shaped like `$mi1 < 1 and $mi2 < 1`, and with blank input they evaluate true. The engine
is not at fault:

```js
me.fromText("＿<1").evaluate_to_constant()    // → null            ✓
me.fromText("＿<1").simplify().tree           // → ["<","＿",1]    ✓ left symbolic
me.fromText("abs(＿)<1").simplify().tree      // → ["<",["apply","abs","＿"],1]  ✓
me.fromText("＿-1").evaluate_to_constant()    // → null            ✓
```

Every probe we can construct at the library boundary behaves correctly. The wrong answer is produced
in DoenetML's `booleanLogic.js` / `checkEquality.js` path.

**Numeric equality losing discrimination.** Two tests now say `e^(10x)` equals `e^(10x)+0.0000001`.
Also not reproducible at the boundary: `a.equals(c)` returns `false` at default tolerance and at
`relative_tolerance` of both `1e-12` and `1e-6`. Whatever makes these compare equal is in our
comparison plumbing.

**`matchesPattern` over-matching — 16 failures.** Blanks are matched literally where the test expects
no match. We have not probed the pattern API directly and are not filing it against you until we do.

**Coordinate/array mismatches — 63 failures.** Head/tail/displacement updates returning the wrong
pair (`[-9, 8]` where `[-12, -1]` is expected), concentrated in `vector.test.ts` (21) and
`ray.test.ts` (9). An inverse-direction problem in our update logic is as likely as an engine one.
This is the largest single cluster remaining and it is unattributed — help welcome, but not yet a
request.

**Sparse arrays reaching `fromAst` — 9 failures.** `Point.js` builds `Array(n+1)` and fills only the
components being set; `JSON.stringify` turns the holes into `null`, which you correctly reject with
`unexpected value null`.

**Tagged values reaching users — 11 failures.** `.tree` returns `{"$":"Inf"}` / `{"$":"NaN"}` where
legacy gave JS `Infinity` / `NaN`. We accept the symmetry argument; our `.tree` consumers do
`typeof x === "number"` and that is ours to fix.

**Float-precision assertions.** Our ODE tests compare two independent integrations with exact `.eq()`
and now differ by 2 ULP.

---

## 10. Where the engine is better

We updated our expectations to match:

- **The Pythagorean identity under full simplification.** A response of `(2x-3)(4-x) + 1` now matches
  a target of `(2x-3)(4-x) + sin(x)^2+cos(x)^2`.
- **Factor cancellation in vector expressions.** `vec(x)*vec(x)vec(y)/(vec(x)*vec(x))` now compares
  equal to `vec(y)` under `simplifyOnCompare`. Our test table had carried the note
  `// with improved simplification, these should compare as true` since before the migration.
- **Exact-constant equality**, and **the more aggressive `simplify`** generally.
- **Printer spacing.** Legacy padded inside delimiters, the Rust printer does not: `( 0, 0 )` →
  `(0, 0)`. Yours is the better output.

---

## 11. Open questions, not defects

**Scientific notation — 9 failures** named `avoidScientificNotation` outright, plus an unseparated
share of the number-formatting failures in `math.test.ts` and `mathinput.test.ts`. The Rust printer
never uses scientific notation; legacy switched at a magnitude threshold:

```
5.252*10^(-13)  →  legacy "5.252 * 10^(-13)"   current "0.0000000000005252"
2*10^21         →  legacy "2 * 10^21"          current "2000000000000000000000"
```

DoenetML has an `avoidScientificNotation` attribute, which presumes scientific *is* the default, so
we cannot simply absorb this. Would you take a notation threshold as a render option, or should we
implement it in our display layer?

**Terminating rationals.** `5/2` renders `2.5` while `1/3` correctly stays `\frac{1}{3}`. We accept
this as ours — with one caveat: if the structural criteria (`ReducedFraction`, `ExactValue`, …) are
meant to be usable *after* `simplify`, this stops being a display question. Worth settling before F1
ships.

**Handle lifetime.** `free()` / `dispose()` work and we use them; `interner_size()` gives us the
gauge we needed. We still owe you growth-rate numbers from a long session — not yet measured.

---

## Notes for anyone else migrating

Two things cost us a debugging cycle each and are not obvious:

- **Do not run a whitespace sweep over test files.** The text printer dropped its delimiter padding,
  but `toLatex` did not: `me.fromText("(1,2)").toString()` is `"(1, 2)"` while
  `me.fromText("(1,2)").toLatex()` is `"\left( 1, 2 \right)"`, padding intact. A naive sweep corrupts
  every LaTeX assertion you have.
- **The delimiter set includes `⟨ ⟩`.** Angle-bracket vector notation unpads exactly like `( )`,
  `[ ]` and `{ }`. We missed it.

---

## Reproducing

```bash
git submodule update --init --recursive          # vendor/math-expressions @ cdc5343
npm run build -w packages/math
cd packages/doenetml-worker-javascript
npx vitest run -t '@group1'                      # and @group2, @group3
npx vitest run -t '^(?!.*@(?:group1|group2|group3))'   # group4
```

Every engine-level claim in §3–§7 and §9 is reproducible in isolation, without DoenetML:

```js
import me from "math-expressions";
console.log(me.fromText("0/0").simplify().tree);
```

That is the form we would want in a bug report, and it is the form that moved four items out of the
request list and into §9.

**The two most useful things you can send back are §1 and §2** — a crash, and three lines in
`astReplacer`.

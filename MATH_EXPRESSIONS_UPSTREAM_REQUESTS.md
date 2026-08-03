# math-expressions: exactly what DoenetML needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** `siefkenj/math-expressions@doenet`, `cdc5343`
**Date:** 2026-08-01
**Supersedes:** the 2026-07-31 revision written against `8ccd98d`

**DoenetML has switched permanently to the Rust engine.** The branch no longer builds the JavaScript
library by default; `DOENET_MATH_ENGINE=js` survives only as a differential-debugging tool. This
document is the list of things still standing between us and a clean suite.

## First: `cdc5343` was a big step

Measured on DoenetML's full worker test suite, one variable changed at a time:

| Pin | Failures | Pass rate |
| --- | ---: | ---: |
| `8ccd98d` (previous) | 969 | 70.9% |
| `cdc5343`, no other change | 577 | 82.2% |
| + our test-expectation update (spacing) | 535 | 84.3% |
| + our `fromAst` unwrap (§1 below) | **465** | **85.5%** |

Everything we asked for in the previous revision landed and works. Verified by **deleting our local
patches** and re-running: `perform_vector_matrix_additions_scalar_multiplications` (which alone was
44.5% of the old failures), the `astReplacer` for `NaN`/`±Infinity`, `{"$":"None"}` round-tripping,
render options on `toText`/`toLatex`, `free()`/`dispose()`, `interner_size()`, the `setWasmModule`
injection point, and `dopri`. The `evaluate_to_constant` hole guard fixed the undefined-slope case
we could not diagnose last time.

Two notes on things we adopted rather than requested:

- **`evaluate_numbers({skip_ordering:true})` now throws** instead of silently reordering. That is
  the right call — but see §4; we need the feature, not just the honest failure.
- **`setWasmModule` has an ordering trap.** The `Context` object literal contains
  `_assumptionsHandle: new wasm.Assumptions()`, which touches the WASM *while the barrel's module
  body evaluates*. So any consumer that imports `setWasmModule` from the package root forces that
  body to run first, and the injection can never win — it silently falls through to the node
  loader. We import from `lib/_wasm` instead, which works but reaches past your public surface.
  Making the handle lazy would make the documented usage actually usable.

---

## 1. `fromAst` must unwrap an `Expression` — 95 hard errors

**The single highest-impact item, and cheap for you.** Legacy accepted an `Expression` anywhere a
tree was expected and unwrapped it:

```js
const e = me.fromText("3");
me.fromAst(e).tree           // legacy: 3        compat: throws
me.fromAst(e).evaluate_to_constant()  // legacy: 3
```

Compat serializes the object as-is, so the `Expression` arrives at Rust as a bare JSON object with
no `$` key and `try_from_js` rejects it.

**The error message is actively misleading.** It reads `unknown special None` — but that `None` is
the `Option<&str>` from `value.get("$").and_then(Value::as_str)`, *not* the `{"$":"None"}` special
you just added. `{"$":"None"}` works correctly. We spent real time chasing the wrong feature; a
message that distinguishes "no `$` key" from "unrecognized `$` value" would have saved it.

**This is not a DoenetML test-hygiene problem.** We assumed it was, and checked: our *source*
depends on it in `PiecewiseFunction.js`, `StateVariableEvaluator.ts` and `Dependency.ts`. A
math-valued state variable *holds* an `Expression`, and code that re-wraps one hands it straight
back to `fromAst`. With ~675 `fromAst` call sites we are not confident we could find them all by
inspection.

**Where it belongs.** `astReplacer` already visits every node on the way through `JSON.stringify`,
so unwrapping there is free:

```js
function astReplacer(_key, value) {
  if (value instanceof Expression) return value.tree;   // ← add
  if (typeof value === "number" && !Number.isFinite(value)) { … }
  return value;
}
```

We have implemented the equivalent in our seam, but ours costs a second full traversal because we
cannot hook yours. Nesting matters: an `Expression` can also sit *inside* a tree under
construction (`["+", someExpr, 2]`).

---

## 2. `simplify()` folds no numeric-function applications — ~109 failures

Legacy evaluated an application of a numeric function to constant arguments; Rust leaves the node
symbolic. Confirmed through DoenetML's own parser configuration:

| input | legacy `simplify()` | Rust `simplify()` |
| --- | --- | --- |
| `floor(55.33)` | `55` | `["apply","floor",55.33]` |
| `ceil(2.1)` | `3` | `["apply","ceil",2.1]` |
| `abs(-3)` | `3` | `["apply","abs",-3]` |
| `sum(3,17,5-4)` | `21` | `["apply","sum",["tuple",3,17,1]]` |
| `prod(2,3,4)` | `51`¹ | `["apply","prod",…]` |
| `mean(1,2,3)` | `7`¹ | `["apply","mean",…]` |
| `variance(1,2,3)` | `76`¹ | `["apply","variance",…]` |
| `std(1,2,3)` | `12`¹ | `["apply","std",…]` |
| `count(1,2,3)` | `3` | `["apply","count",…]` |
| `max(1,17,3)` | `17` | `["apply","max",…]` |
| `median`, `min`, `log` | folded | not folded |

¹ values as asserted by our suite against the specific inputs in `mathoperators.test.ts`.

Note `evaluate_to_constant()` handles `floor`/`ceil`/`abs`/`log` **identically on both engines** — so
the capability is present, it is simply not reached from `simplify`. The aggregates
(`sum`/`mean`/`std`/…) return `null` from `evaluate_to_constant` on both engines, so those need the
evaluation itself.

This surfaces directly to students: `<math simplify>sum(3,17,5-4)</math>` renders the unevaluated
application instead of `21`.

---

## 3. `0/0` simplifies to `0`; it must be `NaN`

```
me.fromText("0/0").simplify().tree          // legacy: NaN      Rust: 0
me.fromText("(3-3)/(2-2)").simplify().tree  // legacy: NaN      Rust: 0
me.fromText("1/0").simplify().tree          // both: Inf   ✓ correct
```

`evaluate_to_constant` inherits it: `0/0` → `0` instead of `null`.

This is how DoenetML computes an undefined slope, so a degenerate line reports slope `0` — a wrong
number rather than a visible failure, which is the worst shape for a grading path. Your new
`has_undefined_leaf` guard fixed the *blank* case (`0*＿`, `(＿-＿)/(＿-＿)`) correctly; this is the
same class, reached through arithmetic rather than through a hole.

---

## 4. `evaluate_numbers({skip_ordering:true})` — 22 failures

Backs DoenetML's `simplify="numberspreserveorder"`, a documented public attribute. It currently
throws by design.

Throwing is better than silently reordering — `1+x+2` coming back `x+3` was the bug it replaced —
but we need an order-preserving numeric fold: combine adjacent numeric terms without applying the
canonical `cmp`. Concentrated in `parabola.test.ts` (13), `symbolicEquality.test.ts` (3).

---

## 5. Symbolic simplify misses log/combinatoric/inverse-trig identities — 19 failures

All in `symbolicEquality simplifyOnCompare`. Each of these **passes numerically** — only the
simplify path fails:

```
sin^(-1)(1) = pi/2      cos^(-1)(1) = 0      tan^(-1)(1) = pi/4
log10(10^3) = 3         log_2(2^3) = 3       log_7(7^3) = 3
nCr(5,3) = 10           nPr(5,3) = 60        binom(5,3) = 10
```

Rust's `simplify` leaves `asin(1)`, `log_2(8)`, `nCr(5, 3)`. Legacy folded them.

Worth noting your **parse is better here**: legacy read `sin^(-1)(1)` as `(1/sin)(1)` — reciprocal,
not inverse. We would rather keep your reading and have simplify evaluate it.

---

## 6. Two decisions to settle, not bugs

**Scientific notation — 34 failures.** Rust never uses it; legacy switched at a magnitude threshold.

```
5.252*10^(-13)  →  legacy "5.252 * 10^(-13)"   Rust "0.0000000000005252"
2*10^21         →  legacy "2 * 10^21"          Rust "2000000000000000000000"
```

DoenetML has an `avoidScientificNotation` attribute, which presumes scientific *is* the default —
so we cannot simply absorb this. Is a notation threshold something you would take as a render
option, or should we implement it in our display layer?

**Terminating rationals — 3 failures.** `5/2` renders `2.5` while `1/3` correctly stays
`\frac{1}{3}`. We accept this as ours per your notes. One caveat we raised before and still hold: if
the structural criteria (`ReducedFraction`, `ExactValue`, …) are meant to be usable *after*
`simplify`, this stops being a display question. Worth settling before F1 ships.

---

## 7. Still open from the previous revision

- **`panic = "abort"` and WASM32 stack safety.** A reachable panic kills the worker and takes the
  student's session with it. `STACK_SAFETY_PLAN` items 21 and 23–26 remain open; deep expressions
  can overflow the ~1 MB shadow stack, including on `Drop`. Student input is adversarial by
  construction. The `Number::parse` fallback you added in `decimal.rs` is exactly the right shape —
  it just needs to be the rule rather than the exception.
- **Handle lifetime.** `free()`/`dispose()` landed and we are using them. `interner_size()` gives us
  the gauge we asked for. We still owe you growth-rate numbers from a long session; we have not
  measured yet.
- **Normalization passes that no-op** (`default_order`, `normalize_negative_numbers`, …). Returning
  `this` rather than throwing was the right call given it kept ~170 idempotent-input specs alive.
  Our residual `term/factor ordering` failures (10) trace here.

---

## What we are taking on ourselves

Recorded so it is not mistaken for a request:

- **Printer spacing — done, 42 tests updated.** Legacy padded inside delimiters, Rust does not:
  `( 0, 0 )` → `(0, 0)`. Yours is the better output; we changed our expectations. For anyone else
  doing this: `toLatex` is byte-identical on both engines — `\left( 1, 2 \right)` keeps its padding
  — so a naive whitespace sweep over test files will corrupt LaTeX assertions.
- **Sparse arrays reaching `fromAst` — 9 failures.** `Point.js` builds `Array(n+1)` and fills only
  the components being set; `JSON.stringify` turns the holes into `null`, which you reject with
  `unexpected value null`. Correctly rejected — the bug is ours. We are deciding whether a hole
  should become `{"$":"None"}` or whether the call site should not produce one.
- **Tagged values reaching users — ~37 failures.** `.tree` returns `{"$":"Inf"}` / `{"$":"NaN"}`
  where legacy gave JS `Infinity` / `NaN`, and the text printer spells a blank `＿` where legacy
  printed `NaN`. We understand the symmetry argument in your `astReplacer` note and are not asking
  you to change it; our `.tree` consumers do `typeof x === "number"` and that is ours to fix.
- **Float-precision assertions.** Our ODE tests compare two independent integrations with exact
  `.eq()`; they now differ by 2 ULP. Ours.
- **The more aggressive `simplify`** and **exact-constant equality** — both improvements.
- **Formatter-coupled assertions.** Renormalizing toward comparing parsed trees or `equals` rather
  than exact strings.

---

## Reproducing

```bash
git submodule update --init --recursive          # vendor/math-expressions @ cdc5343
npm run build -w packages/math                   # Rust is now the default
npx vitest run --root packages/doenetml-worker-javascript --shard=1/8   # ×8; see note
```

The full suite exhausts the heap in one process — a pre-existing DoenetML memory problem, not an
engine difference (the JavaScript engine OOMs identically), which is why it is sharded.

- `scripts/analyze-math-divergences.py <report>...` reproduces the attribution table.
- `scripts/compare-test-runs.py --before <a>... --after <b>...` diffs two runs test-by-test. Every
  number in this document was verified with it; both of our changes came in at **0 broken**.

**The most useful thing you can send back is §1** — three lines in `astReplacer`, and it is the
difference between 465 failures and 560.

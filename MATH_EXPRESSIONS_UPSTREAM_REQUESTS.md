# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** `siefkenj/math-expressions@doenet`, `7a18c9c`
**Date:** 2026-08-04

The detail lives in [`upstream_requests/`](upstream_requests/), one file per request, each
self-contained enough to file as an issue. This page is the cover note. Nothing that has already been
fixed is repeated here — see the git history of this file if you want the record of what was.

DoenetML has switched permanently to the Rust engine. There is no JavaScript engine to fall back to,
so everything below is on the path to shipping.

## Your last round: both fixes verified, and one of ours was wrong

We pinned `7a18c9c`, rebuilt, and re-ran everything before writing this. Your reply is preserved
verbatim at the bottom of this file.

**Item 1 — display rounding: confirmed fixed**, and your account of the mechanism is right down to the
double rounding. We reproduced the bug at `970c1c3` and its absence at `7a18c9c` through the JS API
rather than the Rust tests, because the JS API is the surface we consume:
`round_numbers_to_precision_plus_decimals(2e21, 3, 2).tree` is now `2e+21`. It cleared **14** of our
failures, not the 8 we attributed to it — the five `*List and rounding, from strings` tests and
`mathInput > display small as zero` were the same defect wearing different clothes. Your js-compat
differential is unchanged at 1,384 failures across both pins, and we diffed the failing *set* rather
than the count: byte-identical. Dropping the `1e-12` tolerance was the right call.

**Item 2 — `parseScientificNotation`: you are right and we were wrong.**
[09](upstream_requests/09-parse-scientific-notation-ignored.md) is withdrawn. Every probe in that
report was lowercase, and the case we should have read is pinned four lines above the uppercase cases
we did not: `"1.2e-3": ["+", ["*", 1.2, "e"], -3]`.

**We are also declining the lowercase opt-in**, so please do not build it. All 30 places our tests set
the attribute use uppercase markup (`1E-12`, `3E2`, `1E-6`, `5E+1`); the lowercase spellings in those
files are JS expected values, not input we parse. A second grammar would buy us nothing today and
would put a Doenet-shaped divergence into a shared parser. If authors report students typing `7e-12`,
we will come back with evidence rather than a hypothesis.

**Item 3 — stack safety: your correction is accurate** and we have stopped repeating our summary. For
the record, "closes the vector end-to-end" came from your plan's §6 step 2, which still says it — that
is the text that needs updating. We confirmed all three of your points against `7a18c9c`: one
`tear_down` call site, `MAX_PARSE_DEPTH` enforced only in `shared_grammar.rs`, `try_from_js`
uncapped.

## Still open — ten items

**1. [WASM32 stack safety](upstream_requests/03-wasm32-stack-safety.md)** — unchanged in severity, and
we can add to it. Your two vectors, plus a third:

- `unflatten_left` / `unflatten_right` — **this one is on a path we exercise.** We call
  `me.utils.unflattenLeft` in
  `packages/doenetml-worker-javascript/src/components/Math.js:1486`, on an authored expression, in
  the inverse-definition path for a `<math>` with modifiable children.
- `substitute_var` composing — reachable for us only through nested `<substitute>` components, which
  is authored rather than student input.
- **The caret handler builds deep `Pow` trees in a loop, bypassing `MAX_PARSE_DEPTH`.** Your
  `tests/parse_adversarial.rs` already documents it, as the `#[ignore]`d
  `superscript_nesting_overflows_known_bug`. This is the one that worries us: `^` is a character a
  student types into a math input, and nothing between the keystroke and the recursion bounds it. It
  also means "the cap bounds parser-produced trees" is too generous — it does not bound all of them.

**2. [`.tree` hands back `{"$":"Inf"}` where legacy handed back `Infinity`](upstream_requests/10-tree-returns-tagged-non-finite.md)**
— the case you asked us to send. Eleven of our twelve are that shape, and it is wider than the
rounding functions: `me.fromText("oo").tree` is `{"$":"Inf"}` on a plain parse, with nothing
round-tripped through `fromAst`. Thirteen of your own 1,384 are the same assertion in four spec
files, including all three `quick_rounding.spec.ts` entry points.

The counter-argument is in your source — tagged in both directions, because `{"$":"None"}` has no JS
scalar. Coming *out*, we think it inverts: `None` never had a legacy scalar to lose,
`evaluate_to_constant()` already untags, and the `fromAst(x).tree` fixpoint survives because
`from_ast` still reads both spellings. If you would rather not, say so and we will adapt our consumers
and close it — they are our `typeof x === "number"` checks.

**3. [Signed zero is dropped](upstream_requests/11-negative-zero-not-preserved.md)** — the twelfth
failure, and a value rather than a tag. `(0)(-1)` folds to exact `0`, so `1/((0)(-1))` is `+∞` where
legacy gave `−∞`. Three of your `slow_simplify` specs pin the legacy behaviour and currently fail,
one with the division left unevaluated: `expected [ '/', 6, +0 ] to deeply equal -Infinity`. Low
severity for us — one test, authored content — but it is the same theme as the single residual we
found in the rounding fix, where `round_numbers_to_decimals(-0.001, 2)` now returns `+0` where legacy
returned `-0`.

**4. [Three compat methods accept an options object and ignore it](upstream_requests/12-compat-methods-drop-their-options.md)**
— new this round, ~50 tests, and the largest thing left. `equalsViaSyntax`, `match` and
`evaluate_numbers` take options that never reach the Rust core. They do not throw and do not warn;
they answer confidently with the defaults.

```js
me.fromText("/a").equals(me.fromText("/a"), { allow_blanks: true });          // true   ✓
me.fromText("/a").equalsViaSyntax(me.fromText("/a"), { allow_blanks: true }); // false  ✗
me.fromText("3.2").equalsViaSyntax(me.fromText("3.2001"), { allowed_error_in_numbers: 0.001 }); // false  ✗
```

`match(pattern, _options)` has the underscore in your source: every symbol in the pattern is a
placeholder regardless of `variables`, and `allow_permutations` is inert. `evaluate_numbers` reads
only `skip_ordering`, so `evaluate_functions: true` leaves `sin(0)` unevaluated and our
`simplify="full"` comparison never converges.

The general ask matters more than the three patches: **where an option cannot be honoured, throw.**
You already do exactly this for the legacy no-backing methods, "so calls fail loudly, not as
`undefined is not a function` surprises" — this is the same instinct one level down. Silent
acceptance cost us several sessions and produced wrong equality answers, which for us are wrong
grades.

**5. [`evaluate_to_constant` reports NaN as `None`](upstream_requests/14-evaluate-to-constant-reports-nan-as-none.md)**
— 32 tests, measured against an unchanged pin. This is item 2 above seen at a different exit, and it
stands whichever way item 2 goes: `evaluate_to_constant`'s contract is a JS number, so a tag has
nowhere to go there.

Your own argument for returning `±∞` applies verbatim — `None` reads downstream as `0`, because
`Math.abs(null)` is `0`. A horizontal line's x-intercept is genuinely undefined and we render it at
the origin. `0/0` *evaluates*; it is not undecided in the way a free variable or a `＿` hole is, and
we are not asking you to weaken `has_undefined_leaf`.

**6. [`simplify` leaves unit arithmetic and mixed-container vector sums unfolded](upstream_requests/13-simplify-does-not-fold-units-or-mixed-vectors.md)**
— 9 tests. `$3+$2` stays `["+",["unit","$",2],["unit","$",3]]` while `equals` answers it correctly,
so the semantics are already in there. `⟨a,b⟩ + (c,d)` does not fold although `(a,b)+(c,d)` does —
`altvector` and `tuple` are the same object in our authoring.

**7. [A bare `_` parses as a subscript operator instead of a blank](upstream_requests/15-bare-underscore-parses-as-subscript.md)**
— 6 tests. `me.fromText("_").tree` is `["_","＿","＿"]`; we expect `"＿"`. `x_1`, `a_` and `_b` are all
right — only the both-operands-blank case. `_` is our authoring syntax for a free slot in
`excludeCombinations="(2 2 _)"`.

**8. [Display rounding turns exact rationals into decimals](upstream_requests/16-rounding-destroys-exact-rationals.md)**
— 7 tests, same function family as the fix you shipped. `round_numbers_to_precision(5/2, 3)` is
`2.5` where legacy kept `\frac{5}{2}`; `1/3 → 0.333` is already right, so we think the rule is just
"if rounding would not change the value, return it unchanged". `displayDigits` defaults to 3, so
every rational a student sees goes through it, and in a fractions lesson the fraction *is* the point.

**9. Root and complex simplification gaps** — 4 tests, not filed separately yet.
`cbrt(x^3)`, `nthroot(x^3,3)` and `sqrt(16x²y⁴)` keep their radicals (only the numeric factor comes
out of the last), and `i^2` stays `["^","i",2]` rather than folding to `-1`. Say the word and we will
write it up properly with the corpus.

**10. [Two printer defects: `(-3) x`, and `∫` losing its glyph](upstream_requests/17-printer-negative-coefficients-and-integrals.md)**
— 6 tests, and the only two we would not absorb. We went through every printer difference this round
and changed *our* expectations wherever the new output was a legitimate style choice: canonical term
and factor ordering (`a+mn` now prints `mn+a`), and parentheses that were never needed
(`(x²)/2` → `x²/2`). These two are different.

```js
me.fromAst(["+", "a", ["*", -3, "b"]]).toString();   // "a + (-3) b"   expected "a - 3 b"
me.fromLatex("\\int_{a}^{b} f(x) dx").toString();     // "int_a^b(f(x) dx)"  expected "∫_a^b f(x) dx"
```

`simplify()` fixes the first, so it only shows on unsimplified output — which is where a lot of what
a student reads lives, including our test literally named "display fraction with negative out front".

## Where we are

`packages/doenetml-worker-javascript`: **237 failures of 3,436 executed — 93.1% passing**, from 448
when we started.

| Pin | Failures | Fixed | Broken |
| --- | ---: | ---: | ---: |
| `cdc5343` | 448 | — | — |
| `02293bf` | 412 | 36 | 0 |
| `08bd4dc` | 403 | 10 | 0 |
| `970c1c3` | 343 | 59 | 0 |
| `7a18c9c` + our fixes | **237** | **106** | **0** |

No pin has ever broken anything. `02293bf` also let us delete the last two workarounds in our seam —
with **no change in results either way**, which is how we verify an upstream fix actually covers our
usage. `packages/math/src/engine-rust.ts` is now a straight re-export.

The last row is *combined*, and we would rather say so than claim it: the `7a18c9c` bump and our own
sparse-AST fix landed in the same commit, so that data cannot separate them. Measured in isolation
against an unchanged pin, our fixes were **34 / 0** (sparse AST, across `vector`/`ray`/`point`),
**14 / 0** (`Number.isNaN(null)`, suite-wide) and **6 / 0** (piecewise `otherwise`).

Three bugs of ours are worth naming, because all three were *caused* by the migration rather than
merely revealed by it — and none is your fault:

- **Sparse AST arrays.** Our inverse definitions encoded "leave this vector component alone" as a
  *hole* in the AST array, detected with `tree.includes()`. The old engine stored the array by
  reference so the hole survived `fromAst(...).tree`; yours round-trips through JSON, where a hole
  becomes `null` and `from_ast` rightly rejects it. The throw aborted the entire update transaction,
  so dragging a point changed nothing and reported nothing.
- **`Number.isNaN(null)` is `false`.** Nine places tested an `evaluate_to_constant()` result for
  `NaN` alone. `null` sails straight through and coerces to `0`: `＿ < 1` became `null < 1`, which is
  `true`, so a blank answer scored full credit, and `<sort>` compared `null - null` for every pair
  and returned its input order.
- **Reading a `.tree` leaf with `=== -Infinity`.** `PiecewiseFunction` decides which branch is the
  catch-all by testing whether its domain is `(-∞, ∞)`. Against the tagged form that test is simply
  always false, so every piecewise function printed an explicit final condition instead of
  "otherwise". We read leaves through a tolerant helper now, so it holds whichever way item 2
  settles.

All three are the same shape, and it is the shape worth warning the next migrator about: a
representation whose meaning lived in JavaScript reference or type semantics, silently becoming
something else.

We also hardened `MathBaseOperator`. `median([1,4,5,null])` throws inside mathjs and took the whole
document down; `median([1,4,5,NaN])` degrades quietly. That is downstream of item 5, and it is the
sharpest illustration of why `None` arriving as a JS `null` is worse than a NaN.

The remaining 237 are fully triaged, cluster by cluster, in
[`upstream_requests/README.md`](upstream_requests/README.md) — each confirmed by an engine-level
probe rather than inferred from the test name. Roughly 145 are items 2–8, 6 are item 10, and the rest is a
long tail of two or three per file. The cosmetic bucket is gone: we worked through it and moved our
expectations to the new printer wherever the difference was style rather than substance.

### How we check your fixes now

The pattern that produced this round, and the one we will keep using:

1. Reproduce at the old pin and the new one **through the JS API**, not the Rust tests. Item 1's whole
   story was that `value` was right and only `valueForDisplay` was wrong.
2. Diff the failing *set* between pins, not the count. Equal counts can hide a swap; ours were
   byte-identical, which is what "no regressions" ought to mean.
3. Read the spec that defines the behaviour before filing. Item 2 was uppercase-only in a corpus we
   had not opened, and the third stack-safety vector was an `#[ignore]`d test in yours.
4. Print with `String()`, never `JSON.stringify` — `JSON.stringify(Infinity)` is `"null"`. That has
   now cost us one wrong report and nearly cost us a missed fix.

## Reproducing

```bash
git submodule update --init --recursive          # vendor/math-expressions @ 7a18c9c
npm run build -w packages/math
cd packages/doenetml-worker-javascript
npx vitest run -t '@group1'                      # and @group2, @group3
npx vitest run -t '^(?!.*@(?:group1|group2|group3))'   # group4
```

Every engine-level claim is reproducible in isolation, without DoenetML:

```js
import me from "math-expressions";
console.log(String(me.fromAst(-Infinity).evaluate_to_constant()));
```

That form is what moved nine items off this list and onto ours — printed with `String()`, not
`JSON.stringify`, which renders `Infinity` as `null` and cost us a wrong report.

## Response (yours, on `7a18c9c`)

**Item 1 — display rounding: fixed.** Your read was right down to the mechanism. The float branch of
`Number::round_to_decimals` computed `(v · 10^d).round() / 10^d`, and both steps round: `2e23` is not
representable (`5^23 > 2^53`), so `2e21 · 100` was already wrong before the division made it worse.
Exact values never took that branch, which is why a `<number>` with a typed literal was fine and a
computed one was not, and why asking for more digits recovered — a larger `digits` drives `d`
negative, and `10^-19` happened to survive the round trip.

Rounding now goes through the float's exact binary value (`BigRational::from_float` is lossless),
rounds there, and returns the nearest f64 to the decimal that produces. That is what legacy was doing
with `parseFloat(math.format(v, {notation: "fixed", precision: n}))` — the decimal-string round trip
you inferred. Ties are unchanged (away from zero, resolved against the stored value, so `2.675` → 
`2.67`).

The differential corpus generated from your engine now matches **bit-exactly** on
`round_numbers_to_precision_plus_decimals`; it previously needed a `1e-12` relative tolerance, which
we have removed so the next divergence of this kind cannot hide under it.

**Item 2 — `parseScientificNotation`: not a defect; your repro reads a different case.** The option is
honored, and always was — but only for **uppercase `E`**, and only when the exponent ends the
expression or is followed by `, | ) } ]`. Both restrictions are legacy's, and the lowercase one is
load-bearing rather than an oversight: `e` is Euler's number in this grammar, so `1.2e-3` is
`1.2·e − 3`. Your own spec asserts exactly that (`spec/quick_text-to-ast.spec.js`, and it is still
asserted in our port), so we cannot widen the rule without breaking it.

```js
new me.converters.textToAstObj({ parseScientificNotation: true }).convert("7E-12");  // → 7e-12   ✓
new me.converters.textToAstObj({ parseScientificNotation: false }).convert("7E-12"); // → ["+",["*",7,"E"],-12]
new me.converters.textToAstObj({ parseScientificNotation: true }).convert("7e-12");  // → ["+",["*",7,"e"],-12]  (Euler)
```

So: neither honour-differently nor drop. What we have done instead is make the rule impossible to
misread — it is now stated on the option itself in both parsers, and pinned from both sides
(uppercase honored, lowercase not, delimiter required) in `tests/parser_options.rs` and
`spec/quick_doenet_display_rounding.spec.ts`.

That leaves the real question yours: students type `7e-12`. If DoenetML wants that to parse as
scientific notation, say so and we will add it as an explicit opt-in (a distinct value of the option,
so `1.2e-3` keeps its legacy meaning by default). We did not add it unilaterally because it changes a
grammar decision your own corpus depends on.

**Item 3 — stack safety: still open, and your summary of it is slightly optimistic.** Step 1
(iterative `Drop`) and step 2 (parser depth cap) are done, but they do not close the vector
end-to-end. The cap bounds *parser-produced* trees only, and `tear_down` runs at exactly one call
site — the wasm handle's `Drop` — so it covers neither the ~90 recursive traversals in the core nor
the intermediate trees those passes drop internally. Measured on a 1 MB stack, release profile, the
weakest passes (`flatten`, `serde::to_js`, `to_text`, `canonicalize`) trap at roughly **1,800 levels**;
in a debug build `to_js` traps at **126**, which is below the 128 that `from_js` will admit.

Two vectors are reachable from your side today and are not behind the parser cap:

- `unflatten_left` / `unflatten_right` turn width into depth with no bound. `["+", a1, …, a100000]`
  is depth 2 as JSON — serde_json's 128-deep limit never fires — and becomes a 100,000-deep tree that
  is then serialized and dropped recursively.
- `substitute_var` composes: `e = e.substitute_var("x", e)` **doubles** depth per call, so a dozen
  calls from a JS loop clears 1,800.

We are taking the cheap half first — explicit caps on `try_from_js` and `unflatten_*`, and small-stack
tests for the four heavy passes — rather than blocking on the full iterative-fold port (steps 3–5),
which is the larger piece of work. Flagging the two vectors above in case either is on a path you
already exercise.

**Verification.** Rust: 661 tests, 0 failing; clippy clean. The js-compat differential across 6,289
tests is unchanged at 1,384 failures — no regressions from either change, and the 7 new boundary tests
all pass. The rounding fix has no local test that was failing before, because the case only shows up
at your display path; `spec/quick_doenet_display_rounding.spec.ts` now covers it at the library
boundary in the form you filed it.

**One note on your remaining clusters.** "12 tagged-value leaks into `.tree` consumers" may be ours,
not yours: `me.round_numbers_to_decimals(-Infinity, 2).tree` is `{$: "-Inf"}`, where legacy gave
`-Infinity`. The tag is how non-finite values cross the wasm boundary, and `evaluate_to_constant()`
untags on the way back, but `.tree` does not. If those 12 are that shape, send one and we will take
it.

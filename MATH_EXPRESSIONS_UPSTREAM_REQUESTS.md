# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** `siefkenj/math-expressions@doenet`, `264be80`
**Date:** 2026-08-05

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

## What this round changed

We implemented the open items in the subrepo rather than only filing them, so this section is now a
description of patches on the `doenet` branch, not a request list. Each was measured against
`264be80` with nothing else changed; the totals are in the table below.

**Items 4, 5 and 2 are implemented.** These were the three biggest clusters.

- **[Item 4 — options accepted and ignored](upstream_requests/12-compat-methods-drop-their-options.md).**
  `equalsViaSyntax` now takes options, through a new `structural_equality_with_options` wasm entry;
  the grading-options decoder is factored into one `eq_options_from_json` so the numeric and
  syntactic paths cannot drift apart again. `equals_syntactic` honours `allowed_error_in_numbers`
  via the `fuzzy_tree_eq` that `equals` already used, so a tolerance means the same thing on both.
  `evaluate_numbers` honours `evaluate_functions` through a new core pass. `match` honours
  `variables`, `allow_permutations` and `allow_implicit_identities`.

  On your general ask — *where an option cannot be honoured, throw* — we took it, with one
  refinement. `max_digits` is accepted at `Infinity`, because "no cap" is a constraint the exact
  core genuinely satisfies, and throws on a finite value, which it cannot. All four of our call
  sites pass `Infinity`, and one passes it alone, so a blanket throw would have broken them. A
  predicate passed as a `variables` kind now throws too, naming the three declarative kinds
  instead.

- **[Item 5 — `evaluate_to_constant` reports NaN as `None`](upstream_requests/14-evaluate-to-constant-reports-nan-as-none.md).**
  Implemented, and deliberately *not* by relaxing `finite()` as our report suggested. A NaN that
  simplification derived is a conclusion; a NaN falling out of `eval_complex` may only mean the
  sampler could not evaluate there, and returning that as a value would turn "cannot decide" into a
  confident wrong answer. It reads the simplified tree instead — the same shape as `signed_infinity`
  right above it. Free variables and the holes `has_undefined_leaf` rejects still return `None`.

- **[Item 2 — `.tree` hands back `{"$":"Inf"}`](upstream_requests/10-tree-returns-tagged-non-finite.md).**
  `.tree` untags `Inf`/`-Inf`/`NaN` to the JS scalars through a `JSON.parse` reviver; `{"$":"None"}`
  stays tagged, having no scalar to become. The *wire* stays tagged in both directions — JSON cannot
  hold these three — so what changed is the value a caller sees, not the format. `fromAst(x).tree`
  is still a fixpoint because `astReplacer` re-tags on the way in.

  One trap worth recording, because it bit us immediately: `astReplacer` unwraps a nested
  `Expression` by returning `held.tree`, and once `.tree` untags, that return is a bare JS `NaN`
  that `JSON.stringify` writes as `null` — straight back into "unexpected value null". Both unwrap
  paths now go through `tagNonFinite`. Anyone else making this change needs the same edit.

**Item 3 (signed zero) was fixed by you in `264be80`, and we could not see it.** The sign is correct
all the way through `1/((-1)(0))` now, but the test still failed, because `.tree` handed back
`{"$":"-Inf"}` where it asserts `-Infinity` — item 2 standing in front of item 3. It is worth saying
plainly: a fix you shipped bought zero tests until a second one landed. That is the strongest
argument we have for item 2, and we did not have it when we filed.

**[Item 6 — units and mixed-container vectors](upstream_requests/13-simplify-does-not-fold-units-or-mixed-vectors.md)
is implemented.** A `fold_units` pass in `full_simplify` combines like units under `+`/`-` and moves
scalar factors and divisors inside a single unit. Both boundaries you asked us to hold are held:
unlike units never combine, and a unit never combines with a bare scalar.

For the mixed containers we departed from the spec in one place. You asked for the left operand's
container; `Add` is commutative and canonically sorted, so by the time the rule runs there is no
left operand to read, and keying off position would make `u + v` and `v + u` canonicalize to
different trees. It takes the members' own kind when they agree and the class's canonical container
otherwise. `tuple`/`vector`/`altvector` are one class; `array` is its own, because `createIntervals`
reads `[a,b]` as an interval and your `equals` already keeps tuple↔array coercion a separate opt-in
from tuple↔vector.

**[Item 7 — a bare `_`](upstream_requests/15-bare-underscore-parses-as-subscript.md) is withdrawn.
Please do not build it.** We implemented it, measured it, and reverted it.

The report's premise does not hold for us. `excludeCombinations="(1 1 _)"` is split into lists by
our own sugar before any of it reaches you, so each `_` is parsed **alone** — the `2 2 _`
token-swallowing case the whole report is built on is never on a path we exercise. The parse of a
bare `_` as `["_","＿","＿"]` is cosmetic.

Measured, the change fixed **0** tests and broke **1**: `'-_^` is `["^",["_","＿","＿"],"＿"]` and
renders `_{}^{}`, which is what `displayBlanks` should show for what the author typed; collapsing
the `_` makes it `["^","＿","＿"]` and the subscript slot disappears. A real cost for no benefit.

The 13 tests we had attributed to this were **ours**, and are now fixed: a tenth instance of the
`Number.isNaN(null)` family in `Number.js`. A blank evaluates to `null` — correctly, it is undecided
rather than NaN — `Number.isNaN(null)` is `false`, so it flowed past the NaN branch as `null`, and
the wildcard machinery in `excludeCombinations.js` represents wildcards as `NaN`, so no combination
ever matched.

**Item 1 (WASM32 stack safety) is the one thing still open on your side**, unchanged in severity, and
the caret handler building deep `Pow` trees in a loop is still the vector that worries us most,
because `^` is a character a student types.

**Items 8, 9 and 10 you resolved in `264be80`** (display rounding keeping exact rationals, the
numeric root convention, and both printer defects). We verified all five through the JS API before
counting them.

## One thing we found on your side, which is a soundness bug rather than a gap

Probing indeterminate forms while implementing item 5 turned up three results that are wrong rather
than merely unsimplified:

| | `264be80` | now |
| --- | --- | --- |
| `Infinity/Infinity` | `1` | `NaN` |
| `Infinity^0` | `1` | `NaN` |
| `1^Infinity` | `1` | `NaN` |
| `0^0` | `1` | `NaN` |

Two rules in the `pow` constructor: `x^0 → 1` fired for a zero or non-finite base, and `1^x → 1` for
an infinite exponent. `∞/∞` reached `1` through the first, by collecting to `∞^(1−1)`. Folding an
indeterminate form to a value asserts a limit that does not exist, and `∞/∞ = 1` is the kind of
answer a student can quote back at a teacher.

`0^0` is the debatable member. Combinatorics and IEEE `pow` both take it as 1; Mathematica says
`Indeterminate`. We went with NaN because as a *limit* form it is indeterminate (`x^0 → 1` but
`0^x → 0`), that is the reading a mathematics course teaches, and our `number.test.ts` group is
literally named "indeterminate forms give NaN". It is one predicate
(`is_indeterminate_power_base`) if you would rather keep `0^0 = 1`.

Neighbours that must not move — `2^0`, `x^0`, `1^x`, `0^3`, `∞+∞` — are unchanged and pinned.


## Where we are

`packages/doenetml-worker-javascript`: **99 failures of 3,428 executed — 97.1% passing**, from 448
when we started.

| Pin | Failures | Fixed | Broken |
| --- | ---: | ---: | ---: |
| `cdc5343` | 448 | — | — |
| `02293bf` | 412 | 36 | 0 |
| `08bd4dc` | 403 | 10 | 0 |
| `970c1c3` | 343 | 59 | 0 |
| `7a18c9c` + our fixes | 237 | 106 | 0 |
| `264be80` | 229 | 9 | 1 |
| `264be80` + the work below | **99** | **138** | **0** |

The `264be80` row is the only one that ever broke a test, and it was a stale expectation of ours
rather than a defect: `point.test.ts` built its own expectation from `me.fromText("sqrt(-1)").tree`
— an *unsimplified* parse — while the component now folds the radicand to `i`. Both are correct and
`equals` answers `true` between them; the test now compares against `.simplify().tree`. Counting it
as a break anyway, because the rule that has served us here is to diff the failing *set* and report
what it says.

The last row is this round's work, measured against `264be80` with nothing else changed.

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

The remaining 99 are bucketed by symptom in
[`upstream_requests/README.md`](upstream_requests/README.md). None of them is a filed request any
more: the largest cluster (32) is assumption-gated simplification, where the tests agree with your
`ROOT_SIMPLIFICATION_SPEC.md` for the no-assumption case and only diverge under `x > 0` / `x ∈ R`;
19 are printer and display strings we have not yet walked one at a time; and 5 are the last of our
own `null`-handling sites. The cosmetic bucket is gone: we worked through it and moved our
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

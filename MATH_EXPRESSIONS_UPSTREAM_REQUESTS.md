# math-expressions: what DoenetML still needs

**For:** maintainers of [`Doenet/math-expressions`](https://github.com/Doenet/math-expressions)
**Against:** `siefkenj/math-expressions@doenet`, `66a3bc1`
**Date:** 2026-08-06

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

**Item 1 (WASM32 stack safety) was the one thing still open on your side at the time of writing.**
It is fixed in `1d8fe27` and verified — see "This round" below. Nothing is open on the engine side
now.

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


## This round: your stack fix verified, and a performance regression we found in ourselves

**Item 1 (WASM32 stack safety) is fixed and we have confirmed it.** We re-ran the proven repro from
the last round against `1d8fe27` (`7f8365c "Prevent overflow on bad input"`). All three claims are
resolved:

| | before | at `1d8fe27` |
| --- | --- | --- |
| `^`×6000 through `fromLatex` | `RuntimeError: memory access out of bounds` | `Error: Expression too deeply nested (at 61)` |
| engine usable afterwards | 0 of 5 operations | 5 of 5 |
| process exit code | 1 (uncatchable finalizer crash) | 0 |

A clean error at every depth we tried up to `^`×200,000, on all four caret paths (`fromLatex`,
`fromText`, `toString`, `simplify`), and the `FinalizationRegistry` no longer takes the process down
on the way out. **The crash class is gone from our suite.** One residual, and it is not that class:
`me.utils.unflattenLeft` on a width-5,000 sum throws a JS `RangeError` from the compat layer rather
than a wasm trap — catchable, and the engine survives it (verified). Worth a bound eventually; it
cannot take a worker down.

**A performance regression, and it was ours to find.** Two of our tests began timing out against
vitest's 180s limit, intermittently, which read as flakiness for a while. It was not: the engine is
much more expensive per `fromAst` than the JS one was, and one test sat right at the boundary so
machine load decided the outcome. Instrumenting every compat entry point found **2,139,268 `fromAst`
calls in a single test, every one of them an atom** — 1,394,421 of those the *same* blank `"＿"` that
a domain miss returns.

We fixed it in the compat layer, not in DoenetML: `fromAst` now shares one immutable handle per
recurring atom, and `.tree` memoizes when the result is a primitive (a composite tree is still handed
out fresh per read, because callers mutate what they get). A cached handle outlives any one wrapper,
so `free()` skips it — otherwise one wrapper's disposal dangles every other.

The part worth passing on is what we got wrong first. Caching *every* atom made things worse, badly:

| | cache nothing | cache every atom | cache strings + small ints |
| --- | ---: | ---: | ---: |
| blank-driven test (`＿` in a loop) | 173s | 105s | **4s** |
| sampler-driven test (distinct floats) | 77s | 153s | **78s** |

An interpolated function is evaluated at millions of *distinct* floats. Caching those is not a wash —
every call is a miss plus table churn, and each holds a wasm handle alive until the next sweep. The
working rule is that symbols, blanks and small integers recur and sampled coordinates do not.

**Two engine gaps we closed on the `doenet` branch this round.**

- **Assumption-gated root extraction.** `rule_assumptions` handled `sqrt` of fully-even powers only,
  so `cbrt(x³)` did not reduce even under `x ∈ R`. It is now general over the root degree with partial
  extraction — `sqrt(32x²y⁵) → 4xy²√(2y)`, `nthroot(a⁷b⁶c²⁸,5) → abc⁵·nthroot(a²bc³,5)`. The two
  soundness cases are kept apart deliberately: for an **even** degree the extracted part is an even
  power of a real and therefore `≥ 0`, so pulling it out of a principal root is valid whatever the
  residual is, and what comes out is the magnitude (`|x|` unless the sign is pinned); for an **odd**
  degree the extracted part keeps its sign, so the residual has to stay real — `cbrt(x³·i) ≠ x·cbrt(i)`
  for `x < 0`, the two principal branches differing by a third of a turn. Tests in
  `tests/doenet_root_assumptions.rs`, including the no-assumption rows that must keep declining.

- **A product's sign is never moved into one of its factors.** `simplify(-(1-x))` returned
  `-(-x+1)` rather than `x-1`. This was the root cause of our whole factoring-grader cluster, which
  tests `tree[0] === "*"` and saw `"-"`.

  Two things are easy to conflate here, and our first attempt at this rule conflated them and came
  out too narrow as a result. Moving the **sign** of a product into a factor — `-2(1-x)` is
  `2(x-1)`, and the `2` never moves — is not distributing its **coefficient**, `2(1-x)` to `2-2x`,
  which is `expand`'s job. Restricting the rule to a bare `-1` coefficient therefore left a
  redundant sign on every richer product: `-2(1-x)`, `-(1-x)/2`, `-y(1-x)` and `-(1-x)(1-y)` all
  kept one.

  The rule now applies to any `Mul` whose numeric coefficient is negative. The sign goes into
  exactly *one* factor — into two it would cancel — so where several could take it we pick the one
  that sheds the most signs, ties going to the earliest, which canonical ordering makes
  deterministic. A sum can always take a sign; a power can when its exponent is an **odd integer**,
  since `(-b)^m = -(b^m)` there, which also carries `-1/(1-x)` to `1/(x-1)`. The two guards that
  matter are the exponent ones, because they are the cases that would be silently wrong without
  them: `-(1-x)^2` is *not* `(x-1)^2`, and a non-integer exponent keeps the rule away from
  `-sqrt(1-x)`.

  Worth doing iff it does not add signs: with `n` negated terms out of `k`, the product costs
  `1 + n` as written and `k - n` with the sign pushed in, so it fires iff `2n >= k`. Counting signs
  rather than reading the leading term keeps it independent of sum order, so `-(1-x)` and `-(-x+1)`
  behave alike. Tests in `tests/doenet_sign_distribution.rs`: that table, a fixpoint check (the
  rewrite always leaves a positive coefficient, so it cannot fire on its own output), and a
  value-preservation check over every row.

## Two functions we added to the engine

Both come out of profiling DoenetML's extrema search, which spends ~60s on one document. The
finding that mattered was that the cost is not the algorithm: evaluating `x^2-3x+1` at a point
costs **6ns** of arithmetic and **1,200-2,000ns** of overhead, whichever route you take.

| evaluating `x^2-3x+1` at one point | |
| --- | ---: |
| hand-written JS | 6 ns |
| `.evaluate({x})` — one crossing per point | 1,287 ns |
| mathjs-compiled `.f()` — what we were using | 2,060 ns |
| **`.evaluate_many(var, xs)` — new** | **359 ns** |

- **`evaluate_many(var, values) -> Float64Array`.** One crossing for the whole batch: the
  environment is built once and the variable names are marshalled once. **5.7x** faster than the
  mathjs path we had been using, and it lets a consumer drop mathjs from the hot loop entirely.
  Any other variable is left unbound — substitute it first. A point with no finite real value (a
  pole, a complex branch, an unbound variable) comes back as `NaN` rather than being dropped, so
  the result lines up index-for-index with the input.

  It does not help a *sequential* optimizer — Brent's method needs point `n` before it can ask for
  `n+1` — so it targets grid scans, plotting and root bracketing. The remaining 359ns is the tree
  walk in `eval_complex`; a compiled evaluator would go further, and we have not built one.

- **`critical_points(var) -> Option<Vec<Expr>>`.** The real solutions of `f'(x) = 0`, exactly, in
  increasing order, wherever the derivative is a rational function — no sampling at all. Rational
  roots come back as numbers, irrational ones as `RootOf` carrying the defining polynomial, and a
  repeated root is listed once (`x^3` has one critical point, not a double).

  The contract is deliberately three-valued, because a caller keeping a numerical fallback has to
  tell "none" from "don't know": `Some(points)`, `Some(vec![])` meaning provably none, and `None`
  meaning undecided. Undecided is a derivative that is not rational in `var` (`sin(x)`, with
  infinitely many roots anyway), one carrying a free parameter (`d/dx a*x^2`, whose roots depend on
  `a`), or a constant-zero derivative, where every point is critical and no finite list says so.
  Points where `f'` does not *exist* — the corner of `|x|` — are not reported; they are critical in
  the textbook sense, but finding them is not rational root-finding, and including them would make
  the `Some` case a claim we cannot back.

  A pole cannot masquerade as a root: the derivative is put over a common denominator and reduced
  first, so `x^2/(x-1)` gives `[0, 2]` and never `1`.

  Tests are in `tests/doenet_sampling_and_critical_points.rs`. Soundness (every reported point
  zeroes `f'`) is only half of it — a list that silently drops a root is worse than no list — so
  completeness is checked too, by scanning densely and requiring every sign change of `f'` to sit
  beside a reported point.

**Both are wired into our extrema search.** `find_local_global_minima` (which the maxima side
reuses via a flipped function) now reads its derivative grid with one `evaluate_many` call instead
of ~1,000 mathjs evaluations, and seeds root refinement from `critical_points` instead of running
`fzero` towards the root. On the rational-function test that is 2 batched calls covering 2,006 grid
points, 2 exact critical-point solves, and ~2,900 fewer per-point mathjs evaluations. The failing
set is **unchanged**, which is the property we wanted: exact roots and batched sampling agree with
what bracketing was computing, they just cost less and do not drift.

It also fixed a bug our own test had frozen in place. `extrema of rational function` asserted a
spurious minimum at `4.999999948194912` next to the double pole of
`(x+8)(x-8)/((x-2)(x+4)(x-5)^2)`, with a comment naming it as a numerical artifact (issue #940).
`critical_points` answers `-11.66601734921, -2.29152990292, 3.18454272065, 9.77300453148` — the four
values the test itself credits to Sage, and nothing near 5. The expectation is corrected and the
test passes.

Where the derivative is *not* rational the fallback is untouched, so the two extrema tests that go
through an interpolated function are unaffected — those need the routing fix described above, not
this one.

**What we deliberately did not add: a `find_extrema`.** It would not have helped the case that
prompted this. The 60s document takes extrema of `$$f(x)` where `f` is a JS spline, which the
engine cannot represent, so a built-in would have to call back into JS per sample — reintroducing
the crossing in the worse direction. And the remaining 900 lines of our extrema code are Doenet
policy rather than mathematics: truncating an infinite domain to 200*xscale, buffer widths,
"intervals of extrema are not counted", prescribed heights. That belongs with us. Exact critical
points and a cheap way to sample are the parts that were yours.

## Where we are

`packages/doenetml-worker-javascript`: **64 failures of 3,475 executed — 98.2% passing**, from 448
when we started.

One of those 65 is a **timeout rather than a wrong answer**, and it moves between runs: `evaluate
functions based on interpolated function` lands at 169s and 193s on either side of vitest's 180s
limit under full-suite parallelism, while running at 61s on its own — faster than the 68s it took
before this migration. We are reporting it as a failure because that is what the run says, but it is
a scheduling artefact of our own test setup, not an engine defect. See the performance note above:
single-threaded time is now *better* than the JS engine's on this test and wall-clock under parallel
load is worse, which points at per-worker wasm memory pressure rather than at any one operation.

| Pin | Failures | Fixed | Broken |
| --- | ---: | ---: | ---: |
| `cdc5343` | 448 | — | — |
| `02293bf` | 412 | 36 | 0 |
| `08bd4dc` | 403 | 10 | 0 |
| `970c1c3` | 343 | 59 | 0 |
| `7a18c9c` + our fixes | 237 | 106 | 0 |
| `264be80` | 229 | 9 | 1 |
| `264be80` + the work below | 99 | 138 | 0 |
| `1d8fe27` | 91 | 8 | 0 |
| `1d8fe27` + this round | 65 | 26 | 0 |
| `66a3bc1` | **64** | **1** | **0** |

The `264be80` row is the only one that ever broke a test, and it was a stale expectation of ours
rather than a defect: `point.test.ts` built its own expectation from `me.fromText("sqrt(-1)").tree`
— an *unsimplified* parse — while the component now folds the radicand to `i`. Both are correct and
`equals` answers `true` between them; the test now compares against `.simplify().tree`. Counting it
as a break anyway, because the rule that has served us here is to diff the failing *set* and report
what it says.

The last three rows are this round. `1d8fe27` is your pin bump alone, measured with nothing else
changed; the row below it is our work on top of it, measured the same way. `66a3bc1` is your pin
bump again, on top of both — the atom-cache handle lifetime, the branch-cut fix in `eval_complex`
(a zero imaginary part is now forced to `+0.0`, so `sqrt(-1/4)` no longer depends on how the
radicand was spelled), and rational radicands in the radical rules. It fixed `functionTag > extrema
of rational function` and broke nothing. None of the three broke a test.

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

The remaining 64 are bucketed by symptom in
[`upstream_requests/README.md`](upstream_requests/README.md). None of them is a filed request. The
assumption-gated simplification cluster, which was the largest at 32, is gone — that was the root
extraction described above. What is left is 14 grading and equality differences, 14 of our own
component logic, 11 printer and display strings we have not yet walked one at a time, 9 numeric
tolerances in ODE integration and root finding, 9 tree shapes, and 7 of one specific kind: a sign
that stays outside a function application where the test expects it folded into the argument
(`-sin(2)` where it wants `sin(-2)`).

Two of those buckets have a known shared cause we have not yet acted on, and we would rather name
them than let them read as a mystery:

- **`evaluate_numbers` does not evaluate exact constants.** `2π + π + 6` stays symbolic, where the
  legacy pass folded any variable-free subtree to a float. Four `allowedErrorInNumbers` tests depend
  on it, because a response that typed `6.28318` cannot be compared term-by-term against a target
  that still holds `2π`. We have not changed it because folding π to a float on every
  `simplifyOnCompare="numbers"` is a wide blast radius that deserves its own measured round.
- **Float-versus-exact provenance on our input path.** `round(0.5555, 3)` gives `0.555` because the
  value reaching `<round>` is already an f64 `0.55549…`; the engine is correct on the exact rational.
  That is ours to chase, not yours.

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
git submodule update --init --recursive          # vendor/math-expressions @ 66a3bc1
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

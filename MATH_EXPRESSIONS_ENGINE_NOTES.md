# The Rust math-expressions engine in DoenetML: architecture and review notes

Companion to `MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md` (the plan; its Step 6 is the path off the
submodule) and `MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md` (the ledger of engine-level divergences).
This file keeps the durable findings from the review of
[PR #1622](https://github.com/Doenet/DoenetML/pull/1622): how the seam works, what it costs, the
conventions the switch established, and the follow-up work it identified. The pass-by-pass review
history is in the git log (`Review cycle N:` commits) and the PR's edit history; the user-visible
behavior changes are in `.changeset/rust-math-expressions-engine.md`.

## The seam

`@doenet/math` (`packages/math`) is the one module that decides what backs `me`.

**No call site changed, and none was rewritten.** The files that say
`import me from "math-expressions"` still say exactly that. This table is the one place the counts
are stated; everywhere else says "the files that import the library", because a number repeated in
ten files goes stale in ten files. Reproduce it with
`git grep -lE '<pattern>' -- 'packages/*.ts' 'packages/*.tsx' 'packages/*.js' 'packages/*.jsx' | wc -l`
— `git grep` searches tracked files only, so `node_modules` and `dist` drop out, and the patterns
are anchored so comments and doc examples do not inflate them:

| pattern | files, this head | files, merge base |
| --- | ---: | ---: |
| `^import me from "math-expressions";$` | 139 | 139 |
| `^import me[ ,][^;]*from "math-expressions";$` (default binding in any form) | 145 | 142 |
| `^import .*from "math-expressions";$` (anything from the specifier) | 150 | 145 |

The first row is what "no call site changed" means, and it is **identical at the merge base**. The
other two are not, and the difference is entirely files this branch *adds*: three take a named
import alongside the default (`import me, { dopri } …` in `thunks.ts` and `docUtils.ts`, plus the
new `appliedFunctionSymbols.test.ts`), and two more are review tests
(`periodicSetEquality.test.ts`, `utils/test/domain.test.ts`). An earlier wording gave 136/142/147
and said all three were identical at the base; only the middle number was ever a real
measurement, and it was the base's. Each consuming `package.json` declares
`"math-expressions": "file:../math"`, so the specifier resolves to the workspace package instead
of the npm library. It is an alias, not a codemod. The practical consequence: every bundler rule —
`external`, `dedupe` — must name the bare specifier `math-expressions`, because that is what the
import graph contains (instrumented through a real `packages/doenetml` build, it is the only id
rollup's `external` predicate is ever called with for the seam).

Seven bundler rules name it, and all seven must keep naming the bare specifier.
`packages/doenetml`, `packages/doenetml-prototype`, `packages/virtual-keyboard`,
`packages/doenetml-worker-rust`, `packages/doenetml-worker-javascript` and `packages/utils`
externalize; `packages/doenetml-worker` dedupes (it is fetched by URL, so it must stay
self-contained — one copy is correct, two is a bug). The first four are this diff's own work; the
`doenetml-worker-javascript` and `utils` entries predate it and are listed because a sweep that
misses them reintroduces a private copy.
`packages/standalone/scripts/check-bundle-size.mjs` classifies
inlined binaries by the wasm magic number and fails the build on a second math core.

`packages/math/src/engine-rust.ts` is a straight re-export. It once carried four gap fills
(`Expression#f()`, the context-level operation family, non-finite-preserving `fromAst`, recursive
`Expression` unwrap); all four landed upstream and were deleted here in turn — which is what the
seam is for: a local patch that cannot be removed is an upstream fix that did not actually cover
our usage. The legacy library is no longer a dependency at all; its hand-written type definitions
are vendored in `packages/math/src/vendored/math-expressions.d.ts` (see the width caveat in
`MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md`). There is no build-time switch back to the JavaScript
engine; to A/B, check out a commit from before the switch.

**WASM loading**: upstream's `setWasmModule` injection point replaces any bundler aliasing. One
ordering constraint, documented in the two files it affects: `packages/math/src/wasm-loader.ts`
must be *evaluated* before anything parses, so `engine-rust.ts` imports it first, purely for the
side effect. Browsers refuse to compile a module this size synchronously off-worker, so
`packages/doenetml/src/utils/docUtils.ts` and `packages/doenetml-prototype`'s dast thunk `await
initMathWasm()` during startup; in a worker or under node the engine instantiates synchronously as
it loads and the legacy synchronous `me.*` API works with no `await` anywhere — which is the whole
reason inlining is worth its bundle cost. The bytes are inlined rather than fetched, mirroring
`CoreWorker.ts`, because `fetch` is blocked for blob/data URLs in the VS Code web-worker extension
host and because one artifact behaves identically under Vitest and in the browser. (`CoreWorker.ts`
attributes that to issue #1375, which is a pre-existing mis-citation — #1375 is a VS Code extension
diagnostics bug — so no issue number is repeated here.)

**Publishability** is the one open item, and it is upstream-solved, this-side-pending: `@doenet/math`
is `private: true`, so the externalized `math-expressions` import in a published `@doenet/doenetml`
tarball resolves to nothing — or to npm's `math-expressions@2.x`, a different engine. The
resolution is that `math-expressions@3.x` publishes to npm (its `package publishability` CI job
already verifies the tarball works, `--target web` wasm included) and this side swaps the seam per
Step 6 of `MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md`; because the seam is an alias, no call site
and no bundler rule moves — changing `packages/doenetml/package.json`'s
`"math-expressions": "file:../math"` to the published range is what unblocks publication. *Which*
range depends on the version string the maintainer actually publishes, and the two cases differ:
`^3.0.0` for a real `3.0.0`, but `^3.0.0-alpha1` (or an exact pin) for a prerelease, because npm
semver excludes prereleases from `^3.x`. Step 6 of `MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md` states
both cases; nothing in the build checks which one is right.

Nothing in this repo *enforces* that order, and nothing should: the person who publishes
`math-expressions@3.x` is the person who merges these two PRs, so code protecting them from
themselves is only a thing to maintain. Five review passes wrote and rewrote a shape test on the
range, and two of them opened a hole the previous one's fix had left; the test is gone. The order
is stated once, at the top of `MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md`, and that is where it
lives.

What remains is the mechanism the order acts on, which is worth knowing:
`scripts/transform-package-json.ts` copies each externalized dependency's declared range verbatim
into the built `dist/package.json`'s `peerDependencies`. So `packages/doenetml/package.json`'s
`"math-expressions"` range *is* the range a consumer installs, and editing it is the whole of the
publishability change.

## Building

A Rust toolchain is required — but it was required before this diff too, and saying otherwise has
been the standing error here. `packages/doenetml-worker-rust:build:rust` runs
`npx wasm-pack build lib-js-wasm-binding`, `packages/doenetml:build` depends on it through
`doenetml-worker`, and `npm run build` *is* `packages/doenetml:build`; that is true at the merge
base as well. What this diff adds is (a) a `wasm-bindgen-cli` on `PATH` matching the submodule's
pinned `wasm-bindgen` (`0.2.126`) — nothing before it invoked the CLI directly, since `wasm-pack`
carries its own — and (b) an explicit `rustup target add wasm32-unknown-unknown`, because
`build-wasm.sh` calls `cargo build --target wasm32-unknown-unknown` where `wasm-pack` adds the
target for itself. Both of those go at Step 6; the toolchain does not (Step 6 checklist, item 10).
CI installs them via
`.github/actions/setup-math-wasm`; the devcontainer bakes it in via the `wasm-toolchain` feature.
Every workflow checkout that builds needs `submodules: recursive` plus that action: `ci.yml`,
`publish.yml`, `gh-pages-docs.yml` and `publish-doenetml-to-pretext-python.yml` — 14 checkouts and
12 uses of the action, the two devcontainer jobs in `ci.yml` taking the checkout without the action
because the container image carries the toolchain itself.

`packages/math`'s `build:wasm` declares wireit `files`/`output` so the WASM compile caches; wireit
propagates "not fully tracked" to every dependent and `../math:build` is a dependency of seven
packages (`utils`, `doenetml`, `doenetml-prototype`, `doenetml-to-pretext`,
`doenetml-worker-javascript`, `doenetml-worker-rust`, `test-cypress`), so without it CI's
`WIREIT_CACHE: local` never hits. Declaring the outputs is why
`build-wasm.mjs` copies the wasm-bindgen glue into `src/generated/` rather than aliasing into the
submodule — wireit refuses an output outside the package.

## Sizes

Order of magnitude, not a fingerprint — the wasm is not byte-reproducible build to build, and CI
builds without `wasm-opt` (a developer with binaryen installed measures smaller);
`packages/standalone/bundle-budgets.json` records the same caveats. Measured at the tenth review
pass and re-measured at the thirteenth: `web`-target WASM 1.69 MiB, 2.25 MiB as base64,
`dist/engine-rust.js` 2.41 MiB, ~792 kB gzipped — against roughly 1 MiB for the JavaScript library
it replaces. `@doenet/standalone`'s
main bundle *shrank* (13.82 → 11.41 MiB observed) because libraries stopped carrying private
copies of the engine once the seam was externalized everywhere.

## Conventions the switch established

- **NaN, not null, at every numeric boundary.** The engine answers `NaN` for an expression with no
  numeric value, which is legacy's answer and the only one that poisons arithmetic rather than
  reading as `0` — it briefly answered `null` instead, and that inversion is where **ten** of the
  eighteen grading defects below came from — the ninth through the eighteenth. (An earlier
  wording here said "roughly fourteen", which reconciles with neither the ledger below nor
  either PR body; corrected at the twenty-fifth pass.) It is fixed at the source
  (math-expressions#84), so this is no longer
  a rule a call site can break by forgetting. What the boundary helpers in
  `packages/doenetml-worker-javascript/src/utils/math.ts` and `@doenet/utils`
  (`isNumericConstant`, `toNumberOrNaN`, `evaluateToNumber`, `plainComplex`) are still for is the
  other arm: `evaluate_to_constant` returns `number | Complex`, and a `Complex` is a value no
  `number`-typed state variable can hold. What JavaScript does with one is worth knowing exactly,
  because it is what decides whether a guard is load-bearing (measured at the twenty-fourth pass,
  on a math.js `Complex` of `2i` and on the prototype-stripped `{re, im}` a structured clone
  delivers): `-`, `*`, `/`, `Number()` and `Math.abs()` all give `NaN`, so a site that only
  subtracts or divides already degrades loudly. **Three operations do not.** Every comparison is
  `false` — `c >= -3` *and* `c < -3` — so a range test silently excludes and a comparator sort
  orders arbitrarily; `+` returns a **string** (`2i` + `1` is `"2i1"`, the cloned form
  `"[object Object]1"`); and `me.fromAst` throws on one. Prefer the helpers at any site whose
  result reaches arithmetic, a grade or a renderer, and expect the guard to be *observably*
  load-bearing at the sites that compare, add or rebuild.
- **A guard test in this family is falsified by simulating the old sentinel, not by reverting the
  guard.** Now that `evaluate_to_constant()` answers `NaN` itself, `evaluateToNumber(expr)` and a
  bare `expr.evaluate_to_constant()` agree for every input a document can write except a
  `Complex` — so deleting a guard leaves its test green, and "I reverted it and the test failed"
  is no longer available as a check. The falsification that works is to make the boundary behave
  the way the unguarded code did under the old sentinel: patch `toNumberOrNaN` in
  `packages/utils/src/math/mathexpressions.ts` to
  `typeof value === "number" && !Number.isNaN(value) ? value : 0`, rebuild `@doenet/utils` (the
  worker tests resolve it through `dist/`), and run. **The twenty-third pass audited all 23 guard
  tests the seventh through twenty-second passes added for this class this way, and none is
  vacuous**: 15 fail under that one patch, 5 more fail under the same simulation applied at their
  own guard (`<math>`'s `plainComplex(...) ?? NaN`, the three `nearestPoint` `Number.isFinite`
  guards, and `domain?.[0]`), 2 are the `<line>` marker test and `periodicSetEquality`'s
  deliberate positive control, which are falsified by their own opposite, and the twenty-second
  pass's own four were verified when it wrote them. Where a test *can* be anchored on the
  `Complex` arm instead it should be, because that arm is live and a plain revert does falsify it.

  **The twenty-fourth pass worked that question through the whole population, and the answer is
  mostly "the guard changes nothing".** Twenty guard sites were probed with a `sqrt(-4)` in place
  of the symbolic value, first with the guards in place and then with `toNumberOrNaN` made the
  identity, `plainComplex` made the identity and `isNumericConstant`'s complex-rejecting half
  removed — the same method as the sentinel patch above, aimed at the other arm. Instrumenting the
  helpers to log a `Complex` argument shows one **reaches** the guard at 19 of the 20; `<circle>`'s
  `numericalRadius` is the exception, as the twenty-third pass reported. But at only **five** does
  it change what the document reports, and those five are exactly the sites that store the value or
  hand it to `fromAst` rather than merely subtracting it — see the operator measurements in the
  bullet above. Each is now anchored on the `Complex` arm and verified to fail with its own guard
  plainly reverted, for the right reason, and to pass with it: `<angle>`'s `numericalPoints`,
  `<cell>`'s `.number`, `<ray>`'s `numericalEndpoint`, `<curve>`'s bezier `controlPoints` and
  `periodicSetEquality`'s per-tuple offset guard. That makes **seven** such legs in the branch,
  with the twenty-third pass's `<math>`'s `.number` and `<vector>`'s `numericalEndpoints`. The
  `<curve>` one is the `+`-returns-a-string case: unguarded, a control point's x coordinate becomes
  the math variable named `2i1`. The `periodicSetEquality` one is the `fromAst`-throws case, and a
  throw there is a dead document rather than a wrong grade. (Three of the five are new `it` blocks
  and two are legs inside the existing test, so the population the paragraph above audits is 26
  guard tests now, not 23.)

  The other **fourteen** are reachable and *not* falsifiable by reverting: `<cobwebPolyline>`,
  `<isBetween>`, `<curve>`'s default spline control vectors, `<functionIterates>`, `<line>`'s
  `parallelTo`, `<lineSegment>`'s `slope`, `<rectangle>`'s width and height, `<stickyGroup>`'s
  drag, `<polygon>`'s rigid rotate, `<polygon>`'s centroid, `find_effective_domain`'s endpoint
  reads, and the three `nearestPoint` guards in
  `<polygon>`/`<polyline>`/`<regionBetweenCurveXAxis>`. In every one the `Complex` meets a `-`, a
  `/` or a comparison before it can be observed, and comes out `NaN` or `false` either way. They
  keep their guards — the guards say what the definition requires, and one refactor away the
  arithmetic could change — but their tests are behaviour locks and are falsified by the sentinel
  patch, not by a revert. `<circle>`'s `numericalRadius` and `<polygon>`'s centroid say so in
  place, as does `<polygon>`'s `nearestPoint` (the one where the `Complex` was traced all the way
  to the guard's own `x1`); the rest are recorded here rather than in fourteen comments.
- **Rebuild an expression with an engine method, not from its `.tree`.** The engine holds `5.1`
  exactly, as `51/10`; the JSON AST that `.tree` produces has only f64, so a `fromAst(...)` round
  trip silently makes the expression inexact. Nothing looks different afterwards — the value is
  the same to fifteen digits — but the exact-arithmetic entry points refuse it. `critical_points`
  returns `null` outright for a formula with one inexact coefficient, which is how negating a
  formula as `fromAst(["-", formula.tree])` cost every `<function>`'s *maxima* both their exact
  locations and the pole rejection that needs the complete root set, while its minima kept both.
  `utils/extrema.js` had two such negations — `find_local_global_maxima`'s `formulaFlip` and
  `flip_function_children`'s per-piece one — and both are now `multiply(-1)`. Reach for
  `multiply`/`add`/`substitute`: they stay inside the engine.
- **`evaluate_to_constant()` can return a math.js `Complex`, and the vendored
  declaration said otherwise.** Legacy returned a plain number for a real value and a complex one
  for a non-real value, and the engine keeps that contract — `fromText("i").evaluate_to_constant()`
  is `{re: 0, im: 1}`, not `null`. `packages/math/src/vendored/math-expressions.d.ts` declared
  `number | null`, which mattered only after the seventh pass made `copyDtsFiles` deliver these
  declarations to consumers: from then on the narrow type type-checked code that cannot hold what it
  is handed. Widened to `number | Complex | null` (the `Complex` type was already declared in that
  file, and `evaluate()` beside it already uses it), which immediately found two: the identical
  `numberFromSerializedAst` in `doenetml-to-pretext` and `doenetml-prototype` promised `number` and
  returned `evaluate_to_constant() ?? NaN`, so a non-real value left a `{re, im}` object in a
  declared `number` — and `graph-point.tsx` puts the result straight into a plotted coordinate.
  Both now use `toNumberOrNaN`, which is the helper that exists for exactly this and catches both
  the `null` and the `Complex` case.
- **Sparse vector ASTs are marked, not guessed at**: `markUnspecifiedComponents` writes the
  `UNSPECIFIED_COMPONENT` marker into empty slots (`Point.js`, `Ray.js`, `Vector.js`,
  `DirectionComponent.js` leave holes; `JSON.stringify` would turn them into `null`, which the
  engine rejects).
- **Unpadded container delimiters in text output** (`(0, 0)`, not `( 0, 0 )`). Two traps for
  anyone updating tests elsewhere: `toLatex` is unchanged (`\left( 1, 2 \right)` keeps its
  padding), and padding only counts when it separates a delimiter from real content — prose
  parentheses and deliberately partial `(2, )` must not be touched.
- **`getComponent` in `packages/math/src/components.ts`** is a `try`/`catch` over upstream's
  throwing `get_component`, restoring the legacy contract for call sites that use the throw as a
  type test. The raw `get_component(` sites elsewhere (measured: 36 in `packages/doenetml/src`,
  4 in `@doenet/utils`, 22 in `doenetml-worker-javascript`) are each guarded by a shape test, a
  `try`/`catch`, or an earlier boolean — except the eight unguarded reads named in the follow-ups
  below, five of which are shadow reads.

## Known risks and open product decisions

- **A function's two numeric paths can disagree, and neither disagreement is loud.** DoenetML
  reaches the engine for numbers two ways: `Expression#f()`, which compiles the tree to math.js
  and is what a `<function>` plots and what root-finding samples; and the engine's own evaluators
  (`evaluate_to_constant`, `evaluate_many`), which are what `<number>$$f(2)</number>` and the
  extrema sampler use. A head missing from *either* one produces `NaN` per sample rather than an
  error, so the failure is invisible: `nthroot` was unevaluable through `f()` at every input while
  grading it worked perfectly (twelfth pass), and `erf` was the mirror image — it plotted a correct
  curve while `<number>$$f(0.5)</number>` read `NaN` (thirteenth pass). Both are fixed upstream and
  the sweep for siblings has now been done: every spelling an author can type is probed through
  both paths by
  `packages/doenetml-worker-javascript/src/test/math/appliedFunctionSymbols.test.ts`, whose first
  assertion fails if a spelling is added to `appliedFunctionSymbolsDefault` without a probe.

  There is a **third** numeric path, and the sweep did not cover it: `equals` samples through the
  engine's `eval_complex`, which classifies an application it cannot evaluate as an *opaque
  variable* rather than as `NaN` — so its failure shape is an equality that answers `false`, not a
  value that reads `NaN`. `det` and `trace` landed there: `\det[[1,2],[3,4]]` simplified to `-2`
  and compared unequal to `-2`, and `evaluate_to_constant` answered nothing at all. That was the
  seventh grading-reaching divergence, found at the fourteenth pass and fixed upstream at the
  fifteenth (see the closed entry in `MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md`). The "matrix
  reducers" block in this test file now probes all three paths rather than the two it guarded, and
  the `NO_SCALAR_KERNEL` list that excused `det` from the second — the place the omission was
  codified on this side — is empty.

  One disagreement survives deliberately. `f()` hands a `Pow` node to math.js, which takes the
  principal complex branch for a fractional exponent, while the engine's own evaluators take the
  real branch for an odd root — so `x^(1/3)` at a negative input is a gap when plotted and the real
  cube root when graded, whereas `cbrt` and `nthroot` are real on both. That gap is unchanged from
  the JavaScript library (which also evaluated the power spelling principal through `numericalf`),
  so it is a standing difference rather than a regression; closing it means mapping the odd-root
  `Pow` shape onto `nthRoot` in the engine's `tree-to-mathjs.ts`. It does not currently reach the
  extrema output, because `find_local_global_minima` skips any grid cell whose `f` value is `NaN`
  before it consults the derivative grid.
- **`<floor>`/`<ceil>` and `simplify`'s `floor`/`ceil` disagree.** The components still nudge a
  value within relative `1e-15` of an integer onto it (`MathOperators.js`) — a repair for the f64
  the JavaScript library held every decimal in; the engine holds decimals exactly and needs no
  repair. So `<floor>3.999999999999999</floor>` answers `4` while
  `<math simplify>floor 3.999999999999999</math>` answers `3`. Both are pinned as they behave,
  with the disagreement written down at the test; which is right is a product decision nobody has
  taken.
- **No differential grading harness or memory baseline exists.** Semantic divergence in grading is
  the primary risk of the engine switch and the ordinary suites are all that guard it. A green
  suite is weaker evidence than a divergence ledger, and the review measured how much weaker: it
  turned up **eighteen** wrong-answer-on-grading defects, and no pre-existing test named any of them.
  The first two came from the branch's first full CI run (a float-valued `1` that was not the
  multiplicative identity, so `<math simplify expand>` of `0.5(2x-2)(x+1)` failed a
  `symbolicEquality` check a correct answer should pass; and a fuzzy unordered term re-match that
  fired when its tolerance was never spent, so `<answer symbolicEquality allowedErrorInNumbers>`
  accepted a reordered response it is tested as refusing). The third, fourth and fifth were found
  only by reading or by deliberately probing:
  `default_order` was not a normal form, so `simplify="normalizeOrder"` could grade one answer two
  ways depending on how the student wrote it; the odd-root sign extraction treated *unknown*
  realness as permission, so `equals` answered `true` for a symbolic pair and `false` for its
  `x = 1` instance; and odd roots of negatives split by whether the radicand was a perfect power,
  which cost four `<answer>` cases that scored 1 against legacy — measured end to end on both trees
  at the tenth pass, fixed upstream at the eleventh, and now pinned by
  `answerValidation/oddRootsOfNegatives.test.ts` here. The sixth was found at the thirteenth pass
  and did not look like a grading defect at first: `erf` had no evaluation kernel, which showed up
  as a `<function>erf(x)</function>` that plotted correctly and reported `NaN` for
  `<number>$$f(0.5)</number>`. It reaches grading because `equals` decides numeric constants
  through the same evaluators — measured on the unfixed engine,
  `equals(erf(0.5), 0.5204998778130465)` is `false`, so a correct student answer was marked wrong.
  Fixed upstream and pinned in the crate's `tests/erf.rs` and the compat suite. The seventh came
  from asking what *else* the fifth and sixth implied, and is above: `equals` samples on a third
  path, where an unevaluable head becomes an opaque variable rather than a `NaN`, and `det` and
  `trace` compared unequal to their own values. Found at the fourteenth pass, established as a
  regression against legacy and fixed at the fifteenth. The eighth is the *same split on the same
  path*, found at the sixteenth pass by asking which other applications the folding layer and the
  sampler could disagree about: `f((a, b))`. Legacy's parser wrote one tree for `mod(7,3)` and
  `mod((7,3))` — a head applied to a tuple — so the extra parentheses cost nothing and both
  answered `1`. This parser keeps the spellings apart, and only the fold put them back together, so
  `simplify(mod((7,3)))` was `1` while `equals(mod((7,3)), 1)` was `false` and
  `evaluate_to_constant` was `None`. Both layers now go through one helper,
  `normalize::spread_list_argument`, the way `det`/`trace` go through `matrix::scalar_reduction`.
  (The eighteenth pass then closed the *parenthesized* spelling one layer earlier still: the
  parsers flatten a lone `Tuple` argument, so `mod((7,3))` is literally the tree `mod(7,3)` before
  normalization sees it. The helper is still what makes `mod([7,3])` and
  `["apply","mod",["list",7,3]]` work, and the split it repaired was real either way.)

  The ninth is not an engine defect at all but a DoenetML one, and it is the *other* recurring
  shape: `evaluate_to_constant` answers `null` where legacy answered `NaN`, and `null` coerces to
  `0`. `<isBetween lowerLimit="-1" upperLimit="1">x</isBetween>` reported a free variable as lying
  inside the interval, because `null > -1 && null < 1` is `true` while `NaN > -1` is `false`. Its
  two siblings in the same file guard with `Number.isFinite`; this one did not. Found at the
  seventeenth pass, pinned in `booleanoperatorsonmath.test.ts`, and it is why follow-up 3 below is
  a follow-up rather than closed — the population it names is where the rest of this class lives.

  The **tenth and eleventh** are that same `null`-coerces-to-`0` shape, found at the eighteenth
  pass by sweeping the population follow-up 3 names rather than by waiting for it. Both are
  DoenetML's, not the engine's. `<lineSegment>`'s public `slope` read its four endpoint
  coordinates raw, so `endpoints="($blank,1) (3,4)"` reported the slope of `(0,1)–(3,4)` — the
  number `1` — for a segment that has none; `slope` is `createComponentOfType: "number"` and
  reaches `<answer>` through `<when>`, so a student who submitted nothing scored full credit.
  And `periodicSetEquality` mapped the offsets a student typed through the raw call before
  `mod(offset₀ − offset, period)`, so an answer made entirely of free variables looked like it
  started on the set and collected a third of the credit under `matchPartial`. Pinned in
  `linesegment.test.ts` and a new `math/periodicSetEquality.test.ts`, each verified to fail
  without its fix.

  The **twelfth, thirteenth and fourteenth** are the same shape again, found at the nineteenth
  pass by disbelieving follow-up 3's own dismissal of them (see below). `<constrainTo>` hands a
  `nearestPoint` definition the constrained point's coordinates as *math expressions*, so a point
  with a blank or symbolic coordinate arrives un-evaluated — and `null` is `0` to the distance
  arithmetic, where `NaN` had made every candidate distance fail its comparison and left the point
  alone. `<polygon>`, `<polyline>` and `<regionBetweenCurveXAxis>` therefore *snapped* such a
  point onto themselves. The measured document is worth stating in full, because nothing in it
  looks like a math bug:

  ```
  <mathInput name="mi" />
  <graph>
    <polygon name="poly" vertices="(0,0) (4,0) (4,4) (0,4)" />
    <point name="P" x="$mi" y="9"><constraints><constrainTo>$poly</constrainTo></constraints></point>
  </graph>
  <answer><award><when>$P = (0,4)</when></award></answer>
  ```

  With the input left empty, `P` sits at exactly `(0, 4)` and the answer scores **full credit for
  a student who entered nothing**. `<circle>`, `<line>`, `<parabola>` and `<curve>` were already
  guarded — the identical four-line `Number.isFinite` idiom — so this is the ninth/tenth/eleventh
  lesson a fourth time: the guard existed and three call sites did not use it. Fixed in all five
  unguarded definitions (`<discreteSimulationResultPolyline>` and `<regionBetweenCurves>` are the
  same code reached by the same path, fixed for symmetry rather than from a reproducer), each
  pinned by a test verified to fail without its fix.

  The **fifteenth through eighteenth** are the last of that shape, and they are the reason it is
  now fixed at its source rather than one call site at a time. The twentieth pass changed
  `evaluate_to_constant` to answer `NaN` — legacy's answer — instead of `null`, and swept the 269
  non-test call sites for reads that computed with the raw result. Six sites came back; the
  twentieth pass verified two of them end to end and withdrew its claim about the other five. The
  twenty-first verified those five, by restoring the previous engine pin *and* reverting each
  guard and measuring what the document reported:

  - `<curve through="(1,2) (a,b) (5,6)">` with `<bezierControls>` — `controlPoints` for the
    symbolic through point was the bare control vector `[[1,1],[-1,-1]]`, because
    `null + vectorX` is `vectorX`: the control points of a point that is nowhere, reported as if
    it sat at the origin. **Reproduces.**
  - `<curve through="(0,0) (a,b) (2,3)" />` — the *default* path, with no `<bezierControls>` at
    all. `calculateControlVectorFromSpline` interpolates three consecutive through points, so one
    symbolic point read as `0` gave every control vector a finite, plausible value
    (`[-0.267, -0.4]` at index 1) describing a spline through the origin that nothing in the
    document asked for. **Reproduces.**
  - `<polygon vertices="(1,2) (a,b) (3,4)" rigid rotateAround="vertex" />` — dragging it rotated
    the symbolic vertex about the origin and wrote the result back over the symbol: `(a,b)` became
    `(0.156, -0.071)` and the third vertex moved to `(2.84, 4.15)`. **Reproduces**, and it is the
    only one of the class that *destroys* authored content rather than mis-reporting it.
  - `<cobwebPolyline>` with a vertex the student never placed — the squared distance from the
    attractor came out exactly `0` (`null - null`), so it fell inside `attractThreshold` and
    `correctVertices` read `[false, true]`. **Reproduces**, and it is a grade.
  - `<functionIterates initialValue="(a,b)">`, multi-dimensional — **does not reproduce.** The
    numerical function guards its own input, so the orbit was already `(NaN,NaN)`. The site was
    worth hardening for the `Complex` arm; it was not producing a wrong number. This is the one
    the twentieth pass had already checked, and the twenty-first re-checked independently.

  Each of the four is pinned by a test in `curve.bezier.test.ts`, `polygon.test.ts` and
  `cobwebpolyline.test.ts`, all four verified to fail against the previous pin with their guards
  reverted. The honest summary of the sweep is therefore *six sites hardened, four confirmed
  user-visible defects among them, one confirmed not a defect, and `<angle>`'s the sixth* — and
  the sentinel change is what makes the remaining ~890 unswept reads safe by default.

  Read the eighteen together and the pattern is not "the engine is wrong" but "the suites test one
  path at a time". **Three** of them were invisible because a *different* path answered
  correctly: `erf` plotted while it could not be graded, `det`/`trace` simplified *and* plotted
  while they could not be compared, and `f((a, b))` folded while it could not be compared. Two
  were codified as deliberate in a test's own exemption list before anyone measured them. The
  seventh and eighth are the same shape reached twice, which is the argument for the shared-helper
  habit rather than for a longer list of special cases: whenever *two* layers decide independently
  whether an application has a value, they will eventually answer differently. And the ninth,
  tenth, eleventh and twelfth-through-eighteenth say the same thing about a *guard*: a helper that
  exists (`evaluateToNumber`, or the four-line `Number.isFinite` opening of a `nearestPoint`)
  is worth nothing at the one call site that does not use it. All of them sit in a file that
  already imports the guard and already uses it a few lines away — `<isBetween>` beside two siblings that
  call `Number.isFinite`, `slope` between a `numericalEndpoints` that was fixed on this branch and
  an inverse definition that refuses, `periodicSetEquality` among six other guarded reads in the
  same function.

  `nthroot` is the mirror image of `erf` and is deliberately **not** among the eighteen: it could not
  be plotted while grading it worked perfectly, so no answer was ever marked wrong. It belongs to
  the same lesson about single-path testing and to none of the grading arithmetic — an earlier
  wording counted it as one of them and split `det`/`trace` into two to reach "four invisible",
  which is the same error twice. The `f((a, b))` *serialization* defect the eighteenth pass fixed
  is likewise not one of the eighteen, and for the opposite reason: `checkEquality` rebuilds both
  operands with `me.fromAst` one line before comparing them, so grading never saw it. It was a
  rendering regression.

## Follow-up PRs, written up so they can be opened from here

1. **`<function extend="$c.f1" />` over a `<curve>` throws — pre-existing, no math in it.** The
   shadowing `<function>`'s `domain` arrives one array level too deep (`[[interval]]`), so
   `$f.minima` (or any domain consumer) throws `TypeError: Cannot read properties of undefined
   (reading '1')` at `find_effective_domain` (`packages/utils/src/components/domain.ts`), reached
   from `find_local_global_minima` (`extrema.js`) via `Function.js`'s `minima` definition.
   Reproduces identically at the merge base against the legacy engine. Cause: `Curve.js` shadows
   `Function`'s *array* state variable `domain` onto its ordinary `domainForFunctions`
   (`domain: { stateVariableToShadow: "domainForFunctions" }`), and in
   `shadowReturnArrayDependenciesByKey`
   (`core/StateVariableDefinitionFactory.ts`) an override makes array key `"0"` depend on the
   *whole* target value, which `shadowArrayDefinitionByKey` then assigns to entry `0` — hence
   `domain[0] === [interval]`. Fix either by indexing the override value by array key when the
   target is not itself an array state variable (a two-line change, verified during review to
   clear the crash, then reverted), or by making `Curve.domainForFunctions` a proper array state
   variable; either way `shadowInverseArrayDefinitionByKey` needs the matching treatment, plus a
   regression test asserting `f.domain`'s shape and a working `$f.minima`.
2. **Eight unguarded `get_component` reads rest on an unstated invariant.** `get_component`
   throws on a non-container receiver, and these calls are not inside a `try`, so a state
   variable that is ever a scalar where a point is expected would take the update down. Five are
   *shadow* reads — `headShadow` and `tailShadow` (`Vector.js:1768`, `:1986`), `directionShadow`,
   `throughShadow` and `endpointShadow` (`Ray.js:806`, `:1058`, `:1287`). The other three read
   something else unguarded: `desiredStateVariableValues.parallelCoords` in `LineSegment.js:1581`
   and `:1588` and in `Line.js:1656`, and `globalDependencyValues.unnormalizedDirection` in
   `DirectionComponent.js:322`. (`DirectionComponent.js:274` looks like a ninth and is not — the
   `vectorOperators.includes` shape test at `:265` guards it, a route
   `packages/math/src/components.ts` does not currently credit.) No route producing a scalar was
   found for any of them — the attributes are all `createComponentOfType: "point"` — so this is an
   unstated invariant, not a known bug. Closing it means proving the invariant and asserting it
   once, or deciding what a non-container receiver should mean.
3. **Sweep the remaining unguarded `evaluate_to_constant()` reads.** *(Retitled at the
   twenty-second pass. It read "sweep the remaining raw null-coercions", which was the right task
   while the engine answered `null`; the twentieth pass fixed that at the source, so what is left
   to sweep is the `Complex` arm and the general discipline, not a coercion hazard. The history
   below is kept as written, because what it records is where defects were actually found.)*

   `evaluate_to_constant()` occurs **260 times across 67 files** in `packages/*/src` outside the
   test trees — 30 of those in comments, so **230 live call sites** (`grep -rn
   "evaluate_to_constant(" packages/*/src`, dropping `/test/`, `*.test.*` and the vendored
   declarations; re-derived at the twenty-fifth pass — only the comment total moved, by the one
   the twenty-third pass's comment sweep netted, and the live count is unchanged — and down from
   the eighteenth's 254 live as passes replace sites with
   `toNumberOrNaN`/`evaluateToNumber`). That is the *population*, not the
   defect count, and the distinction is the whole reason this is a follow-up rather than an
   emergency: most sites hand their result straight to `Number.isFinite`, which rejects both a
   `null` and a `Complex` correctly. The eighth pass
   isolated the **204** that had no immediately following
   `Number.isFinite`/`isNumericConstant`/`null` test, read all 204, and reproduced against a real
   core every one whose result reaches arithmetic or a `number`-typed state variable; **six** were
   wrong (`<polygon>`'s centroid, `<vector>`'s `numericalEndpoints`, `<ray>`'s
   `numericalEndpoint`, `<angle>`'s third point, `<math>`'s `.number`, `<cell>`'s `.number`), and
   each was fixed with a regression test that fails without its fix.

   Re-measured at the eighteenth pass over the same packages plus `doenetml-prototype` and
   `doenetml-to-pretext`: **254 live call sites** (300 occurrences, 46 of them in comments), of
   which **44 are unguarded**. Reading all 44 turned up **two** more wrong answers —
   `<lineSegment>`'s `slope` and `periodicSetEquality`, the tenth and eleventh defects above —
   plus one contract violation with no reproducer (`<piecewiseFunction>`'s `numericalfs` returning
   `null` where every sibling branch returns `NaN`, character-for-character the code this branch
   already fixed in `Function.js`). All three are fixed here.

   The eighteenth pass then sorted the rest of the 44 into three groups and called all of them
   safe. **Two of the three claims were wrong, and one was hiding three live grading defects** —
   which is the single most useful thing to know about this ledger, and the reason the remaining
   entries below are stated with what was actually measured rather than with a category:

   - *"pointer-coordinate paths where the input is a number by construction (the six `nearestPoint`
     definitions)"* — **wrong, and the twelfth-through-fourteenth defects above came out of it.**
     `nearestPoint` is not reached only by a pointer. `ConstrainTo.js:118` passes the constrained
     point's `variables` straight through as math expressions, so a `<point>` with a blank or
     symbolic coordinate reaches every one of these definitions un-evaluated. `<polygon>`,
     `<polyline>` and `<regionBetweenCurveXAxis>` all snapped such a point onto themselves; the
     other four (`<circle>`, `<line>`, `<parabola>`, `<curve>`) were already guarded, which is
     what made the group look uniform from a distance. Now fixed in all five that were not.
   - *"rendering-only (`<angle>`'s `numericalPoints`/`numericalRadius`, whose renderer guards)"* —
     **half wrong.** `angle.tsx` guards `numericalRadius` with `Number.isFinite` at two places and
     guards nothing about the point coordinates, which reach JSXGraph, where `null` reads as `0`.
     Measured: `<angle through="($mi,1) (0,0) (1,0)" />` with an empty input gives
     `numericalPoints = [[null,1],[0,0],[1,0]]` — a real `null`, disambiguated against
     `<curve>`'s `numericalThroughPoints` in the same document, which correctly holds `NaN`.
     `numericalPoints` is `forRenderer` and not `public`, so no grading path reaches it and it was
     a display defect rather than a grading one. **Fixed at the twentieth pass** — `Angle.js` reads
     the coordinates through `evaluateToNumber` now — so it is no longer part of this follow-up;
     the entry stays because the *reasoning* that filed it as safe is what was wrong.
   - *"latent with no consumer (`<line>`'s `numericalCoeff*`)"* — **wrong reason, right verdict.**
     They are consumed, by `Line.js`'s own `nearestPoint`, which guards with `Number.isFinite`.

   What was checked and *is* genuinely benign, with the reason rather than the category:
   `ChoiceInput`/`CollaborateGroups` (`Number.isInteger`), `<angle>`'s other reads (a
   `Number.isFinite` block immediately below), `<graph>`'s spacing (`spacing > 0` rejects both),
   `MathOperators`/`SolveEquations`/`MathBaseOperator`/`PeriodicSet` (guarded), `clampFunction`
   and `wrapFunctionPeriodic` (both open with `Number.isFinite`), `<number>`'s four reads
   (`me.fromAst(NaN).evaluate_to_constant()` is `NaN`, so `valueForDisplay` cannot see `null`),
   `<functionIterates>` (the raw array does hold `null`, but `numericalfs` converts it, so the
   public `iterates` are `NaN` as before — latent only), and `<sequence>`'s two reads
   (`Math.floor(null * …)` and `Math.floor(NaN * …)` both end at `length = 0`; only a lost
   `console.warn`). `booleanLogic.js` and `checkEquality.js` — the grading core — are clean: every
   `evaluate_to_constant` in them is guarded, and their `.tree` reads are structural.

   One entry is worth naming as a trap rather than a defect: `sequence.js:536` is unreachable from
   a document today, but if a `null` ever reached `exclude`, `returnSequenceValues` silently drops
   the value `0` (`[null]` → `[-2,-1,1,2]` where `[NaN]` → `[-2,-1,0,1,2]`). It is one refactor
   from being wrong, which is the general shape of what remains.

   The mechanical rule that would have caught all six of the findings from the eighteenth and
   nineteenth passes, and roughly a third of the remaining 44: *no bare `evaluate_to_constant()`
   result may reach `<`, `>`, `-`, `/`, or a `number`-typed `setValue`*. Belongs in its own PR with
   the count re-measured first. Calibrate against 44/5, not the older 204/6 — and note that three
   consecutive passes each found real defects in the residue after the previous one declared it
   safe (the eighteenth's two, the nineteenth's three, the twentieth's seven), so the expectation
   for the next sweep should be that the residue still contains some.

   What the rule is now protecting against has changed, and that changes its urgency rather than
   its content. With `NaN` at the source, an unguarded read that reaches arithmetic propagates
   `NaN` and fails loudly; the residue is a `Complex` reaching a real-valued consumer, which is
   rarer and does not silently read as `0`. The twenty-first pass measured four of the twentieth's
   seven hardened sites as having been live defects against the previous pin and none against this
   one. So this is now a hardening sweep, not a bug hunt — and the twenty-fourth pass narrowed
   what it is worth sweeping *for*. An earlier wording here said `<` and `>` against a `Complex`
   "are decided by `Object.prototype.valueOf` and answer confidently"; measured, they are decided
   by math.js's own `valueOf`, which returns the string `"2i"`, and they answer `false` in **both**
   directions. That is still worth finding — a range test that excludes silently, a comparator sort
   that orders arbitrarily — but it is a narrower target than "answers confidently". The three
   operations that do more than answer `false` are `+` (a string), `me.fromAst` (a throw) and
   storing the value in a `number`-typed state variable; see the conventions section.
4. **The extrema search's remaining gaps are the two the exact roots cannot close on their own.**
   Three quarters of this item is now fixed and only the redesign is left. `exactCriticalPointsOf`
   returns the *complete* real root set of `f'` when the derivative is rational, so
   `utils/extrema.js` can decline both estimators where no extremum can be — see the `<function>`
   extrema entry in the changeset.

   Two corrections to earlier write-ups of this item, both from measurement:

   - The fourteenth pass predicted the `fminbr` branch would be harmless and could keep running.
     It is in fact where the surviving spurious minimum came from, since `result.tol` steps far
     enough either side of the point it converges on that a pole reads as a strict minimum.
   - The fifteenth pass declined a cell holding none of the roots and called that "independent of
     where the grid falls". It is not, quite: a cell can hold a root **and** a pole, and then the
     cell test is satisfied and `fminbr` still descends into the pole. `(x-5)^2/(x-5.1)^2` is the
     shape — the only root of `f'` is 5, on the left edge of the cell that holds the pole at 5.1 —
     and it reported a maximum of 3.01e10 at 5.100000576. The sixteenth pass asks the question of
     the converged *point* instead: a reported minimum must be at one of the known roots, within
     `fminbr`'s own convergence width. That is what is now grid-independent.

   `functionTag.test.ts` pins the off-grid pole and its negation, asserts the four exact locations
   to 1e-12 — closing the "no refinement round-off" half, which the 1e-3 tolerance on the other
   assertions could not distinguish — and pins the root-and-pole-in-one-cell shape separately.

   Also fixed: the derivative and the exact roots are computed once and carried down through the
   recursion. An earlier draft of this item said they were recomputed "on each of up to ~1000 cells
   × 100 recursion levels"; measured, the per-cell claim was wrong — the loop only *reads* the
   finished list, and the work happens once per entry to the function. Per *recursion level* it was
   real, and `critical_points` is what makes it worth removing. On
   `(x-1)(x-2)…(x-12)` over the default domain, finding the minima and the maxima together made
   three `critical_points` calls — one per hunt, plus one for the single level of recursion — at
   about 98ms each. Toggling only the memo, on otherwise identical code: 412ms → 314ms, `-24%`
   (`sin(20x)+x^2/100`, which recurses sixteen times over a much cheaper derivative, 72ms → 63ms).
   Functions that do not recurse are unchanged, and those cases measured inside the run-to-run
   noise.

   **Left, by design and now the only thing left here:** a critical point that touches zero without
   crossing is still invisible, and a cell holding several roots still yields one — nothing looks
   for a root except a bracketed sign change. Driving the search from the exact roots instead of
   from the grid would fix both, and it is a rewrite of the loop rather than a patch to it, so it
   belongs in its own PR.
5. **`flip_function_children` flips a child's formula but not its interpolated coefficients**
   (`utils/extrema.js`). The maximum hunt is the minimum hunt on a negated function, and for a
   piecewise function each child is negated separately. The interpolated branch writes
   `flippedStateValues.coeffsFlip`, but the consumer — `find_local_global_minima`, reached through
   `find_minima_of_piecewise` — reads `coeffs`, which `{...stateValues}` has already copied
   *unflipped*. So a `<piecewiseFunction>` with a through-points `<function>` piece has that
   piece's `numericalf` negated and its cubic coefficients not, and its maxima are computed as the
   minima of the un-negated spline. **Pre-existing and not engine-caused** — identical on
   `upstream/main` (`extrema.js:1178` there), it predates the branch (`Global extrema (#2205)`),
   and it involves no engine call at all. Recorded here because the fifteenth pass was in this
   function fixing the *formula* branch beside it and would otherwise have looked past it. The fix
   is one word (`coeffsFlip` → `coeffs`) plus a test with a through-points piece, and it belongs
   with whatever PR takes the root-driven search left open in item 4 above.
6. **`@doenet/static-assets`' `math-assets.json` is out of step with the parser's real
   applied-function list, and the generator is the copy that is wrong.**
   `packages/static-assets/src/generated/math-assets.json` carries an
   `appliedFunctionSymbolsDefault` of **65** entries, missing `cbrt` and `nthroot`; the
   authoritative list in `packages/doenetml-worker-javascript/src/utils/math.ts` has **67**. Its
   one consumer is `packages/doenetml-worker-rust/lib-js-wasm-binding/src/math-utils.ts`, which
   uses it as the parser's applied-function list, so in that realm `nthroot(x,3)` parses as a
   product of letters rather than as a root. Pre-existing — identical on `upstream/main`, and the
   engine switch neither caused it nor changed it.

   An earlier wording called this *staleness* and proposed extending `schema-freshness` to run
   `build:assets`. That fix would do nothing, and the eighteenth pass measured why:
   `packages/static-assets/scripts/generate-math-assets.ts` holds its **own** hard-coded 65-entry
   list, which is byte-for-byte what the committed JSON already contains. Re-running the generator
   changes not one character. The divergence is between the generator and the worker's list, which
   the generator duplicates instead of importing — so the fix is to make the generator read the
   worker's list (or move that list somewhere both can import), and only then is a freshness check
   worth adding.
7. **Engine-level items** live upstream: `MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md` here (three open
   items, none reaching grading — the seventh grading-reaching divergence, `equals` reading a
   determinant as an opaque variable, was fixed at the fifteenth pass) and
   `active-plans/PR84_REVIEW_KNOWN_ISSUES.md` in the math-expressions repo (the full crate/compat
   ledger). *(Item 7 had been swallowed into item 6's last line by a missing newline since it was
   written, so the list read 1–6, 8, 9.)*
8. **Smaller, all measured during review, none blocking.** CI installs no `binaryen`, so
   `build-wasm.sh`'s `wasm-opt -Oz` is skipped and every published bundle carries the unoptimized
   core *twice* (standalone and the worker) — and a developer who happens to have `wasm-opt` on
   `PATH` builds a materially smaller, different artifact than CI does, which
   `check-bundle-size.mjs` cannot see. `packages/lsp/test/language-server.test.ts` boots an LSP
   worker in each of six `it()`s and terminates none (node realm, torn down at end of file, so it
   is a tidiness item rather than the OOM shape the PreTeXt and prototype suites had).
   `Function.js` carries four hand-copied `inputMathFs` blocks — two symbolic, two numeric — and
   the new `inputNumericFs` flag correctly went on the numeric pair only, which means correctness
   now rests on telling four look-alike blocks apart; extracting
   `symbolicInputFs`/`numericInputFs` would make the pairing structural.
9. **Five packages still do not type-check, and are excluded from the new `tsc` gate.** Until the
   eighteenth pass nothing in CI ran `tsc` at all: `Lint Typescript Code` runs Prettier and a
   case-insensitive-filename check and nothing else, and `packages/doenetml`'s `vite build` *logs*
   every `vite-plugin-dts` diagnostic and still exits `0` (measured: 43 logged, exit 0). That is
   how the sixteenth pass's widening of `evaluate_to_constant` could leave 22 fresh `TS2322`s in
   `packages/doenetml` and one in `doenetml-worker-rust` without turning anything red; the
   seventeenth pass fixed those 23 by hand.

   The gate is now `npm run typecheck` (`scripts/typecheck.mjs`), a step in the **Build** job —
   there rather than in the lint job because the root `paths` mapping resolves `@doenet/…` to a
   package's `dist`, so type-checking needs the build. It discovers packages rather than listing
   them, so a new one is gated the day it is added, and it fails on a stale exclusion — in both
   senses. A package can leave the tree, and it can be *fixed*; the second is the likelier way an
   exclusion goes stale and the one the check originally missed, so an excluded package is now
   type-checked like any other and the run fails when one comes back clean. 22 packages pass, 5
   are excluded and confirmed still unclean, in about 36 seconds all told — including
   `packages/doenetml`, which is where the 22 errors were, and `packages/math`, which is where
   this branch's type surface lives. Making `packages/doenetml`
   clean cost three edits, not eighteen: 16 of its 18 pre-existing errors were one
   `LabelLikeJXG.update` declaration (jsxgraph types the `.label` property's `update` as
   `Function`, which is assignable to no specific signature), and the other two were a `RoundType`
   missing a `typeof` and a `this` in an object-literal method.

   What is left for a follow-up is the five packages the gate skips, **59 errors** in total, with
   the counts measured on the branch: `doenetml-worker-javascript` (**35**, in
   `core/CompositeExpander.ts` and `core/StateVariableDefinitionFactory.ts`),
   `vscode-extension` (**18**), `utils` (**2**), `parser` (**2**), `test-cypress` (**2**). None is
   in a file this branch touches, and the fix for each is a typings question with no math in it.
   Deleting a package's line from `KNOWN_UNCLEAN` is how it re-enters the gate — and the gate now
   makes that mandatory rather than optional.

   Two of those five were described wrongly when they were recorded, and both descriptions are
   worth correcting because they are what a follow-up would budget from.
   `doenetml-worker-javascript`'s 35 are *not* "all implicit `any`": 23 are (TS70xx), but 12 are
   real mismatches — ten `TS2339 Property 'returnDependencies' does not exist`, one `TS2345`, one
   `TS2554`. And `vscode-extension`'s 18 are not React code needing work: every one is
   `TS2812`/`TS2584`/`TS2304`/`TS2552`, and `tsc` names the fix itself — that package's own
   `lib` is `["es2020", "WebWorker"]` with no `dom`, so `scrollTop`, `addEventListener` and the
   JSX namespace are all missing from a file that renders a preview window. Adding `"dom"` is a
   one-line follow-up; it is out of scope here only because nothing about it touches the engine.

   Note that the seventeenth pass reported "18 pre-existing errors" as the blocker; that was
   `packages/doenetml` alone. The eighteenth pass corrected it to a repo-wide 75, which is also
   wrong — 75 reconciles with nothing measurable, and the five entries in `KNOWN_UNCLEAN` sum to
   59 (77 if `packages/doenetml`'s own 18, fixed by that pass, are added back).
10. **`numberFromSerializedAst` is copied into two packages, and should live in `@doenet/utils`.**
    `packages/doenetml-to-pretext/src/utils/math/math-expression-utils.ts` and
    `packages/doenetml-prototype/src/utils/math/math-expression-utils.ts` are byte-identical
    (`diff` exits 0), and were identical in pre-switch DoenetML too — so the duplication predates
    this branch, which is why it is a follow-up rather than part of it. The sixteenth pass had to
    make the same one-line fix in both, which is the argument for moving it. The move is free:
    `toNumberOrNaN` and `serializedComponentsReviver`, its only two imports, are already exported
    from `@doenet/utils`, which already depends on `math-expressions`; neither consumer is in
    `@doenet/utils`' dependency set, so there is no cycle; and both files already import from
    `@doenet/utils`, so no call site gains an import. Two things to fix while there: **neither
    package declares `@doenet/utils`** in its `dependencies` or in its wireit `build.dependencies`
    — the build works only because `doenetml-worker:build` pulls `../utils:build` in first. That
    undeclared dependency has a third instance, found at the eighteenth pass and worth fixing in
    the same PR: `packages/doenetml-worker-rust` declares only `math-expressions` while
    `lib-js-wasm-binding/src/eval-math.ts` imports five names from `@doenet/utils`, one of them
    added on this branch.

11. **A `rigid` polygon with one non-numeric vertex writes `NaN` over the numeric ones when
    dragged — pre-existing, and not the engine's.** `Polyline.js`'s rotate/dilate inverse reads
    every reference vertex as a number, so one vertex with no numeric value makes the whole
    rotation `NaN` and the update writes that back: `<polygon vertices="(1,2) (a,b) (3,4)" rigid
    rotateAround="vertex" />` comes out `[[NaN,NaN],[NaN,NaN],[NaN,NaN]]`, losing two authored
    coordinates as well as the symbol. This is what the twentieth pass's guard there *improved* —
    before it, the symbolic vertex was rotated about the origin and a plausible concrete number
    written over the symbol, which is worse — and it is loud rather than silent, so it is pinned as
    the current behaviour in `polygon.test.ts`. But it is not the right answer. The same function
    already declines an update it cannot compute (`return { success: false }` when the *moved*
    coordinate is not finite); a reference vertex that is not finite should decline the same way,
    leaving the document exactly as authored. Not fixed here because it is not something the engine
    switch caused: legacy's `evaluate_to_constant` answered `NaN` for `(a,b)` too, so this outcome
    predates the branch. Fixing it means the guard, one test expectation in `polygon.test.ts`, and
    a check of the `preserveSimilarity` path beside it. *Re-confirmed at the twenty-third pass and
    left as a follow-up rather than fixed:* the only change this branch makes to
    `calculateNumericalCentroid` and to the rotate/dilate inverse's reference-vertex read is
    `evaluate_to_constant()` → `evaluateToNumber(...)`, which is the identity for a number and for
    `NaN` — so with the sentinel back to `NaN` the branch and its merge base compute this the same
    way, and the outcome is legacy's.

## What is still riding along, and should not be

Two rounds of scope-trimming have already landed (`packages/doenetml-print`'s test setup and
`renderers/doenet/div.tsx` came out; the memory-reduction instruments and the piecewise-domain
crash were flagged in the PR body). A twelfth-pass sweep of the whole diff, reading hunks rather
than filenames, finds these still in and still unrelated. None is deleted here — they are another
author's work — but each is self-contained enough to lift into its own PR, and together they are
roughly 1,100 added lines out of the branch's ~12,000 (`git diff --shortstat main...HEAD`, which
GitHub's own diffstat agrees with; 12,082 at the twenty-fifth pass). The denominator is left
rounded on purpose: it moves with every review pass while the numerator does not, and a precise
figure here has already gone stale more than once.

- **`<video>` playback state** — `renderers/video.tsx`, `components/Video.js`,
  `tagSpecific/video.test.ts` (~152 lines). The one changed component file with no math, NaN or
  `evaluate_to_constant` token in it; `time`/`duration` come from the YouTube IFrame API and never
  reach the engine. The bug reproduces at the merge base, and the Cypress specs that find it are
  gated off in CI (`CYPRESS_SKIP_YOUTUBE_TESTS`), so it was found by running that suite locally.
  It currently ships its user-visible behavior change under a math-engine changeset.
- **`.husky/format-staged.sh` + `.husky/pre-commit` + the `lint-staged` removal** (~157 lines).
  Replaces `lint-staged` wholesale; the script never mentions the submodule, `packages/math` or
  wasm. It arrived inside a merge commit whose whole message is `Merge remote-tracking branch
  'upstream/main'`, so no rationale was recorded, and two later commits are pure repair of it
  (it used `declare -A` and `mapfile`, which broke the pre-commit hook on macOS's bash 3.2).
- **The memory-reduction instruments** — `test/memory-bench.test.ts` + `memory-bench-doc.xml`,
  `cypress/e2e/tagSpecific/polygonBorders.cy.js`, `vennMeasure.cy.js` (~700 lines). The bench's
  own header names a different workstream (issue #1441); `polygonBorders` covers a
  `withLines: needBorders` optimization that landed on main in #1435 and touches no file this
  branch changes, while costing real CI time in `@group1`; `vennMeasure` is `describe.skip` with
  no assertions and reads across a package boundary with `cy.readFile("../…")`.
- **The piecewise-domain crash** — `.changeset/piecewise-domain-without-intervals.md`,
  `tagSpecific/slopeField.test.ts`, and the `domain?.[0]` guard in
  `packages/utils/src/components/domain.ts`. A real fix with its own changeset and its own
  reproducer, which the commit that added it says reproduces on `main`. The cleanest split of the
  four, with one entanglement: the same `domain.ts` hunk also carries a
  `Number.isNaN` → `isNumericConstant` conversion that *is* engine-caused.

Two more items are scope-adjacent rather than unrelated, and are called out here because their
size is misleading rather than because they should move: `utils/extrema.js`'s exact-critical-point
and batch-sampling rewrite is an algorithm upgrade that the new engine's APIs *permitted* rather
than forced (and it changes numerical output — see the changeset), and ~293 of
`packages/utils/src/components/function.ts`'s 559 lines are a de-duplication of nine open-coded
copies of `find_effective_domain`, done because the null/NaN change had to touch all nine anyway.

One thing this sweep looked for and did **not** find: unmotivated behavior drift. The
`periodicSetEquality.js` change from `return false` to `continue` reads like a new partial-credit
policy, but it is parity work — restore `return false` and `periodicset.test.ts`'s pre-existing
"partial credit with periodic set" test fails, because the new engine reports an unfilled offset
as `null` where the legacy one produced a number.

## Pre-existing defects, pushed over the edge by this diff

`packages/doenetml-to-pretext` leaked one core worker per conversion: `doenetMLToPretext` makes a
`DoenetMLToPretext`, which boots a worker, and nothing terminated it. Pre-existing, and survivable
while a worker was only the core bundle plus the core's own WASM. It stopped being survivable when
the math engine moved into every worker realm as a second WASM module: `pretext-export.test.ts`
runs ~50 conversions through one page, which measured at **+7.0 GB of Chrome across the file,
~140 MB per test, still climbing at the last one** (the same measurement with the leak fixed is
+1.9 GB, and it plateaus). On a 16 GB runner the renderer stops
servicing WebDriver near the end of the file and the round trips hang — reported as
`Command network.continueRequest ... timed out`, and read for three review passes as a wedged
WebDriver session, which was the symptom rather than the cause. `DoenetMLToPretext.dispose()`
fixes it; `test/worker-lifetime.test.ts` pins it. Reproducible either way under
`systemd-run -p MemoryMax=6G`: leaking, the file never finishes; fixed, it passes in ~66 s. On CI
the file went from 166,595 ms with two failures to ~52,000 ms with none — the extra two minutes
were the runner thrashing, not work.

The lesson generalizes past PreTeXt — anything that boots a core worker per document now holds two
WASM modules per realm, so a missing `terminate()` costs an order of magnitude more than it used
to. To be precise about who was actually affected, since the fixing commit's message overstates
it: the PreTeXt Python bridge runs one conversion per Deno process and exits, so it never
accumulated. What accumulates is any host that converts more than one document in a single realm,
which today is the test file and any long-lived page holding a converter.

`DoenetEditor.srcDocRebuildReplay.cy` (doenetml-iframe Cypress) is a documented bimodal flake — a
rebuilt iframe either runs the bundle promptly or hangs inside Chrome's module loader; two rounds
of de-flaking (#1151, #1184) reduced it without eliminating it. Its own comment names the size of
the standalone bundle as what makes the second boot expensive, and this diff makes that bundle
larger, so the branch does not cause the flake but does push on it.

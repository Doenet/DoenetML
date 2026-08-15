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
`import me from "math-expressions"` still say exactly that. Counted over `packages/`, excluding
`node_modules` and `dist`, anchored at the start of a line so comments and doc examples do not
inflate it:

| pattern | files |
| --- | --- |
| `^import me from "math-expressions";$` | 136 |
| `^import me[ ,][^;]*from "math-expressions";$` (default binding in any form) | 142 |
| `^import .*from "math-expressions";$` (anything from the specifier) | 147 |

The counts are identical at the merge base. Each consuming `package.json` declares
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
`"math-expressions": "file:../math"` to the published `^3.x` range is what unblocks publication.

Until that happens the release is blocked *mechanically*, not by convention.
`scripts/transform-package-json.ts` marks a built package `"private": true` when something the
bundle imports by name was externalized without a registry-resolvable version, and `npm publish`
refuses a private package (`.github/scripts/npm-publish-with-retry.mjs` refuses first, naming the
reason). That matters because `publish.yml` releases to npm on every successful CI run on `main`,
so merging this branch early would otherwise *publish* the broken tarball rather than merely make
one possible; now it turns the publish job red. The block clears itself when the range changes —
there is no flag to remember to flip.

Two limits of that guard, stated so nobody over-reads it. It is a **shape test on the range**, run
at build time with no network: it catches `file:`/`link:`/`portal:`/`workspace:`/`catalog:`, and a
missing range, but a registry-shaped range naming something nobody published — `^3.0.0` before
`math-expressions@3.x` exists, or the `"*"` this repo uses for private workspace packages — reads
as publishable. So the guard enforces the *edit*, and the release order still has to be followed
for the edit to be honest. And it is not atomic: the root `publish` script fans out with
`npm run publish -w …`, which continues past a workspace that exits non-zero, so a premature merge
refuses `@doenet/doenetml` and still ships `@doenet/standalone`, `@doenet/doenetml-iframe` and
`@doenet/v06-to-v07` at that dev version before the job goes red. Those three are individually
correct — they bundle the seam — but the fixed group ends up version-skewed. A preflight over all
four built manifests before any of them publishes would close that, and is a small follow-up.

## Building

A Rust toolchain is required: the `wasm32-unknown-unknown` target and a `wasm-bindgen-cli`
matching the submodule's pinned `wasm-bindgen` (`0.2.126`). CI installs it via
`.github/actions/setup-math-wasm`; the devcontainer bakes it in via the `wasm-toolchain` feature.
Every workflow checkout that builds needs `submodules: recursive` plus that action: `ci.yml`,
`publish.yml`, `gh-pages-docs.yml` and `publish-doenetml-to-pretext-python.yml` — 14 checkouts and
12 uses of the action, the two devcontainer jobs in `ci.yml` taking the checkout without the action
because the container image carries the toolchain itself.

`packages/math`'s `build:wasm` declares wireit `files`/`output` so the WASM compile caches; wireit
propagates "not fully tracked" to every dependent and `../math:build` is a dependency of four
packages, so without it CI's `WIREIT_CACHE: local` never hits. Declaring the outputs is why
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

- **NaN, not null, at every numeric boundary.** The engine reports "cannot evaluate" (`null`
  crossing to JS) separately from "evaluates to NaN", and `null` coerces to `0` in arithmetic.
  DoenetML converts at every boundary through the helper family in
  `packages/doenetml-worker-javascript/src/utils/math.ts` and `@doenet/utils`
  (`isNumericConstant`, `toNumberOrNaN`, `evaluateToNumber`, `plainComplex`); a new call site that
  forgets fails silently, not loudly. See the follow-up below for the unswept remainder.
- **Rebuild an expression with an engine method, not from its `.tree`.** The engine holds `5.1`
  exactly, as `51/10`; the JSON AST that `.tree` produces has only f64, so a `fromAst(...)` round
  trip silently makes the expression inexact. Nothing looks different afterwards — the value is
  the same to fifteen digits — but the exact-arithmetic entry points refuse it. `critical_points`
  returns `null` outright for a formula with one inexact coefficient, which is how negating a
  formula as `fromAst(["-", formula.tree])` cost every `<function>`'s *maxima* both their exact
  locations and the pole rejection that needs the complete root set, while its minima kept both
  (`find_local_global_maxima` in `utils/extrema.js`, now `formula.multiply(-1)`). Reach for
  `multiply`/`add`/`substitute` — they stay inside the engine.
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

  There is a **third** numeric path, and it is not swept: `equals` samples through the engine's
  `eval_complex`, which classifies an application it cannot evaluate as an *opaque variable*
  rather than as `NaN`. `det` and `trace` land there — `\det[[1,2],[3,4]]` simplifies and
  `evaluate_to_constant`s to `-2`, and `equals` between it and `-2` is nonetheless `false`. That
  is the seventh grading-reaching divergence the review found, it is the only one left open, and
  it is filed with a diagnosis and a fix location in `MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md`. The
  two paths the test file *does* guard agree on the matrix form, which its "matrix reducers" block
  pins.

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
  turned up **six** wrong-answer-on-grading defects, and no pre-existing test named any of them.
  Two came from the branch's first full CI run (a float-valued `1` that was not the multiplicative
  identity, so `<math simplify expand>` of `0.5(2x-2)(x+1)` failed a `symbolicEquality` check a
  correct answer should pass; and a fuzzy unordered term re-match that fired when its tolerance was
  never spent, so `<answer symbolicEquality allowedErrorInNumbers>` accepted a reordered response
  it is tested as refusing). The other three were found only by reading or by deliberately probing:
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
  Fixed upstream and pinned in the crate's `tests/erf.rs` and the compat suite.

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
3. **Sweep the remaining raw null-coercions.** `evaluate_to_constant()` is called from **277 sites
   across 67 files** in `packages/*/src` outside the test trees (`grep -rn "evaluate_to_constant("
   packages/*/src`, dropping `/test/` and `*.test.*`; re-measured at the twelfth pass and unchanged
   since the tenth, though it shrinks as passes replace sites with
   `toNumberOrNaN`/`evaluateToNumber`). That is the *population*, not the defect count, and the
   distinction is the whole reason this is a follow-up rather than an emergency: most sites hand
   their result straight to `Number.isFinite`, which rejects `null` correctly. The eighth pass
   isolated the **204** that had no immediately following
   `Number.isFinite`/`isNumericConstant`/`null` test, read all 204, and reproduced against a real
   core every one whose result reaches arithmetic or a `number`-typed state variable; **six** were
   wrong (`<polygon>`'s centroid, `<vector>`'s `numericalEndpoints`, `<ray>`'s
   `numericalEndpoint`, `<angle>`'s third point, `<math>`'s `.number`, `<cell>`'s `.number`), and
   each was fixed with a regression test that fails without its fix. What is left is therefore the
   long tail: sites added since, and the guarded majority that should be converted for uniformity
   rather than because they are broken. Mechanical but large; belongs in its own PR with the count
   re-measured first, and with the 204/6 ratio as the expectation to calibrate against.
4. **The extrema search still recomputes what it could carry down, and its "no round-off" claim is
   only just pinned.** The spurious-minimum-beside-a-pole half of this item is fixed (see the
   `<function>` extrema entry in the changeset): `exactCriticalPointsOf` returns the *complete*
   real root set of `f'` when the derivative is rational, so a cell holding none of them holds no
   extremum, and `utils/extrema.js` declines both estimators there rather than only the `fzero`
   one. The fourteenth pass's write-up predicted that the `fminbr` branch would be harmless and
   could keep running; it is in fact where the surviving spurious minimum came from, since
   `result.tol` steps far enough either side of the point it converges on that a pole reads as a
   strict minimum. `functionTag.test.ts` now pins the off-grid pole (`(x-5.1)^2`, at 5.1000006) and
   its negation, and asserts the four exact locations to 1e-12 — closing the "no refinement
   round-off" half, which the 1e-3 tolerance on the other assertions could not distinguish.
   What is left in the file is cheap and mechanical: `exactCriticalPointsOf` and the derivative
   construction are pure functions of `formula` and are recomputed on each of up to ~1000 cells ×
   100 recursion levels, and should be passed down through `argsForRecursion`. Also unfixed by
   design: a critical point that touches zero without crossing is still invisible, and a cell
   holding several roots still yields one — nothing looks for a root except a bracketed sign
   change. Driving the search from the exact roots instead of from the grid would fix both.
5. **`@doenet/static-assets`' generated `math-assets.json` is stale, and nothing checks it.**
   `packages/static-assets/src/generated/math-assets.json` is produced by
   `scripts/generate-math-assets.ts`, which runs under `build:assets` — *not* under `build:schema`,
   which is what the `schema-freshness` CI job verifies. So the copy in git has drifted: its
   `appliedFunctionSymbolsDefault` is missing `cbrt` and `nthroot` (65 entries against the source's
   67). Its one consumer is `packages/doenetml-worker-rust/lib-js-wasm-binding/src/math-utils.ts`,
   which uses it as the parser's applied-function list, so in that realm `nthroot(x,3)` parses as a
   product of letters rather than as a root. Pre-existing — identical on `upstream/main`, and the
   engine switch neither caused it nor changed it — but it is adjacent to the twelfth pass's
   `nthroot` work and it is one line of CI to prevent (extend `schema-freshness` to run
   `build:assets`, or fold the generator into `build:schema`).
6. **Engine-level items** live upstream: `MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md` here (two open
   items, neither reaching grading — the seventh grading-reaching divergence, `equals` reading a
   determinant as an opaque variable, was fixed at the fifteenth pass) and
   `active-plans/PR84_REVIEW_KNOWN_ISSUES.md` in the math-expressions repo (the full crate/compat
   ledger).
7. **Smaller, all measured during review, none blocking.** CI installs no `binaryen`, so
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

## What is still riding along, and should not be

Two rounds of scope-trimming have already landed (`packages/doenetml-print`'s test setup and
`renderers/doenet/div.tsx` came out; the memory-reduction instruments and the piecewise-domain
crash were flagged in the PR body). A twelfth-pass sweep of the whole diff, reading hunks rather
than filenames, finds these still in and still unrelated. None is deleted here — they are another
author's work — but each is self-contained enough to lift into its own PR, and together they are
roughly 1,100 of the 8,583 added lines (`git diff --shortstat` against the merge base).

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

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
host (#1375) and because one artifact behaves identically under Vitest and in the browser.

**Publishability** is the one open item, and it is upstream-solved, this-side-pending: `@doenet/math`
is `private: true`, so the externalized `math-expressions` import in a published `@doenet/doenetml`
tarball resolves to nothing — or to npm's `math-expressions@2.x`, a different engine. The
resolution is that `math-expressions@3.x` publishes to npm (its `package publishability` CI job
already verifies the tarball works, `--target web` wasm included) and this side swaps the seam per
Step 6 of `MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md`; because the seam is an alias, no call site
and no bundler rule moves — deleting the filter keeping `math-expressions` out of
`PUBLISHED_PEER_DEPS` (`packages/doenetml/vite.config.ts`) is what unblocks publication.

## Building

A Rust toolchain is required: the `wasm32-unknown-unknown` target and a `wasm-bindgen-cli`
matching the submodule's pinned `wasm-bindgen` (`0.2.126`). CI installs it via
`.github/actions/setup-math-wasm`; the devcontainer bakes it in via the `wasm-toolchain` feature.
Every workflow checkout that builds (`ci.yml`, `publish.yml`, `gh-pages-docs.yml`) needs
`submodules: recursive` plus that action.

`packages/math`'s `build:wasm` declares wireit `files`/`output` so the WASM compile caches; wireit
propagates "not fully tracked" to every dependent and `../math:build` is a dependency of four
packages, so without it CI's `WIREIT_CACHE: local` never hits. Declaring the outputs is why
`build-wasm.mjs` copies the wasm-bindgen glue into `src/generated/` rather than aliasing into the
submodule — wireit refuses an output outside the package.

## Sizes

Order of magnitude, not a fingerprint — the wasm is not byte-reproducible build to build, and CI
builds without `wasm-opt` (a developer with binaryen installed measures smaller);
`packages/standalone/bundle-budgets.json` records the same caveats. Measured at the tenth review
pass: `web`-target WASM 1.68 MiB, 2.25 MiB as base64, `dist/engine-rust.js` 2.41 MiB, ~790 kB
gzipped — against roughly 1 MiB for the JavaScript library it replaces. `@doenet/standalone`'s
main bundle *shrank* (13.82 → 11.41 MiB observed) because libraries stopped carrying private
copies of the engine once the seam was externalized everywhere.

## Conventions the switch established

- **NaN, not null, at every numeric boundary.** The engine reports "cannot evaluate" (`null`
  crossing to JS) separately from "evaluates to NaN", and `null` coerces to `0` in arithmetic.
  DoenetML converts at every boundary through the helper family in
  `packages/doenetml-worker-javascript/src/utils/math.ts` and `@doenet/utils`
  (`isNumericConstant`, `toNumberOrNaN`, `evaluateToNumber`, `plainComplex`); a new call site that
  forgets fails silently, not loudly. See the follow-up below for the unswept remainder.
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
  `try`/`catch`, or an earlier boolean — except the six shadow reads named in the follow-ups
  below.

## Known risks and open product decisions

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
  turned up **five** wrong-answer-on-grading defects, and no pre-existing test named any of them.
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
  `answerValidation/oddRootsOfNegatives.test.ts` here.

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
2. **Six `get_component` reads rest on an unstated invariant.** The `headShadow` / `tailShadow` /
   `endpointShadow` / `throughShadow` / `directionShadow` reads in `Vector.js`, `Ray.js`,
   `LineSegment.js` and `DirectionComponent.js` are not inside a `try`, and `get_component`
   throws on a non-container receiver — a shadowed point-valued state variable that is ever a
   scalar would take the update down. No route producing one was found (the attributes are all
   `createComponentOfType: "point"`), so this is an unstated invariant, not a known bug. Closing
   it means proving the invariant and asserting it once, or deciding what a non-container shadow
   should mean.
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
4. **Engine-level items** live upstream: `MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md` here (two open
   items) and `active-plans/PR84_REVIEW_KNOWN_ISSUES.md` in the math-expressions repo (the full
   crate/compat ledger).

## What is still riding along, and should not be

Two rounds of scope-trimming have already landed (`packages/doenetml-print`'s test setup and
`renderers/doenet/div.tsx` came out; the memory-reduction instruments and the piecewise-domain
crash were flagged in the PR body). A twelfth-pass sweep of the whole diff, reading hunks rather
than filenames, finds these still in and still unrelated. None is deleted here — they are another
author's work — but each is self-contained enough to lift into its own PR, and together they are
roughly 1,100 of the ~8,100 added lines.

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

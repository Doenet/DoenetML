# Migrating DoenetML to the Rust/WASM `math-expressions` — a two-stage plan

Target: <https://github.com/Doenet/math-expressions/> (main, audited 2026-07-30). What is actually
pinned is the `doenet` branch of `siefkenj/math-expressions`
([PR #84](https://github.com/Doenet/math-expressions/pull/84)), the upstream half of this work;
the audit predates it and named PR #82 as the then-pending improvement.

- **Stage 1** — swap the npm dependency for the v3 drop-in (`math-expressions-js-compat`,
  published as `math-expressions`), with its WASM **inlined** the way `CoreWorker.ts` inlines
  `lib_doenetml_worker_bg.wasm`. No DoenetML call sites change.
- **Stage 2** — add `math-expressions-rs` as a **Cargo dependency of `lib-doenetml-core`**, delete
  the Rust→JS math bridge, and re-export the math API to JS through the existing
  `lib-js-wasm-binding`. No *additional* inlining is needed: the Rust core's WASM is already
  inlined, and the math core rides along inside it.

---

## Release order

**This is the single statement of the order, and the only one.** It is a convention, followed by
the person doing the release; nothing in either repo enforces it. It matters because
`.github/workflows/publish.yml` publishes a **dev release to npm on every successful CI run on
`main`** — merging is releasing.

1. Merge [math-expressions#84](https://github.com/Doenet/math-expressions/pull/84).
2. Publish **`math-expressions@3.x`** from that repo to npm.
3. Only then merge the DoenetML side, having first replaced
   `"math-expressions": "file:../math"` with the published range (Step 6 below).

Merging DoenetML first would try to release a `@doenet/doenetml` whose bundle keeps a bare
`import ... from "math-expressions"` that resolves to nothing on a consumer's machine — or, if they
already have the unrelated `math-expressions@2.x` in their tree, silently to the *legacy JS engine*,
which is worse than a build error.

The one mechanism to know: `scripts/transform-package-json.ts` copies each externalized
dependency's declared range verbatim into the built `dist/package.json`'s `peerDependencies`, so
`packages/doenetml/package.json`'s `"math-expressions"` range is exactly the range a consumer
installs. Step 3's edit is the whole of it.

> There used to be a build-time shape test on that range that forced `"private": true` when it
> looked local, so that a premature merge turned the publish job red. It was removed at the
> twentieth review pass, at the maintainer's direction: he is the one who publishes and merges, so
> code protecting him from doing it in the wrong order is superfluous. It had also been holed six
> times over passes 13–19, twice by the pass that had just fixed it, which is its own argument.

---

## 1. Upstream state

The repo is a Rust monorepo; the JS library survives only as an out-of-tree oracle
(`tmp/js-legacy/`, git-ignored).

| Package | What it is | Which stage needs it |
| --- | --- | --- |
| `math-expressions-rs/` | The core Rust crate: text/LaTeX parsing, equality (numeric, finite-field, exact, structural), normalize/simplify/expand, differentiation, symbolic + certified integration, matrices/eigen, ODEs, assumptions, factoring, arbitrary precision. | **Stage 2** (as a crate) |
| `math-expressions-rs-wasm/` | The `wasm-bindgen` boundary (`src-rust/`) + TypeScript bindings (`src-js/`), notably the AST→math.js bridge backing `.f()`. `build-wasm.sh <target> <outdir>` accepts **`web`** and `nodejs`, with an optional `wasm-opt -Oz` pass. | Both |
| `math-expressions-js-compat/` | **Published as `math-expressions` v3 (`3.0.0-alpha1`)** — a drop-in TypeScript reimplementation of the legacy `me.*` API over the WASM core, preserving the synchronous surface. | **Stage 1** |
| `packages/playground/` | Vite/React app running Rust-WASM against canonical JS. Ships the `web` build to GitHub Pages on every push to `main`. | Reference |

### The playground already proves the browser path

`packages/playground/src/engines.ts` dynamically imports the `web` glue and calls `await r.default()`
(wasm-bindgen `init`), then adapts handles into a `me`-shaped API — `fromText`→`parse_text`,
`treeOf`→`JSON.parse(h.tree_json())`, notation through `parse_*_with_options`. Handles **are**
freed, deterministically: `if (h && typeof h.free === "function" && h.__wbg_ptr !== 0) h.free()`,
with the note that "relying on FinalizationRegistry GC corrupted the wasm heap under rapid handle
churn." So `free()` works; *GC-driven* freeing is what failed. `packages/playground/src/wasmApi.ts`
reflects the generated `math_expressions_wasm.d.ts` to enumerate every chainable `Expression`
method — a ready-made way to diff the WASM surface against our needs (§2).

### PR #82 — plan against post-#82 `main`, not today's

1. **Module reorganization** — `norm/`→`normalize/`, `exact.rs`→`eval_exact/`,
   `functions/`→`special_functions/`, `output/`→`print/`. *Stage 2 Rust code written against the
   current layout would need rebasing; do not start Stage 2 integration until #82 lands.*
2. **`simplify()` becomes the aggressive simplifier** — now does `exp(ln x) → x`, `cos(π/3) → 1/2`,
   which the JS version could not. **This is user-visible and hits us directly**: we have ~160
   `.simplify()` call sites (147 at this head), many inside answer normalization. It must be the
   first thing in the differential corpus (§3, Step 1).
3. **Equality on exact constants** — certified-stage evaluation means `equals(1/2, cos(π/3))` is
   now `true`. Almost certainly an improvement for grading, but it *changes grading outcomes*.
4. **Stronger integration** — symbolic integration handles integer powers of sin/cos with linear
   arguments; u-substitution keeps searching after a failed candidate; plus a new **numeric
   integration binding with certified quadrature at 10 significant digits**.
5. **Test/CI hardening** — 533 tests, `cargo test --workspace` in CI, warning-free docs, 19
   previously-silent tests recovered. This materially de-risks pinning a git revision in Stage 2.

### Known gaps (`WHATS_LEFT.md`, `JS_RUST_DIFF.md`)

> **As of the pinned revision, two of these are closed.** PR #84 ports MathML parsing
> (`lib/converters/mml-to-ast.ts`, exported as `converters.MmlToAst`) and the polynomial/Groebner
> subtree (`packages/math-expressions-rs/src/polynomials/`, including `compat/`). The rest of this
> paragraph is the audit's state and is left as the record of what the plan was written against.

MathML parsing (`mmlToAst`), derivative step narration, polynomial/Groebner, `equalsViaSyntax`
*with tolerance*, and richly-structured `get_assumptions` are unported. GLSL/Guppy/MathML-output
and `mathjsToAst` are marked "not needed for Doenet" — verify against our source rather than
assume. Calculus limits are **designed only**, not implemented. Also open: `Sym` interner is
append-only (slow leak); `STACK_SAFETY_PLAN` items 21, 23–26 (deep trees can overflow the WASM32
shadow stack, *including on `Drop`*); `panic = "abort"` makes reachable panics fatal to the worker.

---

## 2. What DoenetML consumes today

### 2.1 The JS surface

150 files import the library, essentially all as `import me from "math-expressions"` (139 of them
in exactly that form). The counts, the command that reproduces them, and how they moved on the
branch are in `MATH_EXPRESSIONS_ENGINE_NOTES.md`; they are stated once, there.

| Package | Files | Realm |
| --- | ---: | --- |
| `doenetml-worker-javascript` | 115 | Web Worker (+ vitest) |
| `doenetml` | 15 | Main thread (renderers) |
| `utils` | 9 | Both |
| `test-cypress`, `doenetml-prototype`, `doenetml-worker-rust`, `doenetml-to-pretext` | 1–3 each | Mixed / node |

Source (non-test) call counts. **These are audit-era figures**, measured on the pre-switch tree on
2026-07-30; they describe the *shape* of the dependency, not a current census, and several have
moved since as review passes replaced call sites with the `toNumberOrNaN`/`evaluateToNumber`
helpers. Re-spot-checked at the eighteenth pass (non-test sources only): `evaluate_to_constant` is
**206** in `worker-javascript/src` and **21** in `utils/src`, and `.tree` is **39** in `utils/src`.
The previous spot-check said 194/17/42 and had gone stale in all three. Re-measure before quoting
one.

| Call | `worker-javascript/src` | `utils/src` | `doenetml/src` |
| --- | ---: | ---: | ---: |
| `me.fromAst` | 621 | 54 | 22 |
| `.tree` (getter) | 522 | 77 | 2 |
| `.evaluate_to_constant` | 274 | 36 | 41 |
| `me.fromText` | 6 | 0 | 2 |

All packages: `.toString` 422, `.equals` 270, `.variables` 225, `.simplify` 160, `.match` 109,
`.subscripts_to_strings` 64, `.toLatex` 51, `.expand` 29, `.substitute` 25, `.context` 22,
`.f()` 21, `.functions` 12, `.tuples_to_vectors` 11, `.strings_to_subscripts` 11,
`.to_intervals` 8, `.derivative` 7, `.equalsViaSyntax` 5, plus `me.math` (re-exported math.js)
43, `me.reviver` 10, `me.converters.{textToAstObj,latexToAstObj}` 9, assumptions ~25, `isTree`,
and the `Expression`/`Tree` TypeScript types.

Tests add **6,857 `.tree`** accesses, 328 `me.fromText`, 571 `evaluate_to_constant` across 164
vitest files in `doenetml-worker-javascript` alone.

**Dependency hygiene:** at the time of the audit only
[packages/utils/package.json](packages/utils/package.json) declared `"math-expressions"`; the
other 12 packages relied on workspace hoisting. Stage 1 fixed this — every consumer now declares
`"math-expressions": "file:../math"` explicitly.

**Serialization:** `Expression.toJSON()` emits `{objectType: "math-expression", tree}` and
[parseStringify.ts:30](packages/utils/src/copy/parseStringify.ts#L30) composes `me.reviver` into
`serializedComponentsReviver`. [Core.ts:402](packages/doenetml-worker-javascript/src/Core.ts#L402)
deliberately keeps a `JSON.stringify`/`JSON.parse` round-trip through that pair. Every such
round-trip constructs fresh expressions.

### 2.2 The Rust core already calls *out* to the JS library — this is what Stage 2 deletes

[lib-doenetml-core/src/core/math_via_wasm.rs](packages/doenetml-worker-rust/lib-doenetml-core/src/core/math_via_wasm.rs)
opens with: *"This file provides an interface for accessing the Javascript `math-expressions`
library from Rust."* It declares an `extern "C"` block against `js_namespace = __forDoenetWorker`:

```rust
#[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
pub fn parseTextIntoMath(source: JsString, splitSymbols: Boolean,
                         functionSymbols: JsValue) -> Result<JsString, JsValue>;
// … toText, parseLatexIntoMath, toLatex, substituteIntoMath,
//   normalizeMath, evaluateToNumber, parseTextIntoNumber
```

Those globals are installed by
[lib-js-wasm-binding/src/index.ts](packages/doenetml-worker-rust/lib-js-wasm-binding/src/index.ts)
from `eval-math.ts`, which sits on `math-utils.ts` → `import me from "math-expressions"`.

The Rust-side representation is a JSON *string*, not a tree:

```rust
pub struct MathExpr { pub math_object: JsMathExpr }   // JsMathExpr(String)
```

and it is handed back to JS as **source code to be eval'd**:

```rust
format!("JSON.parse('{{\"objectType\":\"math-expression\",\"tree\":{}}}', serializedComponentsReviver)", …)
```

There is also an `eval_js(source: &str)` escape hatch that evaluates arbitrary JavaScript with
`MathExpressions` in scope.

So today **every math operation performed by the Rust core costs a WASM→JS boundary crossing plus
a JSON round-trip**, and the Rust core cannot do symbolic math at all without the JS library
present. Stage 2 removes this entire layer.

### 2.3 The inlining mechanism we are copying

[CoreWorker.ts:43-136](packages/doenetml-worker/src/CoreWorker.ts#L43-L136) imports the WASM as
`...bg.wasm?url`, and when that resolves to a `data:…;base64,` URL, decodes it to a `Uint8Array`
and passes the `ArrayBuffer` straight to `init({module_or_path})`. Verified: the built
`packages/doenetml-worker/dist/index.js` contains a `data:application/wasm;base64` payload — the
6.3 MB module really is inlined into the worker bundle.

Two hard-won constraints encoded there, both of which apply to any second module:

- **No `fetch`.** Blocked for blob/data URLs in the VS Code web-worker extension host (issue
  #1375); passing bytes uses `WebAssembly.instantiate(buffer, imports)` and needs no network.
- **Init exactly once per realm, behind one shared promise.** wasm-bindgen's `init` only guards
  *completed* initializations, so concurrent in-flight calls (several hosted cores booting at
  once, #1466) would instantiate twice and corrupt the module-level instance.

Note the Rust WASM is currently built `wasm-pack build … --target web --dev` — unoptimized. Its
6.3 MB is not a fair size baseline (see Stage 2, step 7).

---

## 3. Stage 1 — drop-in replacement, with inlined WASM

**Goal:** `import me from "math-expressions"` keeps working everywhere; only the implementation
changes. Ship it, measure it, and let it soak while Stage 2 is built.

> ### Implementation status
>
> **Stage 1 is done in outline and the branch has switched permanently.** The Rust engine is the
> only engine — the legacy library is no longer a dependency, and there is no build-time switch
> back to it. To A/B against the old engine, check out a commit from before the switch.
>
> - **Submodule** — `vendor/math-expressions` @ `siefkenj/math-expressions@doenet`, pinned by
>   revision. Nothing in DoenetML patches the submodule, by design.
>
> - **The seam is an npm alias, not a codemod.** Step 1 below anticipated rewriting every import to
>   a new module name. That is *not* what was done: each consuming `package.json` declares
>   `"math-expressions": "file:../math"`, so the files that already said
>   `import me from "math-expressions"` were left untouched and now resolve to `packages/math`.
>   Everything Step 1 wanted from the seam still holds — one file decides the engine, and Stage 2
>   repoints that one file — with no call-site churn at all. The consequence to remember is that
>   bundler rules (`external`, `dedupe`) must name the specifier `math-expressions`.
>
> - **⚠️ The submodule seam is a deliberate temporary bridge; the decided exit is npm.**
>   `packages/math` is `"private": true` and is never published, while `packages/doenetml` (and its
>   siblings) externalize the bare specifier `math-expressions`. Inside the workspace that is
>   correct — a `file:` dependency resolves and `@doenet/standalone` bundles exactly one copy. In a
>   *published* tarball it is not: the shipped `@doenet/doenetml` carries a bare `math-expressions`
>   import with nothing declaring it, so an npm consumer either fails to resolve it or, if they
>   happen to have the real npm `math-expressions@2.x` in their tree, silently resolves it to the
>   *legacy JS engine* — a different engine behind the same specifier, which is worse than a build
>   error. Nothing prevents that release automatically — see "Release order" at the top of this
>   document, which is the convention that does.
>
>   **The resolution is not to publish `@doenet/math` and not to bundle the seam.**
>   [math-expressions#84](https://github.com/Doenet/math-expressions/pull/84) merges, the upstream
>   repo publishes **`math-expressions@3.x`** to npm, and DoenetML depends on it from npm instead
>   of from the submodule. Step 6 below is the checklist for that swap, measured against this tree.
>   Until then this branch is not shippable, and nothing else in Stage 1 is blocking.
>
> - **`engine-rust.ts` is a straight re-export.** Upstream absorbed every gap fill we had written —
>   `Expression#f()`, the context-level operation family, the `NaN`/`±Infinity` replacer, and the
>   recursive `fromAst(Expression)` unwrap — and each was deleted here to verify the upstream fix
>   actually covered our usage. That deletion is what the seam is for; a local patch that cannot be
>   removed is a fix that did not land.
>
> - **WASM loading no longer needs a bundler rule.** Upstream's `setWasmModule` replaced the Vite
>   plugin that aliased compat's node-only `lib/_wasm.ts`. One ordering constraint remains, and it
>   is documented in `wasm-loader.ts` and `engine-rust.ts`: the loader must be *evaluated* before
>   anything parses, so `engine-rust.ts` imports it first for the side effect. Which module
>   `setWasmModule` comes *from* no longer matters — compat's assumptions handle is a lazy getter
>   now, so importing from the package root does not force the WASM to load during the barrel's own
>   evaluation the way it once did.
>
> - **`dopri`** now crosses the seam under one name (`ODESystem.js`,
>   `packages/utils/src/components/function.ts`), replacing `me.math.dopri`. `me.math` is otherwise
>   complete.
>
> - **Test expectations** — several hundred string literals across the vitest suite, unpadding
>   container delimiters (`( 0, 0 )` → `(0, 0)`). Two traps worth recording: `toLatex` is unchanged
>   (`\left( 1, 2 \right)` keeps its padding), so a whitespace sweep must skip any literal
>   containing a backslash; and padding only counts as container padding when it separates the
>   delimiter from real content — `(, )` in prose is not a tuple.
>
> - **Sizes**, measured at the current pin with `npm run build -w packages/math`: the `web`-target
>   WASM is **1.69 MiB** (before `wasm-opt`, unavailable here), which inlines as 2.25 MiB of base64
>   into a **2.41 MiB** `dist/engine-rust.js` — **792 kB gzipped**,
>   against roughly 1 MiB for the JavaScript library it replaces (a figure measured before the
>   legacy package was removed from the tree, and not re-measurable here).
>   Bundle size is not the obstacle §5-R7 feared, *provided* every
>   library externalizes the seam; three separate bundles were carrying private copies before they
>   did, which is what `packages/standalone/scripts/check-bundle-size.mjs` now guards.
>
> - **Not done, and this is the gap that matters** — the Step 0 differential harness and the memory
>   baseline (R8) were never built, so R1 (semantic divergence in grading) is still unmitigated by
>   anything but the ordinary suites. Those suites do now pass: vitest and Cypress are both green on
>   the branch, and `initMathWasmSync` runs in a real browser Web Worker on every Cypress and
>   PreTeXt-export run. That is weaker evidence than a divergence ledger, and the review measured
>   how much weaker — see the "Known risks" section of
>   [MATH_EXPRESSIONS_ENGINE_NOTES.md](MATH_EXPRESSIONS_ENGINE_NOTES.md), which lists eighteen
>   wrong-answer-on-grading defects no pre-existing test named. All eighteen are fixed; three of
>   them were invisible because a *different* numeric path answered correctly, and ten were the
>   same `null` coercing to `0` where the legacy engine returned `NaN` — a shape now fixed at its
>   source, by making the engine answer `NaN` too, rather than one call site at a time.
>
>   The failure inventory this document used to carry has been removed rather than restated,
>   because its numbers were measured against an older submodule pin and several of the divergences
>   they attributed to upstream no longer reproduce (see
>   [MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md](MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md)). Re-measure
>   before quoting a number.

### Step 0 — Evidence before code (~1–2 weeks, start now)

1. **API diff.** Generate our used-API inventory (§2.1) from source, and diff it against the WASM
   surface using the `packages/playground/src/wasmApi.ts` reflection over `math_expressions_wasm.d.ts`.
   Output: a have/need/missing matrix that stays current automatically. Resolve every
   "not needed for Doenet" claim against real code — specifically `mmlToAst`, `astToMathjs`, and
   the `me.converters.{textToAstObj,latexToAstObj}` constructor-with-options form used in 9
   places including
   [math-utils.ts](packages/doenetml-worker-rust/lib-js-wasm-binding/src/math-utils.ts).
2. **Differential corpus, weighted by what Doenet actually does.** Wrap `me` and
   `Expression.prototype` in a recording `Proxy`, run the full vitest suite plus all five Cypress
   groups, log every `(method, receiver-tree, args, result)`, then replay against v3 in Node.
   Rank divergences by call frequency. **Run this against post-#82 `main`** — the aggressive
   `simplify` and exact-constant `equals` will dominate the ledger, and they are precisely the
   changes with grading consequences.
3. **Memory baseline.** Expressions created per document render, per update cycle, and peak live
   count, via `packages/memory-benchmark`. This is the number that decides whether compat's
   no-free policy is tolerable (§3, Step 4).

### Step 1 — The seam (~2 days, mechanical)

Create one indirection module — `@doenet/math` (new package) or `@doenet/utils/math-engine` —
re-exporting `me` (default), `isTree`, and the `Expression`/`Tree` types, and declare the
dependency properly in every consuming `package.json` (fixes §2.1's hoisting bug).

*As built, no imports were rewritten:* the dependency is declared as
`"math-expressions": "file:../math"`, so the existing specifier resolves to the seam. See the
implementation-status note above.

Payoff: the engine becomes a one-line switch, a dual-engine A/B mode becomes possible, and —
critically — **Stage 2 repoints this one file instead of touching every importer**.

### Step 2 — Web-target WASM + inlined, synchronous init

The compat package currently loads a `nodejs`-target binding via `createRequire`; its browser
path is unwired. Upstream needs (small, and Doenet owns the repo):

1. Build compat's `vendor/wasm/` with `build-wasm.sh web` in addition to `nodejs`.
2. Parameterize its `lib/_wasm.ts` loader so a host can **supply bytes** instead of a URL.

On our side, mirror `CoreWorker.ts`: import the compat wasm as `?url`, decode the base64 data URL
to an `ArrayBuffer`, hand it to the loader, and gate every caller behind one shared init promise.

**The sync/async split is the one real design question here**, because the legacy `me.*` API is
synchronous:

- **In the worker** — `initSync({ module: bytes })` compiles synchronously, so with inlined bytes
  the compat API stays *fully synchronous with no `await` anywhere*. This is the ideal outcome and
  the main reason inlining is worth it.
- **On the main thread** — browsers restrict synchronous compilation of large modules outside
  workers. Renderers must therefore `await` an async `init()` during app boot, before first use;
  after that the sync API works normally. **Spike this first** — it decides whether the main
  thread can share one code path with the worker (see Step 5).

Keep the existing `external: ["math-expressions"]` in
[doenetml-worker-javascript/vite.config.ts:21](packages/doenetml-worker-javascript/vite.config.ts#L21)
so the bundle carries exactly one copy, and inline the wasm exactly once, in `doenetml-worker`,
next to the existing blob.

> **As built:** the wasm is inlined in `packages/math` itself, not in `doenetml-worker`, so every
> consumer gets the same single artifact. `doenetml-worker` *dedupes* the seam rather than
> externalizing it, because it is fetched by URL and has to stay self-contained.

### Step 3 — Node-only pilot

Compat's node path is supported *today*, so migrate node-resident consumers behind the seam
before the browser work lands: `packages/utils/src/math/subset-of-reals.ts`,
`packages/utils/src/components/domain.ts`, `packages/lsp-tools`, `packages/doenetml-print`,
`packages/doenetml-to-pretext`. Small blast radius, real signal on parse/format/equality drift,
and it keeps compat exercised in CI continuously.

### Step 4 — Handle lifetime (the one thing to watch)

Compat's alpha policy is explicit: it "does not free caller-owned handles," so a long-lived
worker accumulates WASM memory. Our worker mints expressions per state-variable evaluation *and*
on every `serializedComponentsReviver` round-trip. Options, cheapest first:

- **(a) Measure and defer.** If Step 0.3 shows bounded creation, ship Stage 1 as-is and let
  Stage 2 fix it structurally. Gate on a churn test in `packages/memory-benchmark` asserting flat
  `WebAssembly.Memory` growth over a long session.
- **(b) Dispose at the seam.** Add explicit `free()` to compat, modelled on the playground's
  `freeHandle` + `__wbg_ptr !== 0` guard, and own lifetimes inside the seam.
- **(c) Value-first `Expression` upstream.** Canonical state = plain `Tree`; materialize a handle
  only for the duration of an operation. This also kills the boundary cost of compat's uncached
  `get tree() { return JSON.parse(this._w.tree_json()); }` against our ~600 `.tree` and ~675
  `fromAst` source sites. Best answer for Stage 1 — but note **Stage 2 makes it moot**, so weigh
  the effort against Stage 2's timeline rather than doing both.

Independent of all three: the append-only `Sym` interner leaks regardless and is upstream-only.

### Step 5 — Rollout

> **Not as built:** there is no `mathEngine` flag and no two-engine CI run. The branch switched
> permanently — the legacy library is not a dependency any more, so the only way to A/B is to check
> out a commit from before the switch. The triage discipline below still applies; the mechanism does
> not.

`mathEngine: "js" | "rust"` flag through the worker, default `js`. Run the 164-file vitest suite
and all five Cypress groups under both engines in CI; triage each divergence as *Rust bug*
(upstream), *intended improvement* (adapt Doenet + tests), or *Doenet relied on an accident*.
Expect the ~6,900 test-side `.tree`/string assertions to dominate the diff — prefer normalizing
comparisons (compare parsed trees or use `equals`) over rewriting expected strings, so the suite
stops being coupled to one formatter. Flip the default only when memory is flat and the
divergence ledger is empty or accepted; keep the flag one release, then delete it.

### Step 6 — Retire the submodule for the npm `math-expressions@3.x` dependency

This is the decided end state for Stage 1, and it is **imminent, not hypothetical**: the maintainer
publishes `math-expressions@3.x` and moves this branch onto it *before* merging (see "Release
order"). What follows is a checklist to execute in one sitting, measured against this tree at the
current pin — every count and path below was re-verified at the twentieth review pass.

**What does *not* change — this is what the alias design bought.** No call site moves: the
files still say `import me from "math-expressions"`, and every bundler rule already names that bare
specifier, so all seven survive untouched — `external` in `packages/doenetml`,
`packages/doenetml-prototype`, `packages/doenetml-worker-javascript`,
`packages/doenetml-worker-rust`, `packages/utils` and `packages/virtual-keyboard`, and `dedupe` in
`packages/doenetml-worker`. `packages/standalone/scripts/check-bundle-size.mjs`'s two-binaries rule
is unaffected for the same reason.

**`packages/math` survives the swap.** The earlier hedge ("*if* it is retired") is resolved: it is
not. Its remaining job is DoenetML's, not upstream's — base64-inlining the `.wasm` into the bundle
so no extra network request is made, and calling `setWasmModule` with the `--target web` glue.
Upstream ships the glue and the binary; deciding to *inline* them is this repo's choice, and
`wasm-loader.ts` is where it lives. So the seven consumer manifests keep
`"math-expressions": "file:../math"` and it is `packages/math/package.json` that gains the npm
dependency. `packages/doenetml`'s entry is the exception — see step 2.

**The question that used to decide how much else changes — which wasm the published package ships
— is settled, and re-verified.** `packages/math` exists to hand the compat layer a `--target web`
wasm-bindgen module through upstream's `setWasmModule`, because compat's own fallback
(`lib/_wasm.ts`) loads a *nodejs*-target build through `createRequire` and there is no browser path
without an injection. The tarball used to carry only the nodejs target, which would have retired
the submodule while leaving the wasm-bindgen toolchain behind — most of the cost the swap is meant
to remove.

At the current pin it carries both. Upstream's `prepack` runs `build-wasm.sh` with no arguments,
which builds `nodejs` *and* `web`; `files` includes `vendor`, and `exports` maps
`"./wasm-web/*": "./vendor/wasm-web/*"`. Confirmed by `npm pack --dry-run` on the pinned tree: the
tarball is 44 files / 1.2 MB packed, and carries `vendor/wasm-web/math_expressions_wasm_bg.wasm`
(1.8 MB), `math_expressions_wasm.js` (99.8 kB) and both `.d.ts`. So:

```js
import * as glue from "math-expressions/wasm-web/math_expressions_wasm.js";
const url = import.meta.resolve(
    "math-expressions/wasm-web/math_expressions_wasm_bg.wasm",
);
```

That is the whole of what `packages/math/scripts/build-wasm.mjs` needs. Upstream's
`scripts/consumer/web-path.mjs` is that path end-to-end as an executable check — it asserts the
binary's wasm magic number and that it is over 1 MB, then `initSync`s it and runs `me.*` — and its
`package publishability` CI job runs it against a real tarball installed outside the workspace.

---

#### ⚠️ Two things to get right before writing any range

**1. `^3.x` will not install `3.0.0-alpha1`.** Upstream's `package.json` says `3.0.0-alpha1`, which
is a *prerelease*, and npm semver excludes prereleases from `^3.0.0` / `^3.x`. Measured:

| range | matches `3.0.0-alpha1` | matches `3.0.0` |
| --- | --- | --- |
| `^3.x` / `^3.0.0` | **no** | yes |
| `^3.0.0-alpha1` | yes | yes |
| `3.0.0-alpha1` | yes | no |

So if the alpha is what gets published, every range below must be `^3.0.0-alpha1` (or pinned
exactly), **not** `^3.x`. If upstream bumps to a release version first, `^3.0.0` is right. Decide
this before step 1, because nothing in the build checks it — the shape test that used to look at
these ranges was removed, and it never resolved them against the registry anyway.

**2. Check which repo publishes.** `.gitmodules` points at
`https://github.com/siefkenj/math-expressions.git` (branch `doenet`), while this document's prose
says `Doenet/math-expressions`. The npm package name is `math-expressions`, whose `latest` on the
registry is still `2.0.0-alpha95` — 3.x is not published as of the twentieth pass.

---

#### The checklist

1. **Publish upstream.** From `packages/math-expressions-js-compat`, `npm run verify:package`
   first (it packs, installs into a throwaway project outside the workspace and drives both loading
   paths), then publish. Note the exact published version string.

2. **`packages/doenetml/package.json`** — change `"math-expressions": "file:../math"` (line 95, in
   `dependencies`) to the published range. This is the one that matters for publication:
   `scripts/transform-package-json.ts` copies an externalized dependency's declared range verbatim
   into the built `dist/package.json`'s `peerDependencies`, so this range is exactly what a
   consumer installs. Rebuild and read `packages/doenetml/dist/package.json` to confirm.

   The other six consumer manifests (`doenetml-prototype`:109, `doenetml-to-pretext`:117,
   `doenetml-worker-javascript`:64, `doenetml-worker-rust`:116, `test-cypress`:63, `utils`:66) stay
   on `file:../math`, because they consume the seam rather than publishing it.

3. **`packages/math/package.json`** — add `"math-expressions": "<published range>"` to
   `dependencies`. Note the name collision this creates: `@doenet/math` is itself installed *as*
   `math-expressions` in every other workspace's `node_modules` (see `package-lock.json`'s
   `"node_modules/math-expressions": { "resolved": "packages/math", "link": true }`). Verify after
   `npm install` that `packages/math/node_modules/math-expressions` is the registry package and the
   root symlink is still `packages/math`.

   Then delete the nine wireit `files` globs under `../../vendor/math-expressions/` — seven in
   `build:wasm` (lines 55–61), two in `build` (74–75) — replacing them with the `node_modules`
   paths the new `build-wasm.mjs` reads.

4. **`packages/math/scripts/build-wasm.mjs`** — drop the `SUBMODULE` constant, the submodule
   existence check and the `execFileSync` of `build-wasm.sh`. What remains is: read
   `math-expressions/wasm-web/math_expressions_wasm_bg.wasm` and `…_wasm.js` out of `node_modules`,
   base64 the binary into `src/generated/wasm-bytes.ts`, copy the glue. It shrinks; it does not
   disappear.

5. **`packages/math/vite.config.ts`** — of the four aliases (lines 126–147), three become plain
   node resolution (`math-expressions-js-compat` → the package; `math-expressions-js-compat/lib/*`
   → its `./lib/*` export; `math-expressions-rs-wasm` → gone, it is bundled into upstream's
   `dist/`) and `math-expressions-wasm-glue` points at whatever step 4 writes. **Keep
   `dropDefaultWasmPath()`** (lines 34–84) — the glue still carries the
   `new URL('…_bg.wasm', import.meta.url)` line that would inline a second 2.24 MiB copy, and the
   plugin hard-fails if it stops matching. Re-point its `id.startsWith(GENERATED)` guard (line 51)
   if the glue is no longer copied into `src/generated/`.

6. **`packages/math/src/vendored/math-expressions.d.ts`** (1,283 lines) — delete, and re-export
   from the package in `src/types.ts`. Its 422 declaration lines (comments and blanks stripped)
   match upstream's `types/math-expressions.d.ts` line for line; upstream carries 23 more, which
   are exactly `OdeState`, `OdeSolution`, `dopri`, `setWasmModule` and the `MathExpression` default
   export the header documents dropping (21 lines), plus the 2 that `evaluate_to_constant`'s
   signature costs by being wrapped across three lines upstream and one here — this copy is
   Prettier-gated by DoenetML CI and upstream's tree is not, so byte-identity is not achievable in
   both directions. Re-derive both counts before quoting them; they moved at the twenty-second
   pass, when both files were narrowed to the members the engine implements. Two things the
   re-export is not literal about:

   - upstream declares `export function dopri(...)`, a *value*; `src/types.ts` (61–68) declares a
     *type alias* `Dopri`. It must become `typeof import("math-expressions").dopri` or the alias
     must stay hand-written.
   - upstream's `setWasmModule(mod: Record<string, unknown>)` is weaker than the local
     `vendor-shims.d.ts` declaration `(mod: WasmModule)`. That is a deliberate type-strength loss;
     record it or keep the local declaration.

   This cannot be done *before* this step: an `exports` target may not escape its package root, so
   `dist/` has no way to name the submodule that would survive the move to npm.

7. **`packages/math/src/vendor-shims.d.ts`** (76 lines) — delete. All three of its ambient
   `declare module` blocks (`math-expressions-js-compat`, `math-expressions-rs-wasm`,
   `math-expressions-wasm-glue`) become real, typed npm resolutions, except as noted in step 6.
   `vite.config.ts`'s `dts({ exclude: [... "src/vendor-shims.d.ts"] })` entry goes with it.

8. **Workflows** — remove `submodules: recursive` from all **14** checkouts and
   `uses: ./.github/actions/setup-math-wasm` from all **12** steps, then delete
   `.github/actions/setup-math-wasm/`:
   - `ci.yml`: `build` (54/55), `test-main` (136/137), `test-worker-js` (182/183),
     `test-cypress` (235/236), `test-doenetml-to-pretext-devcontainer` (356, checkout only),
     `test-doenetml-to-pretext-full-devcontainer` (395, checkout only), `build-docs` (457/458),
     `schema-freshness` (606/607), `check-docs-coverage` (683/684)
   - `publish.yml`: `dev-release` (53/54), `dev-vscode-extension` (142/143),
     `production-release` (248/249)
   - `gh-pages-docs.yml`: `build-docs` (39/40)
   - `publish-doenetml-to-pretext-python.yml`: `build` (97/98)

   The two devcontainer jobs have the checkout but not the action because their image carries the
   toolchain — see step 10.

9. **Submodule removal** — `git submodule deinit -f vendor/math-expressions`, `git rm
   vendor/math-expressions`, delete the `[submodule "vendor/math-expressions"]` stanza from
   `.gitmodules` (the file then has no stanzas left and can go), remove `.git/modules/vendor/…`,
   drop `vendor/math-expressions` from `.prettierignore` (line 26, with its comment at 22–25), and
   delete the `git submodule update --init --recursive` line from
   `.devcontainer/postCreateCommand.sh` (line 13 and its comment at 8–12).

10. **⚠️ The Rust toolchain does *not* go away — only the pinned `wasm-bindgen-cli` does.**
    `packages/doenetml-worker-rust` is a full Cargo workspace and its `build:rust` script runs
    `npx wasm-pack build lib-js-wasm-binding --target web`, which itself requires
    `rustup target add wasm32-unknown-unknown`. That build is on `packages/doenetml:build`'s
    critical path, so a contributor still needs `cargo` + `wasm32-unknown-unknown` + `wasm-pack`
    after this step. What leaves is the *version-locked* `wasm-bindgen-cli` that had to match the
    submodule's `wasm-bindgen = "=0.2.126"` pin, and the explicit
    `rustup target add wasm32-unknown-unknown` that `build-wasm.sh` needs because it calls `cargo`
    directly.

    `packages/doenetml-worker-rust`'s wireit `build` also gained `../math:build` as a dependency on
    this branch, and that edge **stays**: `@doenet/math` survives Step 6 — step 2 above leaves the
    six non-publishing manifests, `doenetml-worker-rust`'s among them, on `"file:../math"` — so the
    package is still what the bare `math-expressions` specifier resolves to and still has to be
    built first. What changes underneath the edge is that `../math:build` stops compiling Rust and
    starts unpacking a prebuilt `.wasm` out of `node_modules` (step 4).

    Therefore: keep `ci.yml`'s `lint` / "Lint Rust Code" job (428–440) untouched — it has no
    submodule checkout and no `setup-math-wasm` and is entirely independent — and keep
    `.devcontainer/devcontainer.json`'s `ghcr.io/devcontainers/features/rust:1` (12–14) and the
    `rust-lang.rust-analyzer` extension (43). Only `"./features/wasm-toolchain": {}` (line 22, with
    its comment at 19–21) and `.devcontainer/features/wasm-toolchain/` go — **and before deleting
    them, confirm wasm-pack still resolves `wasm32-unknown-unknown` inside the rebuilt image**, or
    the two devcontainer CI jobs break.

11. **Loose ends to sweep** —
    - `packages/math/package.json`'s `build` has `clean: true`, and
      `packages/doenetml-iframe/package.json` carries explicit ordering comments (25–34, 63–75)
      about the CI race that causes. Re-read them once `build:wasm` is gone; they may be
      simplifiable but they are *not* dead, since `packages/math` survives.
    - Update `MATH_EXPRESSIONS_ENGINE_NOTES.md`'s "Building" section, which still tells a
      contributor to install a matching `wasm-bindgen-cli`.
    - `package-lock.json` regenerates on `npm install`; check the
      `"node_modules/math-expressions"` link entry survives.
    - `packages/math/README.md`, `src/engine-rust.ts`, `src/wasm-loader.ts` all name the submodule
      in comments.

12. **Verify.** `npm run build:all-no-docs`; `npm run test -w packages/math`;
    `npm run test -w packages/standalone` (the transform-package-json tests read
    `packages/doenetml/vite.config.ts` and `package.json` from source); read the four built
    `dist/package.json` files and confirm `@doenet/doenetml`'s `peerDependencies.math-expressions`
    is the published range; then `npm pack` `packages/doenetml/dist` and install the tarball into a
    scratch project outside the workspace to confirm the import resolves to the registry package.

**Upstream's side is done.** The three things that used to make `math-expressions@3.x`
uninstallable are fixed in [math-expressions#84](https://github.com/Doenet/math-expressions/pull/84)
and each is now covered by its `package publishability` job, which packs the tarball, installs it
into a throwaway project outside the workspace and runs it: `math-expressions-rs-wasm` is out of
`dependencies` (it is inlined into `dist/`, and being on the registry was never required — being
*named* in the manifest was what made `npm install` fail with a 404), `prepack` builds the
git-ignored `dist/`, and `exports["."]` names a `types` entry. Nothing mechanical gates this step
any more.

**Stage 1 exit criteria:** all suites green on `rust`, flat memory over a long session, no
main-thread init regression, bundle delta accepted, and `@doenet/doenetml` publishable against
`math-expressions@3.x` from npm.

---

## 4. Stage 2 — `math-expressions-rs` as a Cargo dependency

**Goal:** one Rust binary containing both the DoenetML core and the math core; the math API
re-exported to JS through the existing `lib-js-wasm-binding`. **No new inlining work** — the Rust
WASM is already inlined into the worker bundle, and the math core simply rides inside it.

This is where the real wins are, and §2.2 is why: today the Rust core does math by calling *out*
to JavaScript through `__forDoenetWorker`, passing JSON strings, with an `eval_js` escape hatch
that evaluates JS source. Stage 2 deletes that layer outright.

### What Stage 2 buys

- **Deletes the Rust→JS math bridge**: `math_via_wasm.rs`'s extern block, `eval-math.ts`, the
  `__forDoenetWorker` global namespace, and `eval_js`. Every math call in the Rust core becomes a
  direct Rust call.
- **`MathExpr` becomes a real value.** `MathExpr { math_object: JsMathExpr(String) }` — a JSON
  string — becomes a native `Expr`. No serialize/parse per operation, no `to_reviver_string`
  eval'd-JS round-trip.
- **One engine, one copy.** The JS `math-expressions` dependency (1.1 MB) can eventually leave the
  worker bundle entirely, and there is no possibility of JS-core and Rust-core disagreeing about
  what an expression means.
- **Unblocks Rust-side props.** `math_prop.rs` / `latex_prop.rs` stop being gated on a JS
  round-trip, which matters for the ongoing JS→Rust core transition.

### Steps

1. **Wait for PR #82.** The module reorg (`normalize/`, `eval_exact/`, `special_functions/`,
   `print/`) would otherwise force a rebase of every integration point. #82 also brings
   `cargo test --workspace` in CI, which is what makes pinning a revision safe.
2. **Add the dependency.** `math-expressions-rs` is currently a workspace member of another repo,
   not published to crates.io. Pin a git revision in
   [packages/doenetml-worker-rust/Cargo.toml](packages/doenetml-worker-rust/Cargo.toml)'s
   `[workspace.dependencies]` (a `path` dep for local development via a sibling checkout). Commit
   `Cargo.lock`. Decide early whether upstream should publish to crates.io — a git dep is fine for
   one consumer and avoids release friction.
3. **Reconcile the two Rust workspaces.** Concretely: `wasm-bindgen` version (we pin `^0.2.92`;
   upstream pins a matching `wasm-bindgen-cli`), `serde`/`serde_json`, the `panic = "abort"`
   profile upstream sets, and our `console_error_panic_hook` / `wee_alloc` feature setup. This is
   the most likely source of Stage 2 friction and should be spiked *before* committing to a date.
4. **Replace `math_via_wasm.rs` behind its existing signatures.** The module already presents a
   clean Rust-level API (`parse_text_into_math`, `to_latex`, `normalize_math`,
   `substitute_into_math`, `evaluate_to_number`, …) with `#[cfg]`-gated web/testing variants.
   Reimplement those bodies against the crate, keeping signatures, then delete the extern block.
   **Bonus: the `testing`/non-`web` builds stop being stubs that return
   `Err("only available when compiled with the web feature")` — Rust unit tests can finally
   exercise real math.** Migrate `MathExpr` from `JsMathExpr(String)` to `Expr` in a follow-up
   commit so the two changes bisect independently.
5. **Map the parameter model.** Doenet's math calls carry `split_symbols`, `function_symbols`,
   `pad_to_decimals`, `pad_to_digits`, `show_blanks`, and the `normalize` params
   (`simplify`, `expand`, `create_vectors`, `create_intervals`). Upstream's `Expression` now
   *carries* its parse notation (`ARCHITECTURE_REVIEW.md` §7) with `*_with_options` per-call
   overrides — a better fit than the old re-supply-every-call model, but the mapping must be
   written down explicitly, including the JS-side converter options
   (`me.converters.textToAstObj({appliedFunctionSymbols, functionSymbols, splitSymbols,
   parseScientificNotation})`). `JS_RUST_DIFF.md` flags the loss of emitter padding options —
   confirm `pad_to_decimals`/`pad_to_digits` have equivalents, or upstream them.
6. **Re-export to JS through `lib-js-wasm-binding`.** Add `#[wasm_bindgen]` wrappers exposing the
   subset from §2.1's inventory, then **repoint the Stage 1 seam** from `math-expressions` to
   `@doenet/doenetml-worker-rust`. Because Stage 1 already funnelled every import through one
   module, this is a single-file change plus a shim that maps the legacy `me.*` shape onto the
   re-exports. Keep `me.reviver`/`toJSON` semantics identical so
   `serializedComponentsReviver` and the Rust `to_reviver_string` path keep working.
   Wire `.f()` through upstream's `src-js/tree-to-mathjs.ts` bridge (compile once in JS, evaluate
   per sample with no boundary crossing) and keep re-exporting math.js as `me.math`.
7. **Fix the size story while you are here.** The Rust WASM is built `--dev`; a release build plus
   `wasm-opt -Oz` (already in upstream's `build-wasm.sh`) and upstream's planned Cargo features
   for eigen/integrate/precise/numeric-compat (`IMPROVEMENT_PLAN` item 33) should more than absorb
   the math core's footprint. Measure before and after; this is the fair moment to set a bundle
   budget.
8. **Now the stack-safety items matter more, not less.** With math in-process and no JS fallback,
   `STACK_SAFETY_PLAN` item 21 (iterative `Drop`) and 23–26 become production risks on adversarial
   student input, as does the panic firewall (`panic = "abort"` means a Rust panic kills the
   worker where a JS throw used to be catchable). Treat these as Stage 2 release blockers and
   contribute them upstream.

### The main thread is the one thing Stage 2 does not solve

`packages/doenetml` renderers use a thin slice — 22 `fromAst`, 41 `evaluate_to_constant`, 15
`toString`, 1 `.f()` — and the main thread does not load the Rust core WASM. Three options, to be
decided during Stage 2: **(a)** keep the v3 compat package on the main thread only (two engines,
small divergence surface, but a real one); **(b)** ship a second, feature-minimal WASM build for
the main thread; **(c)** route those few calls to the worker. (c) is the cleanest if the call
sites tolerate async; measure (b) once the size work in step 7 is done.

---

## 5. Cross-cutting risks

| # | Risk | Stage 1 | Stage 2 |
| --- | --- | --- | --- |
| R1 | **Output/semantic divergence** — 114 snapshotted golden-output divergences upstream, plus #82's aggressive `simplify` and exact-constant `equals`. Student-visible in grading. | Primary risk. Mitigated by Step 0.2's weighted corpus + dual-engine CI. | Inherited; already triaged. |
| R2 | **WASM heap growth** — compat does not free caller-owned handles; `Sym` interner is append-only. | Real. §3 Step 4. | Largely dissolved — the Rust core owns `Expr` values natively. `Sym` interner remains upstream. |
| R3 | **Boundary cost** — compat's `.tree` is an uncached WASM call + JSON parse, against ~600 source sites. | Real. Mitigate via value-first (§3 Step 4c) or accept and measure. | Dissolved for Rust-side math; JS-side re-exports need the same value-first treatment in the seam shim. |
| R4 | **Crash safety** — `panic = "abort"`; WASM32 shadow-stack overflow on deep trees, including on `Drop`. | Bounded: compat runs in its own module; a crash is still fatal to the worker. | Higher stakes — same module as the core. Release blocker. |
| R5 | **Unported features** — MathML input, derivative narration, polynomial/Groebner, `equalsViaSyntax` tolerance. | Discovered in Step 0.1. | Same. |
| R6 | **Toolchain/version friction** between the two Rust workspaces. | n/a | Spike early (§4 step 3). |
| R7 | **Bundle size.** | +WASM alongside the existing 1.1 MB JS until cutover. | Net improvement expected once `--dev` → release + `wasm-opt -Oz` + feature gating. |

---

## 6. Sequencing and sizing

| Work | Effort | Depends on |
| --- | --- | --- |
| **S1.0** API diff + differential corpus + memory baseline | 1–2 weeks | post-#82 `main` for the corpus |
| **S1.1** Seam + dependency hygiene | ~2 days | nothing |
| **S1.2** Web build + inlined init (upstream loader tweak + our `CoreWorker`-style loader) | ~1 week + upstream | S1.1; main-thread sync spike |
| **S1.3** Node-only pilot | ~1 week | S1.1 |
| **S1.4** Handle-lifetime decision + churn test | few days–2 weeks | S1.0 numbers |
| **S1.5** Dual-engine CI, divergence triage, cutover | bulk of Stage 1 | S1.2, S1.3 |
| **S2.1** Cargo/toolchain reconciliation spike | ~1 week | PR #82 merged |
| **S2.2** Replace `math_via_wasm.rs` bodies; delete extern block + `eval-math.ts` | 1–2 weeks | S2.1 |
| **S2.3** `MathExpr` → native `Expr` | 1–2 weeks | S2.2 |
| **S2.4** `#[wasm_bindgen]` re-exports + repoint the seam | 1–2 weeks | S2.2, S1.1 |
| **S2.5** Size work (release build, `wasm-opt`, feature gating) | ~1 week | S2.4 |
| **S2.6** Main-thread decision | 1–2 weeks | S2.5 |
| **Upstream, parallel** | Sym interner cap, stack safety 21/23–26, panic firewall | blocks S2 release |
| **Payoff** | Structural comparison for `<answer>` grading (F1/F3, built for us), symbolic + certified-numeric integration, arbitrary precision, ODEs, symbolic eigen, `set_resource_limits` guards | after S1 or S2 |

**Critical path note:** S1.0 and S1.1 are unblocked today and are worth doing even if Stage 1
never ships, because Stage 2 needs both — the corpus is the only real defense against R1, and the
seam is what makes S2.4 a one-file change instead of a whole-tree refactor.

**Do not let Stage 1 harden into the destination.** Its two structural costs — no handle freeing
(R2) and the uncached `.tree` (R3) — are exactly what Stage 2 removes for free. If Stage 2 is
close behind, prefer §3 Step 4(a) "measure and defer" over investing in a value-first compat layer
that Stage 2 will throw away.

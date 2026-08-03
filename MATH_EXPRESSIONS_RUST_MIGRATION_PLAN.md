# Migrating DoenetML to the Rust/WASM `math-expressions` — a two-stage plan

Target: <https://github.com/Doenet/math-expressions/> (main, audited 2026-07-30), including the
improvements in **PR #82 "Rust improvements"**, which is expected to merge shortly.

- **Stage 1** — swap the npm dependency for the v3 drop-in (`math-expressions-js-compat`,
  published as `math-expressions`), with its WASM **inlined** the way `CoreWorker.ts` inlines
  `lib_doenetml_worker_bg.wasm`. No DoenetML call sites change.
- **Stage 2** — add `math-expressions-rs` as a **Cargo dependency of `lib-doenetml-core`**, delete
  the Rust→JS math bridge, and re-export the math API to JS through the existing
  `lib-js-wasm-binding`. No *additional* inlining is needed: the Rust core's WASM is already
  inlined, and the math core rides along inside it.

---

## 1. Upstream state

The repo is a Rust monorepo; the JS library survives only as an out-of-tree oracle
(`tmp/js-legacy/`, git-ignored).

| Package | What it is | Which stage needs it |
| --- | --- | --- |
| `math-expressions-rs/` | The core Rust crate: text/LaTeX parsing, equality (numeric, finite-field, exact, structural), normalize/simplify/expand, differentiation, symbolic + certified integration, matrices/eigen, ODEs, assumptions, factoring, arbitrary precision. | **Stage 2** (as a crate) |
| `math-expressions-rs-wasm/` | The `wasm-bindgen` boundary (`src-rust/`) + TypeScript bindings (`src-js/`), notably the AST→math.js bridge backing `.f()`. `build-wasm.sh <target> <outdir>` accepts **`web`** and `nodejs`, with an optional `wasm-opt -Oz` pass. | Both |
| `math-expressions-js-compat/` | **Published as `math-expressions` v3 (`3.0.0-alpha1`)** — a drop-in TypeScript reimplementation of the legacy `me.*` API over the WASM core, preserving the synchronous surface. | **Stage 1** |
| `playground/` | Vite/React app running Rust-WASM against canonical JS. Ships the `web` build to GitHub Pages on every push to `main`. | Reference |

### The playground already proves the browser path

`playground/src/engines.ts` dynamically imports the `web` glue and calls `await r.default()`
(wasm-bindgen `init`), then adapts handles into a `me`-shaped API — `fromText`→`parse_text`,
`treeOf`→`JSON.parse(h.tree_json())`, notation through `parse_*_with_options`. Handles **are**
freed, deterministically: `if (h && typeof h.free === "function" && h.__wbg_ptr !== 0) h.free()`,
with the note that "relying on FinalizationRegistry GC corrupted the wasm heap under rapid handle
churn." So `free()` works; *GC-driven* freeing is what failed. `playground/src/wasmApi.ts`
reflects the generated `math_expressions_wasm.d.ts` to enumerate every chainable `Expression`
method — a ready-made way to diff the WASM surface against our needs (§2).

### PR #82 — plan against post-#82 `main`, not today's

1. **Module reorganization** — `norm/`→`normalize/`, `exact.rs`→`eval_exact/`,
   `functions/`→`special_functions/`, `output/`→`print/`. *Stage 2 Rust code written against the
   current layout would need rebasing; do not start Stage 2 integration until #82 lands.*
2. **`simplify()` becomes the aggressive simplifier** — now does `exp(ln x) → x`, `cos(π/3) → 1/2`,
   which the JS version could not. **This is user-visible and hits us directly**: we have ~160
   `.simplify()` call sites, many inside answer normalization. It must be the first thing in the
   differential corpus (§3, Step 1).
3. **Equality on exact constants** — certified-stage evaluation means `equals(1/2, cos(π/3))` is
   now `true`. Almost certainly an improvement for grading, but it *changes grading outcomes*.
4. **Stronger integration** — symbolic integration handles integer powers of sin/cos with linear
   arguments; u-substitution keeps searching after a failed candidate; plus a new **numeric
   integration binding with certified quadrature at 10 significant digits**.
5. **Test/CI hardening** — 533 tests, `cargo test --workspace` in CI, warning-free docs, 19
   previously-silent tests recovered. This materially de-risks pinning a git revision in Stage 2.

### Known gaps (`WHATS_LEFT.md`, `JS_RUST_DIFF.md`)

MathML parsing (`mmlToAst`), derivative step narration, polynomial/Groebner, `equalsViaSyntax`
*with tolerance*, and richly-structured `get_assumptions` are unported. GLSL/Guppy/MathML-output
and `mathjsToAst` are marked "not needed for Doenet" — verify against our source rather than
assume. Calculus limits are **designed only**, not implemented. Also open: `Sym` interner is
append-only (slow leak); `STACK_SAFETY_PLAN` items 21, 23–26 (deep trees can overflow the WASM32
shadow stack, *including on `Drop`*); `panic = "abort"` makes reachable panics fatal to the worker.

---

## 2. What DoenetML consumes today

### 2.1 The JS surface

163 import sites, essentially all `import me from "math-expressions"`:

| Package | Files | Realm |
| --- | ---: | --- |
| `doenetml-worker-javascript` | 119 | Web Worker (+ vitest) |
| `doenetml` | 17 | Main thread (renderers) |
| `utils` | 11 | Both |
| `test-cypress`, `lsp-tools`, `static-assets`, `doenetml-to-pretext`, `doenetml-print`, `doenetml-prototype`, `i18n` | 1–3 each | Mixed / node |

Source (non-test) call counts:

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

**Dependency hygiene:** only [packages/utils/package.json:65](packages/utils/package.json#L65)
declares `"math-expressions": "^2.0.0-alpha93"`; the other 12 packages rely on workspace
hoisting. A latent bug — but it also means one pin currently controls the monorepo.

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

> ### Implementation status — 2026-08-01
>
> **Stage 1 is complete and the branch has switched permanently.** The Rust engine is the default;
> `DOENET_MATH_ENGINE=js` rebuilds against the legacy library and is kept only as a
> differential-debugging tool (when a spec disagrees, the first question is always "does this pass
> on the old one?").
>
> - **Submodule** — `vendor/math-expressions` @ `cdc5343` (`siefkenj/math-expressions@doenet`).
>   Nothing in DoenetML patches the submodule, by design.
> - **Suite** — 3469 tests, **2965 passed, 465 failed (85.5%)**, from 969 failures (70.9%) on the
>   previous pin. Attribution and the remaining divergences are in
>   [MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md](MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md).
>
>   | Step | Failures |
>   | --- | ---: |
>   | pin `8ccd98d` | 969 |
>   | pin `cdc5343`, nothing else changed | 577 |
>   | + test expectations updated for unpadded delimiters | 535 |
>   | + `fromAst(Expression)` unwrap restored | **465** |
>
>   Each step was verified test-by-test with `scripts/compare-test-runs.py`, not by totals. Both
>   DoenetML-side changes came in at **0 broken**.
>
> - **`engine-rust.ts` is nearly a straight re-export.** Upstream absorbed every gap fill we had
>   written — the context-level operation family, `Expression#f()`, the `NaN`/`±Infinity` replacer
>   — and each was deleted here to verify the upstream fix actually covered our usage. That
>   deletion is what the seam is for; a local patch that cannot be removed is a fix that did not
>   land.
>
>   One fill remains, newly discovered: **`fromAst` must unwrap an `Expression`**. Legacy did;
>   compat does not, and the object reaches Rust as a bare JSON value rejected with the misleading
>   `unknown special None` (that `None` is the `Option`, not the `{"$":"None"}` special). We
>   assumed this was test sloppiness and checked — `PiecewiseFunction.js`,
>   `StateVariableEvaluator.ts` and `Dependency.ts` all depend on it. 95 hard errors; filed
>   upstream as §1, where `astReplacer` can do it for free.
>
> - **WASM loading no longer needs a bundler rule.** Upstream's `setWasmModule` replaced the Vite
>   plugin that aliased compat's node-only `lib/_wasm.ts`. One ordering constraint, documented in
>   `wasm-loader.ts` and `engine-rust.ts`: compat's `Context` literal builds an assumptions handle
>   eagerly, so `setWasmModule` must be imported from `lib/_wasm` rather than the barrel, or the
>   injection loses the race to compat's node fallback.
>
> - **`dopri`** now crosses the seam under one name (`ODESystem.js`, `packages/utils`), replacing
>   `me.math.dopri`. `me.math` itself is otherwise complete on both engines.
>
> - **Test expectations** — 316 string literals across 27 files, unpadding container delimiters
>   (`( 0, 0 )` → `(0, 0)`) via `scripts/unpad-container-delimiters.py`. Two traps worth recording:
>   `toLatex` is byte-identical on both engines (`\left( 1, 2 \right)` keeps its padding), so the
>   codemod skips any literal containing a backslash; and padding only counts as container padding
>   when it separates the delimiter from real content — `(, )` in prose is not a tuple.
>
> - **Sizes** — the `web`-target WASM is **1.32 MB** (before `wasm-opt`, unavailable here);
>   `dist/engine-rust.js` is 3.78 MB raw / **1.21 MB gzipped** with the WASM inlined, against
>   1.1 MB for the JavaScript library it replaces. Bundle size is not the obstacle §5-R7 feared.
>
> - **Not yet done** — the Step 0 differential harness, the memory baseline (R8), Cypress runs, and
>   verification of `initSync` in a real browser Web Worker.

### Step 0 — Evidence before code (~1–2 weeks, start now)

1. **API diff.** Generate our used-API inventory (§2.1) from source, and diff it against the WASM
   surface using the `playground/src/wasmApi.ts` reflection over `math_expressions_wasm.d.ts`.
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
re-exporting `me` (default), `isTree`, and the `Expression`/`Tree` types. Codemod all 163 imports
to it, and declare the dependency properly in every consuming `package.json` (fixes §2.1's
hoisting bug).

Payoff: the engine becomes a one-line switch, a dual-engine A/B mode becomes possible, and —
critically — **Stage 2 repoints this one file instead of touching 163 call sites**.

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

`mathEngine: "js" | "rust"` flag through the worker, default `js`. Run the 164-file vitest suite
and all five Cypress groups under both engines in CI; triage each divergence as *Rust bug*
(upstream), *intended improvement* (adapt Doenet + tests), or *Doenet relied on an accident*.
Expect the ~6,900 test-side `.tree`/string assertions to dominate the diff — prefer normalizing
comparisons (compare parsed trees or use `equals`) over rewriting expected strings, so the suite
stops being coupled to one formatter. Flip the default only when memory is flat and the
divergence ledger is empty or accepted; keep the flag one release, then delete it.

**Stage 1 exit criteria:** all suites green on `rust`, flat memory over a long session, no
main-thread init regression, bundle delta accepted.

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
   `@doenet/doenetml-worker-rust`. Because Stage 1 already funnelled all 163 imports through one
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
seam is what makes S2.4 a one-file change instead of a 163-site refactor.

**Do not let Stage 1 harden into the destination.** Its two structural costs — no handle freeing
(R2) and the uncached `.tree` (R3) — are exactly what Stage 2 removes for free. If Stage 2 is
close behind, prefer §3 Step 4(a) "measure and defer" over investing in a value-first compat layer
that Stage 2 will throw away.

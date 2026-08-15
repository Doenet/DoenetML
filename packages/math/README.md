# `@doenet/math`

The single seam through which DoenetML reaches a math-expressions engine.

**No call site changed.** The files that already said

```ts
import me, { isTree } from "math-expressions";
import type { Expression, Tree } from "math-expressions";

const expr = me.fromAst(["+", "x", 1]);
```

still say exactly that. Each consuming `package.json` declares
`"math-expressions": "file:../math"`, so the specifier resolves to this package
instead of to the npm library — an alias, not a codemod. That is why swapping
the implementation is a one-module change rather than a whole-tree refactor, and
why the bundler configuration that externalizes the seam
(`packages/doenetml/vite.config.ts` and friends) matches the specifier
`math-expressions` rather than `@doenet/math`.

Npm workspace hoisting also makes `import … from "@doenet/math"` resolve, but
nothing does that and nothing should: the externalization and dedupe rules are
written against the `math-expressions` specifier, so a `@doenet/math` import
would quietly be bundled a second time.

See [MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md](../../MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md) for
the plan this package implements, and
[MATH_EXPRESSIONS_ENGINE_NOTES.md](../../MATH_EXPRESSIONS_ENGINE_NOTES.md) for what the switch
actually cost: the seam's exact shape, the behavior classes that changed, the known risks, and the
follow-up work that was deliberately left out.

## The engine

`math-expressions-js-compat` (upstream v3) over the Rust core compiled to WASM,
from the `vendor/math-expressions` submodule. It is the only engine.

```bash
npm run build -w packages/math
```

Building requires a Rust toolchain: `rustup target add wasm32-unknown-unknown`
and `wasm-bindgen-cli` matching the `wasm-bindgen` version pinned in the
submodule's `Cargo.toml` (`cargo install wasm-bindgen-cli --version <pinned>`).

### The legacy library is gone

`math-expressions@2.x` was removed as a dependency. For a while it was retained
so `DOENET_MATH_ENGINE=js` could rebuild against it for differential debugging,
but it had stopped carrying any runtime code we ship — the Rust bundle imports
nothing from it — and keeping a second math engine installed to serve an
occasional debugging convenience was not worth the hazard: with both packages
present, `import me from "math-expressions"` silently meant *different engines*
in different packages depending on resolution.

Its hand-written type definitions were the one thing still needed, and those are
vendored verbatim in [`src/vendored/math-expressions.d.ts`](src/vendored/math-expressions.d.ts).
They are the API contract those files are written against; they arrived with
that library but were never *about* it, since the Rust engine is a drop-in for
exactly this shape.

The same declarations are now `math-expressions@3.x`'s own published `types`
entry, so this copy goes away when the submodule does — see Step 6 of the
migration plan. The legacy contract itself is byte-identical, `diff`ed at the
current pin. Comparing the two with comments and blank lines stripped — the
stable way to say it, since either file's prose moves without its contract
moving — gives 504 declaration lines here against 525 upstream, and the whole
21-line delta is upstream's trailing *v3 additions* block, which Step 6 absorbs
rather than reconciling:

- `OdeState`, `OdeSolution` and `dopri` — hand-rolled here in
  [`src/types.ts`](src/types.ts), so those three declarations go too;
- `setWasmModule` — declared here in
  [`src/vendor-shims.d.ts`](src/vendor-shims.d.ts) instead, because at the
  current pin it is reached through the submodule rather than a published
  package;
- `declare const MathExpression: Context; export default …` — deliberately
  absent here, because `engine-rust.ts` supplies that value.

A hand-written `.d.ts` under `src/` only reaches consumers because
`vite.config.ts` passes `copyDtsFiles` to `vite-plugin-dts`: the plugin
*generates* declarations for `.ts` sources but does not copy `.d.ts` ones, so
without it `dist/types.d.ts` re-exports from a path that is not in `dist/`.
That failure is silent — consumers set `skipLibCheck`, so the unresolved import
becomes `any` rather than an error, and the whole type surface disappears
without anything going red.

To A/B against the old engine now, check out a commit from before the switch.

## WASM initialization

The Rust engine's WASM is **inlined** into `dist/engine-rust.js` as base64 — at
the pinned submodule revision, 1.69 MiB of WASM becoming 2.25 MiB of base64 in a
2.41 MiB chunk (792 kB gzipped) — the same approach `packages/doenetml-worker/src/CoreWorker.ts` uses for
`lib_doenetml_worker_bg.wasm`. It instantiates from bytes, so it needs no
`fetch` — which matters because `fetch` is blocked for blob/data URLs in the VS
Code web-worker extension host. (`CoreWorker.ts` cites issue #1375 for this; that
citation is pre-existing and wrong — #1375 is a VS Code extension diagnostics
bug — so no number is repeated here.)

Where synchronous compilation is legal — a Web Worker, or node/Vitest — the
module instantiates itself as it loads, and the legacy synchronous API works with
no `await` anywhere. That is the whole reason inlining is worth its bundle cost.

Browsers refuse to compile a module this size synchronously on the **main
thread**, so code there must initialize during startup:

```ts
import { initMathWasm } from "math-expressions";
await initMathWasm();
```

Using it on the main thread before initializing throws a message saying so,
rather than failing deep inside wasm-bindgen.

The WASM reaches the compat layer through its `setWasmModule` injection point,
which `wasm-loader.ts` calls at import time. `wasm-loader.ts` must therefore be
*evaluated* before anything parses an expression, which is why `engine-rust.ts`
imports it first, for the side effect alone, and says so in a comment. This is
the one ordering constraint in the package.

Which module `setWasmModule` is imported *from* used to matter too: compat's
`Context` literal built its assumptions handle eagerly, so importing anything
from the barrel ran that handle's `new wasm.Assumptions()` while the barrel's
own body was still evaluating — before injection could happen — and the load
silently lost the race to compat's node fallback. Upstream made the handle a
lazy getter, so `wasm-loader.ts` now imports `setWasmModule` from the package
root like any other export. Bringing the eager construction back upstream would
reintroduce the hazard.

## What `engine-rust.ts` adds

Nothing. It is a straight re-export.

It used to carry four gap fills — `Expression#f()`, the context-level operation
family (`me.simplify(expr)` alongside `expr.simplify()`), a replacer that kept
`fromAst` from losing `NaN`/`±Infinity` to `JSON.stringify`, and a recursive
unwrap so `fromAst` accepted an `Expression` where a tree was expected. All four
landed upstream and were deleted here in turn. Deleting them is how the seam
earns its keep: a local patch that cannot be removed is an upstream fix that did
not actually cover our usage.

Everything compat marks `notImplemented` is left to throw. In a grading path, a
stack trace naming the missing method is far better than a silently wrong answer.

## Layout

```
src/
  index.ts           the public entry — re-exports the selected engine
  engine.ts          indirection point — what backs `me` in this build
  engine-rust.ts     compat over the Rust core
  wasm-loader.ts     inlined WASM, injected into compat via setWasmModule
  components.ts      getComponent — component access as a test rather than a throw
  types.ts           the types consumers import
  vendored/          math-expressions.d.ts — the API contract, vendored
  vendor-shims.d.ts  declared surface of the submodule modules we consume
  generated/         wasm-bytes.ts plus the wasm-bindgen glue (math_expressions_wasm.js
                     and its .d.ts), all written by scripts/build-wasm.mjs (git-ignored)
test/
  engine-smoke.test.ts   exercises dist/
```

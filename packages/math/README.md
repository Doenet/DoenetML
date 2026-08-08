# `@doenet/math`

The single seam through which DoenetML reaches a math-expressions engine.

Every consumer imports from here instead of from `math-expressions` directly:

```ts
import me, { isTree } from "@doenet/math";
import type { Expression, Tree } from "@doenet/math";

const expr = me.fromAst(["+", "x", 1]);
```

The call surface is unchanged — this package re-exports one of two engines, so
swapping implementations is a one-module change rather than a 148-file refactor.
See [MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md](../../MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md).

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
They are the API contract ~147 call sites are written against; they arrived with
that library but were never *about* it, since the Rust engine is a drop-in for
exactly this shape.

To A/B against the old engine now, check out a commit from before the switch.

## WASM initialization

The Rust engine's WASM is **inlined** into `dist/engine-rust.js` as base64, the
same approach `packages/doenetml-worker/src/CoreWorker.ts` uses for
`lib_doenetml_worker_bg.wasm`. It instantiates from bytes, so it needs no
`fetch` — which matters because `fetch` is blocked for blob/data URLs in the VS
Code web-worker extension host (issue #1375).

Where synchronous compilation is legal — a Web Worker, or node/Vitest — the
module instantiates itself as it loads, and the legacy synchronous API works with
no `await` anywhere. That is the whole reason inlining is worth its bundle cost.

Browsers refuse to compile a module this size synchronously on the **main
thread**, so code there must initialize during startup:

```ts
import { initMathWasm } from "@doenet/math";
await initMathWasm();
```

Using it on the main thread before initializing throws a message saying so,
rather than failing deep inside wasm-bindgen.

The WASM reaches the compat layer through its `setWasmModule` injection point,
which `wasm-loader.ts` calls at import time. That import must be evaluated
*before* the `math-expressions-js-compat` barrel: the barrel's `Context` literal
builds an assumptions handle eagerly, touching the WASM while its own module body
runs. `engine-rust.ts` orders its imports accordingly, and `wasm-loader.ts`
imports `setWasmModule` from `lib/_wasm` rather than the barrel for the same
reason. Both places say so in a comment — this is the one ordering constraint in
the package.

## What `engine-rust.ts` adds

Nothing. It is a straight re-export.

It used to carry three gap fills — `Expression#f()`, the context-level operation
family (`me.simplify(expr)` alongside `expr.simplify()`), and a replacer that
kept `fromAst` from losing `NaN`/`±Infinity` to `JSON.stringify`. All three
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
  components.ts      getComponent — the legacy sequence-only contract, on either engine
  types.ts           the types consumers import
  vendored/          math-expressions.d.ts — the API contract, vendored
  vendor-shims.d.ts  declared surface of the submodule modules we consume
  generated/         wasm-bytes.ts, written by scripts/build-wasm.mjs (git-ignored)
test/
  engine-smoke.test.ts   exercises dist/
```

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

This branch runs on the **Rust** engine: `math-expressions-js-compat` (upstream
v3) over the Rust core compiled to WASM, from the `vendor/math-expressions`
submodule. That is the default and the only supported configuration.

```bash
npm run build -w packages/math                        # Rust/WASM engine
DOENET_MATH_ENGINE=js npm run build -w packages/math  # legacy math-expressions@2.x
```

The `js` build is kept as a **differential-debugging tool**, not as a supported
mode. When a spec disagrees with the Rust engine the first question is always
"does this pass on the old one?", and rebuilding one package to answer it beats
bisecting a behavioral difference by hand:

```bash
npm run build -w packages/math && npx vitest run --root packages/doenetml-worker-javascript <spec>
DOENET_MATH_ENGINE=js npm run build -w packages/math && npx vitest run --root packages/doenetml-worker-javascript <spec>
```

Building therefore requires a Rust toolchain: `rustup target add
wasm32-unknown-unknown` and `wasm-bindgen-cli` matching the `wasm-bindgen`
version pinned in the submodule's `Cargo.toml` (`cargo install wasm-bindgen-cli
--version <pinned>`).

Because the choice is baked into `dist/`, switching engines means rebuilding
this package — consumers need no rebuild.

A harness that needs both engines *simultaneously* — the differential corpus in
the migration plan — should import `@doenet/math/engine-js` and
`@doenet/math/engine-rust` directly rather than going through the root entry.

### Why build-time and not runtime

`me.fromAst` and `.tree` are called from dependency-graph hot loops. A runtime
switch (a Proxy, or a branch per property access) would tax the default path to
serve the experimental one, and would force both engines — including a
multi-megabyte inlined WASM payload — into every bundle.

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

Both engines export `initMathWasm` (the JavaScript one as a no-op), so callers
never branch on which engine they were built against. Using the Rust engine on
the main thread before initializing throws a message saying so, rather than
failing deep inside wasm-bindgen.

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
  engine.ts          the selection point (aliased to engine-js.ts when DOENET_MATH_ENGINE=js)
  engine-js.ts       legacy math-expressions@2.x
  engine-rust.ts     compat over the Rust core
  wasm-loader.ts     inlined WASM, injected into compat via setWasmModule
  components.ts      getComponent — the legacy sequence-only contract, on either engine
  types.ts           the types consumers import
  vendor-shims.d.ts  declared surface of the three submodule modules we consume
  generated/         wasm-bytes.ts, written by scripts/build-wasm.mjs (git-ignored)
test/
  engine-smoke.test.ts   runs against whichever engine dist/ was built with
```

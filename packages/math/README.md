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

The published `math-expressions` package (upstream v3) over the Rust core
compiled to WASM. It is the only engine, and it arrives prebuilt — this package
inlines the `--target web` binary the tarball ships rather than compiling one,
so it needs no Rust toolchain and every build inlines the bytes the lockfile
pins.

```bash
npm run build -w packages/math
```

Building this package needs no Rust toolchain. The engine arrives prebuilt in
the `math-expressions` package, which ships both wasm-bindgen targets in its
tarball; `scripts/build-wasm.mjs` reads the `--target web` binary out of
`node_modules` and base64-inlines it. (The repo as a whole still needs Rust,
because `packages/doenetml-worker-rust` compiles DoenetML's own core with
`wasm-pack` on `npm run build`'s critical path — but `wasm-pack` brings its own
target and bindgen.)

Because the binary is the lockfile's rather than whatever the local `cargo`
produced, every build inlines identical bytes.

### The legacy library is gone

`math-expressions@2.x` was removed as a dependency. For a while it was retained
so `DOENET_MATH_ENGINE=js` could rebuild against it for differential debugging,
but it had stopped carrying any runtime code we ship — the Rust bundle imports
nothing from it — and keeping a second math engine installed to serve an
occasional debugging convenience was not worth the hazard: with both packages
present, `import me from "math-expressions"` silently meant *different engines*
in different packages depending on resolution.

Its hand-written type definitions were the one thing still needed, and those
now come from `math-expressions`'s own published `types` entry — see
[`src/types.ts`](src/types.ts). This package used to carry a 1,283-line vendored
copy, because the engine reached the repository through a git submodule that
published nothing; the copy's header carried a line-by-line argument that it
still matched upstream, which is a claim that stays true only while someone
keeps checking it. Depending on the package makes the question unaskable.

Three declarations stayed local, and `src/types.ts` says why at each: `OdeState`
and `OdeSolution` are re-exported straight from upstream, `Dopri` is
`typeof import("math-expressions").dopri` so it cannot drift from the value
`engine-rust.ts` re-exports, and the shape of the injected wasm module lives in
[`src/wasm-module.ts`](src/wasm-module.ts) — upstream types `setWasmModule` as
taking an opaque module, which is honest about what it does with the argument
but says nothing about what the argument has to be.

## WASM initialization

The Rust engine's WASM is **inlined** into `dist/engine-rust.js` as base64 — at
`math-expressions@3.0.0-alpha.1`, 1.69 MiB of WASM becoming 2.25 MiB of base64
in a 2.38 MiB chunk (777 kB gzipped) — the same approach `packages/doenetml-worker/src/CoreWorker.ts` uses for
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
  types.ts           the types consumers import, re-exported from math-expressions
  wasm-module.ts     shape of the wasm module wasm-loader.ts injects
  wasm-web-stub.ts   resolves the subpath @doenet/doenetml names on its consumer path
  vendor-shims.d.ts  the one specifier no package supplies: math-expressions-wasm-glue
  generated/         wasm-bytes.ts plus the wasm-bindgen glue (math_expressions_wasm.js
                     and its .d.ts), all written by scripts/build-wasm.mjs (git-ignored)
test/
  engine-smoke.test.ts   exercises dist/
```

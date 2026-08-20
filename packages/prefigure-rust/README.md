# @doenet/prefigure-rust

An evaluation build of a Rust/WASM PreFigure compiler backend, wrapping the
`prefig-wasm` crate (RaTeX/native variant) from the upstream `prefigure`
project (compiled from Rust, not the Pyodide/Python compiler used by
`packages/prefigure`).

**This package is NOT wired into the live DoenetML renderer or
`doenetml-print`.** It exists purely for evaluation and parity-testing
against the Pyodide-based `@doenet/prefigure` backend. `prefigureRuntime.ts`
and `prefigureConfig.ts` (in `packages/doenetml/src/Viewer/renderers/utils/`)
still only know about the existing Pyodide/build-service paths. Wiring this
package into the renderer, if it happens at all, is a separate, later piece
of work — see `/prefigure-integration-guide.md` at the repo root for the
full evaluation history and rationale.

## Provenance and upstream submodule

The Rust source is vendored as a git submodule at `upstream/`, pointing at
<https://github.com/davidaustinm/prefigure>, pinned to a specific commit
SHA (not floating `main`). See `NOTICE.md` for license/attribution details.

To update the pinned commit:

```bash
cd packages/prefigure-rust/upstream
git fetch origin
git checkout <new-sha>
cd ../../..
git add packages/prefigure-rust/upstream
git commit -m "chore: bump prefigure-rust upstream submodule pin"
```

After bumping, rebuild and rerun this package's tests (see below) to check
for regressions/API changes before relying on the new pin.

If cloning DoenetML fresh, initialize submodules with:

```bash
git submodule update --init --recursive
```

## API

This package's public API deliberately mirrors `packages/prefigure`'s
(the Pyodide-based package) so it can act as a drop-in alternative if it is
ever wired into the runtime:

```ts
import { initPrefigure, compilePrefigure, version } from "@doenet/prefigure-rust";

await initPrefigure();
const { svg, annotationsXml } = await compilePrefigure(diagramXml, {
    mode: "svg", // or "tactile"
});
console.log(version()); // the prefig-wasm crate version, e.g. "0.7.0"
```

Unlike `packages/prefigure`, this package does not use a Web
Worker/Comlink indirection — the wasm module is loaded and run directly in
the importing context. Pyodide needed a worker because it's heavy and slow
to warm up off the main thread; the Rust/wasm build warms up in tens of
milliseconds (see the Phase 1 spike findings in
`/prefigure-integration-guide.md`), so the extra indirection wasn't judged
worth the complexity here. If this package is later wired into the live
renderer, a worker wrapper could still be added without changing this
module's exported API shape.

### Known limitation: text measurement

`prefig-wasm`'s host API requires a `measure_text` callback for label
layout. This package implements it with `OffscreenCanvas`/canvas
`measureText` when available (browser), falling back to a rough
character-count estimate in non-browser environments (e.g. Node tests).
This fallback does not account for the font actually used when rendering
final SVG text, so layout is approximate outside a real browser context.
See the `measureTextFallback` comment in `src/index.ts`.

## Build

```bash
npm run build -w packages/prefigure-rust
```

This runs two wireit-orchestrated steps:

- `build:rust`: `wasm-pack build upstream/packages/prefig-wasm --target web -- --features ratex`,
  producing `pkg/` (wasm-bindgen glue JS + `.wasm` binary). The `ratex`
  feature selects the pure-Rust math-rendering backend (no MathJax/DOM
  host dependency needed — only `measure_text`/`translate_text`).
- `build:js`: a Vite build of `src/index.ts` into `dist/`, copying the
  `.wasm` binary alongside it (see `vite.config.ts`'s
  `preventWasmBundlingPlugin`, which mirrors the same workaround used in
  `packages/doenetml-worker-rust/vite.config.ts` for wasm-bindgen
  `--target web` output).

## Test

```bash
npm run test -w packages/prefigure-rust
```

Runs vitest against `test/compile.test.ts`, which compiles a few small
inline PreFigure XML samples and checks the result is well-formed SVG.
Requires `pkg/` to already exist (run `npm run build` first, or at least
`npm run build:rust -w packages/prefigure-rust`).

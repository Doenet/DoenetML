/**
 * `@doenet/math` — the single seam through which DoenetML reaches a
 * math-expressions engine.
 *
 * Every consumer imports `me` from here rather than from `math-expressions`
 * directly, so swapping the JavaScript library for the Rust/WASM drop-in is a
 * one-module change instead of a 163-site refactor. Usage is unchanged:
 *
 *     import me from "@doenet/math";
 *     const expr = me.fromAst(["+", "x", 1]);
 *
 * Which engine you get is decided when this package is built — see `./engine.ts`.
 *
 * Realms that may run the WASM engine should call `initMathWasm()` once during
 * startup. Both engines export it (the JavaScript one as a no-op), so callers
 * never branch on the engine. In a Web Worker or under node the WASM engine has
 * already instantiated itself synchronously by the time this module finishes
 * loading and the call is redundant but harmless; on the browser main thread it
 * is required, because browsers refuse to compile a module that size
 * synchronously off-worker.
 */
export {
    default,
    dopri,
    engineName,
    initMathWasm,
    initMathWasmSync,
    isMathWasmInitialized,
    isTree,
} from "./engine";
export { getComponent } from "./components";
export type {
    Bindings,
    Complex,
    Context,
    Dopri,
    Expression,
    OdeSolution,
    OdeState,
    Tree,
} from "./types";

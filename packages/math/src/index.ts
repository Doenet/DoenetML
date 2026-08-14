/**
 * `@doenet/math` — the single seam through which DoenetML reaches a
 * math-expressions engine.
 *
 * Consumers do not name this package. Each of them declares
 * `"math-expressions": "file:../math"`, so their unchanged
 *
 *     import me from "math-expressions";
 *     const expr = me.fromAst(["+", "x", 1]);
 *
 * resolves here instead of to the npm library — which is why swapping the
 * JavaScript library for the Rust/WASM drop-in touched none of the 147 files
 * that import it. What backs `me` is decided in `./engine.ts`.
 *
 * Realms that run the engine on the browser main thread must `await
 * initMathWasm()` once during startup, because browsers refuse to compile a
 * module that size synchronously off-worker. In a Web Worker or under node the
 * engine has already instantiated itself synchronously by the time this module
 * finishes loading, so the call is redundant but harmless — callers can make it
 * unconditionally rather than branching on the realm.
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

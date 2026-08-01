/**
 * The legacy JavaScript engine: `math-expressions@2.x` from npm, exactly as
 * DoenetML has always used it. This is the default; selecting the Rust engine is
 * an explicit build-time opt-in (see `./engine.ts`).
 *
 * The init functions are no-ops here so that consumers — notably the worker
 * bootstrap and the main-thread app startup — can call them unconditionally
 * without branching on which engine they were built against.
 */
import me, { isTree } from "math-expressions";
import type { Bindings, Dopri, Expression, Tree } from "./types";

export async function initMathWasm(): Promise<void> {}
export function initMathWasmSync(): void {}
export function isMathWasmInitialized(): boolean {
    return true;
}

/**
 * The Dormand-Prince ODE integrator. Legacy reached it as `me.math.dopri` —
 * numeric.js, re-exported through the math.js instance math-expressions@2
 * bundled. The Rust engine has no `me.math`, and exposes an equivalent as
 * `me.dopri`; exporting it under one name here is what lets `ODESystem.js`
 * stay engine-agnostic.
 */
export const dopri = (me as unknown as { math: { dopri: unknown } }).math
    .dopri as Dopri;

export { isTree };
export const engineName = "js" as const;
export type { Expression, Tree, Bindings, Dopri };
export default me;

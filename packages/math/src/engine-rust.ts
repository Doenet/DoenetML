/**
 * The Rust/WASM engine: `math-expressions-js-compat` (published upstream as
 * `math-expressions` v3), used unmodified from the `vendor/math-expressions`
 * submodule.
 *
 * This module is now a straight re-export. It previously carried four gap
 * fills, all of which landed upstream and have been deleted in turn:
 *
 *   - `Expression#f()` and the context-level operation family
 *     (`me.simplify(expr)` alongside `expr.simplify()`) — PR #84.
 *   - `fromAst` losing `NaN` and `±Infinity`, which `JSON.stringify` renders as
 *     the literal `null`. The compat layer now serializes through an
 *     `astReplacer` that spells all three as the `{"$":…}` specials Rust's
 *     `from_ast` reads back — so the boundary is tagged in both directions and
 *     `fromAst(x).tree` is a fixpoint.
 *   - `fromAst` rejecting an `Expression` where a tree was expected. DoenetML
 *     relies on that in both directions — a math-valued state variable *holds*
 *     an `Expression`, and code that re-wraps one hands it straight back. The
 *     same `astReplacer` now unwraps it, reading the holder rather than the
 *     value because `toJSON()` runs first. Ours cost a second full traversal.
 *
 * Deleting them is how we verify each upstream fix actually covers our usage;
 * that is what the seam is for. The one thing still supplied locally is the
 * WASM itself, injected by `./wasm-loader` through upstream's `setWasmModule`.
 *
 * The loader is imported *first*, and purely for that side effect: it must have
 * injected a module before anything below can parse. ES modules evaluate in
 * import order, so this line is load-bearing — do not reorder it below the
 * `Context` import.
 */
import "./wasm-loader";
import Context, { isTree } from "math-expressions-js-compat";
import type {
    Bindings,
    Dopri,
    Expression as ExpressionType,
    Tree,
} from "./types";

/**
 * The Dormand-Prince integrator, re-exported as a named export. The legacy
 * library reached numeric.js's copy through `me.math.dopri`; this engine has no
 * `me.math` entry for it and supplies its own `solve_ode`-backed equivalent on
 * the context. Callers (`ODESystem.js`, `packages/utils`) import it from
 * `@doenet/math` rather than reaching into the context.
 */
export const dopri = (Context as unknown as { dopri: Dopri }).dopri;

export {
    initMathWasm,
    initMathWasmSync,
    isMathWasmInitialized,
} from "./wasm-loader";
export { isTree };
export const engineName = "rust" as const;
export type { ExpressionType as Expression, Tree, Bindings, Dopri };
export default Context;

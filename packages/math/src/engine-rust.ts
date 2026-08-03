/**
 * The Rust/WASM engine: `math-expressions-js-compat` (published upstream as
 * `math-expressions` v3), used unmodified from the `vendor/math-expressions`
 * submodule.
 *
 * This module is now a straight re-export. It previously carried three gap
 * fills, all of which landed upstream and have been deleted in turn:
 *
 *   - `Expression#f()` and the context-level operation family
 *     (`me.simplify(expr)` alongside `expr.simplify()`) — PR #84.
 *   - `fromAst` losing `NaN` and `±Infinity`, which `JSON.stringify` renders as
 *     the literal `null`. The compat layer now serializes through an
 *     `astReplacer` that spells all three as the `{"$":…}` specials Rust's
 *     `from_ast` reads back — so the boundary is tagged in both directions and
 *     `fromAst(x).tree` is a fixpoint.
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
 * Restore the legacy contract that `fromAst` accepts an `Expression` where a
 * tree is expected, and unwraps it.
 *
 * DoenetML leans on this in both directions of its own plumbing: a math-valued
 * state variable *holds* an `Expression`, and code that re-wraps one —
 * `PiecewiseFunction.js`, `StateVariableEvaluator.ts`, `Dependency.ts`, and a
 * long tail of test helpers — hands it straight back to `fromAst`. Legacy
 * treated that as a copy (`me.fromAst(expr).tree` === `expr.tree`). The compat
 * layer instead serializes the object as-is, so the `Expression` reaches Rust as
 * a bare JSON object with no `$` key and `try_from_js` rejects it with
 * `unknown special None` — the `None` there is the `Option`, not the
 * `{"$":"None"}` special, which is a different thing and works fine.
 *
 * That single gap accounted for 95 hard errors across the suite.
 *
 * Unwrapping is recursive because an `Expression` can also sit *inside* a tree
 * being assembled (`["+", someExpr, 2]`). Unchanged subtrees are returned by
 * reference so an ordinary tree — the overwhelmingly common case — costs one
 * walk and allocates nothing.
 *
 * **Upstream belongs to have this**, and more cheaply than we can: compat's
 * `astReplacer` already visits every node on the way through `JSON.stringify`,
 * so unwrapping there is free, where here it is a second traversal.
 */
function unwrapExpressions(node: unknown): unknown {
    if (Array.isArray(node)) {
        let changed = false;
        const mapped = node.map((child) => {
            const next = unwrapExpressions(child);
            changed ||= next !== child;
            return next;
        });
        return changed ? mapped : node;
    }
    if (node !== null && typeof node === "object" && "tree" in node) {
        // An `Expression`: identified by the `tree` accessor rather than by
        // `instanceof`, so a legacy expression that wandered in across an engine
        // boundary unwraps too instead of failing deep inside wasm-bindgen.
        return unwrapExpressions((node as { tree: unknown }).tree);
    }
    return node;
}

const originalFromAst = Context.fromAst.bind(Context);
Context.fromAst = ((ast: Tree) =>
    originalFromAst(unwrapExpressions(ast) as Tree)) as typeof Context.fromAst;

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

/**
 * The types DoenetML imports alongside `me` — the shape the files that
 * import `math-expressions` are written against.
 *
 * Re-exported from the published `math-expressions` package, which ships its
 * own `types/math-expressions.d.ts`. They used to be vendored here as a
 * 1,283-line copy, because the engine reached this repository through a git
 * submodule that published nothing; the copy's header carried a line-by-line
 * argument that it still matched upstream, which is the kind of claim that
 * only stays true while someone keeps checking. Depending on the package
 * instead makes the question unaskable.
 *
 * Where the engine genuinely diverges from what DoenetML needs, the divergence
 * belongs in the ledger (MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md), not in a
 * widened type here that hides it.
 */
export type {
    Bindings,
    Complex,
    Context,
    Expression,
    Tree,
} from "math-expressions";

/**
 * A state vector, or a bare number for a scalar ODE. Upstream's, rather than a
 * second declaration of the same union.
 */
export type { OdeState, OdeSolution } from "math-expressions";

/**
 * The Dormand-Prince integrator, as `ODESystem.js` calls it.
 *
 * `typeof` the real export rather than a hand-written signature: upstream
 * declares `dopri` as a *function*, and `engine-rust.ts` re-exports that
 * function unchanged, so anything written here would be a second description
 * of one value — free to drift, and previously did, by omitting the three
 * members `OdeSolution` gained over `numeric.dopri`.
 */
export type Dopri = typeof import("math-expressions").dopri;

/**
 * The types DoenetML imports alongside `me`. They come from the legacy
 * package's hand-written `index.d.ts`, which is the shape ~163 call sites are
 * written against; the Rust engine is a drop-in for that shape, so both engines
 * are typed by it. Where the two genuinely diverge, the divergence belongs in
 * the ledger (MATH_EXPRESSIONS_RUST_MIGRATION_PLAN.md §Stage 1 Step 0), not in
 * a widened type that hides it.
 */
export type {
    Bindings,
    Complex,
    Context,
    Expression,
    Tree,
} from "math-expressions";

/** A state vector, or a bare number for a scalar ODE. */
export type OdeState = number | number[];

/** A computed trajectory with dense output — what {@link Dopri} returns. */
export interface OdeSolution {
    /** Interpolated state at `x`, or one state per element of an `x` array. */
    at(x: number): OdeState;
    at(x: number[]): OdeState[];
    /** Accepted step abscissas. */
    readonly x: number[];
    /** States at each step abscissa. */
    readonly y: OdeState[];
}

/**
 * The Dormand-Prince integrator, as `ODESystem.js` calls it. `f(x, y)` returns
 * the derivative. Both engines provide one — legacy via numeric.js under
 * `me.math`, the Rust engine via its own `solve_ode` — and neither supports
 * numeric.js's `event` argument, so it is absent here.
 */
export type Dopri = (
    x0: number,
    x1: number,
    y0: OdeState,
    f: (x: number, y: OdeState) => OdeState,
    tol?: number,
    maxit?: number,
) => OdeSolution;

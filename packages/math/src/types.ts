/**
 * The types DoenetML imports alongside `me` — the shape the 147 files that
 * import `math-expressions` are written against.
 *
 * They are vendored in `./vendored/math-expressions.d.ts` rather than pulled
 * from the legacy package, which is no longer a dependency. They arrived with
 * that library but were never *about* it: the Rust engine is a drop-in for this
 * shape. Where the engine genuinely diverges, the divergence belongs in the
 * ledger (MATH_EXPRESSIONS_UPSTREAM_REQUESTS.md), not in a widened type that
 * hides it.
 */
export type {
    Bindings,
    Complex,
    Context,
    Expression,
    Tree,
} from "./vendored/math-expressions";

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
 * the derivative. The legacy library reached numeric.js's copy through
 * `me.math.dopri`; this engine supplies its own `solve_ode`-backed equivalent.
 * Neither supports numeric.js's `event` argument, so it is absent here.
 */
export type Dopri = (
    x0: number,
    x1: number,
    y0: OdeState,
    f: (x: number, y: OdeState) => OdeState,
    tol?: number,
    maxit?: number,
) => OdeSolution;

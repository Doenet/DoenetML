/**
 * The types DoenetML imports alongside `me` — the shape the files that
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

/**
 * A computed trajectory with dense output — what {@link Dopri} returns.
 *
 * Declared to match `math-expressions@3.x`'s own `OdeSolution`, because that is
 * literally the object `dopri` hands back: the export in `engine-rust.ts` is
 * upstream's function, not a wrapper. The last three members are additive over
 * `numeric.dopri`, and omitting them made this declaration quietly narrower
 * than the value — in particular hiding that a solution owns a WASM handle that
 * nothing releases on its own.
 */
export interface OdeSolution {
    /** Interpolated state at `x`, or one state per element of an `x` array. */
    at(x: number): OdeState;
    at(x: number[]): OdeState[];
    /** Accepted step abscissas. */
    readonly x: number[];
    /** States at each step abscissa. */
    readonly y: OdeState[];
    /** True when integration stopped before `x1` (blow-up or step budget). */
    readonly terminatedEarly: boolean;
    /**
     * Release the underlying WASM handle. Idempotent. `numeric.dopri` had
     * nothing to release, so a caller that never frees behaves as it did
     * before — but a host integrating in a loop leaks one handle per call.
     * DoenetML's two callers keep `at` alive for later interpolation and so
     * cannot free at the call site.
     */
    free(): void;
    /** Alias of {@link free}, and the `using`-statement protocol. */
    dispose(): void;
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

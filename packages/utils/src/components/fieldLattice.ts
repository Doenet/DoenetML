/**
 * The lattice `<slopeField>` and `<vectorField>` are sampled on, and the
 * function they are sampled from.
 *
 * Shared by the JSXGraph renderer, which samples the lattice afresh on every
 * pan and zoom, and by the worker's PreFigure conversion, which samples it once
 * for the graph's bounds. Both must pick the same lattice points, or a field
 * drawn by PreFigure would not be the field the JSXGraph renderer shows.
 *
 * Everything here is pure, so it is directly unit-testable.
 */

import { createFunctionFromDefinition } from "./function";

export interface FieldBounds {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}

export interface FieldGrid {
    dx: number;
    dy: number;
    xoffset: number;
    yoffset: number;
}

/**
 * Rehydrate one of the worker's function definitions into a numeric closure the
 * lattice can call as `f(x, y)`.
 *
 * The definition's own arity is whatever the author wrote: two inputs for a
 * bare expression, which the field's sugar wraps in a `<function>` naming both
 * variables, but one for a `<function>` child — or a function it references —
 * that names a single variable. The two cannot be called the same way. A
 * one-input function built by `createFunctionFromDefinition` has signature
 * `(x, overrideDomain)`, so passing `y` to it as a second argument would not
 * supply a second input; it would suppress the function's domain check and draw
 * marks right across the interval its author excluded. A one-input definition
 * is therefore called with `x` alone and the lattice's `y` discarded, which is
 * what a field of `f(x)` means anyway.
 *
 * Only a `numInputs` in the definition can say otherwise. Every kind of
 * definition that omits it — interpolated, bezier, piecewise, a function
 * operator such as a derivative — describes a function of one input.
 */
export function fieldFunctionFromDefinition(
    fDefinition: any,
): (x: number, y: number) => number {
    const f = createFunctionFromDefinition(fDefinition) as (
        ...args: number[]
    ) => number;

    if ((fDefinition?.numInputs ?? 1) > 1) {
        return f;
    }
    return (x: number, _y: number) => f(x);
}

/**
 * The lattice indices whose points lie inside `bounds`.
 *
 * A negative `dx` or `dy` describes the same set of points as its positive
 * counterpart, just indexed in the opposite direction, so the two ends are
 * sorted before being rounded inward. (`pegboard`, whose lattice attributes
 * these mirror, is likewise indifferent to the sign.)
 *
 * Its `pegIndexRange` is not this function under another name, though: a
 * pegboard keeps its outermost peg half a spacing clear of the border, where
 * a field takes every point that lies inside at all. Sharing one of them
 * would change what the other draws.
 */
export function latticeRange(
    bounds: FieldBounds,
    grid: FieldGrid,
): { minXind: number; maxXind: number; minYind: number; maxYind: number } {
    const xIndA = (bounds.xMin - grid.xoffset) / grid.dx;
    const xIndB = (bounds.xMax - grid.xoffset) / grid.dx;
    const yIndA = (bounds.yMin - grid.yoffset) / grid.dy;
    const yIndB = (bounds.yMax - grid.yoffset) / grid.dy;

    return {
        minXind: Math.ceil(Math.min(xIndA, xIndB)),
        maxXind: Math.floor(Math.max(xIndA, xIndB)),
        minYind: Math.ceil(Math.min(yIndA, yIndB)),
        maxYind: Math.floor(Math.max(yIndA, yIndB)),
    };
}

/**
 * Stride needed to keep the mark count at or below `maxMarks`.
 *
 * Zooming out grows the lattice quadratically, so rather than refusing to draw
 * (a blank graph reads as a bug) the field coarsens: it keeps every `stride`-th
 * lattice line and stays readable.
 */
function strideFor(nx: number, ny: number, maxMarks: number): number {
    // `maxMarks` is the only thing bounding the work, so a value that is not a
    // usable cap must not be allowed to lift the bound: fall back to the
    // tightest possible cap rather than drawing the whole lattice. Anything
    // below 1 is unsatisfiable, since a non-empty lattice keeps at least one
    // mark at every stride.
    const cap = maxMarks >= 1 ? maxMarks : 1;
    const total = nx * ny;
    // Also covers an empty lattice (total <= 0) and maxMarks = Infinity.
    if (total <= cap) {
        return 1;
    }

    /** Lines kept along an axis of `n` lattice lines, at most. */
    const kept = (n: number, s: number) => Math.ceil(n / s);
    const fits = (s: number) => kept(nx, s) * kept(ny, s) <= cap;

    // sqrt(total / cap) is the answer for a continuous lattice, but each axis
    // keeps a *whole* number of lines, and rounding up twice can overshoot the
    // cap badly on a lopsided lattice: 10,000 x 1 lines under a cap of 400
    // gives a stride of 5, which keeps 2000 marks. Since `kept` is
    // non-increasing in the stride, so is `fits`, and the smallest stride that
    // fits can be bisected for exactly — in a number of steps that grows with
    // the log of the lattice size rather than with the lattice itself.
    let lo = 1;
    // A stride this long keeps one line per axis, so it always fits.
    let hi = Math.max(nx, ny);
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (fits(mid)) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return lo;
}

/**
 * The lattice lines of `grid` lying inside `bounds`, thinned so that no more
 * than `maxMarks` lattice points lie on them, with the stride that was applied
 * (1 when none was needed). The points to draw are every `x` in `xs` paired
 * with every `y` in `ys`, in increasing index order.
 *
 * When thinning, the kept lattice lines are those whose index is a multiple of
 * the stride. Anchoring on the index rather than on the first visible line
 * keeps a coarsened field in place as the graph is panned, instead of having
 * every mark jump a lattice line whenever the leading index changes.
 */
export function thinnedLatticeLines(
    bounds: FieldBounds,
    grid: FieldGrid,
    maxMarks: number,
): { xs: number[]; ys: number[]; stride: number } {
    const { minXind, maxXind, minYind, maxYind } = latticeRange(bounds, grid);
    // A spacing of zero or `NaN` leaves no lattice at all. A spacing so small,
    // or an offset so large, that an index passes 2^53 leaves one that cannot
    // be walked: adding a stride to such an index no longer changes it, so the
    // stride search and the loops below would never finish. Neither draws.
    // Nor does a lattice with no line along one axis, which has no points
    // however many lines lie along the other — and `maxMarks` bounds points,
    // not lines, so walking those lines would be unbounded work: a `dx` of
    // 1e-12 is 2e13 lines across a 20-unit graph.
    if (
        !Number.isSafeInteger(minXind) ||
        !Number.isSafeInteger(maxXind) ||
        !Number.isSafeInteger(minYind) ||
        !Number.isSafeInteger(maxYind) ||
        maxXind < minXind ||
        maxYind < minYind
    ) {
        return { xs: [], ys: [], stride: 1 };
    }

    const stride = strideFor(
        maxXind - minXind + 1,
        maxYind - minYind + 1,
        maxMarks,
    );

    const firstXind = Math.ceil(minXind / stride) * stride;
    const firstYind = Math.ceil(minYind / stride) * stride;

    const xs: number[] = [];
    for (let xind = firstXind; xind <= maxXind; xind += stride) {
        xs.push(xind * grid.dx + grid.xoffset);
    }
    const ys: number[] = [];
    for (let yind = firstYind; yind <= maxYind; yind += stride) {
        ys.push(yind * grid.dy + grid.yoffset);
    }

    return { xs, ys, stride };
}

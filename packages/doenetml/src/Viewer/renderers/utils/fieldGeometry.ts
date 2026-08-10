/**
 * Geometry for `<slopeField>` and `<vectorField>`.
 *
 * Both components draw a whole lattice of marks as a *single* JSXGraph curve.
 * Disconnected marks are produced by writing `NaN` into the coordinate arrays:
 * the SVG renderer emits a fresh `M` instead of an `L` whenever it meets one
 * (see jsxgraph `src/renderer/svg.js`, `updatePathStringPrim`), which is a true
 * pen-up. JSXGraph relies on the same trick for its own boxplots.
 *
 * The payoff is that the SVG node count is constant in the number of marks
 * instead of linear, which is what makes a 10,000-mark field practical.
 *
 * Everything here is pure: no JSXGraph and no React, so it is directly
 * unit-testable.
 */

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

export interface FieldScale {
    /** Pixels per unit in x, as reported by `board.unitX`. */
    unitX: number;
    /** Pixels per unit in y, as reported by `board.unitY`. */
    unitY: number;
}

export interface FieldData {
    dataX: number[];
    dataY: number[];
    /** Marks actually emitted (after `maxMarks` coarsening and NaN skipping). */
    numMarks: number;
    /** Lattice stride applied to stay within `maxMarks`; 1 means none. */
    stride: number;
}

/**
 * Everything a field builder needs besides the function itself: where to
 * sample, how finely, how the axes are scaled, and how big a mark may get.
 * Both builders take exactly this, so the renderer can assemble it once.
 */
export interface FieldSampling {
    bounds: FieldBounds;
    grid: FieldGrid;
    scale: FieldScale;
    /** Mark length in pixels. */
    markLength: number;
    maxMarks: number;
}

/**
 * The lattice indices whose points lie inside `bounds`.
 *
 * A negative `dx` or `dy` describes the same set of points as its positive
 * counterpart, just indexed in the opposite direction, so the two ends are
 * sorted before being rounded inward. (`pegboard`, whose lattice attributes
 * these mirror, is likewise indifferent to the sign.)
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
 * Visit every lattice point of `grid` lying inside `bounds`, thinned so that no
 * more than `maxMarks` points are visited, and return the stride that was
 * applied (1 when none was needed).
 *
 * When thinning, the kept lattice lines are those whose index is a multiple of
 * the stride. Anchoring on the index rather than on the first visible line
 * keeps a coarsened field in place as the graph is panned, instead of having
 * every mark jump a lattice line whenever the leading index changes.
 */
function forEachLatticePoint(
    bounds: FieldBounds,
    grid: FieldGrid,
    maxMarks: number,
    visit: (x: number, y: number) => void,
): number {
    const { minXind, maxXind, minYind, maxYind } = latticeRange(bounds, grid);
    if (
        !Number.isFinite(minXind) ||
        !Number.isFinite(maxXind) ||
        !Number.isFinite(minYind) ||
        !Number.isFinite(maxYind)
    ) {
        return 1;
    }

    const stride = strideFor(
        maxXind - minXind + 1,
        maxYind - minYind + 1,
        maxMarks,
    );

    const firstXind = Math.ceil(minXind / stride) * stride;
    const firstYind = Math.ceil(minYind / stride) * stride;

    for (let xind = firstXind; xind <= maxXind; xind += stride) {
        const x = xind * grid.dx + grid.xoffset;
        for (let yind = firstYind; yind <= maxYind; yind += stride) {
            visit(x, yind * grid.dy + grid.yoffset);
        }
    }

    return stride;
}

/**
 * Scale a user-space direction so it renders with a fixed *pixel* length.
 *
 * Normalizing in user units (the usual hand-rolled approach) only produces the
 * correct visual angle when the axes are equally scaled. Working in pixel space
 * keeps marks the same on-screen length, and at the true visual slope, on any
 * aspect ratio.
 *
 * Returns the half-displacement in user units, or null if the direction is
 * degenerate.
 */
function halfDisplacement(
    ux: number,
    uy: number,
    scale: FieldScale,
    pixelLength: number,
): { hx: number; hy: number } | null {
    const pixLen = Math.hypot(ux * scale.unitX, uy * scale.unitY);
    if (!Number.isFinite(pixLen) || pixLen === 0) {
        return null;
    }
    const t = pixelLength / 2 / pixLen;
    return { hx: ux * t, hy: uy * t };
}

/**
 * Tick marks for y' = f(x, y), centered on each lattice point.
 *
 * Emits 3 array entries per mark: two endpoints plus a NaN pen-up.
 */
export function buildSlopeFieldData({
    f,
    bounds,
    grid,
    scale,
    markLength,
    maxMarks,
}: FieldSampling & {
    f: (x: number, y: number) => number;
}): FieldData {
    const dataX: number[] = [];
    const dataY: number[] = [];
    let numMarks = 0;

    const stride = forEachLatticePoint(bounds, grid, maxMarks, (x, y) => {
        const slope = f(x, y);
        if (!Number.isFinite(slope)) {
            // Outside the function's domain: draw nothing here.
            return;
        }

        const half = halfDisplacement(1, slope, scale, markLength);
        if (half === null) {
            return;
        }

        dataX.push(x - half.hx, x + half.hx, NaN);
        dataY.push(y - half.hy, y + half.hy, NaN);
        numMarks++;
    });

    return { dataX, dataY, numMarks, stride };
}

/**
 * Arrows for the vector field (u(x, y), v(x, y)).
 *
 * Emits 9 array entries per arrow — shaft plus two barbs, each NaN-separated —
 * so the arrowheads stay part of the same single curve. JSXGraph's `lastArrow`
 * cannot be used: it applies to a curve as a whole, not to each pen-up piece.
 *
 * `markLength` is the length of the *longest* arrow on screen unless
 * `normalize` is set, in which case every arrow gets it.
 */
export function buildVectorFieldData({
    u,
    v,
    bounds,
    grid,
    scale,
    markLength,
    maxMarks,
    normalize,
    barbFraction = 0.3,
    barbAngle = 0.44,
}: FieldSampling & {
    u: (x: number, y: number) => number;
    v: (x: number, y: number) => number;
    /** Draw every arrow the same length, showing direction only. */
    normalize: boolean;
    /**
     * Arrowhead barb length, as a fraction of the arrow it terminates. A fixed
     * pixel size would swamp the short arrows of a magnitude-scaled field and
     * all but vanish on a large `markLength`.
     */
    barbFraction?: number;
    /** Half-spread of the arrowhead, in radians. */
    barbAngle?: number;
}): FieldData {
    const dataX: number[] = [];
    const dataY: number[] = [];
    let numMarks = 0;

    // Unnormalized arrows are sized relative to the longest vector on screen,
    // so the whole lattice has to be sampled before anything can be emitted.
    // `maxMarks` is what bounds the size of this array.
    const samples: {
        x: number;
        y: number;
        ux: number;
        uy: number;
        mag: number;
    }[] = [];
    let maxMag = 0;

    const stride = forEachLatticePoint(bounds, grid, maxMarks, (x, y) => {
        const ux = u(x, y);
        const uy = v(x, y);
        if (!Number.isFinite(ux) || !Number.isFinite(uy)) {
            // Outside the function's domain: draw nothing here.
            return;
        }
        // Magnitude in pixels, not in user units: what an arrow has to convey
        // is its on-screen length, whatever the axis scaling.
        const mag = Math.hypot(ux * scale.unitX, uy * scale.unitY);
        if (mag === 0) {
            // A zero vector has no direction to draw.
            return;
        }
        maxMag = Math.max(maxMag, mag);
        samples.push({ x, y, ux, uy, mag });
    });

    for (const { x, y, ux, uy, mag } of samples) {
        const pixelLength = normalize
            ? markLength
            : (markLength * mag) / maxMag;

        const half = halfDisplacement(ux, uy, scale, pixelLength);
        if (half === null) {
            continue;
        }

        // Arrows sit centered on the lattice point, like the tick marks do.
        const tailX = x - half.hx;
        const tailY = y - half.hy;
        const headX = x + half.hx;
        const headY = y + half.hy;

        dataX.push(tailX, headX, NaN);
        dataY.push(tailY, headY, NaN);

        // Barbs: rotate the backward pixel direction by +/- barbAngle, then
        // convert back to user units so the head keeps its on-screen shape
        // whatever the axis scaling.
        const bx = (-ux * scale.unitX) / mag;
        const by = (-uy * scale.unitY) / mag;
        const barbLength = pixelLength * barbFraction;
        for (const sign of [1, -1]) {
            const ca = Math.cos(sign * barbAngle);
            const sa = Math.sin(sign * barbAngle);
            const rx = (bx * ca - by * sa) * barbLength;
            const ry = (bx * sa + by * ca) * barbLength;
            dataX.push(headX, headX + rx / scale.unitX, NaN);
            dataY.push(headY, headY + ry / scale.unitY, NaN);
        }

        numMarks++;
    }

    return { dataX, dataY, numMarks, stride };
}

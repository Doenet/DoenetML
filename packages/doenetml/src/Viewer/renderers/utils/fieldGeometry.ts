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

/** The lattice indices whose points lie inside `bounds`. */
export function latticeRange(
    bounds: FieldBounds,
    grid: FieldGrid,
): { minXind: number; maxXind: number; minYind: number; maxYind: number } {
    const minXind = Math.ceil((bounds.xMin - grid.xoffset) / grid.dx);
    const maxXind = Math.floor((bounds.xMax - grid.xoffset) / grid.dx);
    const minYind = Math.ceil((bounds.yMin - grid.yoffset) / grid.dy);
    const maxYind = Math.floor((bounds.yMax - grid.yoffset) / grid.dy);
    return { minXind, maxXind, minYind, maxYind };
}

/**
 * Stride needed to keep the mark count at or below `maxMarks`.
 *
 * Zooming out grows the lattice quadratically, so rather than refusing to draw
 * (a blank graph reads as a bug) the field coarsens: it keeps every `stride`-th
 * lattice line and stays readable.
 */
function strideFor(nx: number, ny: number, maxMarks: number): number {
    if (maxMarks <= 0 || nx <= 0 || ny <= 0) {
        return 1;
    }
    const total = nx * ny;
    if (total <= maxMarks) {
        return 1;
    }
    return Math.ceil(Math.sqrt(total / maxMarks));
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
}: {
    f: (x: number, y: number) => number;
    bounds: FieldBounds;
    grid: FieldGrid;
    scale: FieldScale;
    /** Mark length in pixels. */
    markLength: number;
    maxMarks: number;
}): FieldData {
    const dataX: number[] = [];
    const dataY: number[] = [];
    let numMarks = 0;

    const { minXind, maxXind, minYind, maxYind } = latticeRange(bounds, grid);
    if (
        !Number.isFinite(minXind) ||
        !Number.isFinite(maxXind) ||
        !Number.isFinite(minYind) ||
        !Number.isFinite(maxYind)
    ) {
        return { dataX, dataY, numMarks: 0, stride: 1 };
    }

    const stride = strideFor(
        maxXind - minXind + 1,
        maxYind - minYind + 1,
        maxMarks,
    );

    for (let xind = minXind; xind <= maxXind; xind += stride) {
        const x = xind * grid.dx + grid.xoffset;
        for (let yind = minYind; yind <= maxYind; yind += stride) {
            const y = yind * grid.dy + grid.yoffset;

            const slope = f(x, y);
            if (!Number.isFinite(slope)) {
                // Outside the function's domain: draw nothing here.
                continue;
            }

            const half = halfDisplacement(1, slope, scale, markLength);
            if (half === null) {
                continue;
            }

            dataX.push(x - half.hx, x + half.hx, NaN);
            dataY.push(y - half.hy, y + half.hy, NaN);
            numMarks++;
        }
    }

    return { dataX, dataY, numMarks, stride };
}

/**
 * Arrows for the vector field (u(x, y), v(x, y)).
 *
 * Emits 9 array entries per arrow — shaft plus two barbs, each NaN-separated —
 * so the arrowheads stay part of the same single curve. JSXGraph's `lastArrow`
 * cannot be used: it applies to a curve as a whole, not to each pen-up piece.
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
    barbLength = 4,
    barbAngle = 0.44,
}: {
    u: (x: number, y: number) => number;
    v: (x: number, y: number) => number;
    bounds: FieldBounds;
    grid: FieldGrid;
    scale: FieldScale;
    /** Arrow length in pixels (of the longest arrow when `normalize` is false). */
    markLength: number;
    maxMarks: number;
    /** Draw every arrow the same length, showing direction only. */
    normalize: boolean;
    /** Arrowhead barb length, in pixels. */
    barbLength?: number;
    /** Half-spread of the arrowhead, in radians. */
    barbAngle?: number;
}): FieldData {
    const dataX: number[] = [];
    const dataY: number[] = [];
    let numMarks = 0;

    const { minXind, maxXind, minYind, maxYind } = latticeRange(bounds, grid);
    if (
        !Number.isFinite(minXind) ||
        !Number.isFinite(maxXind) ||
        !Number.isFinite(minYind) ||
        !Number.isFinite(maxYind)
    ) {
        return { dataX, dataY, numMarks: 0, stride: 1 };
    }

    const stride = strideFor(
        maxXind - minXind + 1,
        maxYind - minYind + 1,
        maxMarks,
    );

    // When arrows scale with magnitude, one pass is needed first to find the
    // largest magnitude so nothing overruns `markLength`.
    const samples: { x: number; y: number; ux: number; uy: number }[] = [];
    let maxMag = 0;
    for (let xind = minXind; xind <= maxXind; xind += stride) {
        const x = xind * grid.dx + grid.xoffset;
        for (let yind = minYind; yind <= maxYind; yind += stride) {
            const y = yind * grid.dy + grid.yoffset;
            const ux = u(x, y);
            const uy = v(x, y);
            if (!Number.isFinite(ux) || !Number.isFinite(uy)) {
                continue;
            }
            const mag = Math.hypot(ux * scale.unitX, uy * scale.unitY);
            if (mag > maxMag) {
                maxMag = mag;
            }
            samples.push({ x, y, ux, uy });
        }
    }

    for (const { x, y, ux, uy } of samples) {
        const mag = Math.hypot(ux * scale.unitX, uy * scale.unitY);
        if (mag === 0) {
            continue;
        }
        const pixelLength = normalize
            ? markLength
            : maxMag > 0
              ? (markLength * mag) / maxMag
              : markLength;

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
        // convert back to user units so they keep a constant on-screen size.
        const dxPix = (headX - tailX) * scale.unitX;
        const dyPix = (headY - tailY) * scale.unitY;
        const dLen = Math.hypot(dxPix, dyPix);
        if (dLen > 0) {
            const bx = -dxPix / dLen;
            const by = -dyPix / dLen;
            for (const sign of [1, -1]) {
                const ca = Math.cos(sign * barbAngle);
                const sa = Math.sin(sign * barbAngle);
                const rx = (bx * ca - by * sa) * barbLength;
                const ry = (bx * sa + by * ca) * barbLength;
                dataX.push(headX, headX + rx / scale.unitX, NaN);
                dataY.push(headY, headY + ry / scale.unitY, NaN);
            }
        }

        numMarks++;
    }

    return { dataX, dataY, numMarks, stride };
}

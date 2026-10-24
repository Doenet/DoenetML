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

import {
    thinnedLatticeLines,
    type FieldBounds,
    type FieldGrid,
} from "@doenet/utils";

// The lattice and the function are shared with the worker's PreFigure
// conversion, which has to sample the same lattice points.
export {
    fieldFunctionFromDefinition,
    type FieldBounds,
    type FieldGrid,
} from "@doenet/utils";

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
 * Visit every lattice point of `grid` lying inside `bounds`, thinned so that no
 * more than `maxMarks` points are visited, and return the stride that was
 * applied (1 when none was needed). See `thinnedLatticeLines`.
 */
function forEachLatticePoint(
    bounds: FieldBounds,
    grid: FieldGrid,
    maxMarks: number,
    visit: (x: number, y: number) => void,
): number {
    const { xs, ys, stride } = thinnedLatticeLines(bounds, grid, maxMarks);

    for (const x of xs) {
        for (const y of ys) {
            visit(x, y);
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
 * Returns the displacement in user units that spans `pixelLength` on screen, or
 * null if the direction is degenerate.
 */
function scaledDisplacement(
    ux: number,
    uy: number,
    scale: FieldScale,
    pixelLength: number,
): { dx: number; dy: number } | null {
    const pixLen = Math.hypot(ux * scale.unitX, uy * scale.unitY);
    if (!Number.isFinite(pixLen) || pixLen === 0) {
        return null;
    }
    const t = pixelLength / pixLen;
    return { dx: ux * t, dy: uy * t };
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

        const d = scaledDisplacement(1, slope, scale, markLength);
        if (d === null) {
            return;
        }

        // A slope mark is a sample of the solution curve's tangent line, which
        // passes through the lattice point — so it straddles it.
        dataX.push(x - d.dx / 2, x + d.dx / 2, NaN);
        dataY.push(y - d.dy / 2, y + d.dy / 2, NaN);
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

        const d = scaledDisplacement(ux, uy, scale, pixelLength);
        if (d === null) {
            continue;
        }

        // An arrow represents the vector *at* the lattice point, so its tail
        // sits there and it points away. (Unlike a slope mark, which straddles
        // its point: a tangent direction has no head or tail to distinguish.)
        const headX = x + d.dx;
        const headY = y + d.dy;

        dataX.push(x, headX, NaN);
        dataY.push(y, headY, NaN);

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

import { asFiniteNumber, escapeXml, pushWarning } from "./common";
import type { GraphBounds } from "./types";
import type { DiagnosticRecord } from "@doenet/utils";

// Dark-mode grid stroke. PreFigure defaults grid lines to `#ccc`, which is
// tuned for a white canvas; on the dark canvas (`#121212`) that reads as a
// bright lattice sitting on top of the diagram. JSXGraph draws its grid as
// `#c0c0c0` at half opacity, which composites to roughly this gray over the
// dark canvas, so the two renderers land in the same place.
const PREFIGURE_DARK_GRID_COLOR = "#666666";

// PreFigure's own spacing table (`grid_delta` in `prefig/core/grid_axes.py`),
// reproduced so `grid="dense"` can be expressed as a subdivision of the
// spacing PreFigure would have chosen on its own. Typed as possibly undefined
// so the lookup below has to answer for an index outside the table.
const PREFIGURE_GRID_DELTA: Record<number, number | undefined> = {
    2: 0.1,
    3: 0.25,
    4: 0.25,
    5: 0.5,
    6: 0.5,
    7: 0.5,
    8: 0.5,
    9: 0.5,
    10: 0.5,
    11: 0.5,
    12: 1,
    13: 1,
    14: 1,
    15: 1,
    16: 1,
    17: 1,
    18: 1,
    19: 1,
    20: 1,
};

// `grid="dense"` draws JSXGraph's minor tick lines as well as its major ones.
// JSXGraph puts four minor ticks between major ones — cutting each major
// interval into five — except when that interval is 2×10^k, where it puts three
// (`setMinorTicks` in `doenetml/src/Viewer/renderers/utils/jsxgraph.ts`).
// PreFigure has no notion of minor ticks, so we subdivide its automatic spacing
// by the common factor of five rather than tracking which case JSXGraph's own
// tick interval would have fallen into.
const DENSE_SUBDIVISIONS = 5;

// PreFigure emits one `<line>` per grid line, so a spacing far finer than the
// axis range turns into an unusable diagram (and a very slow compile). Past
// this many lines on either axis we drop the grid and say so.
const MAX_GRID_LINES_PER_AXIS = 1000;

// PreFigure aligns grid lines to multiples of the spacing using this tolerance
// (`find_gridspacing`), so a bound that is a multiple only up to floating-point
// noise still gets its line. We match it.
const MULTIPLE_TOLERANCE = 1e-10;

/**
 * Rounds half-way values to the nearest even integer, as Python's `round` does.
 *
 * The spacing table above is indexed by `round(2 * distance)` in PreFigure. At
 * `2 * distance = 2.5` Python picks 2 where a round-half-up would pick 3, and
 * those two entries disagree (0.1 vs 0.25), so the tie-breaking rule is part of
 * the spacing PreFigure actually chooses.
 */
function roundHalfToEven(value: number): number {
    const lower = Math.floor(value);
    const fraction = value - lower;

    if (fraction > 0.5) {
        return lower + 1;
    }
    if (fraction < 0.5) {
        return lower;
    }
    return lower % 2 === 0 ? lower : lower + 1;
}

/**
 * Trims floating-point noise from a computed coordinate.
 *
 * Spacings are built by repeated multiplication and division by ten, so a
 * position that should read as `0.15` arrives as `0.15000000000000002` and
 * would be written into the XML that way. Fifteen significant digits is the
 * most a double is guaranteed to carry exactly, so rounding there absorbs that
 * noise. A genuinely irrational position such as `pi/2` moves by a relative
 * `1e-15` instead — far below anything the rendered diagram resolves.
 */
function cleanNumber(value: number): number {
    return Number(value.toPrecision(15));
}

/**
 * Reports whether an axis range is one a grid can be drawn on.
 *
 * Both ends are finite by the time they reach here, but the width between them
 * can still be zero, negative, or — for ends near the largest representable
 * double — infinite. The normalizing loops in
 * {@link prefigureAutomaticGridSpacing} divide the width by ten until it drops
 * to ten and multiply it by ten until it passes one, so a width of zero or
 * infinity spins forever, here and in PreFigure itself.
 */
function isDrawableRange(min: number, max: number): boolean {
    return max > min && Number.isFinite(max - min);
}

/**
 * Reproduces PreFigure's automatic grid spacing for one axis range.
 *
 * This is a port of `find_gridspacing()` in `prefig/core/grid_axes.py`, kept in
 * step with it so `grid="dense"` is exactly a subdivision of the spacing that
 * `grid="medium"` gets from PreFigure itself.
 *
 * The caller guarantees a range {@link isDrawableRange} accepts, which is what
 * makes the two loops below terminate.
 */
function prefigureAutomaticGridSpacing(min: number, max: number): number {
    let distance = max - min;

    let spacing = 1;
    while (distance > 10) {
        distance /= 10;
        spacing *= 10;
    }
    while (distance <= 1) {
        distance *= 10;
        spacing /= 10;
    }

    // `distance` now sits in (1, 10], so the index lands in (2, 20] and the
    // table always answers; the fallback only guards against a rounding
    // surprise at the ends of that interval.
    const delta = PREFIGURE_GRID_DELTA[roundHalfToEven(2 * distance)] ?? 1;

    return spacing * delta;
}

type GridTriple = [number, number, number];

/**
 * Turns a spacing into the `(first, spacing, last)` triple PreFigure wants.
 *
 * Doenet places grid lines at multiples of the spacing measured from the axes,
 * so the triple runs from the smallest multiple at or above `min` to the
 * largest at or below `max`.
 *
 * Returns null when the grid would exceed {@link MAX_GRID_LINES_PER_AXIS}, or
 * when a spacing small enough to overflow the division leaves no usable
 * positions at all — both mean the same thing to the caller: too fine to draw.
 */
function alignedGridTriple(
    min: number,
    max: number,
    spacing: number,
): GridTriple | null {
    const first = cleanNumber(
        spacing * Math.ceil(min / spacing - MULTIPLE_TOLERANCE),
    );
    const last = cleanNumber(
        spacing * Math.floor(max / spacing + MULTIPLE_TOLERANCE),
    );

    if (last < first) {
        // No multiple of the spacing falls inside the range. `spacings` has to
        // carry a triple for both axes, so give this one a single position
        // below the bbox; PreFigure skips positions outside the bbox and draws
        // nothing for this axis.
        const belowRange = cleanNumber(min - spacing);
        return [belowRange, spacing, belowRange];
    }

    // A non-finite endpoint means `min / spacing` overflowed, which leaves the
    // line count Infinity or NaN; `Number.isFinite` rejects both.
    const lineCount = Math.round((last - first) / spacing) + 1;
    if (!Number.isFinite(lineCount) || lineCount > MAX_GRID_LINES_PER_AXIS) {
        return null;
    }

    return [first, spacing, last];
}

function positiveSpacing(value: unknown): number | null {
    const spacing = asFiniteNumber(value);
    return spacing !== null && spacing > 0 ? spacing : null;
}

/**
 * Builds the `<grid>` element for a graph, or an empty string for no grid.
 *
 * The three forms of Doenet's `grid` attribute map onto PreFigure like this:
 *
 * - `"medium"` — a bare `<grid />`. With no `spacings`, `hspacing`, or
 *   `vspacing`, PreFigure derives the spacing from the bounding box itself,
 *   which is what keeps the grid adapting as the graph bounds change. This is
 *   the closest PreFigure has to the JSXGraph grid that re-scales on zoom.
 * - `"dense"` — that same automatic spacing, subdivided
 *   {@link DENSE_SUBDIVISIONS} ways, written out explicitly. PreFigure has no
 *   automatic form for it, so we compute the spacing with its own algorithm and
 *   hand back the result as `spacings`.
 * - `[dx, dy]` — the authored spacings, aligned to multiples of `dx` and `dy`.
 */
export function gridElementFromGrid({
    grid,
    graphBounds,
    darkMode,
    diagnostics,
}: {
    grid: unknown;
    graphBounds: GraphBounds;
    darkMode: boolean;
    diagnostics: DiagnosticRecord[];
}): string {
    if (grid !== "medium" && grid !== "dense" && !Array.isArray(grid)) {
        // "none", or anything the grid state variable could not resolve.
        return "";
    }

    const [xMin, yMin, xMax, yMax] = graphBounds;

    if (!isDrawableRange(xMin, xMax) || !isDrawableRange(yMin, yMax)) {
        // An empty, inverted, or overflowing axis range has no grid to draw,
        // and PreFigure's automatic spacing loops forever on one, so a bare
        // `<grid />` must not reach it either. Nothing else about such a graph
        // renders, and `doenet-w0062` already covers non-finite bounds, so
        // this stays quiet.
        return "";
    }

    const strokeAttr = darkMode ? ` stroke="${PREFIGURE_DARK_GRID_COLOR}"` : "";

    if (grid === "medium") {
        return `<grid${strokeAttr} />`;
    }

    let xSpacing: number | null;
    let ySpacing: number | null;

    if (grid === "dense") {
        xSpacing = cleanNumber(
            prefigureAutomaticGridSpacing(xMin, xMax) / DENSE_SUBDIVISIONS,
        );
        ySpacing = cleanNumber(
            prefigureAutomaticGridSpacing(yMin, yMax) / DENSE_SUBDIVISIONS,
        );
    } else {
        xSpacing = positiveSpacing(grid[0]);
        ySpacing = positiveSpacing(grid[1]);
    }

    if (xSpacing === null || ySpacing === null) {
        return "";
    }

    const xTriple = alignedGridTriple(xMin, xMax, xSpacing);
    const yTriple = alignedGridTriple(yMin, yMax, ySpacing);

    if (xTriple === null || yTriple === null) {
        pushWarning({ diagnostics, code: "doenet-w0118" });
        return "";
    }

    // PreFigure reads `spacings` as a pair of `(first, spacing, last)` triples.
    // Every component is finite by construction — `alignedGridTriple` rejects
    // the triples that are not — so default number formatting is enough.
    const spacings = `((${xTriple.join(",")}),(${yTriple.join(",")}))`;

    return `<grid spacings="${escapeXml(spacings)}"${strokeAttr} />`;
}

import React, { useContext, useEffect, useRef } from "react";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BASE_LAYER_OFFSET, BoardContext } from "./graph";
import me from "math-expressions";
import type { round as RoundType } from "mathjs";
// `RoundType` aliases the *value* `round`, so it needs a `typeof` to be
// used as a type.
const { round } = me.math as { round: typeof RoundType };
import { JXGBoard, JXGPoint } from "./jsxgraph-distrib/types";
import type { UnlabeledGraphicalSVs } from "./utils/graphicalSVs";

/**
 * A pegboard sets `static includeLabels = false`, so it receives none of the
 * label state variables most graphical components carry — only the universal
 * ones, plus the lattice it describes.
 */
interface PegboardSVs extends UnlabeledGraphicalSVs {
    dx: number;
    dy: number;
    xoffset: number;
    yoffset: number;
}

/**
 * The lattice indices of the pegs to draw, as
 * `[minXind, maxXind, minYind, maxYind]`.
 */
type PegIndexRange = [number, number, number, number];

/**
 * Whether an index range describes a lattice that can be drawn. The indices
 * come from dividing the bounding box by the spacing, so a spacing of zero
 * leaves them infinite or NaN, naming no pegs at all.
 */
function latticeIsDrawable(...range: PegIndexRange) {
    return range.every(Number.isFinite);
}

export default React.memo(function Pegboard(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<PegboardSVs>(props);

    // @ts-ignore
    Pegboard.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let pegboardJXG = useRef<JXGPoint[][] | null>(null);

    let previousBounds = useRef<PegIndexRange | null>(null);

    let dx = useRef<number>(SVs.dx);
    let dy = useRef<number>(SVs.dy);
    let xoffset = useRef<number>(SVs.xoffset);
    let yoffset = useRef<number>(SVs.yoffset);

    dx.current = SVs.dx;
    dy.current = SVs.dy;
    xoffset.current = SVs.xoffset;
    yoffset.current = SVs.yoffset;

    let jsxPointAttributes = useRef<Record<string, any>>({
        visible: !SVs.hidden,
        fixed: true,
        withlabel: false,
        layer: 10 * SVs.layer + BASE_LAYER_OFFSET,
        fillColor: "darkgray",
        strokeColor: "darkgray",
        size: 0.1,
        face: "circle",
        highlight: false,
        showinfobox: false,
    });

    jsxPointAttributes.current.visible = !SVs.hidden;
    jsxPointAttributes.current.layer = 10 * SVs.layer + BASE_LAYER_OFFSET;

    useEffect(() => {
        if (board === null) {
            return;
        }
        const listeningBoard = board;

        /**
         * Re-tile as the graph is panned or zoomed, but only when that has
         * changed which pegs the bounding box has room for: a pan shorter
         * than one spacing leaves the lattice already on screen exactly
         * right. A change to the spacing or the offsets moves the pegs
         * without the bounding box moving at all, and so is the business of
         * the render below rather than of this listener.
         */
        function followBoundingBox() {
            let [minXind, maxXind, minYind, maxYind] =
                pegIndexRange(listeningBoard);
            let [prevXmin, prevXmax, prevYmin, prevYmax] =
                previousBounds.current!;

            if (
                minXind !== prevXmin ||
                maxXind !== prevXmax ||
                minYind !== prevYmin ||
                maxYind !== prevYmax
            ) {
                recalculatePegboard(minXind, maxXind, minYind, maxYind);
            }
        }

        listeningBoard.on("boundingbox", followBoundingBox);

        //On unmount
        return () => {
            // The board outlives a pegboard removed from the document — one
            // inside a `<conditionalContent>` that switches off, say — so the
            // listener has to go with the component. Left behind, it finds no
            // pegs on the next bounding box change and builds a fresh set that
            // belongs to no mounted component and nothing can remove.
            listeningBoard.off("boundingbox", followBoundingBox);
            deletePegboardJXG();
        };
    }, []);

    /** Where the peg at lattice index `(xind, yind)` sits on the graph. */
    function pegCoords(xind: number, yind: number): [number, number] {
        return [
            xind * dx.current + xoffset.current,
            yind * dy.current + yoffset.current,
        ];
    }

    /** Draw the peg at lattice index `(xind, yind)`. */
    function createPeg(xind: number, yind: number) {
        return board!.create(
            "point",
            pegCoords(xind, yind),
            jsxPointAttributes.current,
        ) as JXGPoint;
    }

    /**
     * The indices of the outermost pegs to draw for the board's current
     * bounding box. Each edge's fractional lattice index is stepped one peg
     * inward and the result rounded, which keeps the outermost peg at least
     * half a spacing clear of the border: a peg that fits inside the box but
     * lands nearer than that goes undrawn. The step comes before the
     * rounding, and the two do not commute: ties round away from zero, so
     * rounding first would draw a peg sitting exactly on that half-spacing
     * boundary where this draws none.
     *
     * The range it returns is only worth drawing if `latticeIsDrawable`
     * accepts it.
     */
    function pegIndexRange(theBoard: JXGBoard): PegIndexRange {
        let [xMin, yMax, xMax, yMin] = theBoard.getBoundingBox();

        let xind1 = (xMin - xoffset.current) / dx.current;
        let xind2 = (xMax - xoffset.current) / dx.current;
        let yind1 = (yMin - yoffset.current) / dy.current;
        let yind2 = (yMax - yoffset.current) / dy.current;

        // Note: use round from mathjs so that it rounds -0.5 to -1, not 0.
        return [
            round(Math.min(xind1, xind2) + 1),
            round(Math.max(xind1, xind2) - 1),
            round(Math.min(yind1, yind2) + 1),
            round(Math.max(yind1, yind2) - 1),
        ];
    }

    function createPegboardJXG() {
        if (board === null) {
            return;
        }

        let [minXind, maxXind, minYind, maxYind] = pegIndexRange(board);

        previousBounds.current = [minXind, maxXind, minYind, maxYind];

        if (latticeIsDrawable(minXind, maxXind, minYind, maxYind)) {
            let pegs: JXGPoint[][] = [];

            for (let yind = minYind; yind <= maxYind; yind++) {
                let row: JXGPoint[] = [];
                for (let xind = minXind; xind <= maxXind; xind++) {
                    row.push(createPeg(xind, yind));
                }
                pegs.push(row);
            }

            pegboardJXG.current = pegs;
        }
    }

    function deletePegboardJXG() {
        if (pegboardJXG.current !== null) {
            for (let row of pegboardJXG.current) {
                for (let point of row) {
                    board?.removeObject(point);
                }
            }
        }

        pegboardJXG.current = null;
    }

    function recalculatePegboard(
        minXind: number,
        maxXind: number,
        minYind: number,
        maxYind: number,
    ) {
        if (pegboardJXG.current === null) {
            return createPegboardJXG();
        }

        if (!latticeIsDrawable(minXind, maxXind, minYind, maxYind)) {
            return deletePegboardJXG();
        }

        let [prevXmin, prevXmax, prevYmin, prevYmax] = previousBounds.current!;

        let numRows = maxYind - minYind + 1;
        let prevNrows = prevYmax - prevYmin + 1;
        let numColumns = maxXind - minXind + 1;
        let prevNcols = prevXmax - prevXmin + 1;

        for (let i = 0; i < Math.min(numRows, prevNrows); i++) {
            let row = pegboardJXG.current[i];

            for (let j = 0; j < Math.min(numColumns, prevNcols); j++) {
                row[j].coords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    pegCoords(j + minXind, i + minYind),
                );

                row[j].needsUpdate = true;
                row[j].update();
            }
            if (prevNcols > numColumns) {
                for (let j = numColumns; j < prevNcols; j++) {
                    let point = row.pop();
                    if (point) {
                        board?.removeObject(point);
                    }
                }
            } else if (prevNcols < numColumns) {
                for (let j = prevNcols; j < numColumns; j++) {
                    row.push(createPeg(j + minXind, i + minYind));
                }
            }
        }

        if (prevNrows > numRows) {
            for (let i = numRows; i < prevNrows; i++) {
                let row = pegboardJXG.current.pop();
                if (row) {
                    for (let j = 0; j < prevNcols; j++) {
                        let point = row.pop();
                        if (point) {
                            board?.removeObject(point);
                        }
                    }
                }
            }
        } else if (prevNrows < numRows) {
            for (let i = prevNrows; i < numRows; i++) {
                let row: JXGPoint[] = [];
                for (let j = 0; j < numColumns; j++) {
                    row.push(createPeg(j + minXind, i + minYind));
                }
                pegboardJXG.current.push(row);
            }
        }

        previousBounds.current = [minXind, maxXind, minYind, maxYind];

        board!.updateRenderer();
    }

    if (board) {
        if (pegboardJXG.current === null) {
            createPegboardJXG();
        } else {
            // Unconditionally, unlike the bounding box listener: the pegs may
            // need moving even where the lattice covers the same indices,
            // since `dx`, `dy` and the offsets can have changed.
            recalculatePegboard(...pegIndexRange(board));

            let firstPeg = pegboardJXG.current?.[0]?.[0];
            if (firstPeg) {
                let layer = 10 * SVs.layer + BASE_LAYER_OFFSET;
                let layerChanged = firstPeg.visProp.layer !== layer;

                if (layerChanged) {
                    for (let row of pegboardJXG.current!) {
                        for (let peg of row) {
                            peg.setAttribute({ layer });
                        }
                    }
                }
            }
        }
    }

    return null;
});

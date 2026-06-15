import React, { useContext, useEffect, useRef } from "react";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BASE_LAYER_OFFSET, BoardContext } from "./graph";
import me from "math-expressions";
import { round } from "mathjs";
import { JXGPoint } from "./jsxgraph-distrib/types";

interface PegboardSVs {
    hidden: boolean;
    layer: number;
    dx: number;
    dy: number;
    xoffset: number;
    yoffset: number;
}

export default React.memo(function Pegboard(props: UseDoenetRendererProps) {
    let { SVs } = useDoenetRenderer<PegboardSVs>(props);

    // @ts-ignore
    Pegboard.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let pegboardJXG = useRef<JXGPoint[][] | null>(null);

    let previousBounds = useRef<[number, number, number, number] | null>(null);

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
        //On unmount
        return () => {
            deletePegboardJXG();
        };
    }, []);

    function createPegboardJXG() {
        if (board === null) {
            return null;
        }

        let [xMin, yMax, xMax, yMin] = board.getBoundingBox();

        let xind1 = (xMin - xoffset.current) / dx.current;
        let xind2 = (xMax - xoffset.current) / dx.current;
        let yind1 = (yMin - yoffset.current) / dy.current;
        let yind2 = (yMax - yoffset.current) / dy.current;

        // Note: use round from mathjs so that it rounds -0.5 to -1, not 0.
        let minXind = round(Math.min(xind1, xind2) + 1);
        let maxXind = round(Math.max(xind1, xind2) - 1);
        let minYind = round(Math.min(yind1, yind2) + 1);
        let maxYind = round(Math.max(yind1, yind2) - 1);

        previousBounds.current = [minXind, maxXind, minYind, maxYind];

        if (
            Number.isFinite(minXind) &&
            Number.isFinite(maxXind) &&
            Number.isFinite(minYind) &&
            Number.isFinite(maxYind)
        ) {
            let pegs: JXGPoint[][] = [];

            for (let yind = minYind; yind <= maxYind; yind++) {
                let y = yind * SVs.dy + SVs.yoffset;
                let row: JXGPoint[] = [];
                for (let xind = minXind; xind <= maxXind; xind++) {
                    row.push(
                        board.create(
                            "point",
                            [xind * SVs.dx + SVs.xoffset, y],
                            jsxPointAttributes.current,
                        ) as JXGPoint,
                    );
                }
                pegs.push(row);
            }

            pegboardJXG.current = pegs;
        }

        board.on("boundingbox", () => {
            let [xMin, yMax, xMax, yMin] = board.getBoundingBox();

            let xind1 = (xMin - xoffset.current) / dx.current;
            let xind2 = (xMax - xoffset.current) / dx.current;
            let yind1 = (yMin - yoffset.current) / dy.current;
            let yind2 = (yMax - yoffset.current) / dy.current;

            // Note: use round from mathjs so that it rounds -0.5 to -1, not 0.
            let minXind = round(Math.min(xind1, xind2) + 1);
            let maxXind = round(Math.max(xind1, xind2) - 1);
            let minYind = round(Math.min(yind1, yind2) + 1);
            let maxYind = round(Math.max(yind1, yind2) - 1);

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
        });
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

        if (
            !Number.isFinite(minXind) ||
            !Number.isFinite(maxXind) ||
            !Number.isFinite(minYind) ||
            !Number.isFinite(maxYind)
        ) {
            return deletePegboardJXG();
        }

        let [prevXmin, prevXmax, prevYmin, prevYmax] = previousBounds.current!;

        let numRows = maxYind - minYind + 1;
        let prevNrows = prevYmax - prevYmin + 1;
        let numColumns = maxXind - minXind + 1;
        let prevNcols = prevXmax - prevXmin + 1;

        for (let i = 0; i < Math.min(numRows, prevNrows); i++) {
            let row = pegboardJXG.current[i];
            let y = (i + minYind) * dy.current + yoffset.current;

            for (let j = 0; j < Math.min(numColumns, prevNcols); j++) {
                let x = (j + minXind) * dx.current + xoffset.current;

                row[j].coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);

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
                    let x = (j + minXind) * dx.current + xoffset.current;
                    row.push(
                        board!.create(
                            "point",
                            [x, y],
                            jsxPointAttributes.current,
                        ) as JXGPoint,
                    );
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
                let y = (i + minYind) * dy.current + yoffset.current;
                for (let j = 0; j < numColumns; j++) {
                    let x = (j + minXind) * dx.current + xoffset.current;
                    row.push(
                        board!.create(
                            "point",
                            [x, y],
                            jsxPointAttributes.current,
                        ) as JXGPoint,
                    );
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
            let [xMin, yMax, xMax, yMin] = board.getBoundingBox();

            let xind1 = (xMin - xoffset.current) / dx.current;
            let xind2 = (xMax - xoffset.current) / dx.current;
            let yind1 = (yMin - yoffset.current) / dy.current;
            let yind2 = (yMax - yoffset.current) / dy.current;

            // Note: use round from mathjs so that it rounds -0.5 to -1, not 0.
            let minXind = round(Math.min(xind1, xind2) + 1);
            let maxXind = round(Math.max(xind1, xind2) - 1);
            let minYind = round(Math.min(yind1, yind2) + 1);
            let maxYind = round(Math.max(yind1, yind2) - 1);

            recalculatePegboard(minXind, maxXind, minYind, maxYind);

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

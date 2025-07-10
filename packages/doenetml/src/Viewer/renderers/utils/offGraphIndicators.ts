import { JXGObject } from "../jsxgraph-distrib/types";
import { getEffectiveBoundingBox } from "./graph";

export function characterizeOffGraphPoint(coords: number[], board: JXGObject) {
    let { flippedX, flippedY, xMin, xMax, yMin, yMax } =
        getEffectiveBoundingBox(board);

    let xscale = xMax - xMin;
    let yscale = yMax - yMin;

    let xminAdjusted = xMin + xscale * 0.01;
    let xmaxAdjusted = xMax - xscale * 0.01;
    let yminAdjusted = yMin + yscale * 0.01;
    let ymaxAdjusted = yMax - yscale * 0.01;

    let indicatorCoords = [...coords] as [number, number];
    let indicatorSides: [number, number] = [0, 0];

    let needIndicator = false;

    if (indicatorCoords.every((v) => typeof v === "number")) {
        if (indicatorCoords[0] < xminAdjusted) {
            needIndicator = true;
            indicatorSides[0] = flippedX ? 1 : -1;
            indicatorCoords[0] = xminAdjusted;
        } else if (indicatorCoords[0] > xmaxAdjusted) {
            needIndicator = true;
            indicatorSides[0] = flippedX ? -1 : 1;
            indicatorCoords[0] = xmaxAdjusted;
        }

        if (indicatorCoords[1] < yminAdjusted) {
            needIndicator = true;
            indicatorSides[1] = flippedY ? 1 : -1;
            indicatorCoords[1] = yminAdjusted;
        } else if (indicatorCoords[1] > ymaxAdjusted) {
            needIndicator = true;
            indicatorSides[1] = flippedY ? -1 : 1;
            indicatorCoords[1] = ymaxAdjusted;
        }
    }

    return {
        needIndicator,
        indicatorCoords,
        indicatorSides,
    };
}

export function characterizeOffGraphCircleArc({
    center,
    radius,
    directionToCheck,
    board,
}: {
    center: [number, number];
    radius: number;
    directionToCheck: [number, number];
    board: JXGObject;
}) {
    // check to see if the arc of the circle (determine by directionToCheck)
    // intersects the edge of the graph (adjusted inward by a buffer)

    let { flippedX, flippedY, xMin, xMax, yMin, yMax } =
        getEffectiveBoundingBox(board);

    let xSign = flippedX ? -1 : 1;
    let ySign = flippedY ? -1 : 1;

    let xscale = xMax - xMin;
    let yscale = yMax - yMin;

    let xminAdjusted = xMin + xscale * 0.01;
    let xmaxAdjusted = xMax - xscale * 0.01;
    let yminAdjusted = yMin + yscale * 0.01;
    let ymaxAdjusted = yMax - yscale * 0.01;

    let xToCheck =
        directionToCheck[0] * xSign === 1 ? xmaxAdjusted : xminAdjusted;
    let yToCheck =
        directionToCheck[1] * ySign === 1 ? ymaxAdjusted : yminAdjusted;

    let yOnVerticalEdge =
        center[1] -
        ySign *
            directionToCheck[1] *
            Math.sqrt(radius ** 2 - (xToCheck - center[0]) ** 2);

    let doubleSign = directionToCheck[1] * ySign;
    if (yOnVerticalEdge * doubleSign > yToCheck * doubleSign) {
        return {
            needIndicator: true,
            indicatorSides: directionToCheck,
            indicatorCoords: [xToCheck, yToCheck] as [number, number],
        };
    }

    return { needIndicator: false };
}

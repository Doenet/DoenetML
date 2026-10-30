import React from "react";
import type * as JSG from "jsxgraph";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import {
    isPoints,
    refresh,
    useGraphObjects,
} from "./jsxgraph/use-graph-objects";
import { look } from "./jsxgraph/look";

type PolylineData = {
    props: {
        numericalVertices: [number, number][];
    };
};

/**
 * A polyline through its vertices. Its vertices are points drawn, and
 * dragged, on their own; the polyline itself is not dragged. A function's
 * curve is drawn the same way, through its samples.
 */
export const PolylineInGraph: BasicComponent<PolylineData> = ({ node }) => {
    const board = React.useContext(GraphContext);

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalVertices }) => isPoints(numericalVertices),
        create: (board) => {
            const curve: JSG.Curve = board.create("curve", [[], []], {
                ...look.line(),
                fixed: true,
                highlight: false,
            });
            return { objects: [curve], curve };
        },
        update: ({ curve }, { numericalVertices }) => {
            curve.dataX = numericalVertices.map(([x]) => x);
            curve.dataY = numericalVertices.map(([, y]) => y);
            refresh(curve);
        },
    });
    return null;
};

import React from "react";
import * as JSG from "jsxgraph";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import { refresh, useGraphObjects } from "./jsxgraph/use-graph-objects";
import { CURVE_ATTRIBUTES } from "./jsxgraph/look";

type PolylineData = { props: { numericalVertices: [number, number][] } };

/** A polyline through its vertices. Its vertices are points drawn, and
 * dragged, on their own; the polyline itself is not dragged. */
export const PolylineInGraph: BasicComponent<PolylineData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    useGraphObjects(
        board,
        node.data.props,
        (board) => {
            const curve: JSG.Curve = board.create("curve", [[], []], {
                ...CURVE_ATTRIBUTES,
                fixed: true,
            });
            return { objects: [curve], curve };
        },
        ({ curve }, { numericalVertices }) => {
            curve.dataX = numericalVertices.map(([x]) => x);
            curve.dataY = numericalVertices.map(([, y]) => y);
            refresh(curve);
        },
    );
    return null;
};

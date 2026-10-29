import React from "react";
import type * as JSG from "jsxgraph";
import { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import {
    isPoints,
    refresh,
    setCoords,
    useGraphObjects,
    xy,
} from "./jsxgraph/use-graph-objects";
import { look } from "./jsxgraph/look";

type PolygonData = {
    props: {
        numericalVertices: [number, number][];
    };
};

/**
 * A polygon. Dragging it moves every vertex; dragging a vertex moves that
 * one. A change in the number of vertices draws it anew.
 */
export const PolygonInGraph: BasicComponent<PolygonData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;
    const { numericalVertices } = node.data.props;

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalVertices: v }) => isPoints(v) && v.length > 0,
        remake: isPoints(numericalVertices) ? numericalVertices.length : 0,
        create: (board, { numericalVertices }, resync) => {
            const vertices: JSG.Point[] = numericalVertices.map(() =>
                board.create("point", [0, 0], look.vertex()),
            );
            const polygon: JSG.Polygon = board.create(
                "polygon",
                vertices,
                look.polygon(),
            );
            const move = (pointCoords: Record<number, [number, number]>) => {
                const action: Action = {
                    component: "polygon",
                    actionName: "movePolygon",
                    componentIdx: id,
                    args: { pointCoords },
                };
                dispatch(coreActions.dispatchAction(action));
            };
            polygon.on("drag", () =>
                move(Object.fromEntries(vertices.map((v, i) => [i, xy(v)]))),
            );
            vertices.forEach((v, i) =>
                v.on("drag", () => move({ [i]: xy(v) })),
            );
            const objects = [polygon, ...vertices];
            for (const o of objects) {
                o.on("up", resync);
            }
            return { objects, polygon, vertices };
        },
        update: ({ polygon, vertices }, { numericalVertices }) => {
            if (vertices.length !== numericalVertices.length) {
                return; // about to be made anew
            }
            vertices.forEach((v, i) => setCoords(v, ...numericalVertices[i]));
            // JSXGraph's typings leave out a polygon's borders.
            for (const border of (polygon as any).borders as JSG.Segment[]) {
                refresh(border);
            }
            refresh(polygon);
        },
    });
    return null;
};

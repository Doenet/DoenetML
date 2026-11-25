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
    setFixed,
    setVisible,
    useGraphObjects,
    xy,
} from "./jsxgraph/use-graph-objects";
import { look } from "./jsxgraph/look";

type PolygonData = {
    props: {
        numericalVertices: [number, number][];
        /** Whether a drag may move the whole shape (ADR 0070); true when
         * a core does not say. */
        draggable?: boolean;
        /** Whether a drag may move one vertex; true when a core does not
         * say. */
        verticesDraggable?: boolean;
    };
};

/**
 * A polygon. Dragging it moves every vertex; dragging a vertex moves that
 * one, each only where the core's flags allow it. A change in the number
 * of vertices draws it anew.
 */
export const PolygonInGraph: BasicComponent<PolygonData> = ({ node }) => (
    <Shape node={node} closed actionName="movePolygon" />
);

/**
 * A polyline that is a shape (ADR 0075): a polygon that is not closed,
 * dragged as a polygon is (`movePolyline`).
 */
export const OpenPolygonInGraph: BasicComponent<PolygonData> = ({ node }) => (
    <Shape node={node} closed={false} actionName="movePolyline" />
);

function Shape({
    node,
    closed,
    actionName,
}: {
    node: React.ComponentProps<BasicComponent<PolygonData>>["node"];
    closed: boolean;
    actionName: "movePolygon" | "movePolyline";
}) {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;
    const { numericalVertices } = node.data.props;
    // Read when a side is dragged, after the props the shape was made with.
    const latest = React.useRef(node.data.props);
    latest.current = node.data.props;

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
                closed ? look.polygon() : look.openPolygon(),
            );
            // An open one has no side from its last vertex to its first.
            if (!closed) {
                const borders = (polygon as any).borders as JSG.Segment[];
                borders[borders.length - 1]?.setAttribute({ visible: false });
            }
            const move = (pointCoords: Record<number, [number, number]>) => {
                const action: Action = {
                    component: node.name,
                    actionName,
                    componentIdx: id,
                    args: { pointCoords },
                };
                dispatch(coreActions.dispatchAction(action));
            };
            polygon.on("drag", () =>
                move(Object.fromEntries(vertices.map((v, i) => [i, xy(v)]))),
            );
            // JSXGraph drags a side by its two vertices alone: a side's drag
            // is the whole shape's, every vertex moved as far as the side.
            const borders = (polygon as any).borders as JSG.Segment[];
            borders.forEach((border, i) =>
                border.on("drag", () => {
                    const from = latest.current.numericalVertices;
                    const [x, y] = xy(vertices[i]);
                    const [dx, dy] = [x - from[i][0], y - from[i][1]];
                    move(
                        Object.fromEntries(
                            from.map(([vx, vy], j) => [j, [vx + dx, vy + dy]]),
                        ),
                    );
                }),
            );
            vertices.forEach((v, i) =>
                v.on("drag", () => move({ [i]: xy(v) })),
            );
            const objects = [polygon, ...vertices];
            for (const border of borders) {
                border.on("up", resync);
            }
            for (const o of objects) {
                o.on("up", resync);
            }
            return { objects, polygon, vertices };
        },
        update: (
            { polygon, vertices },
            { numericalVertices, draggable, verticesDraggable },
        ) => {
            if (vertices.length !== numericalVertices.length) {
                return; // about to be made anew
            }
            // A vertex that may not be dragged on its own has no handle:
            // fixing it would stop the whole shape's drag as well.
            setFixed(polygon, draggable === false);
            for (const border of (polygon as any).borders as JSG.Segment[]) {
                setFixed(border, draggable === false);
            }
            for (const v of vertices) {
                setVisible(v, verticesDraggable !== false);
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
}

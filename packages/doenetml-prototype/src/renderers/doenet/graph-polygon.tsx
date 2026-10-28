import React from "react";
import * as JSG from "jsxgraph";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import { Action } from "@doenet/doenetml-worker";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import {
    finite,
    refresh,
    setVisible,
    useGraphObjects,
} from "./jsxgraph/use-graph-objects";
import { CURVE_ATTRIBUTES, VERTEX_ATTRIBUTES } from "./jsxgraph/look";

type PolygonData = { props: { numericalVertices: [number, number][] } };

/** A polygon. Dragging it moves every vertex; dragging a vertex moves that
 * one. A change in the number of vertices draws it anew. */
export const PolygonInGraph: BasicComponent<PolygonData> = ({ node }) => {
    return (
        <PolygonObjects
            key={node.data.props.numericalVertices.length}
            id={node.data.id}
            vertices={node.data.props.numericalVertices}
        />
    );
};

function PolygonObjects({
    id,
    vertices,
}: {
    id: number;
    vertices: [number, number][];
}) {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    useGraphObjects(
        board,
        vertices,
        (board, initial, resync) => {
            const points: JSG.Point[] = initial.map(() =>
                board.create("point", [0, 0], VERTEX_ATTRIBUTES),
            );
            const polygon: JSG.Polygon = board.create("polygon", points, {
                ...CURVE_ATTRIBUTES,
                borders: CURVE_ATTRIBUTES,
                vertices: VERTEX_ATTRIBUTES,
                fillColor: CURVE_ATTRIBUTES.strokeColor,
                fillOpacity: 0.1,
                highlightFillOpacity: 0.05,
            });
            // JSXGraph's typings leave out a polygon's borders.
            const borders: JSG.Segment[] = (polygon as any).borders;
            const move = (pointCoords: Record<number, [number, number]>) => {
                const action = {
                    component: "polygon",
                    actionName: "movePolygon",
                    componentIdx: id,
                    args: { pointCoords },
                } as unknown as Action;
                dispatch(coreActions.dispatchAction(action));
            };
            polygon.on("drag", () =>
                move(
                    Object.fromEntries(
                        points.map((p, i) => [i, [p.X(), p.Y()]]),
                    ),
                ),
            );
            points.forEach((p, i) =>
                p.on("drag", () => move({ [i]: [p.X(), p.Y()] })),
            );
            for (const o of [polygon, ...points]) o.on("up", resync);
            return {
                objects: [polygon, ...borders, ...points],
                polygon,
                borders,
                points,
            };
        },
        ({ polygon, borders, points }, vertices) => {
            const ok = vertices.every(([x, y]) => finite(x, y));
            points.forEach((p, i) => {
                const [x, y] = vertices[i];
                p.coords.setCoordinates(
                    JSG.COORDS_BY_USER,
                    ok ? [1, x, y] : [1, 0, 0],
                );
                setVisible(p, ok);
                refresh(p);
            });
            setVisible(polygon, ok);
            for (const border of borders) {
                setVisible(border, ok);
                refresh(border);
            }
            refresh(polygon);
        },
    );
    return null;
}

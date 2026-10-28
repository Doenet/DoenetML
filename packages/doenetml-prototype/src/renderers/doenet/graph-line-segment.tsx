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

type LineSegmentData = {
    props: { numericalEndpoints: [[number, number], [number, number]] };
};

/** A segment between two endpoints. Dragging the segment moves both;
 * dragging an endpoint moves that one. */
export const LineSegmentInGraph: BasicComponent<LineSegmentData> = ({
    node,
}) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    useGraphObjects(
        board,
        node.data.props,
        (board, _props, resync) => {
            const p1: JSG.Point = board.create(
                "point",
                [0, 0],
                VERTEX_ATTRIBUTES,
            );
            const p2: JSG.Point = board.create(
                "point",
                [1, 0],
                VERTEX_ATTRIBUTES,
            );
            const segment: JSG.Segment = board.create(
                "segment",
                [p1, p2],
                CURVE_ATTRIBUTES,
            );
            const move = (args: Record<string, [number, number]>) => {
                const action = {
                    component: "lineSegment",
                    actionName: "moveLineSegment",
                    componentIdx: node.data.id,
                    args,
                } as unknown as Action;
                dispatch(coreActions.dispatchAction(action));
            };
            segment.on("drag", () =>
                move({
                    point1coords: [p1.X(), p1.Y()],
                    point2coords: [p2.X(), p2.Y()],
                }),
            );
            p1.on("drag", () => move({ point1coords: [p1.X(), p1.Y()] }));
            p2.on("drag", () => move({ point2coords: [p2.X(), p2.Y()] }));
            for (const o of [segment, p1, p2]) o.on("up", resync);
            return { objects: [segment, p1, p2], segment, p1, p2 };
        },
        ({ segment, p1, p2 }, { numericalEndpoints: [[x1, y1], [x2, y2]] }) => {
            const ok = finite(x1, y1, x2, y2);
            p1.coords.setCoordinates(
                JSG.COORDS_BY_USER,
                ok ? [1, x1, y1] : [1, 0, 0],
            );
            p2.coords.setCoordinates(
                JSG.COORDS_BY_USER,
                ok ? [1, x2, y2] : [1, 1, 0],
            );
            for (const o of [segment, p1, p2]) {
                setVisible(o, ok);
                refresh(o);
            }
        },
    );
    return null;
};

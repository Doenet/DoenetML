import React from "react";
import type * as JSG from "jsxgraph";
import { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import {
    finite,
    isPoints,
    refresh,
    setCoords,
    setVisible,
    useGraphObjects,
    xy,
} from "./jsxgraph/use-graph-objects";
import { look } from "./jsxgraph/look";

type LineSegmentData = {
    props: {
        /** The segment's two endpoints. */
        numericalEndpoints: [[number, number], [number, number]];
    };
};

/**
 * A line segment. Dragging the segment moves both endpoints; dragging an
 * endpoint moves that one.
 */
export const LineSegmentInGraph: BasicComponent<LineSegmentData> = ({
    node,
}) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalEndpoints }) => isPoints(numericalEndpoints, 2),
        create: (board, _props, resync) => {
            const point1: JSG.Point = board.create(
                "point",
                [0, 0],
                look.vertex(),
            );
            const point2: JSG.Point = board.create(
                "point",
                [1, 0],
                look.vertex(),
            );
            const segment: JSG.Segment = board.create(
                "segment",
                [point1, point2],
                look.line(),
            );
            const move = (args: {
                point1coords?: [number, number];
                point2coords?: [number, number];
            }) => {
                const action: Action = {
                    component: "lineSegment",
                    actionName: "moveLineSegment",
                    componentIdx: id,
                    args,
                };
                dispatch(coreActions.dispatchAction(action));
            };
            segment.on("drag", () =>
                move({ point1coords: xy(point1), point2coords: xy(point2) }),
            );
            point1.on("drag", () => move({ point1coords: xy(point1) }));
            point2.on("drag", () => move({ point2coords: xy(point2) }));
            const objects = [segment, point1, point2];
            for (const o of objects) {
                o.on("up", resync);
            }
            return { objects, segment, point1, point2 };
        },
        update: (
            { segment, point1, point2 },
            { numericalEndpoints: [[x1, y1], [x2, y2]] },
        ) => {
            const ok = finite(x1, y1, x2, y2);
            for (const o of [segment, point1, point2]) {
                setVisible(o, ok);
            }
            setCoords(point1, x1, y1);
            setCoords(point2, x2, y2);
            refresh(segment);
        },
    });
    return null;
};

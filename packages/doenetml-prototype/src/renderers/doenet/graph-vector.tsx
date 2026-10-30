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

type VectorData = {
    props: {
        /** The vector's tail, then its head. */
        numericalEndpoints: [[number, number], [number, number]];
        headDraggable: boolean;
        tailDraggable: boolean;
    };
};

/**
 * A vector: an arrow from its tail to its head. Dragging the arrow moves
 * both; dragging an end moves that one, when it may be dragged.
 */
export const VectorInGraph: BasicComponent<VectorData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalEndpoints }) => isPoints(numericalEndpoints, 2),
        create: (board, { headDraggable, tailDraggable }, resync) => {
            const tail: JSG.Point = board.create("point", [0, 0], {
                ...look.vertex(),
                fixed: !tailDraggable,
            });
            const head: JSG.Point = board.create("point", [1, 0], {
                ...look.vertex(),
                fixed: !headDraggable,
            });
            const arrow: JSG.Segment = board.create("segment", [tail, head], {
                ...look.line(),
                lastArrow: true,
            });
            const move = (args: {
                tailcoords?: [number, number];
                headcoords?: [number, number];
            }) => {
                const action: Action = {
                    component: "vector",
                    actionName: "moveVector",
                    componentIdx: id,
                    args,
                };
                dispatch(coreActions.dispatchAction(action));
            };
            arrow.on("drag", () =>
                move({ tailcoords: xy(tail), headcoords: xy(head) }),
            );
            tail.on("drag", () => move({ tailcoords: xy(tail) }));
            head.on("drag", () => move({ headcoords: xy(head) }));
            const objects = [arrow, tail, head];
            for (const o of objects) {
                o.on("up", resync);
            }
            return { objects, arrow, tail, head };
        },
        update: (
            { arrow, tail, head },
            { numericalEndpoints: [[x1, y1], [x2, y2]] },
        ) => {
            const ok = finite(x1, y1, x2, y2);
            for (const o of [arrow, tail, head]) {
                setVisible(o, ok);
            }
            setCoords(tail, x1, y1);
            setCoords(head, x2, y2);
            refresh(arrow);
        },
    });
    return null;
};

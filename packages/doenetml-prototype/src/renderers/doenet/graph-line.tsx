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
import { CURVE_ATTRIBUTES, HIDDEN_POINT_ATTRIBUTES } from "./jsxgraph/look";

type LineData = {
    props: { numericalPoints: [[number, number], [number, number]] };
};

/** A line through two points. Dragging it moves both. */
export const LineInGraph: BasicComponent<LineData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    useGraphObjects(
        board,
        node.data.props,
        (board, _props, resync) => {
            const p1: JSG.Point = board.create(
                "point",
                [0, 0],
                HIDDEN_POINT_ATTRIBUTES,
            );
            const p2: JSG.Point = board.create(
                "point",
                [1, 0],
                HIDDEN_POINT_ATTRIBUTES,
            );
            const line: JSG.Line = board.create(
                "line",
                [p1, p2],
                CURVE_ATTRIBUTES,
            );
            line.on("drag", () => {
                const action: Action = {
                    component: "line",
                    actionName: "moveLine",
                    componentIdx: node.data.id,
                    args: {
                        point1coords: [p1.X(), p1.Y()],
                        point2coords: [p2.X(), p2.Y()],
                    },
                } as unknown as Action;
                dispatch(coreActions.dispatchAction(action));
            });
            line.on("up", resync);
            return { objects: [line, p1, p2], line, p1, p2 };
        },
        ({ line, p1, p2 }, { numericalPoints: [[x1, y1], [x2, y2]] }) => {
            const ok = finite(x1, y1, x2, y2);
            p1.coords.setCoordinates(
                JSG.COORDS_BY_USER,
                ok ? [1, x1, y1] : [1, 0, 0],
            );
            p2.coords.setCoordinates(
                JSG.COORDS_BY_USER,
                ok ? [1, x2, y2] : [1, 1, 0],
            );
            setVisible(line, ok);
            refresh(p1);
            refresh(p2);
            refresh(line);
        },
    );
    return null;
};

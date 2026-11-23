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
    onClick,
    refresh,
    setCoords,
    setVisible,
    useGraphObjects,
    xy,
} from "./jsxgraph/use-graph-objects";
import { look } from "./jsxgraph/look";

type LineData = {
    props: {
        /** Two points the line passes through. */
        numericalPoints: [[number, number], [number, number]];
        /** Drawn dashed (an unstable equilibrium line). */
        dashed?: boolean;
        /** Whether a click switches `dashed` (`switchLine`). */
        switchable?: boolean;
    };
};

/** A line. Dragging it moves both of its points; clicking a `switchable`
 * one switches whether it is `dashed`. */
export const LineInGraph: BasicComponent<LineData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;
    // Read when the line is clicked, after the props it was made with.
    const latest = React.useRef(node.data.props);
    latest.current = node.data.props;

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalPoints }) => isPoints(numericalPoints, 2),
        create: (board, _props, resync) => {
            const line: JSG.Line = board.create(
                "line",
                [
                    [0, 0],
                    [1, 0],
                ],
                look.line(),
            );
            line.on("drag", () => {
                const action: Action = {
                    component: "line",
                    actionName: "moveLine",
                    componentIdx: id,
                    args: {
                        point1coords: xy(line.point1),
                        point2coords: xy(line.point2),
                    },
                };
                dispatch(coreActions.dispatchAction(action));
            });
            line.on("up", resync);
            onClick(line, () => {
                if (!latest.current.switchable) {
                    return;
                }
                const action: Action = {
                    component: "line",
                    actionName: "switchLine",
                    componentIdx: id,
                    args: {},
                };
                dispatch(coreActions.dispatchAction(action));
            });
            return { objects: [line], line };
        },
        update: (
            { line },
            { numericalPoints: [[x1, y1], [x2, y2]], dashed },
        ) => {
            setVisible(line, finite(x1, y1, x2, y2));
            const dash = dashed ? 2 : 0;
            if (line.getAttribute("dash") !== dash) {
                line.setAttribute({ dash });
            }
            setCoords(line.point1, x1, y1);
            setCoords(line.point2, x2, y2);
            refresh(line);
        },
    });
    return null;
};

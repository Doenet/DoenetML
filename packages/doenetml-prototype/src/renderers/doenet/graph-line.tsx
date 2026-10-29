import React from "react";
import { BasicComponent } from "../types";
import { GraphContext, LAYER_OFFSETS } from "./graph";
import * as JSG from "jsxgraph";
import {
    attachStandardGraphListeners,
    GraphListenerActions,
    GraphListeners,
    removeStandardGraphListeners,
} from "./jsxgraph/listeners";
import { Action } from "@doenet/doenetml-worker";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";

type LineData = {
    props: {
        /** Two points the line passes through. */
        numericalPoints: [[number, number], [number, number]];
    };
};

export const LineInGraph: BasicComponent<LineData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const lineRef = React.useRef<JSG.Line | null>(null);
    const lineListenersActions = React.useRef<GraphListenerActions>({});
    const lineListenersAttached = React.useRef<GraphListeners>({});
    const id = node.data.id;

    const dispatch = useAppDispatch();

    const numericalPoints = node.data.props.numericalPoints;

    React.useEffect(() => {
        if (!board) {
            lineRef.current = null;
            return;
        }
        if (lineRef.current) {
            return;
        }
        const line = createLine(board, {
            numericalPoints,
            labelForGraph: "",
            lineColor: "var(--mainGreen)",
            hidden: false,
            fixed: false,
            draggable: true,
            fixLocation: false,
            layer: 0,
            selectedStyle: { lineStyle: "solid", lineOpacity: 1, lineWidth: 2 },
            dashed: false,
        });
        lineRef.current = line;
        if (!line) {
            return;
        }

        lineListenersActions.current.drag = function (e, interactionState) {
            const action: Action = {
                component: "line",
                actionName: "moveLine",
                componentIdx: id,
                args: {
                    point1coords: [line.point1.X(), line.point1.Y()],
                    point2coords: [line.point2.X(), line.point2.Y()],
                },
            };
            dispatch(coreActions.dispatchAction(action));
        };

        lineListenersAttached.current = attachStandardGraphListeners(
            line,
            lineListenersActions.current,
        );

        return () => {
            removeStandardGraphListeners(line, lineListenersAttached.current);
            board.removeObject(line);
        };
    }, [board, lineRef]);

    if (!board || !lineRef.current || !validPoints(numericalPoints)) {
        return null;
    }

    // We have a pre-existing line. Update the rendered line so that it matches values from the props.

    const [[x1, y1], [x2, y2]] = numericalPoints;
    lineRef.current.point1.coords.setCoordinates(JXG.COORDS_BY_USER, [
        1,
        x1,
        y1,
    ]);
    lineRef.current.point2.coords.setCoordinates(JXG.COORDS_BY_USER, [
        1,
        x2,
        y2,
    ]);

    // update the line and the board so the line actually moves to the specified location
    lineRef.current.point1.needsUpdate = true;
    lineRef.current.point1.update();
    lineRef.current.point2.needsUpdate = true;
    lineRef.current.point2.update();
    lineRef.current.needsUpdate = true;
    lineRef.current.update();
    board.updateRenderer();

    return null;
};

/**
 * Whether `points` is a pair of points, as a core that sends this component
 * without them (or with another shape for them) does not.
 */
function validPoints(
    points: unknown,
): points is [[number, number], [number, number]] {
    return (
        Array.isArray(points) &&
        points.length === 2 &&
        points.every((x) => Array.isArray(x) && x.length === 2)
    );
}

function createLine(
    board: JSG.Board,
    props: {
        numericalPoints: [[number, number], [number, number]];
        labelForGraph: string;
        lineColor: string;
        hidden: boolean;
        fixed: boolean;
        draggable: boolean;
        fixLocation: boolean;
        layer: number;
        selectedStyle: {
            lineStyle: string;
            lineOpacity: number;
            lineWidth: number;
        };
        dashed: boolean;
    },
) {
    if (!validPoints(props.numericalPoints)) {
        return null;
    }

    const lineColor = props.lineColor;

    // Things to be passed to JSXGraph as attributes
    const jsxLineAttributes: JSG.GeometryElementAttributes &
        JSG.LineAttributes = {
        name: props.labelForGraph,
        visible: !props.hidden,
        fixed: props.fixed,
        layer: 10 * props.layer + LAYER_OFFSETS.line,
        strokeColor: lineColor,
        strokeOpacity: props.selectedStyle.lineOpacity,
        highlightStrokeColor: lineColor,
        highlightStrokeOpacity: props.selectedStyle.lineOpacity * 0.5,
        strokeWidth: props.selectedStyle.lineWidth,
        highlightStrokeWidth: props.selectedStyle.lineWidth,
        dash: styleToDash(props.selectedStyle.lineStyle, props.dashed),
        highlight: !props.fixLocation,
    };

    const through = [
        [...props.numericalPoints[0]],
        [...props.numericalPoints[1]],
    ];

    const line: JSG.Line = board.create("line", through, jsxLineAttributes);

    return line;
}

/**
 * Return the the dash length for a given style.
 */
export function styleToDash(style: string, dash: boolean) {
    if (style === "dashed" || dash) {
        return 2;
    } else if (style === "solid") {
        return 0;
    } else if (style === "dotted") {
        return 1;
    } else {
        return 0;
    }
}

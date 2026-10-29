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
import { styleToDash } from "./graph-line";

type LineSegmentData = {
    props: {
        /** The segment's two endpoints. */
        numericalEndpoints: [[number, number], [number, number]];
    };
};

type SegmentObjects = {
    segment: JSG.Segment;
    point1: JSG.Point;
    point2: JSG.Point;
};

/**
 * A line segment. Dragging the segment moves both endpoints; dragging an
 * endpoint moves that one.
 */
export const LineSegmentInGraph: BasicComponent<LineSegmentData> = ({
    node,
}) => {
    const board = React.useContext(GraphContext);
    const segmentRef = React.useRef<SegmentObjects | null>(null);
    const segmentListenersAttached = React.useRef<GraphListeners>({});
    const point1ListenersAttached = React.useRef<GraphListeners>({});
    const point2ListenersAttached = React.useRef<GraphListeners>({});
    const id = node.data.id;

    const dispatch = useAppDispatch();

    const numericalEndpoints = node.data.props.numericalEndpoints;

    React.useEffect(() => {
        if (!board) {
            segmentRef.current = null;
            return;
        }
        if (segmentRef.current) {
            return;
        }
        const objects = createLineSegment(board, {
            numericalEndpoints,
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
        segmentRef.current = objects;
        if (!objects) {
            return;
        }
        const { segment, point1, point2 } = objects;

        function moveLineSegment(args: {
            point1coords?: [number, number];
            point2coords?: [number, number];
        }) {
            const action: Action = {
                component: "lineSegment",
                actionName: "moveLineSegment",
                componentIdx: id,
                args,
            };
            dispatch(coreActions.dispatchAction(action));
        }

        const segmentListenersActions: GraphListenerActions = {
            drag: function (e, interactionState) {
                moveLineSegment({
                    point1coords: [point1.X(), point1.Y()],
                    point2coords: [point2.X(), point2.Y()],
                });
            },
        };
        const point1ListenersActions: GraphListenerActions = {
            drag: function (e, interactionState) {
                moveLineSegment({ point1coords: [point1.X(), point1.Y()] });
            },
        };
        const point2ListenersActions: GraphListenerActions = {
            drag: function (e, interactionState) {
                moveLineSegment({ point2coords: [point2.X(), point2.Y()] });
            },
        };

        segmentListenersAttached.current = attachStandardGraphListeners(
            segment,
            segmentListenersActions,
        );
        point1ListenersAttached.current = attachStandardGraphListeners(
            point1,
            point1ListenersActions,
        );
        point2ListenersAttached.current = attachStandardGraphListeners(
            point2,
            point2ListenersActions,
        );

        return () => {
            removeStandardGraphListeners(
                segment,
                segmentListenersAttached.current,
            );
            removeStandardGraphListeners(
                point1,
                point1ListenersAttached.current,
            );
            removeStandardGraphListeners(
                point2,
                point2ListenersAttached.current,
            );
            board.removeObject(segment);
            board.removeObject(point2);
            board.removeObject(point1);
        };
    }, [board, segmentRef]);

    if (!board || !segmentRef.current || !validEndpoints(numericalEndpoints)) {
        return null;
    }

    // We have a pre-existing segment. Update the rendered segment so that it matches values from the props.

    const { segment, point1, point2 } = segmentRef.current;
    const [[x1, y1], [x2, y2]] = numericalEndpoints;
    point1.coords.setCoordinates(JXG.COORDS_BY_USER, [1, x1, y1]);
    point2.coords.setCoordinates(JXG.COORDS_BY_USER, [1, x2, y2]);

    // update the segment and the board so the segment actually moves to the specified location
    point1.needsUpdate = true;
    point1.update();
    point2.needsUpdate = true;
    point2.update();
    segment.needsUpdate = true;
    segment.update();
    board.updateRenderer();

    return null;
};

/**
 * Whether `endpoints` is a pair of points, as a core that sends this
 * component without them (or with another shape for them) does not.
 */
function validEndpoints(
    endpoints: unknown,
): endpoints is [[number, number], [number, number]] {
    return (
        Array.isArray(endpoints) &&
        endpoints.length === 2 &&
        endpoints.every((x) => Array.isArray(x) && x.length === 2)
    );
}

function createLineSegment(
    board: JSG.Board,
    props: {
        numericalEndpoints: [[number, number], [number, number]];
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
): SegmentObjects | null {
    if (!validEndpoints(props.numericalEndpoints)) {
        return null;
    }

    const lineColor = props.lineColor;

    // Things to be passed to JSXGraph as attributes
    const jsxSegmentAttributes: JSG.GeometryElementAttributes &
        JSG.SegmentAttributes = {
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

    // The endpoints, drawn as small handles that can be dragged
    const jsxPointAttributes: JSG.PointAttributes = {
        name: "",
        withLabel: false,
        visible: !props.hidden,
        fixed: props.fixed || !props.draggable,
        layer: 10 * props.layer + LAYER_OFFSETS.vertex,
        size: 3,
        fillColor: lineColor,
        strokeColor: lineColor,
        highlightFillColor: lineColor,
        highlightStrokeColor: lineColor,
        showInfobox: false,
        highlight: !props.fixLocation,
    };

    const point1: JSG.Point = board.create(
        "point",
        [...props.numericalEndpoints[0]],
        jsxPointAttributes,
    );
    const point2: JSG.Point = board.create(
        "point",
        [...props.numericalEndpoints[1]],
        jsxPointAttributes,
    );
    const segment: JSG.Segment = board.create(
        "segment",
        [point1, point2],
        jsxSegmentAttributes,
    );

    return { segment, point1, point2 };
}

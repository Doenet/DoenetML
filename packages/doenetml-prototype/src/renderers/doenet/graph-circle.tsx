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

type CircleData = {
    props: {
        numericalCenter: [number, number];
        numericalRadius: number;
    };
};

type CircleObjects = {
    circle: JSG.Circle;
    center: JSG.Point;
    /** The radius the circle is drawn with; read by JSXGraph on update. */
    radius: { current: number };
};

/**
 * A circle. Dragging it moves its center.
 */
export const CircleInGraph: BasicComponent<CircleData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const circleRef = React.useRef<CircleObjects | null>(null);
    const circleListenersActions = React.useRef<GraphListenerActions>({});
    const circleListenersAttached = React.useRef<GraphListeners>({});
    const id = node.data.id;

    const dispatch = useAppDispatch();

    const { numericalCenter, numericalRadius } = node.data.props;

    React.useEffect(() => {
        if (!board) {
            circleRef.current = null;
            return;
        }
        if (circleRef.current) {
            return;
        }
        const objects = createCircle(board, {
            numericalCenter,
            numericalRadius,
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
        circleRef.current = objects;
        if (!objects) {
            return;
        }
        const { circle, center } = objects;

        circleListenersActions.current.drag = function (e, interactionState) {
            const action: Action = {
                component: "circle",
                actionName: "moveCircle",
                componentIdx: id,
                args: { center: [center.X(), center.Y()] },
            };
            dispatch(coreActions.dispatchAction(action));
        };

        circleListenersAttached.current = attachStandardGraphListeners(
            circle,
            circleListenersActions.current,
        );

        return () => {
            removeStandardGraphListeners(
                circle,
                circleListenersAttached.current,
            );
            board.removeObject(circle);
            board.removeObject(center);
        };
    }, [board, circleRef]);

    if (!board || !circleRef.current || !validCenter(numericalCenter)) {
        return null;
    }

    // We have a pre-existing circle. Update the rendered circle so that it matches values from the props.

    const { circle, center, radius } = circleRef.current;
    center.coords.setCoordinates(JXG.COORDS_BY_USER, [1, ...numericalCenter]);
    radius.current = numericalRadius;

    // update the circle and the board so the circle actually moves to the specified location
    center.needsUpdate = true;
    center.update();
    circle.needsUpdate = true;
    circle.update();
    board.updateRenderer();

    return null;
};

/**
 * Whether `center` is a point, as a core that sends this component without
 * one does not.
 */
function validCenter(center: unknown): center is [number, number] {
    return Array.isArray(center) && center.length === 2;
}

function createCircle(
    board: JSG.Board,
    props: {
        numericalCenter: [number, number];
        numericalRadius: number;
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
): CircleObjects | null {
    if (
        !validCenter(props.numericalCenter) ||
        typeof props.numericalRadius !== "number"
    ) {
        return null;
    }

    const lineColor = props.lineColor;

    // Things to be passed to JSXGraph as attributes
    const jsxCircleAttributes: JSG.GeometryElementAttributes &
        JSG.CircleAttributes = {
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
        fillOpacity: 0,
        highlightFillOpacity: 0,
    };

    // The center is not drawn; the circle is dragged by its curve
    const center: JSG.Point = board.create(
        "point",
        [...props.numericalCenter],
        { visible: false, withLabel: false, showInfobox: false },
    );

    // The radius is read from `radius.current`, so a change of radius is
    // drawn with the next update like any other change
    const radius = { current: props.numericalRadius };
    const circle: JSG.Circle = board.create(
        "circle",
        [center, () => radius.current],
        jsxCircleAttributes,
    );

    return { circle, center, radius };
}

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
import { Action, PointProps } from "@doenet/doenetml-worker-rust";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { numberFromSerializedAst } from "../../utils/math/math-expression-utils";

type PointData = { props: PointProps };

export const PointInGraph: BasicComponent<PointData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const pointRef = React.useRef<JSG.Point | null>(null);
    const pointListenersActions = React.useRef<GraphListenerActions>({});
    const pointListenersAttached = React.useRef<GraphListeners>({});
    const hadNonNumericCoords = React.useRef(false);
    const id = node.data.id;

    const dispatch = useAppDispatch();

    const x: number = numberFromSerializedAst(node.data.props.x.math_object);
    const y: number = numberFromSerializedAst(node.data.props.y.math_object);

    React.useEffect(() => {
        if (!board) {
            pointRef.current = null;
            return;
        }
        if (pointRef.current) {
            return;
        }
        const point = createPoint(board, {
            coords: [x, y],
            labelForGraph: "test",
            lineColor: "var(--mainPurple)",
            hidden: false,
            fixed: false,
            draggable: true,
            fixLocation: false,
            layer: 0,
            selectedStyle: { lineStyle: "solid", lineOpacity: 1, lineWidth: 2 },
            dashed: false,
        });
        pointRef.current = point;
        if (!point) {
            return;
        }

        // TODO: call actions when point moves

        pointListenersActions.current.drag = function (e, interactionState) {
            let action: Action = {
                component: "point",
                actionName: "move",
                componentIdx: id,
                args: { x: pointRef.current!.X(), y: pointRef.current!.Y() },
            };
            dispatch(coreActions.dispatchAction(action));
        };

        pointListenersAttached.current = attachStandardGraphListeners(
            point,
            pointListenersActions.current,
        );

        return () => {
            removeStandardGraphListeners(point, pointListenersAttached.current);
            board.removeObject(point);
        };
    }, [board, pointRef]);

    if (!board || !pointRef.current) {
        return null;
    }

    // We have a pre-existing point. Update the rendered point so that it matches values from the props.

    if (pointRef.current.hasLabel) {
        // the the point has a label, need to update it so that it moves if the point moves
        pointRef.current.label!.needsUpdate = true;
        pointRef.current.label!.update();
    }

    // move the point to the current location determined by the props
    pointRef.current.coords.setCoordinates(JXG.COORDS_BY_USER, [1, x, y]);

    // update the point and the board so the point actually moves to the specified location
    pointRef.current.needsUpdate = true;
    // if the point previous had non-numeric coordinates,
    // it appears that the point requires a fullUpdate to get it to reappear.
    if (hadNonNumericCoords.current) {
        //@ts-ignore
        pointRef.current.fullUpdate();
    } else {
        pointRef.current.update();
    }

    // record for next time whether or not we have non-numeric coordinates
    hadNonNumericCoords.current = !Number.isFinite(x) || !Number.isFinite(y);

    board.updateRenderer();

    return null;
};

function createPoint(
    board: JSG.Board,
    props: {
        coords: [number, number];
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
    const lineColor = props.lineColor;

    // Things to be passed to JSXGraph as attributes
    const jsxPointAttributes: JSG.PointAttributes = {
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

    const point: JSG.Point = board.create(
        "point",
        props.coords,
        jsxPointAttributes,
    );

    return point;
}

/**
 * Return the the dash length for a given style.
 */
function styleToDash(style: string, dash: boolean) {
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

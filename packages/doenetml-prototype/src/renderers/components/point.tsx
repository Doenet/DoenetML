import React from "react";
import { BasicComponent } from "../types";
import { GraphContext, LAYER_OFFSETS } from "./graph";
import * as JSG from "jsxgraph";
import { attachStandardGraphListeners } from "./jsxgraph/listeners";
import { serializedComponentsReviver } from "@doenet/utils";
import { PointProps } from "@doenet/doenetml-worker-rust";

type PointData = { props: PointProps };

export const PointInGraph: BasicComponent<PointData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const pointRef = React.useRef<JSG.Point | null>(null);

    const x = JSON.parse(
        node.data.props.x.math_object,
        serializedComponentsReviver,
    ).evaluate_to_constant();
    const y = JSON.parse(
        node.data.props.y.math_object,
        serializedComponentsReviver,
    ).evaluate_to_constant();

    // TODO: if x or y change, move the point

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
        attachStandardGraphListeners(point);

        return () => {
            point.off("drag");
            point.off("down");
            point.off("hit");
            point.off("up");
            point.off("keyfocusout");
            point.off("keydown");
            board.removeObject(point);
        };
    }, [board, pointRef]);

    if (!board) {
        return null;
    }

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
    const jsxLineAttributes: JSG.PointAttributes = {
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

    const line: JSG.Point = board.create(
        "point",
        props.coords,
        jsxLineAttributes,
    );

    return line;
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

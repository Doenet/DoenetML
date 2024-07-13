import React from "react";
import { BasicComponent } from "../types";
import { GraphContext, LAYER_OFFSETS } from "./graph";
import * as JSG from "jsxgraph";

export const PointInGraph: BasicComponent = ({ node }) => {
    const board = React.useContext(GraphContext);
    const pointRef = React.useRef<JSG.Point | null>(null);

    React.useEffect(() => {
        if (!board) {
            pointRef.current = null;
            return;
        }
        if (pointRef.current) {
            return;
        }
        const point = createPoint(board, {
            coords: [1, 1],
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
    }, [board]);

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

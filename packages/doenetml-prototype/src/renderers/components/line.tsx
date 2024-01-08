import React from "react";
import { BasicComponent } from "../types";
import { GraphContext, LAYER_OFFSETS } from "./graph";
import * as JSG from "jsxgraph";
import { attachStandardGraphListeners } from "./jsxgraph/listeners";

export const LineInGraph: BasicComponent = ({ node }) => {
    const board = React.useContext(GraphContext);
    const lineRef = React.useRef<JSG.Line | null>(null);

    React.useEffect(() => {
        if (!board) {
            lineRef.current = null;
            return;
        }
        if (lineRef.current) {
            return;
        }
        const line = createLine(board, {
            numericalPoints: [
                [0, 0],
                [1, 1],
            ],
            labelForGraph: "test",
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

        attachStandardGraphListeners(line);

        return () => {
            line.off("drag");
            line.off("down");
            line.off("hit");
            line.off("up");
            line.off("keyfocusout");
            line.off("keydown");
            board.removeObject(line);
        };
    }, [board, lineRef]);

    if (!board) {
        return null;
    }

    return null;
};

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
    if (
        props.numericalPoints?.length !== 2 ||
        props.numericalPoints.some((x) => x.length !== 2)
    ) {
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

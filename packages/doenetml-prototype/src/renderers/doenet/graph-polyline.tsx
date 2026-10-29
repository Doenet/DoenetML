import React from "react";
import { BasicComponent } from "../types";
import { GraphContext, LAYER_OFFSETS } from "./graph";
import * as JSG from "jsxgraph";
import { styleToDash } from "./graph-line";

type PolylineData = {
    props: {
        numericalVertices: [number, number][];
    };
};

/**
 * A polyline through its vertices. Its vertices are points drawn, and
 * dragged, on their own; the polyline itself is not dragged.
 */
export const PolylineInGraph: BasicComponent<PolylineData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const curveRef = React.useRef<JSG.Curve | null>(null);

    const numericalVertices = node.data.props.numericalVertices;

    React.useEffect(() => {
        if (!board) {
            curveRef.current = null;
            return;
        }
        if (curveRef.current) {
            return;
        }
        const curve = createPolyline(board, {
            numericalVertices,
            labelForGraph: "",
            lineColor: "var(--mainGreen)",
            hidden: false,
            layer: 0,
            selectedStyle: { lineStyle: "solid", lineOpacity: 1, lineWidth: 2 },
            dashed: false,
        });
        curveRef.current = curve;
        if (!curve) {
            return;
        }

        return () => {
            board.removeObject(curve);
        };
    }, [board, curveRef]);

    if (!board || !curveRef.current || !Array.isArray(numericalVertices)) {
        return null;
    }

    // We have a pre-existing polyline. Update the rendered polyline so that it matches values from the props.

    curveRef.current.dataX = numericalVertices.map(([x]) => x);
    curveRef.current.dataY = numericalVertices.map(([, y]) => y);

    // update the polyline and the board so the polyline actually moves to the specified location
    curveRef.current.needsUpdate = true;
    curveRef.current.update();
    board.updateRenderer();

    return null;
};

function createPolyline(
    board: JSG.Board,
    props: {
        numericalVertices: [number, number][];
        labelForGraph: string;
        lineColor: string;
        hidden: boolean;
        layer: number;
        selectedStyle: {
            lineStyle: string;
            lineOpacity: number;
            lineWidth: number;
        };
        dashed: boolean;
    },
) {
    if (!Array.isArray(props.numericalVertices)) {
        return null;
    }

    const lineColor = props.lineColor;

    // Things to be passed to JSXGraph as attributes
    const jsxCurveAttributes: JSG.CurveAttributes = {
        name: props.labelForGraph,
        visible: !props.hidden,
        fixed: true,
        layer: 10 * props.layer + LAYER_OFFSETS.line,
        strokeColor: lineColor,
        strokeOpacity: props.selectedStyle.lineOpacity,
        highlightStrokeColor: lineColor,
        highlightStrokeOpacity: props.selectedStyle.lineOpacity * 0.5,
        strokeWidth: props.selectedStyle.lineWidth,
        highlightStrokeWidth: props.selectedStyle.lineWidth,
        dash: styleToDash(props.selectedStyle.lineStyle, props.dashed),
        highlight: false,
    };

    const curve: JSG.Curve = board.create(
        "curve",
        [
            props.numericalVertices.map(([x]) => x),
            props.numericalVertices.map(([, y]) => y),
        ],
        jsxCurveAttributes,
    );

    return curve;
}

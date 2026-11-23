import React from "react";
import type * as JSG from "jsxgraph";
import { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { GraphContext, LAYER_OFFSETS } from "./graph";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import {
    finite,
    isPoints,
    setTextCoords,
    setVisible,
    useGraphObjects,
} from "./jsxgraph/use-graph-objects";

type ValueData = {
    props: {
        /** Where it is drawn. */
        numericalAnchor: [number, number];
        /** Where it sits against its anchor (`upperright`, `center`, ...). */
        positionFromAnchor?: string;
        /** Whether a drag moves it. */
        draggable?: boolean;
        /** Its value, as math notation (a math, an operator, an `<m>`). */
        latex?: string;
        /** Its value, as text (a number, a formatted value). */
        text?: string;
        /** Its value, as text (a `<text>`). */
        value?: string;
    };
};

/** JSXGraph's `anchorX` and `anchorY` for where a value sits against its
 * anchor, as the current core's renderers place it. */
const POSITIONS: Record<string, [string, string]> = {
    upperright: ["left", "bottom"],
    upperleft: ["right", "bottom"],
    lowerright: ["left", "top"],
    lowerleft: ["right", "top"],
    top: ["middle", "bottom"],
    bottom: ["middle", "top"],
    left: ["right", "middle"],
    right: ["left", "middle"],
    center: ["middle", "middle"],
};

/** The elements whose drag the current core calls `moveText`, and
 * `moveNumber`; any other value's is `moveMath`. */
const TEXT_VALUES = new Set(["text", "intComma", "pluralize", "latex"]);
const NUMBER_VALUES = new Set(["number", "integer"]);

/** What a value shows: its LaTeX, typeset, or its text. */
function content({ latex, text, value }: ValueData["props"]): string {
    if (latex !== undefined) {
        return `\\(${latex}\\)`;
    }
    return String(text ?? value ?? "");
}

/**
 * A value placed in a graph (a math, a number, a text, an operator): drawn
 * as a label at its anchor, which a drag moves. Drawn only when the core
 * sends its anchor (`numericalAnchor`).
 */
export const ValueInGraph: BasicComponent<ValueData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;
    const name = node.name;

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalAnchor }) => isPoints([numericalAnchor]),
        create: (board, props, resync) => {
            const [anchorX, anchorY] =
                POSITIONS[props.positionFromAnchor ?? "center"] ??
                POSITIONS.center;
            const label: JSG.Text = board.create(
                "text",
                [0, 0, content(props)],
                {
                    anchorX,
                    anchorY,
                    fixed: props.draggable === false,
                    useMathJax: props.latex !== undefined,
                    parse: false,
                    display: "html",
                    layer: LAYER_OFFSETS.text,
                    highlight: false,
                    cssStyle: "color: var(--canvasText)",
                },
            );
            label.on("drag", () => {
                const action: Action = {
                    component: name,
                    actionName: TEXT_VALUES.has(name)
                        ? "moveText"
                        : NUMBER_VALUES.has(name)
                          ? "moveNumber"
                          : "moveMath",
                    componentIdx: id,
                    args: { x: label.X(), y: label.Y() },
                };
                dispatch(coreActions.dispatchAction(action));
            });
            label.on("up", resync);
            return { objects: [label], label, shown: content(props) };
        },
        update: (made, props) => {
            const [x, y] = props.numericalAnchor;
            const shown = content(props);
            if (shown !== made.shown) {
                made.label.setText(shown);
                made.shown = shown;
            }
            setVisible(made.label, finite(x, y));
            setTextCoords(made.label, x, y);
        },
    });
    return null;
};

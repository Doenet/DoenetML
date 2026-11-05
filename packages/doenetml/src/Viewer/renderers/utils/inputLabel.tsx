import React, { createContext, useContext } from "react";
import { BoardContext } from "../graph";
import { NoClickTargetContext } from "./ClickTarget";

/**
 * Set inside the label of an input, button, slider, or answer.
 *
 * `inLabel`: the `<label>` renderer leaves styling to the component it labels,
 * as it did when that component showed the label's string.
 *
 * `inheritTextColor`: the label is on a colored background (a button's, say),
 * so the text and math in it take the color of the component they label
 * rather than their own.
 */
export const InputLabelContext = createContext({
    inLabel: false,
    inheritTextColor: false,
});

/**
 * The rendered `<label>` of an `<answer>`, for the input that the answer
 * created from sugar. That input takes its `label` from the answer, but the
 * `<label>` is the answer's child, so only the answer can render it.
 */
export const AnswerLabelContext = createContext<React.ReactNode>(null);

/**
 * Return the rendered `<label>` that a component's `label` comes from, so
 * the label shows its markup (e.g., `<em>` or `<delete>`), which the `label`
 * string drops. Return `null` when the label does not come from a rendered
 * `<label>` (e.g., it comes from `labelIsName`, or from a copy without a
 * `<label>` child); the caller then shows the `label` string.
 *
 * Set `inheritTextColor` when the label is shown on a colored background.
 *
 * The label is rendered as HTML even for a component in a graph (a
 * `<mathInput>` in a graph shows its label in a portal under the board), so
 * `BoardContext` is cleared for it: otherwise the `<label>` and any text,
 * math, or number in it would be drawn on the graph instead.
 *
 * The component's worker class must render its label child: see
 * `returnLabelChildIndDefinition`.
 */
export function useRenderedLabel({
    SVs,
    children,
    inheritTextColor = false,
}: {
    SVs: {
        labelChildInd?: number;
        labelFromParent?: boolean;
        [key: string]: any;
    };
    children: React.ReactNode[];
    inheritTextColor?: boolean;
}): React.ReactNode {
    const answerLabel = useContext(AnswerLabelContext);

    let label: React.ReactNode = null;
    if (SVs.labelChildInd !== undefined && SVs.labelChildInd !== -1) {
        label = children[SVs.labelChildInd];
    }
    if (!label && SVs.labelFromParent) {
        label = answerLabel;
    }
    if (!label) {
        return null;
    }
    return (
        <BoardContext.Provider value={null}>
            <InputLabelContext.Provider
                value={{ inLabel: true, inheritTextColor }}
            >
                <NoClickTargetContext.Provider value={true}>
                    {label}
                </NoClickTargetContext.Provider>
            </InputLabelContext.Provider>
        </BoardContext.Provider>
    );
}

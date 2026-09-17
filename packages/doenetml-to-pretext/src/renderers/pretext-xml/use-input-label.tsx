import React from "react";
import { AnswerLabelContext } from "./answer-label-context";

/**
 * What an input draws in front of its blank: the label written on the input, or nothing
 * where an enclosing `<answer>` has already drawn the same one.
 *
 * An input inherits `label` from the answer around it, the way it inherits `expanded`, so
 * an input that drew the inherited copy would print the question twice. The answer is the
 * one that keeps it, since an expanded input is replaced by writing space before export
 * and the label has to survive that. A label written on the input itself never reaches the
 * answer, so comparing the two tells the inherited copy from the input's own.
 *
 * A label may hold math, written between `\(` and `\)`, which becomes `<m>`.
 */
export function useInputLabel(rawLabel: string | undefined): React.ReactNode {
    const ownLabel = rawLabel?.trim() || "";
    const answerLabel = React.useContext(AnswerLabelContext);
    const inheritedFromAnswer = Boolean(ownLabel) && ownLabel === answerLabel;

    if (inheritedFromAnswer || !ownLabel) {
        // The answer drew the label instead, but the space that separated it from the
        // blank was this component's, so it still has to be supplied.
        return inheritedFromAnswer ? " " : null;
    }

    // Every odd-indexed part lay between the delimiters, so it is math.
    return [
        ...ownLabel
            .split(/\\\(|\\\)/)
            .map((part, index) =>
                index % 2 === 0 ? part : <m key={index}>{part}</m>,
            ),
        // Separate the label from the blank that follows it.
        " ",
    ];
}

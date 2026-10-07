import React from "react";
import { AnswerLabelContext } from "./answer-label-context";
import { Element } from "../element";

/**
 * A label as PreTeXt content, or `null` when it is empty.
 *
 * Where the label comes from a `<label>` element (`labelElementId`, see
 * `detachLabelChildren`), that element is printed, so the label keeps its markup. Otherwise
 * the label string is printed. It may hold math, written between `\(` and `\)`, which
 * becomes `<m>`; an unmatched `\(` or `\)` is printed as written.
 */
export function labelContent(
    rawLabel: string | undefined,
    labelElementId?: number,
): React.ReactNode {
    const label = rawLabel?.trim() || "";
    if (!label) {
        return null;
    }
    if (labelElementId != null) {
        return <Element id={labelElementId} annotation="original" />;
    }
    // Only a `\(` closed by a later `\)` opens math; a delimiter without its partner is
    // printed as written.
    const parts: React.ReactNode[] = [];
    let start = 0;
    for (const match of label.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
        parts.push(label.slice(start, match.index));
        parts.push(<m key={match.index}>{match[1]}</m>);
        start = match.index + match[0].length;
    }
    parts.push(label.slice(start));
    return parts;
}

/**
 * What an input draws in front of its blank: the label written on the input, or nothing
 * where an enclosing `<answer>` has already drawn the same one.
 *
 * An input inherits `label` from the answer around it, the way it inherits `expanded`, so
 * an input that drew the inherited copy would print the question twice. The answer is the
 * one that keeps it, since an expanded input is replaced by writing space before export
 * and the label has to survive that. A label written on the input itself never reaches the
 * answer, so comparing the two tells the inherited copy from the input's own.
 */
export function useInputLabel(
    rawLabel: string | undefined,
    labelElementId?: number,
): React.ReactNode {
    const ownLabel = rawLabel?.trim() || "";
    const answerLabel = React.useContext(AnswerLabelContext);
    const inheritedFromAnswer = Boolean(ownLabel) && ownLabel === answerLabel;

    if (inheritedFromAnswer || !ownLabel) {
        // The answer drew the label, and the space after it, instead.
        return null;
    }

    // Separate the label from the blank that follows it.
    return [labelContent(ownLabel, labelElementId), " "];
}

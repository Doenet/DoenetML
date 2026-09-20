import React from "react";
import { MATH_BLANK_LATEX } from "@doenet/utils";

/**
 * How wide a blank in an expression is drawn.
 *
 * There is nothing to measure — the input it stands for is empty, which is why
 * there is a blank at all — so this matches the width the exporter already uses
 * for a `<mathInput>`, and readers see one consistent size of gap.
 */
const BLANK_CHARACTERS = 8;

/**
 * Turn an expression's LaTeX into PreTeXt math content, with `<fillin>` where
 * an embedded input was left empty.
 *
 * An input written inside `<m>` contributes its value to `latex` once it has
 * been filled in, so a completed expression needs nothing special here — the
 * value is already part of the string. An empty one contributes a marker
 * instead, and that is what becomes a blank for the reader to write on.
 *
 * `<fillin>` is part of PreTeXt's own content model for mathematics
 * (`MathInlineItem` and `MathRowItem` both admit it), so this is the element
 * PreTeXt expects rather than a rule drawn to look like one.
 */
export function mathContentWithBlanks(latex: string): React.ReactNode {
    if (!latex.includes(MATH_BLANK_LATEX)) {
        return latex;
    }

    const runs = latex.split(MATH_BLANK_LATEX);

    return runs.flatMap((run, index) =>
        index === runs.length - 1
            ? [run]
            : [run, <fillin key={index} characters={BLANK_CHARACTERS} />],
    );
}

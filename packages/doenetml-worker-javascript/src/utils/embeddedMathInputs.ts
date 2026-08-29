import { MATH_BLANK_LATEX } from "@doenet/utils";

export {
    mathInputSlotToken as slotToken,
    MATH_INPUT_SLOT_PATTERN as SLOT_PATTERN,
} from "@doenet/utils";

/**
 * Slot markers for inputs rendered inside typeset math.
 *
 * `<m>x = <textInput/></m>` renders the input where it is written, inside the
 * MathJax output, rather than flattening it to its current value. Reserving
 * space for it needs the control's pixel size, which only the renderer can
 * measure — core runs in a worker with no DOM. So core emits a *template*: the
 * LaTeX it would otherwise produce, with a marker in place of each embedded
 * input. The renderer replaces each marker with a box of the size it measured.
 * The marker itself lives in `@doenet/utils`, since both packages must agree
 * on it.
 *
 * The public `latex` state variable keeps its existing meaning and still
 * interpolates the input's value; the template is a separate variable. That
 * split is also what keeps typing cheap — a keystroke changes `latex`, but not
 * the template, so nothing re-typesets while the reader works.
 */

/**
 * The blank as an *operand*, for the forms of the expression that are parsed.
 *
 * `text` and `math` are both produced by parsing `latex`, and no LaTeX that
 * *draws* a blank also *parses* as one — a parser meeting
 * `\underline{\hspace{2em}}` abandons the whole expression, which is how
 * `$m.math` used to collapse to a bare placeholder instead of keeping its
 * shape. U+FF3F is the placeholder math-expressions already emits for a
 * missing subexpression, and it parses back to that same placeholder, so the
 * blank survives the round trip in position: `x = ＿ + 3` rather than `＿`.
 */
export const BLANK_PLACEHOLDER = "\uFF3F";

/** `latex` with each blank written as something a parser can read. */
export function latexWithBlanksAsPlaceholders(latex: string): string {
    return latex.split(MATH_BLANK_LATEX).join(BLANK_PLACEHOLDER);
}

/**
 * Convert LaTeX that may contain blanks, keeping the blanks where they are.
 *
 * `convert` sees a complete expression rather than one with a hole in it, and
 * the placeholder renders as itself, so nothing has to be put back afterwards.
 */
export function convertLatexWithBlanks(
    latex: string,
    convert: (latex: string) => string,
): string {
    return convert(latexWithBlanksAsPlaceholders(latex));
}

/**
 * What an embedded input contributes to the `latex` of the expression it sits
 * in: its `latex` if it has one, else its `text`, else — for a choice input,
 * which has neither — the choices it has selected, each as LaTeX when the
 * choices are math and as written otherwise. Empty when it has nothing to say,
 * which is what makes it a blank.
 */
export function embeddedChildContent(child: any): string {
    const sv = child?.stateValues ?? {};
    if (typeof sv.latex === "string") {
        return sv.latex.trim();
    }
    if (typeof sv.text === "string") {
        return sv.text.trim();
    }
    if (Array.isArray(sv.selectedValues)) {
        return sv.selectedValues
            .map((value: any) =>
                typeof value?.toLatex === "function"
                    ? value.toLatex()
                    : String(value ?? ""),
            )
            .filter((value: string) => value.trim() !== "")
            .join(", ");
    }
    return "";
}

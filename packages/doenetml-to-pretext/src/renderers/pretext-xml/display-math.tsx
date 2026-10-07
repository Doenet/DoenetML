import React from "react";
import { BasicComponent } from "../types";
import { MathPropsInText } from "@doenet/doenetml-worker";
import { mathContentWithBlanks } from "./utils/math-blanks";

type MathData = { props: MathPropsInText };

/** `<me>` and `<md>`: a display whose rows are unnumbered unless a row asks otherwise. */
export const DisplayMath: BasicComponent<MathData> = ({ node }) =>
    node.name === "me"
        ? singleEquation(node.data.props.latex, false)
        : displayMath(node.data.props.latex, false);

/** `<men>` and `<mdn>`: a display whose rows are numbered unless a row asks otherwise. */
export const DisplayMathNumbered: BasicComponent<MathData> = ({ node }) =>
    node.name === "men"
        ? singleEquation(node.data.props.latex, true)
        : displayMath(node.data.props.latex, true);

/**
 * An `<me>` or `<men>`: one equation, with one number if any, however many lines an
 * author breaks it into. A `\\` the author wrote is a line break inside the equation, as
 * it is on screen, so the lines are gathered into one rather than split into rows that
 * PreTeXt would number one by one. An equation the author tagged by hand keeps that tag
 * and is given no number of PreTeXt's.
 */
function singleEquation(rawLatex: string, numbered: boolean) {
    const latex = withoutTrailingComment(rawLatex, false);
    const mdAttrs = {
        number: numbered && !hasAuthorTag(latex, false) ? "yes" : "no",
    };
    const lines = splitAtTopLevelRowBreaks(latex, false);
    const content =
        lines.length > 1 ? `\\begin{gathered}${latex}\\end{gathered}` : latex;
    return <md {...mdAttrs}>{mathContentWithBlanks(content)}</md>;
}

/**
 * A displayed expression as a PreTeXt `<md>`. PreTeXt aligns the rows of an `<md>` on
 * their `\amp`s only when each is its own `<mrow>`; a single run of rows separated by
 * `\\` has nothing to align them in, and every `\amp` is a "Misplaced &". PreTeXt numbers
 * the equations itself, so a row says only whether it is numbered (`mrow/@number`), and
 * the display as a whole what its rows default to (`md/@number`). The display's is written
 * out whether numbered or not, since a PreTeXt document can number equations by default.
 */
function displayMath(latex: string, numbered: boolean) {
    const rows = parseDisplayRows(latex);
    const mdAttrs = { number: numbered ? "yes" : "no" };
    // Whether a row's number differs from the display's, which is all it need say.
    const differs = (row: DisplayRow) =>
        row.numbered !== undefined && row.numbered !== numbered;

    if (rows.length === 1 && !differs(rows[0])) {
        return <md {...mdAttrs}>{mathContentWithBlanks(rows[0].latex)}</md>;
    }
    return (
        <md {...mdAttrs}>
            {rows.map((row, index) => (
                <mrow
                    key={index}
                    {...(differs(row)
                        ? { number: row.numbered ? "yes" : "no" }
                        : {})}
                >
                    {mathContentWithBlanks(row.latex)}
                </mrow>
            ))}
        </md>
    );
}

export type DisplayRow = {
    latex: string;
    /** Whether the row is numbered, or undefined if nothing says. */
    numbered?: boolean;
};

/** The `\tag{n}` the core writes at the start of a numbered row. */
const CORE_TAG = /^\\tag\{\d+\}/;
/** The `\notag` the core writes at the start of an unnumbered row. */
const CORE_NOTAG = /^\\notag(?![a-zA-Z])/;

/**
 * The rows of a displayed expression, as the core writes it: its rows joined by `\\`, each
 * starting with `\tag{n}` when it is numbered and with `\notag` when it is not. Only a `\\`
 * outside every group and environment ends a row — one inside an `array`, say, ends a row
 * of the array. The core's `\tag` and `\notag` are taken off the row and reported as
 * `numbered`, since PreTeXt numbers the rows itself. Every row is kept, empty or not, so
 * the rows PreTeXt numbers are the rows DoenetML numbers.
 *
 * A `\tag` the author wrote in a row stays in it, and the row is reported unnumbered, so
 * that the author's tag is the only one it gets. A comment that runs to the end of a row is
 * left out, since PreTeXt writes the row's number and the break after it on the same line.
 */
export function parseDisplayRows(latex: string): DisplayRow[] {
    const rows: DisplayRow[] = [];
    for (const raw of splitAtTopLevelRowBreaks(latex, true)) {
        let row = raw;
        let numbered: boolean | undefined;
        if (CORE_TAG.test(row)) {
            numbered = true;
            row = row.replace(CORE_TAG, "");
        } else if (CORE_NOTAG.test(row)) {
            numbered = false;
        }
        row = withoutTrailingComment(row, true).replace(
            /\\notag(?![a-zA-Z])/g,
            "",
        );
        if (hasAuthorTag(row, true)) {
            numbered = false;
        }
        // An empty row is kept: it is a row, and numbered, on screen as well.
        rows.push({ latex: row.trim(), numbered });
    }
    return rows;
}

/**
 * Whether `latex` holds a `\tag{…}` or `\tag*{…}` that is not the core's: one the author
 * wrote. Its argument may hold braces of its own, as in `\tag{a_{1}}`. A tag in a `%`
 * comment is no tag, since TeX never reads it.
 */
function hasAuthorTag(latex: string, inDisplay: boolean) {
    return /\\tag(?![a-zA-Z])\*?\s*\{/.test(withoutComments(latex, inDisplay));
}

/** `latex` without its comments. */
function withoutComments(latex: string, inDisplay: boolean) {
    let result = "";
    for (let i = 0; i < latex.length; i++) {
        const char = latex[i];
        if (char === "\\") {
            // Keep the escaped character, so that `\%` stays a percent sign.
            result += latex.slice(i, i + 2);
            i++;
        } else if (char === "%") {
            i = commentEnd(latex, i, inDisplay) - 1;
        } else {
            result += char;
        }
    }
    return result;
}

/** `latex` without a comment that nothing but space follows. */
function withoutTrailingComment(latex: string, inDisplay: boolean) {
    const trimmed = latex.trimEnd();
    for (let i = 0; i < trimmed.length; i++) {
        const char = trimmed[i];
        if (char === "\\") {
            i++;
        } else if (char === "%") {
            const end = commentEnd(trimmed, i, inDisplay);
            if (end === trimmed.length) {
                return trimmed.slice(0, i).trimEnd();
            }
            i = end - 1;
        }
    }
    return latex;
}

/**
 * Where the comment that starts at `start`, an unescaped `%`, ends: at the end of its
 * line, or, in a display (`inDisplay`), where the core starts the next row, since the core
 * joins the rows with no line break between them.
 */
function commentEnd(latex: string, start: number, inDisplay: boolean) {
    const pattern = inDisplay
        ? /\n|\\\\(?=\\tag\{\d+\}|\\notag(?![a-zA-Z]))/
        : /\n/;
    const match = pattern.exec(latex.slice(start));
    return match ? start + match.index : latex.length;
}

/**
 * `latex` cut at each `\\` outside every group, environment and comment. `inDisplay` says
 * whether `latex` is a display the core composed of rows, as for {@link commentEnd}.
 */
function splitAtTopLevelRowBreaks(latex: string, inDisplay: boolean): string[] {
    const rows: string[] = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < latex.length; i++) {
        const char = latex[i];
        if (char === "\\") {
            if (latex.startsWith("\\begin", i)) {
                depth++;
            } else if (latex.startsWith("\\end", i)) {
                depth--;
            } else if (latex[i + 1] === "\\" && depth === 0) {
                rows.push(latex.slice(start, i));
                start = i + 2;
            }
            // Skip the escaped character, so that `\{` or `\\` is not read again.
            i++;
        } else if (char === "%") {
            // Nothing in a comment counts.
            i = commentEnd(latex, i, inDisplay) - 1;
        } else if (char === "{") {
            depth++;
        } else if (char === "}") {
            depth--;
        }
    }
    rows.push(latex.slice(start));
    return rows;
}

import React from "react";
import { BasicComponent } from "../types";
import { MathPropsInText } from "@doenet/doenetml-worker";
import { mathContentWithBlanks } from "./utils/math-blanks";

type MathData = { props: MathPropsInText };

/** `<me>` and `<md>`: a display whose rows are unnumbered unless a row asks otherwise. */
export const DisplayMath: BasicComponent<MathData> = ({ node }) =>
    displayMath(node.data.props.latex, false);

/** `<men>` and `<mdn>`: a display whose rows are numbered unless a row asks otherwise. */
export const DisplayMathNumbered: BasicComponent<MathData> = ({ node }) =>
    displayMath(node.data.props.latex, true);

/**
 * A displayed expression as a PreTeXt `<md>`. PreTeXt aligns the rows of an `<md>` on
 * their `\amp`s only when each is its own `<mrow>`; a single run of rows separated by
 * `\\` has nothing to align them in, and every `\amp` is a "Misplaced &". PreTeXt numbers
 * the equations itself, so a row says only whether it is numbered (`mrow/@number`), and
 * the display as a whole what its rows default to (`md/@number`).
 */
function displayMath(latex: string, numbered: boolean) {
    const rows = parseDisplayRows(latex);
    const mdAttrs = numbered ? { number: "yes" } : {};
    // Whether a row's number differs from the display's, which is all it need say.
    const differs = (row: DisplayRow) =>
        row.numbered !== undefined && row.numbered !== numbered;

    if (rows.length === 0) {
        return <md {...mdAttrs}>{mathContentWithBlanks(latex)}</md>;
    }
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
    /** Whether the row is numbered, as the core marked it, or undefined if it did not. */
    numbered?: boolean;
};

/**
 * The rows of a displayed expression, as the core writes it: its rows joined by `\\`, each
 * prefixed by `\tag{n}` when it is numbered and by `\notag` when it is not. Only a `\\`
 * outside every group and environment ends a row — one inside an `array`, say, ends a row
 * of the array. The core's `\tag` and `\notag` are taken off the row and reported as
 * `numbered`, since PreTeXt numbers the rows itself.
 */
export function parseDisplayRows(latex: string): DisplayRow[] {
    const rows: DisplayRow[] = [];
    for (const raw of splitAtTopLevelRowBreaks(latex)) {
        let row = raw;
        let numbered: boolean | undefined;
        if (/\\notag(?![a-zA-Z])/.test(row)) {
            numbered = false;
            row = row.replace(/\\notag(?![a-zA-Z])/g, "");
        }
        if (/\\tag\{[^{}]*\}/.test(row)) {
            numbered = true;
            row = row.replace(/\\tag\{[^{}]*\}/g, "");
        }
        row = row.trim();
        if (row !== "") {
            rows.push({ latex: row, numbered });
        }
    }
    return rows;
}

/** `latex` cut at each `\\` outside every group and environment. */
function splitAtTopLevelRowBreaks(latex: string): string[] {
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
        } else if (char === "{") {
            depth++;
        } else if (char === "}") {
            depth--;
        }
    }
    rows.push(latex.slice(start));
    return rows;
}

import React from "react";
import { BasicComponent } from "../types";
import { MathPropsInText } from "@doenet/doenetml-worker";
import { mathContentWithBlanks } from "./utils/math-blanks";

type MathData = { props: MathPropsInText };

export const DisplayMath: BasicComponent<MathData> = ({ node }) => {
    const latexString = node.data.props.latex;
    const rows = splitDisplayRows(latexString);
    if (rows.length <= 1) {
        return <md>{mathContentWithBlanks(latexString)}</md>;
    }
    // PreTeXt aligns the rows of an `<md>` on their `\amp`s only when each is its own
    // `<mrow>`; a single run of rows separated by `\\` has nothing to align them in, and
    // every `\amp` is a "Misplaced &".
    return (
        <md>
            {rows.map((row, index) => (
                <mrow key={index}>{mathContentWithBlanks(row)}</mrow>
            ))}
        </md>
    );
};

/**
 * The rows of a displayed expression, as the core writes it: its rows joined by `\\`, each
 * marked `\notag` unless it is numbered. Only a `\\` outside every group and environment
 * ends a row — one inside an `array`, say, ends a row of the array. A row's `\notag` is
 * dropped, since the rows of an `<md>` are unnumbered unless asked otherwise.
 */
export function splitDisplayRows(latex: string): string[] {
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
    return rows
        .map((row) => row.replace(/\\notag(?![a-zA-Z])/g, "").trim())
        .filter((row) => row !== "");
}

import { RowCol } from "../../doenet-source-object";
import { DastMacro, showCursor } from "@doenet/parser";
import { AutoCompleter } from "..";

export type CompletionContext =
    | { cursorPos: "body" }
    | { cursorPos: "element"; complete: boolean }
    | { cursorPos: "macro"; complete: boolean; node: DastMacro | null };

/**
 * Get context about the current cursor position to determine whether completions should be offered or not,
 * and what type of completions should be offered.
 */
export function getCompletionContext(
    this: AutoCompleter,
    offset: number | RowCol,
): CompletionContext {
    if (typeof offset !== "number") {
        offset = this.sourceObj.rowColToOffset(offset);
    }

    const prevChar = this.sourceObj.source.charAt(offset - 1);
    const prevPrevChar = this.sourceObj.source.charAt(offset - 2);
    const nextChar = this.sourceObj.source.charAt(offset + 1);
    let prevNonWhitespaceCharOffset = offset - 1;
    while (
        this.sourceObj.source
            .charAt(prevNonWhitespaceCharOffset)
            .match(/(\s|\n)/)
    ) {
        prevNonWhitespaceCharOffset--;
    }
    const prevNonWhitespaceChar = this.sourceObj.source.charAt(
        prevNonWhitespaceCharOffset,
    );

    const leftNode = this.sourceObj.nodeAtOffset(offset, { side: "left" });

    // Check for status inside a macro
    let macro = this.sourceObj.nodeAtOffset(offset, {
        type: "macro",
        side: "left",
    });
    if (
        !macro &&
        (prevChar === "." || prevChar === "[") &&
        prevPrevChar !== ")"
    ) {
        macro = this.sourceObj.nodeAtOffset(offset - 1, {
            type: "macro",
            side: "left",
        });
    }
    if (macro) {
        // Since macros are terminal, if the node to our immediate left is a macro,
        // the macro is complete.
        const complete = leftNode?.type === "macro";
        return { cursorPos: "macro", complete, node: macro };
    }

    return { cursorPos: "body" };
}

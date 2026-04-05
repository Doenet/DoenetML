import { RowCol } from "../../doenet-source-object";
import type { DastMacro, DastMacroV6 } from "@doenet/parser";
import { AutoCompleter } from "../index";

type MacroNode = DastMacro | DastMacroV6;

/**
 * High-level cursor contexts used to choose between XML completions and
 * ref-specific completions.
 *
 * `refName` covers `$foo`, while `refMember` covers member segments after a
 * dot such as `$foo.bar` or `$foo.bar.`. These ref contexts may be detected
 * either from a parsed macro node or from partially typed plain text before
 * the parser has recognized a full macro.
 */
export type CompletionContext =
    | { cursorPos: "body" }
    | { cursorPos: "element"; complete: boolean }
    | { cursorPos: "macro"; complete: boolean; node: MacroNode | null }
    | {
          cursorPos: "refName";
          typedPrefix: string;
          replaceFromOffset: number;
      }
    | {
          cursorPos: "refMember";
          typedPrefix: string;
          replaceFromOffset: number;
          pathParts: string[];
      };

/**
 * Walk left from `offset` to capture the current word fragment being
 * typed. The returned start offset is later used as the text replacement start
 * for ref completions.
 */
function getIdentifierPrefixInfo(source: string, offset: number) {
    let tokenStart = offset;
    while (tokenStart > 0 && source.charAt(tokenStart - 1).match(/\w/)) {
        tokenStart--;
    }
    return {
        tokenStart,
        typedPrefix: source.slice(tokenStart, offset),
    };
}

/**
 * Classify the cursor location for completion routing.
 *
 * This distinguishes regular XML editing contexts from ref-oriented contexts
 * such as `$name` and `$name.member`, including incomplete text that has not
 * yet been parsed into a full macro node.
 */
export function getCompletionContext(
    this: AutoCompleter,
    offset: number | RowCol,
): CompletionContext {
    if (typeof offset !== "number") {
        offset = this.sourceObj.rowColToOffset(offset);
    }

    const source = this.sourceObj.source;
    const prevChar = source.charAt(offset - 1);
    const prevPrevChar = source.charAt(offset - 2);
    const { tokenStart, typedPrefix } = getIdentifierPrefixInfo(source, offset);

    const leftNode = this.sourceObj.nodeAtOffset(offset, { side: "left" });

    // First prefer an actual parsed macro at or just to the left of the cursor.
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
        if (prevChar === "." || source.charAt(tokenStart - 1) === ".") {
            const pathSource = source.slice(
                (macro.position?.start.offset ?? offset) + 1,
                offset,
            );
            return {
                cursorPos: "refMember",
                typedPrefix,
                replaceFromOffset: tokenStart,
                pathParts: pathSource.split("."),
            };
        }

        if (prevChar === "$" || source.charAt(tokenStart - 1) === "$") {
            return {
                cursorPos: "refName",
                typedPrefix,
                replaceFromOffset: tokenStart,
            };
        }

        // Since macros are terminal, if the node to our immediate left is a macro,
        // the macro is complete.
        const complete = leftNode?.type === "macro";
        return { cursorPos: "macro", complete, node: macro };
    }

    // If parsing has not produced a macro node yet, detect ref syntax directly
    // from the surrounding text so completions still appear while typing.
    if (prevChar === "." || source.charAt(tokenStart - 1) === ".") {
        let pathStart = tokenStart - 1;
        while (pathStart > 0 && source.charAt(pathStart - 1).match(/[\w.]/)) {
            pathStart--;
        }
        if (source.charAt(pathStart - 1) === "$") {
            return {
                cursorPos: "refMember",
                typedPrefix,
                replaceFromOffset: tokenStart,
                pathParts: source.slice(pathStart, offset).split("."),
            };
        }
    }

    if (prevChar === "$" || source.charAt(tokenStart - 1) === "$") {
        return {
            cursorPos: "refName",
            typedPrefix,
            replaceFromOffset: tokenStart,
        };
    }

    return { cursorPos: "body" };
}

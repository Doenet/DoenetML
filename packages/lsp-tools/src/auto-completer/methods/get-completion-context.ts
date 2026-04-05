import { RowCol } from "../../doenet-source-object";
import type { DastMacro, DastMacroV6 } from "@doenet/parser";
import { AutoCompleter } from "../index";

type MacroNode = DastMacro | DastMacroV6;

const SIMPLE_IDENTIFIER_CHAR_REGEX = /\w/;
const MACRO_IDENTIFIER_CHAR_REGEX = /[A-Za-z0-9_-]/;
const MACRO_PATH_CHAR_REGEX = /[A-Za-z0-9_.-]/;

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
 * Walk left from `offset` capturing a continuous identifier fragment.
 * Uses the specified regex to match identifier characters.
 */
function getIdentifierPrefixInfo(
    source: string,
    offset: number,
    charRegex: RegExp = SIMPLE_IDENTIFIER_CHAR_REGEX,
) {
    let tokenStart = offset;
    while (tokenStart > 0 && charRegex.test(source.charAt(tokenStart - 1))) {
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
    const { tokenStart: macroTokenStart, typedPrefix: macroTypedPrefix } =
        getIdentifierPrefixInfo(source, offset, MACRO_IDENTIFIER_CHAR_REGEX);

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
        const macroStartOffset = macro.position?.start.offset ?? offset;
        const isParenthesizedMacro =
            source.charAt(macroStartOffset + 1) === "(";
        const activeTokenStart = isParenthesizedMacro
            ? macroTokenStart
            : tokenStart;
        const activeTypedPrefix = isParenthesizedMacro
            ? macroTypedPrefix
            : typedPrefix;

        if (prevChar === "." || source.charAt(activeTokenStart - 1) === ".") {
            let pathSource = source.slice(
                macroStartOffset + (isParenthesizedMacro ? 2 : 1),
                offset,
            );
            if (isParenthesizedMacro) {
                // Member access typed after a completed `$(...)` appears in source
                // as `...).member`; normalize it back to dot-delimited path parts.
                pathSource = pathSource.replace(/\)\./g, ".");
            }
            if (pathSource.endsWith(")")) {
                pathSource = pathSource.slice(0, -1);
            }
            return {
                cursorPos: "refMember",
                typedPrefix: activeTypedPrefix,
                replaceFromOffset: activeTokenStart,
                pathParts: pathSource.split("."),
            };
        }

        if (
            (isParenthesizedMacro &&
                ((prevChar === "(" && prevPrevChar === "$") ||
                    (source.charAt(activeTokenStart - 1) === "(" &&
                        source.charAt(activeTokenStart - 2) === "$"))) ||
            (!isParenthesizedMacro &&
                (prevChar === "$" ||
                    source.charAt(activeTokenStart - 1) === "$"))
        ) {
            return {
                cursorPos: "refName",
                typedPrefix: activeTypedPrefix,
                replaceFromOffset: activeTokenStart,
            };
        }

        // Since macros are terminal, if the node to our immediate left is a macro,
        // the macro is complete.
        const complete = leftNode?.type === "macro";
        return { cursorPos: "macro", complete, node: macro };
    }

    // If parsing has not produced a macro node yet, detect ref syntax directly
    // from partially typed text so completions appear while typing.

    // Check for just typed `$(`, `$` with macro path detection
    if (
        (prevChar === "(" && prevPrevChar === "$") ||
        (source.charAt(macroTokenStart - 1) === "(" &&
            source.charAt(macroTokenStart - 2) === "$")
    ) {
        return {
            cursorPos: "refName",
            typedPrefix: macroTypedPrefix,
            replaceFromOffset: macroTokenStart,
        };
    }

    // Check for macro path member access: `$(foo.` or `$(foo-bar).member`
    if (prevChar === "." || source.charAt(macroTokenStart - 1) === ".") {
        let pathStart = macroTokenStart - 1;
        while (
            pathStart > 0 &&
            MACRO_PATH_CHAR_REGEX.test(source.charAt(pathStart - 1))
        ) {
            pathStart--;
        }

        // Pattern: `$identifier.member`
        if (source.charAt(pathStart - 1) === "$") {
            return {
                cursorPos: "refMember",
                typedPrefix: macroTypedPrefix,
                replaceFromOffset: macroTokenStart,
                pathParts: source.slice(pathStart, offset).split("."),
            };
        }

        // Pattern: `$(identifier.member` or `$(identifier).member`
        if (
            source.charAt(pathStart - 1) === "(" &&
            source.charAt(pathStart - 2) === "$"
        ) {
            return {
                cursorPos: "refMember",
                typedPrefix: macroTypedPrefix,
                replaceFromOffset: macroTokenStart,
                pathParts: source.slice(pathStart, offset).split("."),
            };
        }

        // Pattern: `$(identifier).member`
        if (source.charAt(pathStart - 1) === ")") {
            const macroOpenParen = source.lastIndexOf("(", pathStart - 1);
            if (
                macroOpenParen > 0 &&
                source.charAt(macroOpenParen - 1) === "$"
            ) {
                const basePath = source.slice(
                    macroOpenParen + 1,
                    pathStart - 1,
                );
                const suffix = source.slice(pathStart, offset);
                return {
                    cursorPos: "refMember",
                    typedPrefix: macroTypedPrefix,
                    replaceFromOffset: macroTokenStart,
                    pathParts: `${basePath}${suffix}`.split("."),
                };
            }
        }
    }

    // Check for simple `$identifier` pattern (when not in parentheses yet)
    if (prevChar === "$" || source.charAt(tokenStart - 1) === "$") {
        if (prevChar === "$" || /^\w+$/.test(typedPrefix)) {
            return {
                cursorPos: "refName",
                typedPrefix,
                replaceFromOffset: tokenStart,
            };
        }
    }

    // Edge case: check for incomplete `$identifier.path` after `$` without parens
    if (
        prevChar === "." &&
        source.charAt(tokenStart - 1) === "." &&
        tokenStart > 1
    ) {
        // Walk back to after the `$`
        let dollarPos = tokenStart - 2;
        while (dollarPos > 0 && /[\w.]/.test(source.charAt(dollarPos - 1))) {
            dollarPos--;
        }
        if (source.charAt(dollarPos - 1) === "$") {
            const pathStart = dollarPos;
            const pathStr = source.slice(pathStart, offset).trim();
            const pathParts = pathStr.split(".").filter((p) => p.length > 0);
            if (pathParts.length > 0 && /^\w+/.test(pathStr)) {
                return {
                    cursorPos: "refMember",
                    typedPrefix,
                    replaceFromOffset: tokenStart,
                    pathParts,
                };
            }
        }
    }

    return { cursorPos: "body" };
}

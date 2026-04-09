import { RowCol } from "../../doenet-source-object";
import type { DastMacro } from "@doenet/parser";
import { AutoCompleter } from "../index";

type MacroNode = DastMacro;

// Keep these aligned with parser grammar in `packages/parser/src/macros/macros.peggy`:
// - SimpleIdent = [a-zA-Z_][a-zA-Z0-9_]*
// - Ident = [a-zA-Z0-9_-]+
const SIMPLE_IDENTIFIER_CHAR_REGEX = /[A-Za-z0-9_]/;
const SIMPLE_IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;
const MACRO_IDENTIFIER_CHAR_REGEX = /[A-Za-z0-9_-]/;
const MACRO_PATH_CHAR_REGEX = /[A-Za-z0-9_.[\]-]/;

/** Regex matching one or more bracket indices at the end, e.g. `[1]`, `[2][3]`. */
const BRACKET_INDEX_SUFFIX_REGEX = /(\[[^\]]*\])+$/;

/**
 * Strip bracket indices from path parts and report index usage per segment.
 * For example:
 * `["sel[1]", "member", ""]` →
 * `{ parts: ["sel", "member", ""], pathPartHasIndex: [true, false, false] }`.
 */
function stripIndicesFromPathParts(parts: string[]): {
    parts: string[];
    pathPartHasIndex: boolean[];
} {
    const pathPartHasIndex: boolean[] = [];
    const stripped = parts.map((p) => {
        const indexed = BRACKET_INDEX_SUFFIX_REGEX.test(p);
        pathPartHasIndex.push(indexed);
        if (indexed) {
            return p.replace(BRACKET_INDEX_SUFFIX_REGEX, "");
        }
        return p;
    });
    return { parts: stripped, pathPartHasIndex };
}

/**
 * High-level cursor contexts used to choose between XML completions and
 * ref-specific completions.
 *
 * Returned cursor positions are `body`, `macro`, `refName`, and `refMember`.
 * `refName` covers `$foo`, while `refMember` covers member segments after a
 * dot such as `$foo.bar` or `$foo.bar.`. These ref contexts may be detected
 * either from a parsed macro node or from partially typed plain text before
 * the parser has recognized a full macro.
 */
export type CompletionContext =
    | { cursorPos: "body" }
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
          /**
           * Per-segment index flags aligned with `pathParts`.
           * Example: `$rep[1].myMath.` -> pathPartHasIndex `[true, false, false]`.
           */
          pathPartHasIndex: boolean[];
      };

/**
 * Build a `refMember` context, stripping bracket indices from path parts.
 */
function makeRefMemberContext(
    typedPrefix: string,
    replaceFromOffset: number,
    rawPathParts: string[],
): CompletionContext & { cursorPos: "refMember" } {
    const { parts, pathPartHasIndex } = stripIndicesFromPathParts(rawPathParts);
    return {
        cursorPos: "refMember",
        typedPrefix,
        replaceFromOffset,
        pathParts: parts,
        pathPartHasIndex,
    };
}

/**
 * Validate raw path parts before converting to a `refMember` context.
 * Whitespace around any non-final segment indicates invalid syntax
 * (for example, `$foo .bar` or `$foo[1] .`).
 */
function hasValidRefMemberPathSyntax(rawPathParts: string[]): boolean {
    if (rawPathParts.length === 0) {
        return false;
    }

    for (let i = 0; i < rawPathParts.length - 1; i++) {
        const part = rawPathParts[i];
        if (part.length === 0 || part.trim() !== part) {
            return false;
        }
    }

    return true;
}

function makeValidatedRefMemberContext(
    typedPrefix: string,
    replaceFromOffset: number,
    rawPathParts: string[],
): CompletionContext {
    if (!hasValidRefMemberPathSyntax(rawPathParts)) {
        return { cursorPos: "body" };
    }

    return makeRefMemberContext(typedPrefix, replaceFromOffset, rawPathParts);
}

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

function normalizeMacroPathForMemberResolution(pathSource: string) {
    // Normalize `$(a).b`, `$(a).(b)`, and mixed forms into dot-delimited parts.
    let normalized = pathSource
        .replace(/\)\.\(/g, ".")
        .replace(/\)\./g, ".")
        .replace(/\.\(/g, ".");

    if (normalized.startsWith("(")) {
        normalized = normalized.slice(1);
    }
    if (normalized.endsWith(")")) {
        normalized = normalized.slice(0, -1);
    }

    return normalized;
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

        if (
            prevChar === "." ||
            source.charAt(activeTokenStart - 1) === "." ||
            (source.charAt(activeTokenStart - 1) === "(" &&
                source.charAt(activeTokenStart - 2) === ".")
        ) {
            const pathSource = normalizeMacroPathForMemberResolution(
                source.slice(
                    macroStartOffset + (isParenthesizedMacro ? 2 : 1),
                    offset,
                ),
            );
            return makeValidatedRefMemberContext(
                activeTypedPrefix,
                activeTokenStart,
                pathSource.split("."),
            );
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
    if (
        prevChar === "." ||
        source.charAt(macroTokenStart - 1) === "." ||
        (source.charAt(macroTokenStart - 1) === "(" &&
            source.charAt(macroTokenStart - 2) === ".")
    ) {
        let pathStart = macroTokenStart - 1;
        while (
            pathStart > 0 &&
            MACRO_PATH_CHAR_REGEX.test(source.charAt(pathStart - 1))
        ) {
            pathStart--;
        }

        // Pattern: `$identifier.member`
        if (source.charAt(pathStart - 1) === "$") {
            return makeValidatedRefMemberContext(
                macroTypedPrefix,
                macroTokenStart,
                source.slice(pathStart, offset).split("."),
            );
        }

        // Pattern: `$(identifier.member` or `$(identifier).member`
        if (
            source.charAt(pathStart - 1) === "(" &&
            source.charAt(pathStart - 2) === "$"
        ) {
            return makeValidatedRefMemberContext(
                macroTypedPrefix,
                macroTokenStart,
                source.slice(pathStart, offset).split("."),
            );
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
                return makeValidatedRefMemberContext(
                    macroTypedPrefix,
                    macroTokenStart,
                    `${basePath}${suffix}`.split("."),
                );
            }
        }

        // Pattern: `$identifier.(member` or `$(identifier).(member`
        if (
            source.charAt(pathStart - 1) === "(" &&
            source.charAt(pathStart - 2) === "."
        ) {
            // Non-parenthesized base: `$identifier.(member`
            let baseStart = pathStart - 2;
            while (
                baseStart > 0 &&
                MACRO_PATH_CHAR_REGEX.test(source.charAt(baseStart - 1))
            ) {
                baseStart--;
            }
            if (source.charAt(baseStart - 1) === "$") {
                const basePath = source.slice(baseStart, pathStart - 2);
                return makeValidatedRefMemberContext(
                    macroTypedPrefix,
                    macroTokenStart,
                    `${basePath}.${source
                        .slice(pathStart, offset)
                        .replace(/^\(/, "")}`.split("."),
                );
            }

            // Parenthesized base: `$(identifier).(member`
            if (source.charAt(baseStart - 1) === ")") {
                const macroOpenParen = source.lastIndexOf("(", baseStart - 1);
                if (
                    macroOpenParen > 0 &&
                    source.charAt(macroOpenParen - 1) === "$"
                ) {
                    const basePath = source.slice(
                        macroOpenParen + 1,
                        baseStart - 1,
                    );
                    return makeValidatedRefMemberContext(
                        macroTypedPrefix,
                        macroTokenStart,
                        `${basePath}.${source
                            .slice(pathStart, offset)
                            .replace(/^\(/, "")}`.split("."),
                    );
                }
            }
        }
    }

    // Check for simple `$identifier` pattern (when not in parentheses yet)
    if (prevChar === "$" || source.charAt(tokenStart - 1) === "$") {
        if (prevChar === "$" || SIMPLE_IDENTIFIER_REGEX.test(typedPrefix)) {
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
        while (
            dollarPos > 0 &&
            /[A-Za-z0-9_.[\]-]/.test(source.charAt(dollarPos - 1))
        ) {
            dollarPos--;
        }
        if (source.charAt(dollarPos - 1) === "$") {
            const pathStart = dollarPos;
            const pathStr = source.slice(pathStart, offset).trim();
            const pathParts = pathStr.split(".");
            if (pathParts.length > 0 && /^[A-Za-z0-9_]/.test(pathStr)) {
                return makeValidatedRefMemberContext(
                    typedPrefix,
                    tokenStart,
                    pathParts,
                );
            }
        }
    }

    return { cursorPos: "body" };
}

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
/** What a path is made of outside its `[…]` indices: `Ident` chars and `.`. */
const MACRO_PATH_CHAR_REGEX = /[A-Za-z0-9_.-]/;

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
 * Where the macro a member is being typed into begins.
 *
 * `macroStartOffset` is its `$`; `pathStartOffset` is the first character of
 * its path — one past the `$`, or two for the parenthesized `$(a.b` form.
 * Consumers read the form off the gap between them, and an edit that has to
 * rewrite the whole macro (rather than just the member) starts at the `$`.
 *
 * Both are recorded here because this is where they are known: from the
 * parsed macro node when there is one, and otherwise from the scan that
 * classified the cursor. Rescanning downstream is what produced
 * `$rep[$(i].my-p)` — a scan that reads the `$` of a macro used as an index
 * as the start of the one the member sits in.
 */
type MacroOffsets = {
    macroStartOffset: number;
    pathStartOffset: number;
};

/**
 * Whether the macro a member sits in is the parenthesized `$(a.b` form —
 * the only one that puts two characters in front of its path.
 *
 * The form decides which identifiers the path can hold: `$(a.my-b)` reads
 * with `Ident`, the bare `$a.b` with `SimpleIdent`.
 */
export function isParenthesizedRefMacro(macroOffsets: MacroOffsets): boolean {
    return macroOffsets.pathStartOffset > macroOffsets.macroStartOffset + 1;
}

/**
 * Whether a path segment as authored — its name plus any `[…]` indices — fits
 * the bare `$name` form, whose segments are `SimpleIdent`. A hyphen or a
 * leading digit does not fit and needs `$(…)`; an index always fits, since it
 * hangs off the name rather than being part of it.
 */
export function segmentFitsBareMacro(segment: string): boolean {
    return SIMPLE_IDENTIFIER_REGEX.test(
        segment.replace(BRACKET_INDEX_SUFFIX_REGEX, ""),
    );
}

/**
 * Walk left from `offset` to the first character of the reference path that
 * ends there, returning `offset` itself when no path does.
 *
 * A `[…]` index is stepped over whole rather than character by character,
 * because its contents can hold a macro of its own: the path of
 * `$rep[$i].member` starts at `rep`, and a scan that read the `$` of `$i` as
 * a macro's start would anchor the member on it.
 */
function findPathStartLeftOf(source: string, offset: number): number {
    let pathStart = offset;
    while (pathStart > 0) {
        const char = source.charAt(pathStart - 1);
        if (char === "]") {
            const openBracket = findMatchingOpenBracket(source, pathStart - 1);
            // An unbalanced `]` is not an index, so the path stops here.
            if (openBracket < 0) {
                return pathStart;
            }
            pathStart = openBracket;
        } else if (MACRO_PATH_CHAR_REGEX.test(char)) {
            pathStart--;
        } else {
            // Includes an unbalanced `[`, which means `offset` is *inside* an
            // index rather than after one.
            return pathStart;
        }
    }
    return pathStart;
}

/** Offset of the `[` matching the `]` at `closeOffset`, or `-1` if unmatched. */
function findMatchingOpenBracket(source: string, closeOffset: number): number {
    let depth = 0;
    for (let i = closeOffset; i >= 0; i--) {
        const char = source.charAt(i);
        if (char === "]") {
            depth++;
        } else if (char === "[") {
            depth--;
            if (depth === 0) {
                return i;
            }
        }
    }
    return -1;
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
    | ({
          cursorPos: "refMember";
          typedPrefix: string;
          replaceFromOffset: number;
          pathParts: string[];
          /**
           * Per-segment index flags aligned with `pathParts`.
           * Example: `$rep[1].myMath.` -> pathPartHasIndex `[true, false, false]`.
           */
          pathPartHasIndex: boolean[];
          /**
           * The path parts as authored, with bracket indices preserved
           * (`["rep[1]", "myMath", ""]`). Use this for display-only purposes
           * (e.g. rendering the cursor's full path in a help sentence);
           * resolution code should use the stripped `pathParts` and the
           * `pathPartHasIndex` flag instead.
           */
          rawPathParts: string[];
      } & MacroOffsets);

/** The {@link CompletionContext} for a member being typed into a macro. */
export type RefMemberCompletionContext = Extract<
    CompletionContext,
    { cursorPos: "refMember" }
>;

/**
 * Build a `refMember` context, stripping bracket indices from path parts.
 */
function makeRefMemberContext(
    typedPrefix: string,
    replaceFromOffset: number,
    rawPathParts: string[],
    macroOffsets: MacroOffsets,
): RefMemberCompletionContext {
    const { parts, pathPartHasIndex } = stripIndicesFromPathParts(rawPathParts);
    return {
        cursorPos: "refMember",
        typedPrefix,
        replaceFromOffset,
        pathParts: parts,
        pathPartHasIndex,
        rawPathParts,
        ...macroOffsets,
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
    macroOffsets: MacroOffsets,
): CompletionContext {
    if (!hasValidRefMemberPathSyntax(rawPathParts)) {
        return { cursorPos: "body" };
    }

    return makeRefMemberContext(
        typedPrefix,
        replaceFromOffset,
        rawPathParts,
        macroOffsets,
    );
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
            // The path starts after the `$` of `$a.b`, or after the `$(` of
            // `$(a.b` — the parenthesized form's path is read from inside its
            // parentheses.
            const pathStartOffset =
                macroStartOffset + (isParenthesizedMacro ? 2 : 1);
            return makeValidatedRefMemberContext(
                activeTypedPrefix,
                activeTokenStart,
                source.slice(pathStartOffset, offset).split("."),
                { macroStartOffset, pathStartOffset },
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

    // Check for macro path member access: `$foo.member` or `$(foo-bar.member`.
    //
    // Those are the only two shapes a member can be typed into. A macro ends
    // at the `)` of `$(foo-bar)`, so the `.` in `$(foo-bar).member` starts
    // ordinary text, and the grammar has no parenthesized property form, so
    // `$foo.(member)` is text as well (`packages/parser/src/macros/macros.peggy`).
    // Neither gets member completions — suggesting into them would be
    // suggesting something that is not a reference.
    if (prevChar === "." || source.charAt(macroTokenStart - 1) === ".") {
        // `macroTokenStart - 1` is the `.` in front of the member.
        const pathStart = findPathStartLeftOf(source, macroTokenStart - 1);

        // Pattern: `$identifier.member`
        if (source.charAt(pathStart - 1) === "$") {
            return makeValidatedRefMemberContext(
                macroTypedPrefix,
                macroTokenStart,
                source.slice(pathStart, offset).split("."),
                {
                    macroStartOffset: pathStart - 1,
                    pathStartOffset: pathStart,
                },
            );
        }

        // Pattern: `$(identifier.member`, still inside the parenthesized form
        if (
            source.charAt(pathStart - 1) === "(" &&
            source.charAt(pathStart - 2) === "$"
        ) {
            return makeValidatedRefMemberContext(
                macroTypedPrefix,
                macroTokenStart,
                source.slice(pathStart, offset).split("."),
                {
                    macroStartOffset: pathStart - 2,
                    pathStartOffset: pathStart,
                },
            );
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

    return { cursorPos: "body" };
}

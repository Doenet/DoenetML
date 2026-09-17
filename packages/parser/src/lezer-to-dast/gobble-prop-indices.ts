import type { DiagnosticArgs } from "@doenet/i18n";
import { codedDastError } from "../coded-dast-error";
import {
    DastElement,
    DastElementContent,
    DastError,
    DastFunctionMacro,
    DastMacro,
    DastMacroPathPart,
    DastRootContent,
    DastText,
} from "../types";
import {
    findNodesWithPositionInfo,
    mergeAdjacentTextInArray,
} from "../dast-to-xml/utils";
import {
    gobbleFunctionArguments,
    splitTextAtSpecialChars,
    trimWhitespace,
} from "./gobble-function-arguments";
import { parseMacroTail } from "../macros";
import {
    OffsetToPositionMap,
    updateNodePositionData,
} from "./lezer-to-dast-utils";

/**
 * An index can be written with an element in it — `$myList[<indexOf …/>]` — but the
 * macro parser can never see one, for the same reason it cannot see a function
 * reference's element arguments.
 *
 * Lezer parses the XML structure first, and `reprocessTextForMacros` then runs the
 * macro parser over each *text* node that comes out of it. An element between the
 * brackets splits that text, so `[` and `]` end up in different text nodes and no
 * rule in `macros.peggy` can match across the boundary. By the time the macro parser
 * looks, the element has stopped being text.
 *
 * So the re-association happens here instead, over the assembled sibling array, once
 * the elements between the brackets exist as nodes — exactly as
 * `gobbleFunctionArguments` does for `$$f(<math>x</math>)`. See #1909.
 *
 * **Note**: this function may mutate the input.
 */
export function gobblePropIndices(
    nodes: DastRootContent[],
    offsetMap: OffsetToPositionMap,
    options: { warnOnly?: boolean } = {},
): DastRootContent[] {
    // `warnOnly` is the second of the two passes this function makes over a
    // sibling array. The first runs before `gobbleFunctionArguments` and does the
    // real work; this one runs after it, attaches nothing, and exists only to
    // report `$$f(<n/>)[<m/>]`. Until the arguments have been gobbled that
    // reference is followed by `(` rather than `[`, so the first pass cannot see
    // the brackets at all, while `$$f(1)[<m/>]` — whose arguments the grammar
    // parsed — it warns about normally. Restricting this pass to references whose
    // input holds an element is what keeps the two from both reporting the same
    // thing.
    const { warnOnly = false } = options;
    if (!mayHaveAnElementIndex(nodes)) {
        return nodes;
    }
    // Give every bracket a text node of its own so the depth count below can work a
    // node at a time. The adjacent text nodes this leaves behind are merged again
    // before we return, so a document that happens to contain brackets in its prose
    // comes back with its text nodes exactly as they were.
    let split: DastRootContent[] = nodes
        .map((node) =>
            node.type === "text"
                ? (splitTextAtSpecialChars(node, /[\[\]]/) as DastRootContent[])
                : node,
        )
        .flat();

    const ret: DastRootContent[] = [];
    for (let i = 0; i < split.length; i++) {
        const node = split[i];
        ret.push(node);
        if (node.type !== "macro" && node.type !== "function") {
            continue;
        }
        if (warnOnly && !hasElementArguments(node)) {
            continue;
        }
        // A reference may take more than one index in a row: `$a[<n/>][<m/>]`.
        while (isOpenBracket(split[i + 1])) {
            const group = collectBracketGroup(split, i + 1);

            if (!group) {
                // No closing bracket anywhere. Only worth saying so if an element is
                // sitting right there, since that is the shape that reads as an index.
                if (elementFollows(split, i + 1)) {
                    ret.push(
                        indexWarning(
                            node,
                            split[i + 1] as DastText,
                            "unclosed",
                        ),
                    );
                }
                break;
            }
            if (!group.content.some((n) => n.type === "element")) {
                // Nothing here the macro parser could not already have taken. Claiming
                // it would silently change `$(x)[1]` and `$x{z}[5]`.
                break;
            }
            if (group.content.some((n) => n.type === "error")) {
                // The markup between the brackets is malformed — a stray closing
                // tag, say. The `error` node the parser left there has to stay in
                // the sibling array, where the flattener turns it into an
                // `_error`: an index's `value` holds only text, references and
                // elements, so an error carried into one is a deserialization
                // failure that takes the whole document down rather than the
                // diagnostic the author needs. Declining leaves the brackets
                // literal, exactly as they were before an element could index,
                // and leaves the parse error where it can still be reported.
                //
                // Sitting above `whatClosedThePath` is deliberate, not an
                // oversight: `$(x)[<n/> </badclose>]` reports the stray tag and
                // *not* the `doenet-w0162` the closed path would otherwise earn.
                // The brackets are literal either way, and one loud error about
                // malformed markup beats two about markup that cannot be read
                // yet. Move this below that call and both arrive.
                break;
            }
            // A path that is closed is closed whatever follows the brackets,
            // so `$$(f)[<n/>](y)` and `$$f(1)[<n/>](y)` are a parenthesized path
            // and an argument list respectively, and the trailing `(y)` is
            // literal text in both. An index on a path that is still *open* is
            // taken, called or not: `$$fs[<n/>](3)` picks which of the functions
            // in `fs` to call, exactly as the literal `$$fs[1](3)` does.
            const closedBy = whatClosedThePath(node);
            if (closedBy) {
                if (closedBy !== "unknown") {
                    ret.push(
                        indexWarning(node, split[i + 1] as DastText, closedBy),
                    );
                }
                break;
            }

            if (warnOnly) {
                // This pass reports; the first one attaches. Reaching here means
                // the brackets *would* be claimed, which the first pass already
                // did — there is nothing left to say.
                break;
            }

            // A warning minted while processing the group's own contents goes
            // in the sibling array, not into the index it came from.
            ret.push(...attachIndex(node, group, offsetMap));
            i = group.closeIdx;

            // The path may carry on past the brackets — `$a[<n/>].x`, `$a[<n/>][1]`
            // — and everything after the `]` was emitted as plain text before this
            // pass ran, so it has to be parsed here. `graftTail` rewrites the run
            // of text nodes it consumed, leaving `split[i + 1]` as whatever is left;
            // the loop then re-checks it, which is what lets an element index and a
            // text tail alternate in `$a[<n/>].x[2].y[<m/>]`.
            graftTail(split, i + 1, node, offsetMap);
        }
    }

    return mergeAdjacentTextInArray(ret as any) as DastRootContent[];
}

/**
 * Whether this function reference was given its arguments by
 * `gobbleFunctionArguments` rather than by the grammar — which is true exactly
 * when an element was written among them, as in `$$f(<math>3</math>)`.
 *
 * Used only by the `warnOnly` pass, to pick out the references the first pass
 * could not have seen.
 */
function hasElementArguments(node: DastMacro | DastFunctionMacro): boolean {
    if (node.type !== "function" || !node.input) {
        return false;
    }
    return node.input.some((argument) =>
        argument.some((n) => n.type === "element"),
    );
}

/**
 * Whether any reference in `nodes` is immediately followed by a `[`.
 *
 * The adjacency is what keeps ordinary prose out of this pass: the macro parser has
 * already taken every bracket it legally could, so `$a [1]` leaves a `" "` in
 * between and `see [1]` has no reference before the bracket at all.
 */
function mayHaveAnElementIndex(nodes: DastRootContent[]): boolean {
    return nodes.some((node, i) => {
        if (node.type !== "macro" && node.type !== "function") {
            return false;
        }
        const next = nodes[i + 1];
        return next?.type === "text" && next.value.startsWith("[");
    });
}

function isOpenBracket(node: DastRootContent | undefined): boolean {
    return node?.type === "text" && node.value === "[";
}

/**
 * Whether an element appears anywhere after the `[` at `openIdx`. Used only to
 * decide whether an unclosed bracket is worth reporting.
 *
 * The whole remainder is scanned rather than just the first node, because an index
 * may hold mixed content: `$a[1 + <n/>` is the unclosed spelling of `$a[1 + <n/>]`,
 * which *is* claimed, and reporting one but not the other would be arbitrary. The
 * adjacency of the `[` to the reference is what keeps prose out of this — a bracket
 * the reference does not touch never reaches here.
 */
function elementFollows(nodes: DastRootContent[], openIdx: number): boolean {
    return nodes.slice(openIdx + 1).some((node) => node.type === "element");
}

type BracketGroup = {
    content: DastRootContent[];
    closeIdx: number;
    closeNode: DastText;
};

/**
 * Collect everything between the `[` at `openIdx` and its matching `]`.
 *
 * Only brackets that are *siblings* are counted. Brackets written inside an element,
 * as in `$a[<b>x[1]</b>]`, live in that element's own children and never reach this
 * array, so they cannot unbalance the count.
 */
function collectBracketGroup(
    nodes: DastRootContent[],
    openIdx: number,
): BracketGroup | null {
    const content: DastRootContent[] = [];
    let depth = 1;
    for (let i = openIdx + 1; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.type === "text") {
            if (node.value === "[") {
                depth++;
            } else if (node.value === "]") {
                depth--;
                if (depth === 0) {
                    return { content, closeIdx: i, closeNode: node };
                }
            }
        }
        content.push(node);
    }
    return null;
}

/**
 * Why this reference can no longer take an index, or `undefined` if it still can.
 *
 * The grammar hangs an index off a *path part* (`PathPart = name PropIndex*`), so an
 * index can only follow the path itself. Anything written after the path has closed
 * it: `$x{z}` ends with its brace block, `$(x)` with its closing paren and `$$f(1)`
 * with its argument list, which is why `$x{z}[5]`, `$(x)[1]` and `$$f(1)[2]` are a
 * reference followed by literal text today. Comparing the reference's end offset with
 * its last path part's end offset detects all three without needing the source string.
 *
 * `"unknown"` means the reason cannot be told for want of position data, which the
 * grammar always supplies; the caller then declines the brackets without reporting a
 * reason it does not have.
 */
function whatClosedThePath(
    reference: DastMacro | DastFunctionMacro,
):
    | "braces"
    | "parens"
    | "parensFunction"
    | "arguments"
    | "unknown"
    | undefined {
    const lastPart = reference.path[reference.path.length - 1] as
        DastMacroPathPart | undefined;
    const referenceEnd = reference.position?.end?.offset;
    const partEnd = lastPart?.position?.end?.offset;
    if (referenceEnd == null || partEnd == null) {
        return "unknown";
    }
    if (referenceEnd === partEnd) {
        return undefined;
    }
    if (reference.type === "function" && reference.input != null) {
        // `$$f(1)`. The argument list is what runs past the path. Writing the
        // index inside the parentheses would make it one more argument, and
        // writing it before them — `$$f[2](1)` — picks which function is called
        // rather than part of what the call returns, so neither is the index the
        // author wrote. See `indexWarning` for what the message offers instead.
        // (Before the arguments *is* a working place for an index; it just
        // answers a different question from the one these brackets ask.)
        return "arguments";
    }
    // What is left is a parenthesized path or a brace block, told apart by where the
    // path starts: `$(x)` and `$$(f)` write the path inside parens, so it begins one
    // character further in than the bare `$x` that a `{…}` block follows.
    const referenceStart = reference.position?.start?.offset;
    const firstStart = reference.path[0]?.position?.start?.offset;
    const sigilLength = reference.type === "function" ? 2 : 1;
    if (
        referenceStart == null ||
        firstStart == null ||
        firstStart > referenceStart + sigilLength
    ) {
        return reference.type === "function" ? "parensFunction" : "parens";
    }
    // `$x{…}`. The grammar still parses a brace block, but v0.7 gives it no
    // meaning — `set_ref` in the Rust flattener drops a reference's attributes
    // outright, so `$x{link="false"}` renders exactly as `$x` — which makes the
    // braces the only thing standing between this reference and its index.
    return "braces";
}

/**
 * Move a bracket group onto the reference's last path part as an index.
 */
/**
 * Carry the reference's path past the index that was just attached.
 *
 * `$a[<n/>].x` reaches this pass as `$a`, `[`, the element, `]`, `.x` — the
 * macro parser never saw `.x` next to a path, because the element split the text
 * before it ran. So the text after the `]` is parsed here with the grammar's
 * `MacroTail` entry point, which claims as much as a path could have and reports
 * the rest.
 *
 * Only *text* siblings are joined, and only consecutive ones. They are contiguous
 * in the source — the sole split so far was on brackets — and stopping at the
 * first non-text node is what leaves `$a[<n/>][<m/>]` to the caller's loop: the
 * tail sees only `[`, claims nothing, and the element index is taken as usual.
 *
 * Returns whether anything was claimed. **Mutates `nodes`**, replacing the text it
 * consumed with what is left over, re-split on brackets so the caller's
 * `isOpenBracket` test still works.
 */
function graftTail(
    nodes: DastRootContent[],
    startIdx: number,
    reference: DastMacro | DastFunctionMacro,
    offsetMap: OffsetToPositionMap,
): boolean {
    let endIdx = startIdx;
    while (nodes[endIdx]?.type === "text") {
        endIdx++;
    }
    if (endIdx === startIdx) {
        return false;
    }
    const run = nodes.slice(startIdx, endIdx) as DastText[];
    const first = run[0];
    const last = run[run.length - 1];
    if (!first.position || !last.position) {
        return false;
    }
    const joined = run.map((n) => n.value).join("");

    const tail = parseMacroTail(joined);

    // A function reference cannot carry a `{…}` block: `FunctionMacro` has no
    // `PropAttrs`, so `$$f[1]{z}` leaves the braces as text. Stopping at
    // `attrsOffset` makes `$$f[<n/>]{z}` do the same, while still keeping any
    // path parts written before them.
    const takesAttributes = reference.type === "macro";
    const attrs = takesAttributes ? tail.attrs : null;
    const consumed = takesAttributes
        ? joined.length - tail.remainder.length
        : tail.attrsOffset;
    if (consumed === 0) {
        return false;
    }

    // Everything `MacroTail` built is positioned relative to `joined`; shift it
    // to where that text actually sits. `updateNodePositionData` is the same
    // helper `reprocessTextForMacros` uses for the whole-text parse.
    const claimed: unknown[] = [
        ...tail.index,
        ...tail.parts,
        ...(attrs ? Object.values(attrs) : []),
    ];
    for (const node of findNodesWithPositionInfo(claimed as any)) {
        updateNodePositionData(node, first, offsetMap);
    }

    const lastPart = reference.path[reference.path.length - 1];
    lastPart.index.push(...(tail.index as (typeof lastPart.index)[number][]));
    if (tail.index.length > 0 && lastPart.position) {
        // The path part grew: `$a[<n/>][1]` is one part carrying two indices.
        const grownTo = lastPart.index[lastPart.index.length - 1].position?.end;
        if (grownTo) {
            lastPart.position.end = {
                ...grownTo,
            } as typeof lastPart.position.end;
        }
    }
    reference.path.push(...(tail.parts as unknown as DastMacroPathPart[]));
    if (attrs && reference.type === "macro") {
        reference.attributes = {
            ...reference.attributes,
            ...(attrs as unknown as typeof reference.attributes),
        };
    }

    // The reference now runs to the end of what was claimed — past a `{…}` block
    // too, which is not part of the path but is part of the reference. That is
    // what lets `whatClosedThePath` go on telling `$a[<n/>]{z}[<m/>]` from
    // `$a[<n/>][<m/>]`.
    if (reference.position) {
        reference.position.end = pointAt(
            first,
            consumed,
            offsetMap,
        ) as typeof reference.position.end;
    }

    const leftover = joined.slice(consumed);
    const replacement: DastText[] = leftover
        ? splitTextAtSpecialChars(
              {
                  type: "text",
                  value: leftover,
                  position: {
                      start: pointAt(first, consumed, offsetMap),
                      end: { ...last.position.end },
                  },
              } as DastText,
              /[\[\]]/,
          )
        : [];
    nodes.splice(startIdx, endIdx - startIdx, ...replacement);
    return true;
}

/**
 * The document position `relativeOffset` characters into `textNode`'s value.
 */
function pointAt(
    textNode: DastText,
    relativeOffset: number,
    offsetMap: OffsetToPositionMap,
) {
    const offset = (textNode.position?.start.offset ?? 0) + relativeOffset;
    return {
        offset,
        line: offsetMap.rowMap[offset] + 1,
        column: offsetMap.columnMap[offset] + 1,
    };
}

function attachIndex(
    reference: DastMacro | DastFunctionMacro,
    group: BracketGroup,
    offsetMap: OffsetToPositionMap,
): DastError[] {
    const lastPart = reference.path[reference.path.length - 1];

    // A comment written between the brackets is kept here and removed in
    // normalization instead, by `pluginRemoveCommentsInstructionsAndDocStrings`.
    // Dropping it at parse time would make the pretty-printer destructive: it
    // formats the parser's own output, so the author's comment would simply
    // disappear from their document, which is not what happens to a comment
    // anywhere else. Leaving it in means `index.value` carries it until
    // normalization, which is why the type admits one.
    const content = group.content;

    // The group may hold references and function references of its own, so it gets the
    // same two passes the top level gets.
    const processed = gobbleFunctionArguments(
        gobblePropIndices(content, offsetMap),
    ) as DastElementContent[];

    // Those passes can *produce* a warning — a reference inside the brackets whose
    // own index cannot be claimed, as in `$a[$(x)[<n/>]]`. The guard above only
    // sees errors the parser had already left in the group, so a warning minted
    // here slips past it, and an index's value admits no error node: it reaches
    // Rust as a variant of `DastTextRefElementContent` that does not exist and
    // fails the whole document rather than reporting anything. Hand them back to
    // the caller, which puts them in the sibling array where an error belongs —
    // the index keeps its content and the author still gets told.
    const errors = processed.filter(
        (node): node is DastError => node.type === "error",
    );
    const value = trimWhitespace(
        processed.filter((node) => node.type !== "error"),
    ) as (DastText | DastMacro | DastFunctionMacro | DastElement)[];

    const start = lastPart.position?.end;
    const end = group.closeNode.position?.end;

    lastPart.index.push({
        type: "index",
        value,
        // The DAST `Point` makes `offset` optional where the grammar's own type
        // requires it; `gobbleFunctionArguments` casts for the same reason.
        ...(start && end
            ? { position: { start: { ...start }, end: { ...end } } as any }
            : {}),
    });

    // The reference now runs to the closing bracket. `sourceLocation.ts` in the
    // worker quotes a reference by spanning its path parts' positions, so the path
    // part has to grow too, not just the reference.
    if (end) {
        if (lastPart.position) {
            lastPart.position.end = { ...end } as typeof lastPart.position.end;
        }
        if (reference.position) {
            reference.position.end = {
                ...end,
            } as typeof reference.position.end;
        }
    }

    return errors;
}

/**
 * An element sits in brackets right after a reference, but the brackets cannot be
 * read as an index. Without this the element renders between literal brackets and
 * nothing says the index was dropped — the silence #1909 is about.
 */
function indexWarning(
    reference: DastMacro | DastFunctionMacro,
    openBracket: DastText,
    reason: "braces" | "parens" | "parensFunction" | "arguments" | "unclosed",
): DastError {
    // The sigil belongs to `name` because a function reference carries two of them:
    // quoting `$$f` as `$f` would name a component the author did not write.
    const name =
        (reference.type === "function" ? "$$" : "$") +
        reference.path.map((part) => part.name).join(".");
    // Each remedy has to work for the element the author actually wrote, which is
    // what makes the wording specific: an element written inside `$(…)` is not
    // read there either, so the `parens` remedy has to name it first, and an
    // element index written before a function reference's arguments does not
    // work at all.
    const remedy = {
        braces: "`{…}` is not part of a reference, so `[…]` written after it is ordinary text. Remove the `{…}`.",
        parens: "`$(…)` ends a reference, so `[…]` written after it is ordinary text. Give the element a name and write the index inside the parentheses, as `$(x[$idx])`.",
        parensFunction:
            "`$$(…)` ends a function reference, so `[…]` written after it is ordinary text. Give the element a name and write the index inside the parentheses, as `$$(f[$idx])`.",
        arguments:
            "A function reference's arguments end it, so `[…]` written after them is ordinary text. An index written before the arguments would pick which function to call rather than part of what it returns; to index the result, give the result a name and index that.",
        unclosed: "Its `[` is never closed.",
    }[reason];

    return codedDastError({
        code: "doenet-w0162",
        message: `The element in brackets after \`${name}\` was not read as an index. ${remedy}`,
        args: { name, reason } as DiagnosticArgs,
        error_type: "warning",
        position:
            reference.position && openBracket.position
                ? {
                      start: { ...reference.position.start },
                      end: { ...openBracket.position.end },
                  }
                : undefined,
    });
}

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
import { mergeAdjacentTextInArray } from "../dast-to-xml/utils";
import {
    gobbleFunctionArguments,
    splitTextAtSpecialChars,
    trimWhitespace,
} from "./gobble-function-arguments";

/**
 * An index can be written with an element in it — `$myList[<indexOf …/>]` — but the
 * macro parser can never see one, for the same reason it cannot see a function
 * macro's element arguments.
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
export function gobblePropIndices(nodes: DastRootContent[]): DastRootContent[] {
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
                break;
            }
            if (node.type === "function" && isCallFollowing(split, group)) {
                // `$$f[<n/>](y)`. The grammar takes this — an index on a function
                // reference picks which function to call, and `$$f[1](y)` parses —
                // but the worker cannot build a *component-valued* index on a
                // reference that is then called: it emits the index component
                // twice and throws `Found a duplicate componentIdx`, which blanks
                // the page. That failure is not ours (`$$f[$k](3)` throws it with
                // an ordinary reference index too) but claiming these brackets
                // would newly route an author into it, where before they rendered
                // as harmless literal text. So leave them literal and say why.
                ret.push(
                    indexWarning(node, split[i + 1] as DastText, "called"),
                );
                break;
            }
            const closedBy = whatClosedThePath(node);
            if (closedBy) {
                if (closedBy !== "unknown") {
                    ret.push(
                        indexWarning(node, split[i + 1] as DastText, closedBy),
                    );
                }
                break;
            }

            attachIndex(node, group);
            i = group.closeIdx;
        }
    }

    return mergeAdjacentTextInArray(ret as any) as DastRootContent[];
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
 * Whether an argument list opens immediately after this bracket group, which makes
 * the reference a *called* function reference.
 *
 * The grammar puts a function reference's index before its arguments
 * (`FunctionMacro = "$$" path input?`, and `PropIndex` sits inside the path), and
 * `gobbleFunctionArguments` likewise only takes an argument list that is an
 * immediate sibling — so requiring the `(` to sit directly after the `]` matches
 * what both of them would do with it.
 */
function isCallFollowing(
    nodes: DastRootContent[],
    group: BracketGroup,
): boolean {
    const next = nodes[group.closeIdx + 1];
    return next?.type === "text" && next.value.startsWith("(");
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
    macro: DastMacro | DastFunctionMacro,
): "braces" | "parens" | "arguments" | "unknown" | undefined {
    const lastPart = macro.path[macro.path.length - 1] as
        DastMacroPathPart | undefined;
    const macroEnd = macro.position?.end?.offset;
    const partEnd = lastPart?.position?.end?.offset;
    if (macroEnd == null || partEnd == null) {
        return "unknown";
    }
    if (macroEnd === partEnd) {
        return undefined;
    }
    if (macro.type === "function" && macro.input != null) {
        // `$$f(1)`. The argument list is what runs past the path. Writing the
        // index inside the parentheses would make it one more argument, and
        // writing it before them — `$$f[2](1)` — picks which function is called
        // rather than part of what the call returns, so neither is the index the
        // author wrote. See `indexWarning` for what the message offers instead.
        return "arguments";
    }
    // What is left is a parenthesized path or a brace block, told apart by where the
    // path starts: `$(x)` and `$$(f)` write the path inside parens, so it begins one
    // character further in than the bare `$x` that a `{…}` block follows.
    const macroStart = macro.position?.start?.offset;
    const firstStart = macro.path[0]?.position?.start?.offset;
    const sigilLength = macro.type === "function" ? 2 : 1;
    if (
        macroStart == null ||
        firstStart == null ||
        firstStart > macroStart + sigilLength
    ) {
        return "parens";
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
function attachIndex(
    macro: DastMacro | DastFunctionMacro,
    group: BracketGroup,
): void {
    const lastPart = macro.path[macro.path.length - 1];

    // Comments, XML instructions and doctypes are dropped here, which is the only
    // place they can be. `pluginRemoveCommentsInstructionsAndDocStrings` reaches
    // them only in a `children` array, and an index's contents are not children of
    // anything — so a comment left in the group would survive into `index.value`,
    // a node type that field does not admit, and would turn a working
    // `$myList[<number>2</number>]` into an unresolvable mixed-content index.
    // Adjacent text is merged again so that the whitespace either side of a
    // dropped comment trims as the single run of whitespace it reads as.
    const content = mergeAdjacentTextInArray(
        group.content.filter(
            (node) =>
                node.type !== "comment" &&
                node.type !== "instruction" &&
                node.type !== "doctype",
        ) as any,
    ) as DastRootContent[];

    // The group may hold references and function macros of its own, so it gets the
    // same two passes the top level gets.
    const value = trimWhitespace(
        gobbleFunctionArguments(
            gobblePropIndices(content),
        ) as DastElementContent[],
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
    // part has to grow too, not just the macro.
    if (end) {
        if (lastPart.position) {
            lastPart.position.end = { ...end } as typeof lastPart.position.end;
        }
        if (macro.position) {
            macro.position.end = { ...end } as typeof macro.position.end;
        }
    }
}

/**
 * An element sits in brackets right after a reference, but the brackets cannot be
 * read as an index. Without this the element renders between literal brackets and
 * nothing says the index was dropped — the silence #1909 is about.
 */
function indexWarning(
    macro: DastMacro | DastFunctionMacro,
    openBracket: DastText,
    reason: "braces" | "parens" | "arguments" | "called" | "unclosed",
): DastError {
    // The sigil belongs to `name` because a function macro carries two of them:
    // quoting `$$f` as `$f` would name a component the author did not write.
    const name =
        (macro.type === "function" ? "$$" : "$") +
        macro.path.map((part) => part.name).join(".");
    // Each remedy has to work for the element the author actually wrote, which is
    // what makes the wording specific: an element written inside `$(…)` is not
    // read there either, so the `parens` remedy has to name it first, and an
    // element index written before a function reference's arguments does not
    // work at all.
    const remedy = {
        braces: "`{…}` is not part of a reference, so `[…]` written after it is ordinary text. Remove the `{…}`.",
        parens: "`$(…)` ends a reference, so `[…]` written after it is ordinary text. Give the element a name and write the index inside the parentheses, as `$(x[$idx])`.",
        arguments:
            "A function reference's arguments end it, so `[…]` written after them is ordinary text. An index written before the arguments would pick which function to call rather than part of what it returns; to index the result, give the result a name and index that.",
        called: "An index before a function reference's arguments picks which function to call, and a computed one there is not supported. To index what the call returns, give the result a name and index that.",
        unclosed: "Its `[` is never closed.",
    }[reason];

    return codedDastError({
        code: "doenet-w0162",
        message: `The element in brackets after \`${name}\` was not read as an index. ${remedy}`,
        args: { name, reason } as DiagnosticArgs,
        error_type: "warning",
        position:
            macro.position && openBracket.position
                ? {
                      start: { ...macro.position.start },
                      end: { ...openBracket.position.end },
                  }
                : undefined,
    });
}

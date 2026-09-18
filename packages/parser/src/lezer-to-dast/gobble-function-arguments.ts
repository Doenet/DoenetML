import {
    DastElementContent,
    DastFunctionMacro,
    DastNodes,
    DastRootContent,
    DastText,
} from "../types";
import { createOffsetToPositionMap } from "./lezer-to-dast-utils";

/**
 * Functions can take arguments consisting of DastNodes. The macro parser works on strings only,
 * so functions that take DastElement children will not be fully parsed. We manually parse through
 * and attach the arguments in this special case.
 *
 * **Note**: this function may mutate the input.
 */
export function gobbleFunctionArguments(
    nodes: DastRootContent[],
): DastRootContent[] {
    if (!nodes.some((node) => node.type === "function" && node.input == null)) {
        return nodes;
    }
    // To make things easy for ourselves, we will split all special characters into their own text nodes.
    // This means the resulting tree will have adjacent text nodes, but those can be cleaned up later.
    nodes = nodes
        .map((node) =>
            node.type === "text" ? splitTextAtSpecialChars(node) : node,
        )
        .flat();

    const ret: DastRootContent[] = [];
    let functionNode: DastFunctionMacro | null = null;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.type === "function" && node.input == null) {
            functionNode = node;
            ret.push(node);
            continue;
        }
        if (!functionNode) {
            ret.push(node);
            continue;
        }
        // If we made it here, there is a function node and we're looking for its
        // opening/closing paren.
        if (node.type === "error" && node.error_type === "warning") {
            // `gobblePropIndices` mints a warning about an index's own contents
            // into the sibling array — an index's `value` admits no error node —
            // and that puts it between the reference and its argument list. Left
            // to stand, it made the argument list stop being one: the author was
            // told the index was bad and the `(3)` of `$$F[$(x)[<n/>]](3)` simply
            // appeared as text, with nothing said about the call. Step over it.
            //
            // Only a *warning*, which is an annotation beside content the pass
            // decided to leave as it found it. A plain `error` node is markup
            // that did not parse, and stepping over one would let a stray `</q>`
            // in `$$f</q>(3)` silently turn an uncalled reference into a call —
            // a structural change to the tree the worker builds from, made as a
            // side effect of a fix about warnings. At this point in the pipeline
            // `error_type: "warning"` is exactly this pass's own `doenet-w0162`:
            // every error `createErrorNode` makes from the grammar leaves
            // `error_type` unset, and the other warning-minting passes all run
            // later, in `dast-normalize`.
            //
            // This does not resurrect a call that a *declined* index killed
            // legitimately. In `$$(f)[<n/>](y)` the brackets stay in the sibling
            // array as literal text, so what follows the warning is `[`, not `(`,
            // and the guard below declines exactly as it did before.
            ret.push(node);
            continue;
        }
        if (
            !(node.type === "text" && node.value === "(") ||
            findMatchingCloseParen(nodes, i) < 0
        ) {
            // No opening paren, or none that closes again at this depth, so this
            // function node cannot have arguments.
            functionNode = null;
            ret.push(node);
            continue;
        }
        // We have an open paren as the first character and a closing paren somewhere. Now we need to find them and gobble the arguments.
        let currentFunctionArg: DastRootContent[] = [];
        functionNode.input = [];
        let parenDepth = 1;
        // At index `i` is a text node containing "(". Advance one so we can eat the arguments.
        i++;
        while (functionNode) {
            const nextNode = nodes[i];
            if (!nextNode) {
                // Unreachable: the guard above only lets us in when
                // `findMatchingCloseParen` has already found the `)` that closes
                // this depth, and the loop below stops there. Kept as an
                // invariant rather than deleted, since running off the end is
                // what used to take the whole document down.
                throw new Error(
                    "Ran out of nodes looking for a function reference's closing paren",
                );
            }
            if (nextNode.type !== "text") {
                currentFunctionArg.push(nextNode);
                i++;
                continue;
            }
            if (nextNode.value === "(") {
                parenDepth++;
            }
            // Commas separate arguments, but they may appear inside of balanced parenthesis. E.g. `$$f( (a,b) )`
            // is a function with exactly one argument of `(a,b)`.
            if (nextNode.value === "," && parenDepth <= 1) {
                // Recursed like the closing-paren branch below. Without it only
                // the *last* argument got this treatment, so a nested call whose
                // own arguments hold an element — the one shape that needs this
                // pass rather than the grammar — stayed uncalled anywhere but
                // last: `$$g($$f(<n/>), 1)` left `$$f` a bare reference
                // followed by literal text, where `$$g(1, $$f(<n/>))` called it.
                functionNode.input!.push(
                    trimWhitespace(
                        gobbleFunctionArguments(
                            currentFunctionArg,
                        ) as DastElementContent[],
                    ),
                );
                currentFunctionArg = [];
                i++;
                continue;
            }
            if (nextNode.value === ")") {
                parenDepth--;
                if (parenDepth === 0) {
                    functionNode.input!.push(
                        trimWhitespace(
                            gobbleFunctionArguments(
                                currentFunctionArg,
                            ) as DastElementContent[],
                        ),
                    );
                    currentFunctionArg = [];
                    // We found the closing `)`. This should mark the position
                    // of the end of the function macro.
                    if (nextNode.position) {
                        functionNode.position.end = {
                            ...nextNode.position.end,
                        } as any;
                    }
                    functionNode = null;
                    i++;
                    continue;
                }
            }
            i++;
            currentFunctionArg.push(nextNode);
        }
        // We've found a closing paren, so walk back one step.
        i--;
    }

    return ret;
}

/**
 * Split the text node at each of `specialChars`, which defaults to `(`, `)`,
 * and `,`.
 *
 * `gobblePropIndices` passes `/[\[\]]/` to get the same treatment for brackets.
 *
 * The pieces always end where `node` ended, so merging them back gives the node
 * it started from. That is not automatic: `splitTextNodeAt` works out every
 * boundary but the last by counting characters of `value`, which is one short
 * per character reference — `&amp;` is five characters of source and one of
 * value. Only the final piece carries the real end, and when the text ends on a
 * special character that piece is empty and filtered away, taking the end with
 * it. `gobblePropIndices` splits text that an earlier pass of its own already
 * merged, so it is the one that meets this: a node holding `&amp;` and ending
 * in `]` came back four characters short, stopping inside the entity.
 */
export function splitTextAtSpecialChars(
    node: DastText,
    specialChars: RegExp = /[\(\),]/,
): DastText[] {
    if (node.value.search(specialChars) < 0) {
        return [node];
    }
    // A loop, not the recursion this was: one frame per special character
    // overflowed the stack on a long enough run of them, and the throw took
    // the whole document with it. The arithmetic stays in `splitTextNodeAt`,
    // which works from each remaining piece's own start, so walking the
    // remainder is the same computation the recursion did.
    const pieces: DastText[] = [];
    let remaining = node;
    while (true) {
        const pos = remaining.value.search(specialChars);
        if (pos < 0) {
            pieces.push(remaining);
            break;
        }
        const [left, middle, right] = splitTextNodeAt(remaining, pos);
        pieces.push(left, middle);
        remaining = right;
    }

    const kept = pieces.filter((piece) => piece.value !== "");
    const last = kept[kept.length - 1];
    if (last?.position && node.position) {
        last.position.end = { ...node.position.end };
    }
    return kept;
}

const DEFAULT_POSITION = {
    start: { offset: 0, line: 1, column: 1 },
    end: { offset: 0, line: 1, column: 1 },
};
/**
 * Split the text node at the given position. Returns [left, middle, right].
 */
export function splitTextNodeAt(
    node: DastText,
    pos: number,
): [DastText, DastText, DastText] {
    const { value, position = DEFAULT_POSITION } = node;
    if (pos < 0 || pos > value.length) {
        throw new Error(
            `Cannot split a string at a value larger than its length (got pos:${pos} for text node "${value}")`,
        );
    }
    const { rowMap, columnMap } = createOffsetToPositionMap(value);

    // `rowMap`/`columnMap` are relative to this node's own text. A column only
    // continues the node's start column while we are still on the row it began
    // on; once a newline has been crossed the column restarts from 1, and adding
    // the node's start column again puts it that many characters too far right.
    const columnAt = (i: number) =>
        rowMap[i] === 0
            ? columnMap[i] + position.start.column
            : columnMap[i] + 1;

    const leftValue = value.slice(0, pos);
    const left: DastText = {
        type: "text",
        value: leftValue,
        position: {
            start: { ...position.start },
            end: {
                offset: (position.start.offset || 0) + leftValue.length,
                line: rowMap[pos] + position.start.line,
                column: columnAt(pos),
            },
        },
    };
    const middleValue = value.slice(pos, pos + 1);
    const middle: DastText = {
        type: "text",
        value: middleValue,
        position: {
            start: {
                offset: (position.start.offset || 0) + pos,
                line: rowMap[pos] + position.start.line,
                column: columnAt(pos),
            },
            end: {
                offset: (position.start.offset || 0) + pos + 1,
                line: rowMap[pos + 1] + position.start.line,
                column: columnAt(pos + 1),
            },
        },
    };

    const rightValue = value.slice(pos + 1);
    const right: DastText = {
        type: "text",
        value: rightValue,
        position: {
            end: { ...position.end },
            start: {
                offset: (position.start.offset || 0) + pos + 1,
                line: rowMap[pos + 1] + position.start.line,
                column: columnAt(pos + 1),
            },
        },
    };

    return [left, middle, right];
}

/**
 * The index of the `)` that closes the `(` at `openIdx`, or `-1` if the text runs
 * out first.
 *
 * Depth matters. A plain search for a `)` anywhere in the remaining siblings answers
 * "yes" on the strength of one an inner call has already claimed, so `$$g($$f(<n/>)`
 * — a document an author passes through while typing `$$g($$f(<n/>), 2)` — committed
 * the outer reference to being a call and then ran off the end of the array looking
 * for a paren that was never there. Counting depth the way the gobbling loop below
 * counts it means the two agree on which `)` belongs to whom.
 *
 * Only sibling text nodes count, and by the time we get here each holds a single
 * special character. Parens written inside an element are that element's own
 * children, and parens belonging to an already-gobbled call live in its `input`;
 * neither reaches this array.
 */
function findMatchingCloseParen(nodes: DastNodes[], openIdx: number): number {
    let depth = 1;
    for (let i = openIdx + 1; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.type !== "text") {
            continue;
        }
        if (node.value === "(") {
            depth++;
        } else if (node.value === ")") {
            depth--;
            if (depth === 0) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * Trim any leading or trailing whitespace.
 */
export function trimWhitespace<T extends DastNodes>(nodes: T[]): T[] {
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];

    if (!firstNode || !lastNode) {
        return nodes;
    }
    if (firstNode.type === "text") {
        firstNode.value = firstNode.value.trimStart();
        if (firstNode.value === "") {
            nodes.shift();
        }
    }
    if (lastNode.type === "text") {
        lastNode.value = lastNode.value.trimEnd();
        if (lastNode.value === "") {
            nodes.pop();
        }
    }
    return nodes;
}

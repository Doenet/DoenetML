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
        if (
            !(node.type === "text" && node.value === "(") ||
            !hasClosingParen(nodes.slice(i))
        ) {
            // No opening paren, so this function node cannot have arguments
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
                throw new Error(
                    "Failed to find next node when search for function arguments",
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
    const pos = node.value.search(specialChars);
    if (pos < 0) {
        return [node];
    }
    const [left, middle, right] = splitTextNodeAt(node, pos);
    const ret = [left, middle, ...splitTextAtSpecialChars(right, specialChars)];

    const kept = ret.filter((node) => node.value !== "");
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

function hasClosingParen(nodes: DastNodes[]): boolean {
    return nodes.some(
        (node) => node.type === "text" && node.value.includes(")"),
    );
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

import {
    DastElement,
    DastElementContent,
    DastFunctionMacro,
    DastMacro,
    DastText,
    Point,
} from "../../../types";

/**
 * Break all `children` into groups separated by any spaces inside text nodes
 * that are not inside parentheses and wrap them with a new component of type `componentType`.
 *
 * Do nothing if any `children` are not a text node or a reference (macro or function) node.
 * Also do nothing if there are mismatched parentheses.
 *
 * For example, if `children` is parsed from `"a $b $$f(x) (c - $d) e$g"`,
 * then the `children` array will have seven components:\
 * `["a ", $b, " ", $$f(x), " (c - ", $d, ") e", $g]`.\
 * The children will then be grouped into five groups `[[$a], [$b], [$$f(x)], ["(c - ", $d, ")"], ["e", "$g"]]`
 * and each of those groups will become the children of a new child of type `componentType`.
 *
 * If `wrapSingleNonTextNodes` is `false` and a group is a single reference node such as `[$a]`,
 * then node is returned without wrapping it in a parent of type `componentType`.
 *
 * Returns:
 * - `success`: `true` if the `children` were successfully broken into groups.
 *   `success` will be `false` if there is a child that is not a text node or a reference node
 *   or if there are mismatched parentheses.
 * - `newChildren`: if `success`, then `newChildren` is the array of new children.
 */
export function groupTextAndReferencesBySpacesOutsideParens({
    children,
    componentType,
    wrapSingleNonTextNodes = true,
}: {
    children: DastElementContent[];
    componentType: string;
    wrapSingleNonTextNodes?: boolean;
}):
    | { success: false }
    | {
          success: true;
          newChildren: (
              | DastText
              | DastMacro
              | DastFunctionMacro
              | DastElement
          )[];
      } {
    // Only apply transformation if all children are text or references
    for (const child of children) {
        if (!["text", "macro", "function"].includes(child.type)) {
            return { success: false };
        }
    }

    const newChildren: (
        | DastText
        | DastMacro
        | DastFunctionMacro
        | DastElement
    )[] = [];
    let currentGroup: (
        | DastText
        | DastMacro
        | DastFunctionMacro
        | DastElement
    )[] = [];

    let nParens = 0;

    for (const child of children) {
        switch (child.type) {
            case "macro":
            case "function":
                // If child is a reference, add it to the current group.
                currentGroup.push(child);
                continue;
            case "text":
                const splitNodes = splitAtParensOrSpace(child);

                let currentText = "";
                let currentTextStartPos = splitNodes[0]?.position?.start;

                for (const node of splitNodes) {
                    if (node.value === "(") {
                        currentText += node.value;
                        nParens++;
                    } else if (node.value === ")") {
                        if (nParens === 0) {
                            // We have an unmatched closing parenthesis, so give up.
                            // TODO: issue a warning?
                            return { success: false };
                        } else {
                            currentText += node.value;
                            nParens--;
                        }
                    } else if (nParens === 0 && node.value.match(/\s/)) {
                        // We found a space outside parens, so we will create a new child from
                        // the current group and any extra text before the space.

                        if (currentText.length > 0) {
                            // Add any text before the space.
                            currentGroup.push(
                                createNewTextNode(
                                    currentText,
                                    currentTextStartPos,
                                ),
                            );
                        }

                        // Create the new child from all new components found up to the space.
                        if (currentGroup.length > 0) {
                            newChildren.push(
                                createElementFromChildren(
                                    componentType,
                                    currentGroup,
                                    wrapSingleNonTextNodes,
                                ),
                            );

                            currentGroup = [];
                        }

                        currentText = "";
                        currentTextStartPos = node.position?.end;
                    } else {
                        currentText += node.value;
                    }
                }

                // We've reached the end of the string.
                // Add any remaining substring to the current group.
                if (currentText.length > 0) {
                    currentGroup.push(
                        createNewTextNode(currentText, currentTextStartPos),
                    );
                }

                break;

            default:
                throw Error("Unreachable");
        }
    }

    if (nParens > 0) {
        // We have an unmatched opening parenthesis, so give up.
        // TODO: issue a warning?
        return { success: false };
    }

    // Any remaining components become the last child.
    if (currentGroup.length > 0) {
        newChildren.push(
            createElementFromChildren(
                componentType,
                currentGroup,
                wrapSingleNonTextNodes,
            ),
        );
    }

    return { success: true, newChildren };
}

/**
 * Create a new dast element with `name` and `children`.
 *
 * If `wrapSingleNonTextNodes` is `true` and `children` is a single node that isn't a text node,
 * then return that node without wrapping it as a child of an element with `name`.
 */
function createElementFromChildren(
    name: string,
    children: (DastText | DastMacro | DastFunctionMacro | DastElement)[],
    wrapSingleNonTextNodes: boolean,
) {
    if (
        !wrapSingleNonTextNodes &&
        children.length === 1 &&
        children[0].type !== "text"
    ) {
        return children[0];
    }

    const newChild: DastElement = {
        type: "element",
        name,
        children,
        attributes: {},
    };

    const startPos = children[0].position?.start;
    const endPos = children[children.length - 1].position?.end;

    if (startPos && endPos) {
        newChild.position = {
            start: startPos,
            end: endPos,
        };
    }
    return newChild;
}

/**
 * Create a text node with value `text` and starting position `startPos`.
 */
function createNewTextNode(text: string, startPos?: Point) {
    const newNode: DastText = {
        type: "text",
        value: text,
    };

    if (startPos) {
        newNode.position = {
            start: startPos,
            end: computeEndPosition(text, startPos),
        };
    }
    return newNode;
}

/**
 * Split a text node based on `(`, `)`, and `\s+`. The
 * parens and spaces are kept in the output.
 */
function splitAtParensOrSpace(node: DastText) {
    // Split up the text node and calculate the positions of the returned elements

    let startPos = node.position!.start;

    const splitText: DastText[] = [];

    for (const match of node.value.matchAll(/([()]|\s+|[^()\s]+)/g)) {
        const newNode: DastText = { type: "text", value: match[0] };
        if (startPos) {
            newNode.position = {
                start: startPos,
                end: computeEndPosition(match[0], startPos),
            };
            startPos = newNode.position.end;
        }
        splitText.push(newNode);
    }

    return splitText;
}

/**
 * Compute the end position for `text` given that its start position is `startPos`
 */
function computeEndPosition(text: string, startPos: Point) {
    const byLines = text.split("\n");
    const endPos: Point = {
        line: startPos.line + byLines.length - 1,
        column: startPos.column + byLines[byLines.length - 1].length,
    };
    if (startPos.offset != undefined) {
        endPos.offset = startPos.offset + text.length;
    }

    return endPos;
}

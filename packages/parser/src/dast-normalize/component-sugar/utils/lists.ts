import { splitListItems } from "../../../list-separation";
import { codedDastError } from "../../../coded-dast-error";
import {
    DastElement,
    DastError,
    DastElementContent,
    DastFunctionMacro,
    DastMacro,
    DastText,
    Point,
} from "../../../types";

/**
 * Break `children`, a list written as text and references, into its entries
 * by the one rule for lists (`splitListItems`, Doenet/DoenetML#2492): commas
 * if the text has a comma outside brackets, spaces otherwise, with what is
 * inside balanced brackets kept together. Each entry is wrapped in a new
 * element of type `componentType`; an empty entry (`a,,b`) is an empty one.
 *
 * For example, if `children` is parsed from `"a $b $$f(x) (c - $d) e$g"`,
 * then the `children` array will have seven components:\
 * `["a ", $b, " ", $$f(x), " (c - ", $d, ") e", $g]`.\
 * The children will then be grouped into five groups `[[$a], [$b], [$$f(x)], ["(c - ", $d, ")"], ["e", "$g"]]`
 * and each of those groups will become the children of a new child of type `componentType`.
 * Written `"a, $b + 1, (c - $d)"`, they are grouped into three:
 * `[["a"], [$b, " + 1"], ["(c - ", $d, ")"]]`.
 *
 * If `wrapSingleNonTextNodes` is `false` and a group is a single reference node such as `[$a]`,
 * then node is returned without wrapping it in a parent of type `componentType`.
 *
 * Returns:
 * - `success`: `true` if the `children` were successfully broken into groups.
 *   `success` will be `false` if there is a child that is not a text node or
 *   a reference node.
 * - `newChildren`: if `success`, then `newChildren` is the array of new children.
 * - `unmatchedBrackets`: if `success`, whether the brackets of the text
 *   didn't balance, so were ignored, which the caller reports
 *   (`listBracketsUnmatchedError`).
 */
export function groupTextAndReferencesIntoListEntries({
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
              DastText | DastMacro | DastFunctionMacro | DastElement
          )[];
          unmatchedBrackets: boolean;
      } {
    // Only apply transformation if all children are text or references
    const items: (string | DastMacro | DastFunctionMacro)[] = [];
    for (const child of children) {
        if (child.type === "text") {
            items.push(child.value);
        } else if (child.type === "macro" || child.type === "function") {
            items.push(child);
        } else {
            return { success: false };
        }
    }

    const { entries, unmatchedBrackets } = splitListItems(items);

    const sourceDoc = children.find(
        (child) => child.source_doc !== undefined,
    )?.source_doc;

    const newChildren: (
        DastText | DastMacro | DastFunctionMacro | DastElement
    )[] = entries.map((parts) => {
        const group = parts.map((part) => {
            const child = children[part.item];
            if (part.start === undefined) {
                return child as DastMacro | DastFunctionMacro;
            }
            const textNode = child as DastText;
            const text = textNode.value.slice(part.start, part.end);
            const nodeStart = textNode.position?.start;
            return createNewTextNode(
                text,
                nodeStart
                    ? part.start === 0
                        ? nodeStart
                        : computeEndPosition(
                              textNode.value.slice(0, part.start),
                              nodeStart,
                          )
                    : undefined,
                textNode.source_doc,
            );
        });
        return createElementFromChildren(
            componentType,
            group,
            wrapSingleNonTextNodes,
            sourceDoc,
        );
    });

    return { success: true, newChildren, unmatchedBrackets };
}

/**
 * The info that the brackets of the list written in `node` (a `<select>`,
 * or the `for` of a `<repeat>`, at `position`) don't balance, so were
 * ignored: the parser's copy of `list-brackets-unmatched`, which the worker
 * reports for the lists it splits. An info, since the DoenetML is valid and
 * often meant (`a) apple, b) banana`); it only explains how the list was read.
 */
export function listBracketsUnmatchedError(
    node: DastElement,
    position = node.position,
): DastError {
    return codedDastError({
        code: "doenet-i0058",
        error_type: "info",
        message: `The brackets in the list of \`<${node.name}>\` don't all match, so they are ignored: the commas or spaces inside them separate entries like any others. To keep one inside an entry, balance the brackets, or, in a list written between tags, write its entries as children.`,
        args: { componentType: node.name },
        position,
        source_doc: node.source_doc,
    });
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
    source_doc?: number,
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
        source_doc,
    };

    const startPos = children[0]?.position?.start;
    const endPos = children[children.length - 1]?.position?.end;

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
function createNewTextNode(
    text: string,
    startPos?: Point,
    source_doc?: number,
) {
    const newNode: DastText = {
        type: "text",
        value: text,
        source_doc: source_doc,
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

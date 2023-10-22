import { Plugin } from "unified";
import { DastRoot } from "../../types";
import {
    BREAK_AROUND_ELEMENTS,
    PAR_ELEMENTS,
    PRE_ELEMENTS,
} from "./special-nodes";
import { replaceNode } from "./utils/replace-node";
import { isElement, isText } from "./utils/testers";

/**
 * Unifiedjs plugin that converts sequences of whitespace to a single space character.
 */
export const removeInternodeWhitespacePlugin: Plugin<
    void[],
    DastRoot,
    DastRoot
> = function () {
    return (root: DastRoot) => {
        replaceNode(root, (node, info) => {
            const parent = info.parents[0];
            if (
                !isText(node) ||
                node.value.trim().length > 0 ||
                node.value.endsWith("\n\n") ||
                node.value.startsWith("\n\n") ||
                PRE_ELEMENTS.has(parent?.name)
            ) {
                return;
            }
            const containingArray = info.containingArray;
            const index = info.index;
            if (!containingArray || index == null) {
                return;
            }
            // If we made it here, we are a pure whitespace node
            const prevNode = containingArray[index - 1];
            const nextNode = containingArray[index + 1];
            if (
                (isElement(prevNode) &&
                    (PAR_ELEMENTS.has(prevNode.name) ||
                        BREAK_AROUND_ELEMENTS.has(prevNode.name))) ||
                (isElement(nextNode) &&
                    (PAR_ELEMENTS.has(nextNode.name) ||
                        BREAK_AROUND_ELEMENTS.has(nextNode.name)))
            ) {
                // If we are between two paragraphs, we should be removed
                return null;
            }
        });
    };
};

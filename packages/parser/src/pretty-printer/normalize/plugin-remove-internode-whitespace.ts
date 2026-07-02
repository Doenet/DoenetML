import { Plugin } from "unified";
import { DastRoot } from "../../types";
import { isBlock } from "./layout-categories";
import { PRE_ELEMENTS } from "./special-nodes";
import { replaceNode } from "./utils/replace-node";
import { isElement, isText } from "./utils/testers";

/**
 * Unifiedjs plugin that drops pure-whitespace text nodes between two
 * block siblings. The printer emits its own hardlines between blocks, so
 * this whitespace would otherwise produce stray spaces in the output.
 *
 * Blank-line semantics aren't lost: `plugin-mark-blank-lines` runs first
 * and records a `prettyBlankLineBefore` marker on the next sibling for
 * any whitespace text node that contained a blank line. The whitespace
 * text node itself is then dropped here.
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
                (isElement(prevNode) && isBlock(prevNode.name)) ||
                (isElement(nextNode) && isBlock(nextNode.name))
            ) {
                // Whitespace between block siblings is redundant — the
                // printer will insert hardlines.
                return null;
            }
        });
    };
};

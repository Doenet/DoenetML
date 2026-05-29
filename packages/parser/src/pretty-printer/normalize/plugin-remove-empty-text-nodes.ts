import { Plugin } from "unified";
import { DastRoot } from "../../types";
import { replaceNode } from "./utils/replace-node";
import { isText } from "./utils/testers";

/**
 * Unifiedjs plugin that removes text nodes whose value is empty.
 */
export const removeEmptyTextNodesPlugin: Plugin<void[], DastRoot, DastRoot> =
    function () {
        return (root: DastRoot) => {
            replaceNode(root, (node) => {
                if (!isText(node)) {
                    return;
                }
                if (!node.value) {
                    return null;
                }
            });
        };
    };

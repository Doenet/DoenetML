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
export const removeEmptyTextNodesPlugin: Plugin<void[], DastRoot, DastRoot> =
    function () {
        return (root: DastRoot) => {
            replaceNode(root, (node, info) => {
                if (!isText(node)) {
                    return;
                }
                if (!node.value) {
                    return null;
                }
            });
        };
    };

import { Plugin } from "unified";
import { DastElement, DastNodes, DastRoot } from "../../types";
import { ALWAYS_BREAK_ELEMENTS, PAR_ELEMENTS } from "./special-nodes";
import { replaceNode } from "./utils/replace-node";
import { isElement } from "./utils/testers";
import { visit } from "./utils/visit";

/**
 * Unifiedjs plugin that trims whitespace at the start and end of applicable nodes.
 */
export const trimWhitespacePlugin: Plugin<void[], DastRoot, DastRoot> =
    function () {
        return (root: DastRoot) => {
            visit(root, (node, info) => {
                if (node.type !== "element" && node.type !== "root") {
                    return;
                }
                if (
                    isElement(node) &&
                    !(
                        PAR_ELEMENTS.has(node.name) ||
                        ALWAYS_BREAK_ELEMENTS.has(node.name)
                    )
                ) {
                    return;
                }
                // If we made it here, whitespace at the start and end of the node should be trimmed
                const firstChild = node.children[0];
                const lastChild = node.children[node.children.length - 1];
                if (firstChild?.type === "text") {
                    firstChild.value = firstChild.value.trimStart();
                }
                if (lastChild?.type === "text") {
                    lastChild.value = lastChild.value.trimEnd();
                }
            });
        };
    };

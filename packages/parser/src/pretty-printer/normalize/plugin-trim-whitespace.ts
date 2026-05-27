import { Plugin } from "unified";
import { DastRoot } from "../../types";
import { isBlock } from "./layout-categories";
import { INDENTABLE_PRE_ELEMENTS, PRE_ELEMENTS } from "./special-nodes";
import { visit } from "./utils/visit";

/**
 * Unifiedjs plugin that trims whitespace at the start and end of block
 * elements and the document root. Inline elements (`<em>`, `<m>`, ...)
 * and pre-formatted elements (`<pre>`, `<cline>`, ...) are left alone
 * so prose flow and verbatim layout survive normalization.
 */
export const trimWhitespacePlugin: Plugin<void[], DastRoot, DastRoot> =
    function () {
        return (root: DastRoot) => {
            visit(root, (node) => {
                if (node.type === "element") {
                    if (
                        !isBlock(node.name) ||
                        PRE_ELEMENTS.has(node.name) ||
                        INDENTABLE_PRE_ELEMENTS.has(node.name)
                    ) {
                        return;
                    }
                } else if (node.type !== "root") {
                    return;
                }
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

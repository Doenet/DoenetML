import { Plugin } from "unified";
import { DastRoot } from "../../types";
import { replaceNode } from "./utils/replace-node";

/**
 * Unifiedjs plugin that turns all `cdata` elements into text elements. Note: the resulting
 * tree may be incorrect because there might be adjacent text nodes after the comments have been removed.
 */
export const expandCdataPlugin: Plugin<void[], DastRoot, DastRoot> =
    function () {
        return (root: DastRoot) => {
            replaceNode(root, (node) => {
                if (Array.isArray(node)) {
                    return;
                }
                if (node.type === "cdata") {
                    return { type: "text", value: node.value };
                }
            });
        };
    };

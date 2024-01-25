import { Plugin } from "unified";
import { DastNodes, DastRoot } from "../../types";
import { replaceNode } from "./utils/replace-node";

/**
 * Unifiedjs plugin that merges any adjacent text nodes.
 */
export const mergeAdjacentTextPlugin: Plugin<void[], DastRoot, DastRoot> =
    function () {
        return (root: DastRoot) => {
            replaceNode(root, (node) => {
                if (!("children" in node)) {
                    return;
                }
                const children = node.children;
                let prevNode: DastNodes | null = null;
                let needsMerging = false;
                for (const n of children) {
                    if (
                        prevNode &&
                        prevNode.type === "text" &&
                        n.type === "text"
                    ) {
                        needsMerging = true;
                        break;
                    }
                    prevNode = n;
                }
                if (!needsMerging) {
                    return;
                }

                // Collapse any adjacent nodes
                prevNode = null;
                const newChildren: DastRoot["children"] = [];
                for (const n of children) {
                    if (!prevNode) {
                        newChildren.push(n);
                        prevNode = n;
                        continue;
                    }
                    if (prevNode.type === "text" && n.type === "text") {
                        prevNode.value += n.value;
                        continue;
                    }
                    newChildren.push(n);
                    prevNode = n;
                }
                node.children = newChildren;
                return node;
            });
        };
    };

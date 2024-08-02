import { visit } from "unist-util-visit";
import { Plugin } from "unified";

import { Root as MdastRoot } from "mdast";
import { MdxJsxFlowElement } from "./types";

/**
 * Wraps codeblocks of type `doenet-editor` with a JSX element that renders the output.
 */
export const wrapDoenetViewer: Plugin<void[], MdastRoot, MdastRoot> =
    function () {
        return (tree) => {
            visit(tree, (node) => {
                if (node?.type !== "code") {
                    return;
                }
                if (node.lang !== "doenet-viewer") {
                    return;
                }

                const newNode: MdxJsxFlowElement = {
                    type: "mdxJsxFlowElement",
                    name: "DoenetViewer",
                    attributes: [
                        {
                            type: "mdxJsxAttribute",
                            name: "source",
                            value: node.value,
                        },
                    ],
                    children: [],
                };

                // Override the original node with the new one.
                Object.assign(node, newNode);
            });
        };
    };

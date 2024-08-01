import { visit } from "unist-util-visit";
import { Plugin } from "unified";

import { Root as MdastRoot } from "mdast";
// Importing this automatically imports all the types from `mdast-util-mdx-jsx`.
import "mdast-util-mdx-jsx";

/**
 * Wraps codeblocks of type `doenet-editor` with a JSX element that renders the editor with the output.
 */
export const wrapDoenetEditor: Plugin<void[], MdastRoot, MdastRoot> =
    function () {
        return (tree) => {
            visit(tree, (node) => {
                type MdxJsxFlowElement = typeof node & {
                    type: "mdxJsxFlowElement";
                };
                if (node?.type !== "code") {
                    return;
                }
                if (node.lang !== "doenet-editor") {
                    return;
                }

                console.log(
                    "value for wrapped editor",
                    JSON.stringify(node.value),
                );

                const newNode: MdxJsxFlowElement = {
                    type: "mdxJsxFlowElement",
                    name: "DoenetEditor",
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

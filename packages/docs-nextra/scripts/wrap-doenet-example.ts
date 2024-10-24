import { visit } from "unist-util-visit";
import { Plugin } from "unified";

import { Root as MdastRoot } from "mdast";
import { MdxJsxFlowElement } from "./types";

/**
 * Wraps codeblocks of type `doenet-example` with a JSX element that renders the code and the output.
 */
export const wrapDoenetExample: Plugin<void[], MdastRoot, MdastRoot> =
    function () {
        return (tree) => {
            visit(tree, (node) => {
                if (node?.type !== "code") {
                    return;
                }
                if (node.lang !== "doenet-example") {
                    return;
                }

                // Make sure to change `lang` away from `doenet-example` to avoid infinite recursion.
                const origNode = { ...node, lang: "doenet" };

                const newNode: MdxJsxFlowElement = {
                    type: "mdxJsxFlowElement",
                    name: "DoenetExample",
                    attributes: [
                        {
                            type: "mdxJsxAttribute",
                            name: "source",
                            value: origNode.value,
                        },
                    ],
                    children: [origNode],
                };

                // Override the original node with the new one.
                Object.assign(node, newNode);
            });
        };
    };

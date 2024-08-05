import { visit } from "unist-util-visit";
import { Plugin } from "unified";

import { Root as MdastRoot } from "mdast";
import { MdxJsxFlowElement } from "./types";
import { objectToEstree } from "./object-to-estree";

/**
 * Wraps codeblocks of type `doenet-editor` with a JSX element that renders the editor with the output.
 */
export const wrapDoenetEditor: Plugin<void[], MdastRoot, MdastRoot> =
    function () {
        return (tree) => {
            visit(tree, (node) => {
                if (node?.type !== "code") {
                    return;
                }
                if (node.lang !== "doenet-editor") {
                    return;
                }

                const newNode: MdxJsxFlowElement = {
                    type: "mdxJsxFlowElement",
                    name: "DoenetEditor",
                    attributes: [
                        {
                            type: "mdxJsxAttribute",
                            name: "source",
                            value: {
                                type: "mdxJsxAttributeValueExpression",
                                value: JSON.stringify(node.value),
                                data: { estree: objectToEstree(node.value) },
                            },
                        },
                        {
                            type: "mdxJsxAttribute",
                            name: "viewerLocation",
                            value: "bottom",
                        },
                        {
                            type: "mdxJsxAttribute",
                            name: "height",
                            value: "600px",
                        },
                    ],
                    children: [],
                };

                // Override the original node with the new one.
                Object.assign(node, newNode);
            });
        };
    };

/**
 * Wraps codeblocks of type `doenet-editor-horiz` with a JSX element that renders the editor with the output
 * where the editor defaults to being at the left.
 */
export const wrapDoenetEditorHorizontal: Plugin<void[], MdastRoot, MdastRoot> =
    function () {
        return (tree) => {
            visit(tree, (node) => {
                if (node?.type !== "code") {
                    return;
                }
                if (node.lang !== "doenet-editor-horiz") {
                    return;
                }

                const newNode: MdxJsxFlowElement = {
                    type: "mdxJsxFlowElement",
                    name: "DoenetEditor",
                    attributes: [
                        {
                            type: "mdxJsxAttribute",
                            name: "source",
                            value: {
                                type: "mdxJsxAttributeValueExpression",
                                value: JSON.stringify(node.value),
                                data: { estree: objectToEstree(node.value) },
                            },
                        },
                        {
                            type: "mdxJsxAttribute",
                            name: "viewerLocation",
                            value: "right",
                        },
                        {
                            type: "mdxJsxAttribute",
                            name: "height",
                            value: "500px",
                        },
                    ],
                    children: [],
                };

                // Override the original node with the new one.
                Object.assign(node, newNode);
            });
        };
    };

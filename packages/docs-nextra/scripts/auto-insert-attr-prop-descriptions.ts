import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { computeOptimizedSchema } from "./compute-optimized-schema";
import { parseModule, Program as EstreeProgram } from "esprima";
import { Root as MdastRoot } from "mdast";
// Importing this automatically imports all the types from `mdast-util-mdx-jsx`.
import "mdast-util-mdx-jsx";

export const autoInsertAttrPropDescriptions: Plugin<
    void[],
    MdastRoot,
    MdastRoot
> = function () {
    const optimizedSchema = computeOptimizedSchema();
    return (tree, file) => {
        file.data.extraSearchData = {};

        visit(tree, (node) => {
            if (node?.type !== "mdxJsxFlowElement") {
                return;
            }
            if (node.name !== "AttrDisplay" && node.name !== "PropDisplay") {
                return;
            }
            const nameAttr = node.attributes.find(
                (attr) =>
                    attr.type === "mdxJsxAttribute" && attr.name === "name",
            );
            const name = String(nameAttr?.value);
            const info = optimizedSchema[name || ""];
            if (!info) {
                return;
            }

            if (
                node.name === "AttrDisplay" &&
                !node.attributes.find(
                    (attr) =>
                        attr.type === "mdxJsxAttribute" &&
                        attr.name === "attrs",
                )
            ) {
                // Info has all the schema information for this element. We need to insert it into the node.
                node.attributes.push({
                    type: "mdxJsxAttribute",
                    name: "attrs",
                    value: {
                        type: "mdxJsxAttributeValueExpression",
                        value: JSON.stringify(info.attrs),
                        data: {
                            estree: objectToEstree(info.attrs),
                        },
                    },
                });

                // Add some data that will be used for search
                // @ts-ignore
                file.data.extraSearchData["attr-list#Attribute"] = info.attrs
                    .filter((attr) => !attr.common)
                    .map((attr) => attr.name)
                    .join("\n");
            }
            if (
                node.name === "PropDisplay" &&
                !node.attributes.find(
                    (attr) =>
                        attr.type === "mdxJsxAttribute" &&
                        attr.name === "props",
                )
            ) {
                // Info has all the schema information for this element. We need to insert it into the node.
                node.attributes.push({
                    type: "mdxJsxAttribute",
                    name: "props",
                    value: {
                        type: "mdxJsxAttributeValueExpression",
                        value: JSON.stringify(info.props),
                        data: {
                            estree: objectToEstree(info.props),
                        },
                    },
                });

                // Add some data that will be used for search
                // @ts-ignore
                file.data.extraSearchData["prop-list#Property"] = info.props
                    .filter((prop) => !prop.common)
                    .map((prop) => prop.name)
                    .join("\n");
            }
        });
    };
};

/**
 * Turn a plain JS object into an ESTree object suitable for including in a `mdxJsxAttributeValueExpression`.
 */
function objectToEstree(obj: any): EstreeProgram {
    const estreeRaw = parseModule(`const IGNORE = ${JSON.stringify(obj)}`);

    const decl = estreeRaw.body[0];
    if (decl.type !== "VariableDeclaration") {
        throw new Error("PARSE ERROR: Expected a VariableDeclaration");
    }
    const decl2 = decl.declarations[0];
    if (decl2.type !== "VariableDeclarator") {
        throw new Error("PARSE ERROR: Expected a VariableDeclarator");
    }
    const expr = decl2.init;
    if (!expr) {
        throw new Error("PARSE ERROR: Expected an Expression");
    }

    return {
        type: "Program",
        body: [
            {
                type: "ExpressionStatement",
                expression: expr,
            },
        ],
        sourceType: "module",
    };
}

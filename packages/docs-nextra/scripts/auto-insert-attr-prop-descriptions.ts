import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { computeOptimizedSchema } from "./compute-optimized-schema";
import { parseModule, Program as EstreeProgram } from "esprima";
import { Heading, Root as MdastRoot } from "mdast";
// Importing this automatically imports all the types from `mdast-util-mdx-jsx`.
import "mdast-util-mdx-jsx";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

type OptimizedInfo = ReturnType<typeof computeOptimizedSchema>[string];

export const autoInsertAttrPropDescriptions: Plugin<
    void[],
    MdastRoot,
    MdastRoot
> = function () {
    const optimizedSchema = computeOptimizedSchema();
    return (tree, file) => {
        file.data.extraSearchData = {};

        visit(tree, (node, index, parent) => {
            if (node?.type !== "mdxJsxFlowElement") {
                return;
            }
            if (
                node.name !== "AttrDisplay" &&
                node.name !== "PropDisplay" &&
                node.name !== "ComponentDisplay" &&
                node.name !== "AttrPropDisplay"
            ) {
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

            if (node.name === "AttrDisplay") {
                injectAttrs(node, info, file);
            }
            if (node.name === "PropDisplay") {
                injectProps(node, info, file);
            }
            if (node.name === "ComponentDisplay") {
                injectSummary(node, info, file);
            }
            if (
                node.name === "AttrPropDisplay" &&
                parent &&
                typeof index === "number"
            ) {
                // <AttrPropDisplay> renders the attribute and property
                // sections (or "no attributes/properties" messages), so it
                // needs both data sets.
                injectAttrs(node, info, file);
                injectProps(node, info, file);
                // Emit the section heading as a real Markdown heading so it
                // picks up the theme's heading styling, anchor, and TOC entry.
                const heading: Heading = {
                    type: "heading",
                    depth: 2,
                    children: [
                        { type: "text", value: "Attributes and Properties" },
                    ],
                };
                parent.children.splice(index, 0, heading);
                // Continue past the inserted heading and this node.
                return index + 2;
            }
        });
    };
};

/** Whether `node` already carries an attribute named `attrName`. */
function hasAttribute(node: MdxJsxFlowElement, attrName: string): boolean {
    return node.attributes.some(
        (attr) => attr.type === "mdxJsxAttribute" && attr.name === attrName,
    );
}

/** Inject the schema `attrs` data onto an `<AttrDisplay>`/`<AttrPropDisplay>`. */
function injectAttrs(
    node: MdxJsxFlowElement,
    info: OptimizedInfo,
    file: { data: Record<string, any> },
): void {
    if (hasAttribute(node, "attrs")) {
        return;
    }
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

    // Add some data that will be used for search. Include the descriptions
    // so searches match the explanatory text too.
    file.data.extraSearchData["attr-list#Attribute"] = info.attrs
        .filter((attr) => !attr.common)
        .map((attr) => `${attr.name}: ${attr.description}`)
        .join("\n");
}

/** Inject the schema `props` data onto a `<PropDisplay>`/`<AttrPropDisplay>`. */
function injectProps(
    node: MdxJsxFlowElement,
    info: OptimizedInfo,
    file: { data: Record<string, any> },
): void {
    if (hasAttribute(node, "props")) {
        return;
    }
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

    // Add some data that will be used for search. Include the descriptions
    // so searches match the explanatory text too.
    file.data.extraSearchData["prop-list#Property"] = info.props
        .filter((prop) => !prop.common)
        .map((prop) => `${prop.name}: ${prop.description}`)
        .join("\n");
}

/** Inject the schema `summary` onto a `<ComponentDisplay>`. */
function injectSummary(
    node: MdxJsxFlowElement,
    info: OptimizedInfo,
    file: { data: Record<string, any> },
): void {
    if (hasAttribute(node, "summary")) {
        return;
    }
    node.attributes.push({
        type: "mdxJsxAttribute",
        name: "summary",
        value: info.summary,
    });

    // Add the summary to the search data.
    file.data.extraSearchData["component-summary#Description"] = info.summary;
}

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

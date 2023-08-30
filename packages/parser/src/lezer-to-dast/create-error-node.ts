import { SyntaxNode } from "@lezer/common";
import {
    Attribute,
    AttributeValue,
    CloseTag,
    Element,
    OpenTag,
    SelfClosingTag,
    TagName
} from "../generated-assets/lezer-doenet.terms";
import { DastError } from "../types";
import {
    extractContent, lezerNodeToPosition,
    OffsetToPositionMap
} from "./lezer-to-dast-utils";

export function createErrorNode(
    node: SyntaxNode,
    source: string,
    offsetToPositionMap: OffsetToPositionMap): DastError {
    if (!node.type.isError) {
        throw new Error("Function can only be called on a node of type error.");
    }
    function errorNode(message: string): DastError {
        return {
            type: "error",
            message,
            position: lezerNodeToPosition(node, offsetToPositionMap),
        };
    }
    const parent = node.parent;
    if (!parent) {
        const message = `Invalid DoenetML: ${extractContent(node, source)}`;
        return {
            type: "error",
            message,
            position: lezerNodeToPosition(node, offsetToPositionMap),
        };
    }
    switch (parent.type.id) {
        case Element: {
            // Elements may have a missing close tag
            const openTag = parent.getChild(OpenTag);
            const closeTag = parent.getChild(CloseTag);
            const tagNameTag = (
                openTag ||
                parent.getChild(SelfClosingTag) ||
                closeTag
            )?.getChild(TagName);
            const openTagName = tagNameTag
                ? extractContent(tagNameTag, source)
                : "";
            if (openTag && !closeTag) {
                // If the openTag itself has an error in it, we want to report that error instead of
                // a missing close tag error, since it should make more sense to the user.
                const childError = openTag.getChild("⚠");
                if (childError) {
                    return createErrorNode(
                        childError,
                        source,
                        offsetToPositionMap
                    );
                }

                const openTagName = tagNameTag
                    ? extractContent(tagNameTag, source)
                    : "";
                const message = `Invalid DoenetML: The tag \`${extractContent(
                    openTag,
                    source
                )}\` has no closing tag. Expected a self-closing tag or a </${openTagName}> tag.`;
                return errorNode(message);
            }
            return errorNode(
                `Invalid DoenetML: Error in tag \`<${openTagName}>\``
            );
        }
        case Attribute: {
            const value = extractContent(parent, source);
            const attributeNameNode = parent.getChild("AttributeName");
            const isNode = parent.getChild("Is");
            if (attributeNameNode && isNode) {
                return errorNode(
                    `Invalid DoenetML: Invalid attribute \`${value}\` appears to be missing a value.`
                );
            }
            return errorNode(
                `Invalid DoenetML: Invalid attribute \`${value}\``
            );
        }
        case AttributeValue: {
            const attribute = parent.parent;
            const value = extractContent(parent, source);
            const openQuote = value[0];
            const closeQuote = value[value.length - 1];
            if (!attribute || openQuote === closeQuote) {
                return errorNode(
                    `Invalid DoenetML: Invalid attribute value \`${value}\``
                );
            }
            // A common type of attribute error is when the open brace doesn't equal the close brace
            const correctQuote = openQuote.match(/['"]/)
                ? openQuote
                : closeQuote.match(/['"]/)
                    ? closeQuote
                    : '"';
            return errorNode(
                `Invalid DoenetML: Invalid attribute value \`${value}\`. The quote marks do not match. You appear to be missing a \`${correctQuote}\``
            );
        }
    }

    return errorNode(`Could not convert node ${node} to Dast node.`);
}

import { SyntaxNode } from "@lezer/common";
import {
    Attribute,
    AttributeValue,
    CloseTag,
    Element,
    EndTag,
    MismatchedCloseTag,
    MissingCloseTag,
    OpenTag,
    SelfCloseEndTag,
    SelfClosingTag,
    TagName,
} from "../generated-assets/lezer-doenet.terms";
import { DastError } from "../types";
import {
    extractContent,
    lezerNodeToPosition,
    OffsetToPositionMap,
} from "./lezer-to-dast-utils";

export function createErrorNode(
    node: SyntaxNode,
    source: string,
    offsetToPositionMap: OffsetToPositionMap,
): DastError {
    if (!node.type.isError && !node.type.is(MissingCloseTag)) {
        throw new Error("Function can only be called on a node of type error.");
    }
    function errorNode(
        message: string,
        options?: { startNode?: SyntaxNode; endNode?: SyntaxNode },
    ): DastError {
        const { startNode = node, endNode = node } = options ?? {};
        const startPos = lezerNodeToPosition(startNode, offsetToPositionMap);
        const endPos =
            startNode !== endNode
                ? lezerNodeToPosition(endNode, offsetToPositionMap)
                : startPos;
        return {
            type: "error",
            message,
            position: { start: startPos.start, end: endPos.end },
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
                const openTagName = tagNameTag
                    ? extractContent(tagNameTag, source)
                    : "";
                const message = `Invalid DoenetML: The tag \`${extractContent(
                    openTag,
                    source,
                )}\` has no closing tag. Expected a self-closing tag or a \`</${openTagName}>\` tag.`;
                return errorNode(message, {
                    startNode: openTag,
                    endNode: openTag,
                });
            }
            return errorNode(
                `Invalid DoenetML: Error in tag \`<${openTagName}>\``,
            );
        }
        case Attribute: {
            const value = extractContent(parent, source);
            const attributeNameNode = parent.getChild("AttributeName");
            const isNode = parent.getChild("Is");
            if (attributeNameNode && isNode) {
                return errorNode(
                    `Invalid DoenetML: Invalid attribute \`${value}\` appears to be missing a value.`,
                );
            }
            return errorNode(
                `Invalid DoenetML: Invalid attribute \`${value}\``,
            );
        }
        case AttributeValue: {
            const attribute = parent.parent;
            const value = extractContent(parent, source);
            const openQuote = value[0];
            const closeQuote = value[value.length - 1];
            if (!attribute || openQuote === closeQuote) {
                return errorNode(
                    `Invalid DoenetML: Invalid attribute value \`${value}\``,
                );
            }
            // A common type of attribute error is when the open brace doesn't equal the close brace
            const correctQuote = openQuote.match(/['"]/)
                ? openQuote
                : closeQuote.match(/['"]/)
                  ? closeQuote
                  : '"';
            return errorNode(
                `Invalid DoenetML: Invalid attribute value \`${value}\`. The quote marks do not match. You appear to be missing a \`${correctQuote}\``,
            );
        }
        case OpenTag: {
            // Various things could go wrong in an open tag.
            //  1. If there is no tag name, then the user could have typed `<` and then nothing else.
            //  2. If there is no closing `>`, then the user could have typed `<tag` and then nothing else.
            const tagName = parent.getChild(TagName);
            if (!tagName) {
                return errorNode(
                    `Invalid DoenetML: Found a tag without a tag name, e.g. \`<\``,
                );
            }
            const endTag = parent.getChild(EndTag);
            if (!endTag) {
                return errorNode(
                    `Invalid DoenetML: Tag \`${extractContent(
                        parent,
                        source,
                    )}\` was not closed (a \`>\` appears to be missing).`,
                    { startNode: parent, endNode: tagName },
                );
            }
        }
        case SelfClosingTag: {
            const tagName = parent.getChild(TagName);
            if (!tagName) {
                return errorNode(
                    `Invalid DoenetML: Found a tag without a tag name \`<${extractContent(
                        node,
                        source,
                    )}>\``,
                );
            }
            const endTag = parent.getChild(SelfCloseEndTag);
            if (!endTag) {
                return errorNode(
                    `Invalid DoenetML: Tag \`${extractContent(
                        parent,
                        source,
                    )}\` was not closed (\`/>\` appears to be missing).`,
                );
            }
            return errorNode(
                `Invalid DoenetML: Tag \`${extractContent(
                    parent,
                    source,
                )}\` is not valid. It may have incorrect attributes.`,
            );
        }
        case MismatchedCloseTag:
        case CloseTag: {
            const tagName = parent.getChild(TagName);
            if (!tagName) {
                return errorNode(
                    `Invalid DoenetML: Found a closing tag without a tag name, e.g. \`</\``,
                );
            }
            const endTag = parent.getChild(EndTag);
            if (!endTag) {
                return errorNode(
                    `Invalid DoenetML: Tag \`${extractContent(
                        parent,
                        source,
                    )}\` was not closed (a \`>\` appears to be missing).`,
                    { startNode: parent, endNode: tagName },
                );
            }
        }
    }

    return errorNode(`Could not convert node ${node} to Dast node.`);
}

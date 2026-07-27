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
import { codedDastError } from "../coded-dast-error";
import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
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
        diagnostic: {
            code: DiagnosticCode;
            message: string;
            args?: DiagnosticArgs;
        },
        options?: { startNode?: SyntaxNode; endNode?: SyntaxNode },
    ): DastError {
        const { startNode = node, endNode = node } = options ?? {};
        const startPos = lezerNodeToPosition(startNode, offsetToPositionMap);
        const endPos =
            startNode !== endNode
                ? lezerNodeToPosition(endNode, offsetToPositionMap)
                : startPos;
        return codedDastError({
            ...diagnostic,
            position: { start: startPos.start, end: endPos.end },
        });
    }
    const parent = node.parent;
    if (!parent) {
        const content = extractContent(node, source);
        return codedDastError({
            code: "doenet-e0007",
            message: `Invalid DoenetML: ${content}`,
            args: { content },
            position: lezerNodeToPosition(node, offsetToPositionMap),
        });
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
                const tag = extractContent(openTag, source);
                return errorNode(
                    {
                        code: "doenet-e0008",
                        message: `Invalid DoenetML: The tag \`${tag}\` has no closing tag. Expected a self-closing tag or a \`</${openTagName}>\` tag.`,
                        args: { tag, tagName: openTagName },
                    },
                    {
                        startNode: openTag,
                        endNode: openTag,
                    },
                );
            }
            return errorNode({
                code: "doenet-e0009",
                message: `Invalid DoenetML: Error in tag \`<${openTagName}>\``,
                args: { tagName: openTagName },
            });
        }
        case Attribute: {
            const value = extractContent(parent, source);
            const attributeNameNode = parent.getChild("AttributeName");
            const isNode = parent.getChild("Is");
            if (attributeNameNode && isNode) {
                return errorNode({
                    code: "doenet-e0010",
                    message: `Invalid DoenetML: Invalid attribute \`${value}\` appears to be missing a value.`,
                    args: { attribute: value },
                });
            }
            return errorNode({
                code: "doenet-e0011",
                message: `Invalid DoenetML: Invalid attribute \`${value}\``,
                args: { attribute: value },
            });
        }
        case AttributeValue: {
            const attribute = parent.parent;
            const value = extractContent(parent, source);
            const openQuote = value[0];
            const closeQuote = value[value.length - 1];
            if (!attribute || openQuote === closeQuote) {
                return errorNode({
                    code: "doenet-e0012",
                    message: `Invalid DoenetML: Invalid attribute value \`${value}\``,
                    args: { value },
                });
            }
            // A common type of attribute error is when the open brace doesn't equal the close brace
            const correctQuote = openQuote.match(/['"]/)
                ? openQuote
                : closeQuote.match(/['"]/)
                  ? closeQuote
                  : '"';
            return errorNode({
                code: "doenet-e0013",
                message: `Invalid DoenetML: Invalid attribute value \`${value}\`. The quote marks do not match. You appear to be missing a \`${correctQuote}\``,
                args: { value, quote: correctQuote },
            });
        }
        case OpenTag: {
            // Various things could go wrong in an open tag.
            //  1. If there is no tag name, then the user could have typed `<` and then nothing else.
            //  2. If there is no closing `>`, then the user could have typed `<tag` and then nothing else.
            const tagName = parent.getChild(TagName);
            if (!tagName) {
                return errorNode({
                    code: "doenet-e0014",
                    message: `Invalid DoenetML: Found a tag without a tag name, e.g. \`<\``,
                });
            }
            const endTag = parent.getChild(EndTag);
            if (!endTag) {
                const tag = extractContent(parent, source);
                return errorNode(
                    {
                        code: "doenet-e0015",
                        message: `Invalid DoenetML: Tag \`${tag}\` was not closed (a \`>\` appears to be missing).`,
                        args: { tag },
                    },
                    { startNode: parent, endNode: tagName },
                );
            }
        }
        case SelfClosingTag: {
            const tagName = parent.getChild(TagName);
            if (!tagName) {
                const content = extractContent(node, source);
                return errorNode({
                    code: "doenet-e0016",
                    message: `Invalid DoenetML: Found a tag without a tag name \`<${content}>\``,
                    args: { content },
                });
            }
            const endTag = parent.getChild(SelfCloseEndTag);
            const tag = extractContent(parent, source);
            if (!endTag) {
                return errorNode({
                    code: "doenet-e0017",
                    message: `Invalid DoenetML: Tag \`${tag}\` was not closed (\`/>\` appears to be missing).`,
                    args: { tag },
                });
            }
            return errorNode({
                code: "doenet-e0018",
                message: `Invalid DoenetML: Tag \`${tag}\` is not valid. It may have incorrect attributes.`,
                args: { tag },
            });
        }
        case MismatchedCloseTag:
        case CloseTag: {
            const tagName = parent.getChild(TagName);
            if (!tagName) {
                return errorNode({
                    code: "doenet-e0019",
                    message: `Invalid DoenetML: Found a closing tag without a tag name, e.g. \`</\``,
                });
            }
            const endTag = parent.getChild(EndTag);
            if (!endTag) {
                const tag = extractContent(parent, source);
                return errorNode(
                    {
                        code: "doenet-e0015",
                        message: `Invalid DoenetML: Tag \`${tag}\` was not closed (a \`>\` appears to be missing).`,
                        args: { tag },
                    },
                    { startNode: parent, endNode: tagName },
                );
            }
        }
    }

    // Not a document's fault: the grammar produced a shape this conversion has
    // no case for. It still becomes an error node the author is looking at, so
    // it is coded and translated like the rest; the node's own name carries
    // what a bug report needs.
    return errorNode({
        code: "doenet-e0023",
        message: `Could not convert node ${node} to Dast node.`,
        args: { node: String(node) },
    });
}

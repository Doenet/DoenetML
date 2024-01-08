import { SyntaxNode, TreeBuffer } from "@lezer/common";
import {
    CloseTag,
    MissingCloseTag,
    OpenTag,
    TagName,
} from "../generated-assets/lezer-doenet.terms";
import { parser } from "../generated-assets/lezer-doenet";
import {
    DastAttributeV6,
    DastDoctype,
    DastElementContentV6,
    DastFunctionMacroV6,
    DastMacroV6,
    DastRootContentV6,
    DastRootV6,
    DastText,
    LezerSyntaxNodeName,
} from "../types";
import { createErrorNode } from "./create-error-node";
import {
    attributeValueText,
    createOffsetToPositionMap,
    entityToString,
    extractContent,
    extractDoctypeInfo,
    findFirstErrorInChild,
    getLezerChildren,
    lezerNodeToPosition,
    textNodeToText,
    updateNodePositionData,
} from "./lezer-to-dast-utils";
import { gobbleFunctionArguments } from "./gobble-function-arguments";
import { parseMacrosV06 } from "../macros-v6";
import { gobbleFunctionArgumentsV6 } from "./gobble-function-arguments-v6";

/**
 * Create a lezer `SyntaxNode` from a string. This can be passed
 * to `lezerToDast` to create a DAST tree.
 */
export function stringToLezer(source: string): SyntaxNode {
    const tree = parser.parse(source);
    return tree.topNode;
}

/**
 * Convert a lezer `SyntaxNode` into a DAST tree. This parses Doenet v0.6 macros.
 *
 * **Note**: this function should only be used to provide support for the legacy macro syntax.
 */
export function lezerToDastV6(
    node: SyntaxNode | string,
    source?: string,
): DastRootV6 {
    if (typeof node === "string") {
        const tree = parser.parse(node);
        source = node;
        return _lezerToDast(tree.topNode, source);
    }
    if (source == null) {
        throw new Error(
            `If you provide a SyntaxNode, you must also provide the source string`,
        );
    }
    return _lezerToDast(node, source);
}

function _lezerToDast(node: SyntaxNode, source: string): DastRootV6 {
    const offsetMap = createOffsetToPositionMap(source);
    return {
        type: "root",
        children: gobbleFunctionArgumentsV6(lezerNodeToDastNode(node)),
        position: lezerNodeToPosition(node, offsetMap),
    };

    function lezerNodeToDastNode(node: SyntaxNode): DastRootContentV6[] {
        if (!node) {
            throw new Error(`Expecting node but got ${JSON.stringify(node)}`);
        }
        const name = node.type.name as LezerSyntaxNodeName;
        switch (name) {
            case "Document":
                return getLezerChildren(node).flatMap(lezerNodeToDastNode);
            case "Element": {
                const openTag =
                    node.getChild("OpenTag") || node.getChild("SelfClosingTag");
                if (!openTag) {
                    console.warn(
                        `Could not find open tag for element ${extractContent(
                            node,
                            source,
                        )}`,
                    );
                    return [];
                }
                let children: DastElementContentV6[] = [];
                // The open tag may have an error in it.
                const openTagError = findFirstErrorInChild(openTag);
                if (openTagError) {
                    const errorNode = createErrorNode(
                        openTagError,
                        source,
                        offsetMap,
                    );
                    children.push(errorNode);
                }
                // If we have an open tag but no closing tag, it's an error.
                // It's not an error if the tag was self closing.
                let elementError =
                    node.getChild("⚠") || node.getChild(MissingCloseTag);
                if (
                    openTag.type.name === "OpenTag" &&
                    !node.getChild("CloseTag") &&
                    !openTagError &&
                    elementError
                ) {
                    const errorNode = createErrorNode(
                        elementError,
                        source,
                        offsetMap,
                    );
                    children.push(errorNode);
                }

                const tag = openTag.getChild("TagName");
                const name = tag ? extractContent(tag, source) : "";
                const attributesList: DastAttributeV6[] = [];
                for (const attrTag of openTag.getChildren("Attribute")) {
                    const error = findFirstErrorInChild(attrTag);
                    if (error) {
                        const errorNode = createErrorNode(
                            error,
                            source,
                            offsetMap,
                        );
                        children.push(errorNode);
                    }
                    const attrName = attrTag.getChild("AttributeName");
                    const attrValue = attrTag.getChild("AttributeValue");
                    if (!attrName) {
                        continue;
                    }
                    let attrChildren: DastAttributeV6["children"] = attrValue
                        ? [
                              ...reprocessTextForMacros({
                                  type: "text",
                                  value: attributeValueText(attrValue, source),
                                  position: lezerNodeToPosition(
                                      attrValue,
                                      offsetMap,
                                  ),
                              } as DastText),
                          ]
                        : [];
                    // Attributes with no specified value are assigned the value "true".
                    // E.g. `<foo bar />` is the same as `<foo bar="true" />`
                    attributesList.push({
                        type: "attribute",
                        name: extractContent(attrName, source),
                        children: attrChildren,
                        position: lezerNodeToPosition(attrTag, offsetMap),
                    });
                }
                // Children get pushed after attributes so that any attribute errors will
                // appear first.
                children.push(
                    ...getLezerChildren(node).flatMap(
                        (n) => lezerNodeToDastNode(n) as DastElementContentV6[],
                    ),
                );
                children = gobbleFunctionArgumentsV6(
                    children,
                ) as DastElementContentV6[];

                return [
                    {
                        type: "element",
                        name,
                        attributes: Object.fromEntries(
                            attributesList.map((a) => [a.name, a]),
                        ),
                        children,
                        position: lezerNodeToPosition(node, offsetMap),
                    },
                ];
            }
            case "Text": {
                const textNode: DastText = {
                    type: "text",
                    value: textNodeToText(node, source),
                    position: lezerNodeToPosition(node, offsetMap),
                };
                return reprocessTextForMacros(textNode);
            }
            case "Ampersand":
                return [
                    {
                        type: "text",
                        value: "&",
                        position: lezerNodeToPosition(node, offsetMap),
                    },
                ];
            case "CharacterReference":
            case "EntityReference":
                return [
                    {
                        type: "text",
                        value: entityToString(node, source),
                        position: lezerNodeToPosition(node, offsetMap),
                    },
                ];
            case "ProcessingInst": {
                const fullContent = extractContent(node, source);
                let value = fullContent.slice(2, fullContent.length - 2);
                const match = value.match(/^[\w-]*/);
                const name = match?.[0] || "";
                if (name) {
                    value = value.slice(name.length).trim();
                }
                return [
                    {
                        type: "instruction",
                        name,
                        value,
                        position: lezerNodeToPosition(node, offsetMap),
                    },
                ];
            }
            case "Comment": {
                const fullContent = extractContent(node, source);
                return [
                    {
                        type: "comment",
                        value: fullContent.slice(4, fullContent.length - 3),
                        position: lezerNodeToPosition(node, offsetMap),
                    },
                ];
            }
            case "Cdata": {
                const fullContent = extractContent(node, source);
                return [
                    {
                        type: "cdata",
                        value: fullContent.slice(9, fullContent.length - 3),
                        position: lezerNodeToPosition(node, offsetMap),
                    },
                ];
            }
            case "DoctypeDecl": {
                // DocTypes look like <!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN' 'http://www.w3.org/TR/REC-html40/loose.dtd'>
                const fullContent = extractContent(node, source);
                let value = fullContent.slice(10, fullContent.length - 1);
                const doctypeInfo = extractDoctypeInfo(value);
                return [
                    {
                        type: "doctype",
                        ...doctypeInfo,
                        position: lezerNodeToPosition(node, offsetMap),
                    } as DastDoctype,
                ];
            }
            case "Attribute":
            case "AttributeName":
            case "AttributeValue":
            case "EndTag":
            case "Is":
            case "OpenTag":
            case "SelfCloseEndTag":
            case "SelfClosingTag":
            case "TagName":
            case "StartTag":
            case "StartCloseTag":
                return [];
            case "CloseTag": {
                const errorNode = findFirstErrorInChild(node);
                if (errorNode) {
                    return [createErrorNode(errorNode, source, offsetMap)];
                }
                return [];
            }
            case "MismatchedCloseTag": {
                // We may have a mismatched tag, but the tag may also be incomplete itself.
                // For example `</x ` (with no closing `>`). In this case, we want the error
                // in the tag itself to take priority.
                const closeTagError = findFirstErrorInChild(node);
                if (closeTagError) {
                    return [createErrorNode(closeTagError, source, offsetMap)];
                }

                const parent = node.parent;
                const openTag = parent?.getChild(OpenTag);
                const closeTag = parent?.getChild(CloseTag);
                if (!parent || !openTag) {
                    const message = `Invalid DoenetML: Found closing tag \`${extractContent(
                        node,
                        source,
                    )}\`, but no corresponding opening tag`;
                    return [
                        {
                            type: "error",
                            message,
                            position: lezerNodeToPosition(node, offsetMap),
                        },
                    ];
                }
                // If we have a parent, check to see if we also have a close tag.
                // This could arise in code like `<foo></bar></foo>`
                if (closeTag) {
                    const message = `Invalid DoenetML: Found closing tag \`${extractContent(
                        node,
                        source,
                    )}\`, but no corresponding opening tag`;

                    return [
                        {
                            type: "error",
                            message,
                            position: lezerNodeToPosition(node, offsetMap),
                        },
                    ];
                }
                // In this case, there was an open tag, a mismatched close tag, but no actual close tag.
                // E.g. `<foo>bar</baz>`
                const tagNameTag = openTag.getChild(TagName);
                const openTagName = tagNameTag
                    ? extractContent(tagNameTag, source)
                    : "";
                const message = `Invalid DoenetML: Mismatched closing tag. Expected \`</${openTagName}>\`. Found \`${extractContent(
                    node,
                    source,
                )}\``;

                return [
                    {
                        type: "error",
                        message,
                        position: lezerNodeToPosition(node, offsetMap),
                    },
                ];
            }
            case "MissingCloseTag":
            case "⚠":
                return [];
            default:
                const unhandledName: never = name;
                console.log(
                    `Encountered Lezer node of unknown type ${unhandledName}`,
                );
        }
        return [];
    }
}

/**
 * Process a text node and expose any macros within as DastNodes.
 */
function reprocessTextForMacros(
    textNode: DastText,
): (DastText | DastMacroV6 | DastFunctionMacroV6)[] {
    if (!textNode.value.includes("$")) {
        return [textNode];
    }
    // If there is a `$` in the text, it may contain macros, so re-parse it
    // looking for macros.
    const parsed = parseMacrosV06(textNode.value);
    // The text node may be located anywhere in the source and we have
    // just re-parsed it, so we need to make sure the position data is
    // correct.
    parsed.forEach((n) => updateNodePositionData(n, textNode));
    return parsed;
}

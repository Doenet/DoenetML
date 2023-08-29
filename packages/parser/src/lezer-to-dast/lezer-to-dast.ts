import { SyntaxNode } from "@lezer/common";
import { Doctype, Element, Root } from "xast";
import { LezerSyntaxNodeName, DastAbstractNode, DastNodes } from "../types";
import {
    createOffsetToPositionMap,
    entityToString,
    extractContent,
    lezerNodeToPosition,
    mergeAdjacentTextNodes,
    OffsetToPositionMap,
    textNodeToText,
} from "./lezer-to-dast-utils";
import { lezerNodeToDastNodeWithoutChildren } from "./lezer-to-dast-without-children";

export function lezerNodeChildrenToDastNode(
    node: SyntaxNode,
    source: string,
    offsetToPositionMap?: OffsetToPositionMap,
): Root["children"] {
    const ret: Root["children"] = [];
    let child = node.firstChild;
    let needsMerge = false;
    let lastNodeType: string = "";
    while (child) {
        const xastNode = lezerNodeToDastNode(
            child,
            source,
            offsetToPositionMap,
        );
        if (xastNode) {
            ret.push(xastNode as Element);
            if (lastNodeType === "text" && xastNode.type === "text") {
                needsMerge = true;
            }
            lastNodeType = xastNode.type || "";
        }
        child = child.nextSibling;
    }

    if (needsMerge) {
        return mergeAdjacentTextNodes(ret);
    }
    return ret;
}

export function lezerNodeToDastNode(
    node: SyntaxNode,
    source: string,
    offsetToPositionMap?: OffsetToPositionMap,
): DastNodes | null {
    if (!offsetToPositionMap) {
        offsetToPositionMap = createOffsetToPositionMap(source);
    }
    const name = node.type.name as LezerSyntaxNodeName;
    switch (name) {
        case "Document": {
            const root = lezerNodeToDastNodeWithoutChildren(
                node,
                source,
                offsetToPositionMap,
            ) as Root;
            root.children.push(
                ...lezerNodeChildrenToDastNode(
                    node,
                    source,
                    offsetToPositionMap,
                ),
            );
            return root;
        }
        case "Element": {
            const element = lezerNodeToDastNodeWithoutChildren(
                node,
                source,
                offsetToPositionMap,
            ) as Element;
            if (!element) {
                throw new Error(
                    `Could not convert node "${node}" with contents "${extractContent(
                        node,
                        source,
                    )}" to element node.`,
                );
            }
            element.children.push(
                ...(lezerNodeChildrenToDastNode(
                    node,
                    source,
                    offsetToPositionMap,
                ) as Element["children"]),
            );

            return element;
        }
        case "Text":
            return {
                type: "text",
                value: textNodeToText(node, source),
                position: lezerNodeToPosition(node, offsetToPositionMap),
            };
        case "CharacterReference":
        case "EntityReference":
            return {
                type: "text",
                value: entityToString(node, source),
                position: lezerNodeToPosition(node, offsetToPositionMap),
            };
        case "ProcessingInst": {
            const fullContent = extractContent(node, source);
            let value = fullContent.slice(2, fullContent.length - 2);
            const match = value.match(/^[\w-]*/);
            const name = match?.[0] || "";
            if (name) {
                value = value.slice(name.length).trim();
            }
            return {
                type: "instruction",
                name,
                value,
                position: lezerNodeToPosition(node, offsetToPositionMap),
            };
        }
        case "Comment": {
            const fullContent = extractContent(node, source);
            return {
                type: "comment",
                value: fullContent.slice(4, fullContent.length - 3),
                position: lezerNodeToPosition(node, offsetToPositionMap),
            };
        }
        case "Cdata": {
            const ret = lezerNodeToDastNodeWithoutChildren(
                node,
                source,
                offsetToPositionMap,
            );
            if (!ret) {
                throw new Error(`Could not convert node ${node} to Dast node.`);
            }
            return ret;
        }
        case "DoctypeDecl": {
            const ret = lezerNodeToDastNodeWithoutChildren(
                node,
                source,
                offsetToPositionMap,
            );
            if (!ret) {
                throw new Error(`Could not convert node ${node} to Dast node.`);
            }
            return ret;
        }

        case "Attribute":
        case "AttributeName":
        case "AttributeValue":
        case "CloseTag":
        case "EndTag":
        case "Is":
        case "MismatchedCloseTag":
        case "MissingCloseTag":
        case "OpenTag":
        case "SelfCloseEndTag":
        case "SelfClosingTag":
        case "TagName":
        case "StartTag":
        case "StartCloseTag":
        case "InvalidEntity":
        case "⚠":
            return lezerNodeToDastNodeWithoutChildren(node, source, offsetToPositionMap);
        default:
            const unhandledName: never = name;
            console.log(
                `Encountered Lezer node of unknown type ${unhandledName}`,
            );
    }
    return null;
}

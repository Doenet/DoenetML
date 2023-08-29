import { SyntaxNode } from "@lezer/common";
import { Doctype } from "xast";
import { LezerSyntaxNodeName, DastAbstractNode, DastNodes } from "../types";
import {
    attributeValueText,
    createOffsetToPositionMap,
    entityToString,
    extractContent,
    extractDoctypeInfo,
    lezerNodeToPosition,
    OffsetToPositionMap,
    textNodeToText,
} from "./lezer-to-dast-utils";

/**
 * Convert a `lezer` `SyntaxNode` into a `DastNodes` if possible.
 * `null` is returned if there is no corresponding `Dast` node.
 */
export function lezerNodeToDastNodeWithoutChildren(
    node: SyntaxNode,
    source: string,
    offsetToPositionMap?: OffsetToPositionMap,
): DastNodes | null {
    if (!offsetToPositionMap) {
        offsetToPositionMap = createOffsetToPositionMap(source);
    }
    const name = node.type.name as LezerSyntaxNodeName;
    switch (name) {
        case "Document":
            return {
                type: "root",
                children: [],
                // In XAST's `fromXml`, no position is provided for `"root"`. So we do the same
                // position: lezerNodeToPosition(node, offsetToPositionMap),
            };
        case "Element": {
            const openTag =
                node.getChild("OpenTag") || node.getChild("SelfClosingTag");
            if (!openTag) {
                return null;
            }
            const tag = openTag.getChild("TagName");
            let name = "";
            if (tag) {
                name = extractContent(tag, source);
            }

            const attributes: Record<string, string> = {};
            for (const attrTag of openTag.getChildren("Attribute")) {
                const attrName = attrTag.getChild("AttributeName");
                const attrValue = attrTag.getChild("AttributeValue");
                if (!attrName) {
                    continue;
                }
                // Attributes with no specified value are assigned the value "true".
                // E.g. `<foo bar />` is the same as `<foo bar="true" />`
                attributes[extractContent(attrName, source)] = attrValue
                    ? attributeValueText(attrValue, source)
                    : "true";
            }

            return {
                type: "element",
                name,
                attributes,
                children: [],
                position: lezerNodeToPosition(node, offsetToPositionMap),
            };
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
            const fullContent = extractContent(node, source);
            return {
                type: "cdata",
                value: fullContent.slice(9, fullContent.length - 3),
                position: lezerNodeToPosition(node, offsetToPositionMap),
            };
        }
        case "DoctypeDecl": {
            // DocTypes look like <!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN' 'http://www.w3.org/TR/REC-html40/loose.dtd'>
            const fullContent = extractContent(node, source);
            let value = fullContent.slice(10, fullContent.length - 1);
            const doctypeInfo = extractDoctypeInfo(value);
            return {
                type: "doctype",
                ...doctypeInfo,
                position: lezerNodeToPosition(node, offsetToPositionMap),
            } as Doctype;
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
            return null;
        default:
            const unhandledName: never = name;
            console.log(
                `Encountered Lezer node of unknown type ${unhandledName}`,
            );
    }
    return null;
}

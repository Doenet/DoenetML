import { DastElement, DastText } from "../../../types";

/**
 * Test whether a node is a DastElement.
 */
export function isElement(node: any): node is DastElement {
    return node && node.type === "element";
}

/**
 * Test whether a node is a DastElement.
 */
export function isText(node: any): node is DastText {
    return node && node.type === "text";
}

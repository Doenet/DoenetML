import { CursorPosition, DoenetSourceObject, RowCol } from "./index";
import { DastElement, LezerSyntaxNodeName } from "../parser";

/**
 * Get the element containing the position `offset`. `null` is returned if the position is not
 * contained in an element.
 *
 * Details about the `offset` position within the element are also returned, e.g., if `offset` is in
 * the open tag, etc..
 */
export function elementAtOffset(
    this: DoenetSourceObject,
    offset: number | RowCol,
): {
    node: DastElement | null;
    cursorPosition: CursorPosition;
} {
    if (typeof offset !== "number") {
        offset = this.rowColToOffset(offset);
    }

    const prevChar = this.source.charAt(offset - 1);
    let node = this.nodeAtOffset(offset);
    let cursorPosition: CursorPosition = "unknown";
    while (node != null && node.type !== "element") {
        // If we are in a child node, then we must be in the body of the element.
        cursorPosition = "body";
        node = this.getParent(node);
    }
    if (!node) {
        cursorPosition = "unknown";
    }
    if (node && cursorPosition === "unknown") {
        // Try to guess where the cursor is
        const cursor = this._lezerCursor();
        cursor.moveTo(offset, -1);
        const leftNode = cursor.node;
        cursor.moveTo(offset, 1);
        const rightNode = cursor.node;
        // XXX Fix this after the CodeMirror update
        // @ts-ignore
        const atNodeBoundary = leftNode.index !== rightNode.index;
        // If we're at a node boundary, we pick the node to the left if the previous character
        // is a word character. This should help with completion contexts, since the author
        // is probably still typing a word, or is expecting completions from the word on the left.
        let lezerNode = atNodeBoundary
            ? prevChar.match(/\w/)
                ? leftNode
                : rightNode
            : leftNode;

        const lezerNodeType = lezerNode.type.name as LezerSyntaxNodeName;
        const lezerNodeParentType = lezerNode.parent?.type?.name as
            | LezerSyntaxNodeName
            | undefined;
        switch (lezerNodeType) {
            case "TagName": {
                cursorPosition =
                    lezerNodeParentType === "OpenTag" ||
                    lezerNodeParentType === "SelfClosingTag"
                        ? "openTagName"
                        : "closeTagName";
                break;
            }
            case "AttributeName":
                cursorPosition = "attributeName";
                break;
            case "AttributeValue":
                cursorPosition = "attributeValue";
                break;
            case "OpenTag":
            case "SelfClosingTag":
                cursorPosition = "openTag";
                break;
            case "EndTag":
                if (
                    lezerNodeParentType === "OpenTag" ||
                    lezerNodeParentType === "SelfClosingTag"
                ) {
                    cursorPosition = "openTag";
                } else if (!prevChar.match(/(\s|\n)/)) {
                    cursorPosition = "closeTagName";
                } else {
                    cursorPosition = "unknown";
                }
                break;
            case "StartCloseTag":
                cursorPosition = "body";
                break;
        }
    }

    // If we're not in an element and the previous character is a word character or `<`, then
    // we might be part of an incomplete element. In this case, we return the element _before_ `offset`.
    if (!node && prevChar.match(/(\w|<)/)) {
        return this.elementAtOffset(offset - 1);
    }

    const prevCharIsWhitespace = Boolean(prevChar.match(/(\s|\n)/));
    let prevNonWhitespaceCharOffset = offset - 1;
    while (this.source.charAt(prevNonWhitespaceCharOffset).match(/(\s|\n)/)) {
        prevNonWhitespaceCharOffset -= 1;
    }
    const prevNonWhitespaceChar = this.source.charAt(
        prevNonWhitespaceCharOffset,
    );

    // If there is an incomplete element before the cursor position and the cursor
    // is positioned right before the start of the close tag, we might misreport we're
    // in the body of the parent element rather than in the incomplete preceding element.
    // This can happen like
    //  1. `<a> <b  </a>` where the cursor is a child of an element; OR
    //  2. `<b   ` where the cursor is in the document root.
    //
    // Handle the case where we're a child of an element
    if (cursorPosition === "body" && prevCharIsWhitespace) {
        const precedingNode = this.nodeAtOffset(offset - 1);
        if (precedingNode && precedingNode.type === "element") {
            node = precedingNode;
        }
    }
    // Handle the case where we're in the document root
    if (!node && cursorPosition === "unknown" && prevCharIsWhitespace) {
        // Elements _always_ end in `>`, even if they're self closing.
        // We don't want to return the previous element if it's already closed.
        if (prevNonWhitespaceChar !== ">") {
            const precedingNode = this.nodeAtOffset(
                prevNonWhitespaceCharOffset,
            );
            if (precedingNode && precedingNode.type === "element") {
                node = precedingNode;
            }
        }
    }

    // If we're in an incomplete tag, our `cursorPosition` may be unknown.
    if (node && cursorPosition === "unknown" && prevCharIsWhitespace) {
        const cursor = this._lezerCursor();
        cursor.moveTo(prevNonWhitespaceCharOffset, 1);
        const lezerNodeType = cursor.node.type.name as LezerSyntaxNodeName;
        const lezerNodeParentType = cursor.node.parent?.type?.name as
            | LezerSyntaxNodeName
            | undefined;
        switch (lezerNodeType) {
            case "TagName": {
                if (lezerNodeParentType === "CloseTag") {
                    break;
                }
            }
            case "Attribute":
            case "AttributeName":
            case "AttributeValue":
                cursorPosition = "openTag";
                break;
        }
    }

    return { node, cursorPosition };
}

import { RowCol } from "../../doenet-source-object";
import type { CompletionItem } from "vscode-languageserver/browser";
import { CompletionItemKind } from "vscode-languageserver/browser";
import { showCursor } from "@doenet/parser";
import { AutoCompleter } from "../index";

/**
 * Get a list of completion items at the given offset.
 */
export function getCompletionItems(
    this: AutoCompleter,
    offset: number | RowCol,
): CompletionItem[] {
    if (typeof offset !== "number") {
        offset = this.sourceObj.rowColToOffset(offset);
    }

    const prevChar = this.sourceObj.source.charAt(offset - 1);
    const prevPrevChar = this.sourceObj.source.charAt(offset - 2);
    let prevNonWhitespaceCharOffset = offset - 1;
    while (
        this.sourceObj.source
            .charAt(prevNonWhitespaceCharOffset)
            .match(/(\s|\n)/)
    ) {
        prevNonWhitespaceCharOffset--;
    }
    const prevNonWhitespaceChar = this.sourceObj.source.charAt(
        prevNonWhitespaceCharOffset,
    );

    let containingNode = this.sourceObj.nodeAtOffset(offset);
    let containingElement = this.sourceObj.elementAtOffsetWithContext(offset);
    const element = containingElement.node;
    let cursorPosition = containingElement.cursorPosition;

    if (!containingNode && cursorPosition === "unknown" && prevChar === "<") {
        return this.schemaTopAllowedElements.map((name) => ({
            label: name,
            kind: CompletionItemKind.Property,
        }));
    }

    if (!element && containingNode && containingNode.type === "text") {
        // We're in the root of the document and not inside any special XML tags (like `<? foo ?>` or `<!DOCTYPE xml>`)
        // Find out what items we can complete.

        // If the previous char is a `<`, we suggest all top-level elements.
        if (prevChar === "<") {
            return this.schemaTopAllowedElements.map((name) => ({
                label: name,
                kind: CompletionItemKind.Property,
            }));
        }

        return [];
    }

    if (!element) {
        return [];
    }

    if (cursorPosition === "closeTagName") {
        // We're in the close tag name. Suggest the close tag name.
        return [
            {
                label: `/${element.name}>`,
                kind: CompletionItemKind.Property,
            },
        ];
    }

    const { tagComplete, closed } = this.sourceObj.isCompleteElement(element);

    if (
        cursorPosition === "body" &&
        containingElement.node &&
        prevChar === "<"
    ) {
        const allowedChildren = this._getAllowedChildren(
            containingElement.node.name,
        ).map((name) => ({
            label: name,
            kind: CompletionItemKind.Property,
        }));
        if (closed) {
            // We're in the body of an element. Suggest all allowed children.
            return allowedChildren;
        }
        // We are the child of a non-closed tag. Suggest the close tag or allowed children
        return [
            {
                label: `/${element.name}>`,
                kind: CompletionItemKind.Property,
            },
            ...allowedChildren,
        ];
    }

    // Suggest closing tag after "</"
    if (
        prevPrevChar === "<" &&
        prevChar === "/" &&
        containingElement.node &&
        !closed &&
        (cursorPosition === "body" ||
            (cursorPosition === "unknown" &&
                this.sourceObj.source.charAt(offset).match(/(\s|\n)/)))
    ) {
        return [
            {
                label: `/${element.name}>`,
                kind: CompletionItemKind.Property,
            },
        ];
    }

    if (cursorPosition === "openTagName") {
        // We're in the open tag name. Suggest everything that starts with the current text.
        const currentText = element.name.toLowerCase();
        const parent = this.sourceObj.getParent(element);
        if (!parent || parent.type === "root") {
            return this.schemaTopAllowedElements
                .filter((name) => name.toLowerCase().startsWith(currentText))
                .map((name) => ({
                    label: name,
                    kind: CompletionItemKind.Property,
                }));
        }

        return this._getAllowedChildren(parent.name)
            .filter((label) => label.toLowerCase().startsWith(currentText))
            .map((label) => ({
                label,
                kind: CompletionItemKind.Property,
            }));
    }

    if (cursorPosition === "openTag" || cursorPosition === "attributeName") {
        const elmName = this.normalizeElementName(element.name);
        const allowedAttributes =
            this.schemaElementsByName[elmName]?.attributes || [];
        return allowedAttributes.map((attr) => ({
            label: attr.name,
            kind: CompletionItemKind.Enum,
        }));
    }

    if (
        cursorPosition === "attributeValue" ||
        (cursorPosition === "unknown" && prevNonWhitespaceChar === "=")
    ) {
        const elmName = this.normalizeElementName(element.name);
        const allowedAttributes =
            this.schemaElementsByName[elmName]?.attributes || [];
        const attribute = this._getAttributeContainsOffset(element, offset);
        const allowedAttrValues = allowedAttributes.find(
            (a) => a.name === attribute?.name,
        )?.values;
        if (!allowedAttrValues) {
            return [{ label: '""', kind: CompletionItemKind.Value }];
        }
        // If we are right after the =, we should include quotes in the completion,
        // otherwise, assume the user has already supplied the quote marks.
        const includeQuotes = prevNonWhitespaceChar === "=";
        const quote = includeQuotes ? '"' : "";
        return allowedAttrValues.map((value) => ({
            label: `${quote}${value}${quote}`,
            kind: CompletionItemKind.Value,
        }));
    }
    return [];
}

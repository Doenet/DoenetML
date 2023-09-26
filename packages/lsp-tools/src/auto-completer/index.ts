import { DoenetSourceObject, RowCol } from "../doenet-source-object";
import { doenetSchema } from "@doenet/static-assets";
import type { CompletionItem } from "vscode-languageserver/browser";
import { CompletionItemKind } from "vscode-languageserver/browser";
import { DastAttribute, DastElement, showCursor } from "@doenet/parser";

type ElementSchema = {
    name: string;
    top: boolean;
    attributes: { name: string; values?: string[] }[];
    children: string[];
    acceptsStringChildren: boolean;
};

/**
 * A class to make auto-completion queries on DoenetML source.
 */
export class AutoCompleter {
    sourceObj: DoenetSourceObject = new DoenetSourceObject();
    schema: ElementSchema[] = [];
    schemaLowerToUpper: Record<string, string> = {};
    schemaTopAllowedElements: string[] = [];
    schemaElementsByName: Record<string, ElementSchema> = {};

    constructor(
        source?: string,
        schema: ElementSchema[] = doenetSchema.elements,
    ) {
        if (source != null) {
            this.sourceObj.setSource(source);
        }
        if (schema) {
            this.setSchema(schema);
        }
    }

    /**
     * Set the schema to be used for auto-completion.
     * @param schema
     */
    setSchema(schema: ElementSchema[]) {
        this.schema = schema;
        this.schemaLowerToUpper = Object.fromEntries(
            this.schema.map((e) => [e.name.toLowerCase(), e.name]),
        );
        this.schemaElementsByName = Object.fromEntries(
            this.schema.map((e) => [e.name, e]),
        );
        this.schemaTopAllowedElements = this.schema
            .filter((e) => e.top)
            .map((e) => e.name);
    }

    /**
     * Get a list of completion items at the given offset.
     */
    getCompletionItems(offset: number | RowCol): CompletionItem[] {
        if (typeof offset !== "number") {
            offset = this.sourceObj.rowColToOffset(offset);
        }

        {
            // XXX Debug
            const cursor = this.sourceObj.lezerCursor;
            cursor.moveTo(offset);
            console.log("Cursor at pos:", showCursor(cursor));
        }

        const prevChar = this.sourceObj.source.charAt(offset - 1);
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
        let containingElement = this.sourceObj.elementAtOffset(offset);
        const element = containingElement.node;
        let cursorPosition = containingElement.cursorPosition;
        if (!element && containingNode && containingNode.type === "text") {
            // We're in the root of the document and not inside any special XML tags (like `<? foo ?>` or `<!DOCTYPE xml>`)
            // Find out what items we can complete.

            // If the previous char is a `<`, we suggest all top-level elements.
            if (prevChar === "<") {
                return this.schemaTopAllowedElements.map((name) => ({
                    label: name,
                    kind: CompletionItemKind.Module,
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
                    label: element.name,
                    kind: CompletionItemKind.Module,
                },
            ];
        }

        const { tagComplete, closed } =
            this.sourceObj.isCompleteElement(element);

        console.log({ tagComplete, closed });

        if (
            cursorPosition === "body" &&
            containingElement.node &&
            prevChar === "<"
        ) {
            // We're in the body of an element. Suggest all allowed children.
            return this._getAllowedChildren(containingElement.node.name).map(
                (name) => ({
                    label: name,
                    kind: CompletionItemKind.Module,
                }),
            );
        }

        if (cursorPosition === "openTagName") {
            // We're in the open tag name. Suggest everything that starts with the current text.
            const currentText = element.name.toLowerCase();
            const parent = this.sourceObj.getParent(element);
            if (!parent) {
                return this.schemaTopAllowedElements
                    .filter((name) =>
                        name.toLowerCase().startsWith(currentText),
                    )
                    .map((name) => ({
                        label: name,
                        kind: CompletionItemKind.Module,
                    }));
            }

            return this._getAllowedChildren(parent.name)
                .filter((label) => label.toLowerCase().startsWith(currentText))
                .map((label) => ({
                    label,
                    kind: CompletionItemKind.Module,
                }));
        }

        if (
            cursorPosition === "openTag" ||
            cursorPosition === "attributeName"
        ) {
            const elmName = this.normalizeElementName(element.name);
            const allowedAttributes =
                this.schemaElementsByName[elmName]?.attributes || [];
            return allowedAttributes.map((attr) => ({
                label: attr.name,
                kind: CompletionItemKind.Property,
            }));
        }

        if (cursorPosition === "unknown" && prevNonWhitespaceChar === "=") {
            const elmName = this.normalizeElementName(element.name);
            const allowedAttributes =
                this.schemaElementsByName[elmName]?.attributes || [];
            const attribute = this._getAttributeLeftOfOffset(element, offset);
            const allowedAttrValues = allowedAttributes.find(
                (a) => a.name === attribute?.name,
            )?.values;
            if (!allowedAttrValues) {
                return [{ label: '""', kind: CompletionItemKind.Value }];
            }
            return allowedAttrValues.map((value) => ({
                label: `"${value}"`,
                kind: CompletionItemKind.Value,
            }));
        }
        return [];
    }

    /**
     * Get the children allowed inside an `elementName` named element.
     * The search is case insensitive.
     */
    _getAllowedChildren(elementName: string): string[] {
        elementName = this.normalizeElementName(elementName);
        return this.schemaElementsByName[elementName]?.children || [];
    }

    /**
     * Gets the attribute that ends to the left of `offset`, if one exists.
     */
    _getAttributeLeftOfOffset(
        node: DastElement,
        offset: number,
    ): DastAttribute | null {
        let candidate = node.attributes[0];
        let candidateOffset = candidate.position?.end?.offset!;
        for (const attr of node.attributes) {
            let attrOffset = attr.position?.end?.offset!;
            if (attrOffset > candidateOffset && attrOffset <= offset) {
                candidate = attr;
            }
        }
        return candidate || null;
    }

    /**
     * Set the internal DoenetSourceObject. This should not normally be used,
     * but may be used if you want to pool DoenetSourceObjects over multiple
     * instances.
     */
    setDoenetSourceObject(sourceObj: DoenetSourceObject) {
        this.sourceObj = sourceObj;
    }

    /**
     * Set the DoenetML source string. All future queries will be run on this source.
     */
    setSource(source: string) {
        this.sourceObj.setSource(source);
        return this;
    }

    get source() {
        return this.sourceObj.source;
    }

    /**
     * Convert an element name to its standard capitalization.
     */
    normalizeElementName(name: string) {
        return this.schemaLowerToUpper[name.toLowerCase()] || "UNKNOWN_NAME";
    }
}

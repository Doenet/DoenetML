import { DoenetSourceObject, RowCol } from "../doenet-source-object";
import { doenetSchema } from "@doenet/static-assets";
import type { CompletionItem } from "vscode-languageserver/browser";
import { CompletionItemKind } from "vscode-languageserver/browser";
import { DastAttribute, DastElement, showCursor } from "@doenet/parser";
import { getCompletionItems } from "./get-completion-items";
import { getSchemaViolations } from "./get-schema-violations";

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
    getCompletionItems = getCompletionItems;

    /**
     * Get a list of LSP `Diagnostic`s for schema violations.
     */
    getSchemaViolations = getSchemaViolations;

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

import { DoenetSourceObject, RowCol } from "../doenet-source-object";
import { doenetSchema } from "@doenet/static-assets";
import { DastAttribute, DastElement } from "@doenet/parser";
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
    /**
     * A map of element names (in lower case) to their canonical capitalization.
     */
    schemaLowerToUpper: Record<string, string> = {};
    /**
     * A map of attribute names (in lower case) to their canonical capitalization.
     */
    schemaAttributesLowerToUpper: Record<string, string> = {};
    schemaTopAllowedElements: string[] = [];
    schemaElementsByName: Record<string, ElementSchema> = {};
    parentChildMap: Map<string, Set<string>> = new Map();
    nodeAttributeMap: Map<string, Map<string, Set<string> | null>> = new Map();

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
        this.schemaAttributesLowerToUpper = Object.fromEntries(
            this.schema.flatMap((e) => {
                return e.attributes.map((a) => [a.name.toLowerCase(), a.name]);
            }),
        );
        this.schemaElementsByName = Object.fromEntries(
            this.schema.map((e) => [e.name, e]),
        );
        this.schemaTopAllowedElements = this.schema
            .filter((e) => e.top)
            .map((e) => e.name);
        this.parentChildMap = new Map(
            this.schema.map((e) => [e.name, new Set(e.children)]),
        );
        this.nodeAttributeMap = new Map(
            this.schema.map((e) => [
                e.name,
                new Map(
                    e.attributes.map((a) => [
                        a.name,
                        a.values ? new Set(a.values) : null,
                    ]),
                ),
            ]),
        );
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
        if (!candidate) {
            return null;
        }
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
    normalizeElementName(name: string): string | "UNKNOWN_NAME" {
        return this.schemaLowerToUpper[name.toLowerCase()] || "UNKNOWN_NAME";
    }

    /**
     * Convert an attribute name to its standard capitalization.
     */
    normalizeAttributeName(name: string): string | "UNKNOWN_NAME" {
        return (
            this.schemaAttributesLowerToUpper[name.toLowerCase()] ||
            "UNKNOWN_NAME"
        );
    }

    /**
     * Gets whether the child is allowed inside the parent. This function normalizes the
     * name of the parent and child before checking.
     */
    isAllowedChild(parentName: string, childName: string): boolean {
        parentName = this.normalizeElementName(parentName);
        childName = this.normalizeElementName(childName);
        if (parentName === "UNKNOWN_NAME" || childName === "UNKNOWN_NAME") {
            return false;
        }
        return this.parentChildMap.get(parentName)?.has(childName) || false;
    }

    /**
     * Checks whether the given attribute is allowed on the given element. This function
     * normalizes the name of the element and attribute before checking.
     */
    isAllowedAttribute(elementName: string, attributeName: string): boolean {
        elementName = this.normalizeElementName(elementName);
        attributeName = this.normalizeAttributeName(attributeName);
        if (
            elementName === "UNKNOWN_NAME" ||
            attributeName === "UNKNOWN_NAME"
        ) {
            return false;
        }
        return (
            this.nodeAttributeMap.get(elementName)?.has(attributeName) || false
        );
    }

    /**
     * Gets the schema for a given attribute of a given element. This function
     * normalizes the name of the element and attribute before checking.
     */
    getAttributeAllowedValues(elementName: string, attributeName: string) {
        elementName = this.normalizeElementName(elementName);
        attributeName = this.normalizeAttributeName(attributeName);
        if (
            elementName === "UNKNOWN_NAME" ||
            attributeName === "UNKNOWN_NAME"
        ) {
            return null;
        }
        return (
            this.nodeAttributeMap.get(elementName)?.get(attributeName) || null
        );
    }
}

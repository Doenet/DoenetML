import { DoenetSourceObject, RowCol } from "../doenet-source-object";
import { doenetSchema } from "@doenet/static-assets/schema";
import { DastAttributeV6, DastElementV6 } from "@doenet/parser";
import { getCompletionItems } from "./methods/get-completion-items";
import { getSchemaViolations } from "./methods/get-schema-violations";
import { getCompletionContext } from "./methods/get-completion-context";

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
    nodeAttributeMap: Map<
        string,
        Map<string, { correctCase: Set<string>; lowerCase: Set<string> } | null>
    > = new Map();

    constructor(
        source?: string,
        schema: ElementSchema[] = doenetSchema.elements,
    ) {
        if (source != null) {
            // Adding a space at the end of the source so that a final "<"
            // will be parsed as a text "<" rather than an invalid element.
            this.sourceObj.setSource(source + " ");
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
                        a.values
                            ? {
                                  correctCase: new Set(a.values),
                                  lowerCase: new Set(
                                      a.values.map((v) => v.toLowerCase()),
                                  ),
                              }
                            : null,
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
     * Get context about the current cursor position to determine whether completions should be offered or not,
     * and what type of completions should be offered.
     */
    getCompletionContext = getCompletionContext;

    /**
     * Get the children allowed inside an `elementName` named element.
     * The search is case insensitive.
     */
    _getAllowedChildren(elementName: string): string[] {
        elementName = this.normalizeElementName(elementName);
        return this.schemaElementsByName[elementName]?.children || [];
    }

    /**
     * Gets the attribute where offset is between its start and end position, if one exists.
     */
    _getAttributeContainsOffset(
        node: DastElementV6,
        offset: number,
    ): DastAttributeV6 | null {
        const candidate = Object.values(node.attributes).find((attr) => {
            const start = attr.position?.start.offset;
            const end = attr.position?.end.offset;
            return (
                start !== undefined &&
                end !== undefined &&
                offset >= start &&
                offset <= end
            );
        });

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
        this.sourceObj.setSource(source + " ");
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

import { DoenetSourceObject, RowCol } from "../doenet-source-object";
import { doenetSchema } from "@doenet/static-assets/schema";
import { COMPLETION_SNIPPETS } from "@doenet/static-assets/completion-snippets";
import type { CompletionSnippetCursor } from "@doenet/static-assets/completion-snippet-protocol";
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

type ProcessedSnippet = {
    key: string;
    element: string;
    normalizedElement: string;
    snippet: string;
    description: string;
    cursor?: CompletionSnippetCursor;
};

/**
 * Shift snippet cursor offsets after trimming leading whitespace.
 */
function adjustCursorForTrimStart(
    cursor: CompletionSnippetCursor,
    trimmedCharacters: number,
): CompletionSnippetCursor {
    if ("caretOffset" in cursor) {
        return {
            caretOffset: Math.max(0, cursor.caretOffset - trimmedCharacters),
        };
    }

    return {
        selectionStartOffset: Math.max(
            0,
            cursor.selectionStartOffset - trimmedCharacters,
        ),
        selectionEndOffset: Math.max(
            0,
            cursor.selectionEndOffset - trimmedCharacters,
        ),
    };
}

/**
 * A class to make auto-completion queries on DoenetML source.
 *
 * The completer covers both XML editing workflows and ref workflows such as
 * `$name` and `$name.member`, using the current parsed source plus schema data.
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
    /**
     * Processed snippets indexed by element (normalized to schema capitalization) for quick lookup.
     */
    snippetsByNormalizedElement: Map<string, ProcessedSnippet[]> = new Map();

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
        this._initializeSnippets();
    }

    /**
     * Get completion items at the given offset, including XML, snippet, and
     * ref-specific completions.
     */
    getCompletionItems = getCompletionItems;

    /**
     * Get a list of LSP `Diagnostic`s for schema violations.
     */
    getSchemaViolations = getSchemaViolations;

    /**
     * Get the high-level completion context at the given cursor position,
     * including incomplete ref contexts that may not yet parse as full macros.
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

    /**
     * Initialize snippets map after schema is set.
     * Processes all snippets and indexes them by their normalized element name for quick lookup.
     */
    private _initializeSnippets() {
        this.snippetsByNormalizedElement.clear();

        Object.entries(COMPLETION_SNIPPETS).forEach(([key, snippet]) => {
            const rawSnippet = snippet.snippet ?? "";
            const trimmedSnippet = rawSnippet.trimStart();
            const trimmedCharacters = rawSnippet.length - trimmedSnippet.length;
            const normalizedElement = this.normalizeElementName(
                snippet.element,
            );
            if (normalizedElement === "UNKNOWN_NAME") {
                // Skip snippets for unknown elements
                console.warn(
                    `Skipping snippet "${key}": invalid element name "${snippet.element}".`,
                );
                return;
            }

            const processed: ProcessedSnippet = {
                key,
                element: snippet.element,
                normalizedElement,
                snippet: trimmedSnippet,
                description: snippet.description,
                cursor: snippet.cursor
                    ? adjustCursorForTrimStart(
                          snippet.cursor,
                          trimmedCharacters,
                      )
                    : undefined,
            };

            if (!this.snippetsByNormalizedElement.has(normalizedElement)) {
                this.snippetsByNormalizedElement.set(normalizedElement, []);
            }
            this.snippetsByNormalizedElement
                .get(normalizedElement)!
                .push(processed);
        });
    }

    /**
     * Get snippets allowed for a given set of allowed element names.
     * Filters snippets by:
     * 1. Whether their element is in the allowed elements set
     * 2. Whether their key starts with the typed prefix
     *
     * @param allowedElements - Set of allowed element names
     * @param typedPrefix - The text typed after `<` (used for prefix filtering)
     * @returns Array of ProcessedSnippets that match the criteria
     */
    _getSnippetsForElements(
        allowedElements: Set<string>,
        typedPrefix: string = "",
    ): ProcessedSnippet[] {
        const results: ProcessedSnippet[] = [];

        // Iterate through allowed elements and collect their snippets
        for (const elementName of allowedElements) {
            const snippets =
                this.snippetsByNormalizedElement.get(elementName) || [];
            results.push(...snippets);
        }

        // Filter by typed prefix on snippet key if prefix is provided
        if (typedPrefix) {
            const prefixLower = typedPrefix.toLowerCase();
            return results.filter((s) =>
                s.key.toLowerCase().startsWith(prefixLower),
            );
        }
        return results;
    }
}

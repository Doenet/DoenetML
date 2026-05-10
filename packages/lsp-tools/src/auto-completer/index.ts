import { DoenetSourceObject, RowCol } from "../doenet-source-object";
import { doenetSchema } from "@doenet/static-assets/schema";
import { COMPLETION_SNIPPETS } from "@doenet/static-assets/completion-snippets";
import type { CompletionSnippetCursor } from "@doenet/static-assets/completion-snippet-protocol";
import { DastAttribute, DastElement } from "@doenet/parser";
import { getCompletionItems } from "./methods/get-completion-items";
import { getSchemaViolations } from "./methods/get-schema-violations";
import {
    getCompletionContext,
    type CompletionContext,
} from "./methods/get-completion-context";
import type { RustResolverAdapter } from "./rust-resolver-adapter";

/**
 * Per-attribute fields surfaced in autocomplete and the help panel. The
 * narrow autocomplete fields (`values`, `autocompleteValues`) coexist with
 * help-only fields (`defaultValue`); both come from the same JSON schema.
 */
export type SchemaAttribute = {
    name: string;
    description?: string;
    values?: string[];
    autocompleteValues?: string[];
    defaultValue?: unknown;
};

/**
 * Per-property fields. `type`/`isArray` are help-only metadata.
 */
export type SchemaProperty = {
    name: string;
    description?: string;
    type?: string;
    isArray?: boolean;
};

export type ElementSchema = {
    name: string;
    summary?: string;
    /** Slug into the docs site, used by the help panel to link out. */
    docsSlug?: string | null;
    top: boolean;
    attributes: SchemaAttribute[];
    properties?: SchemaProperty[];
    children: string[];
    acceptsStringChildren: boolean;
    takesIndex?: boolean;
    /** Map from child component type → key in `aliasedElements` providing
     *  context-specific help (e.g. `<row>` inside `<matrix>` → `matrixRow`). */
    childContextHelp?: Record<string, string>;
};

/**
 * Help-only payload carrying alias-specific descriptions (e.g. `matrixRow`).
 * Aliased entries are looked up via a parent element's `childContextHelp` and
 * are never themselves valid top-level/child elements, so they only carry the
 * fields used for help/documentation.
 */
export type AliasedElementSchema = {
    name: string;
    summary?: string;
    docsSlug?: string | null;
    attributes: SchemaAttribute[];
    properties?: SchemaProperty[];
};

type ProcessedSnippet = {
    key: string;
    element: string;
    normalizedElement: string;
    snippet: string;
    description: string;
    cursor?: CompletionSnippetCursor;
};

export type ResolveRefMemberContainerArgs = {
    /** Character offset into the source string (0-based) */
    offset: number;
    /** Path segments to resolve (e.g., ["foo", "bar"] for $foo.bar) */
    pathParts: string[];
    /** Per-path-part index flags aligned with pathParts. */
    pathPartHasIndex?: boolean[];
    /** Optional flat-tree node index at the given offset, for Rust-backed resolution */
    nodeIndex?: number | null;
};

export type RefMemberContainerResolution = {
    node: DastElement | null;
    unresolvedPathParts: string[];
    /**
     * Descendant names that are actually visible from the resolved node (respecting
     * visibility rules like `ChildrenInvisibleToTheirGrandparents`).
     * Resolvers must always provide this field.
     */
    visibleDescendantNames: string[];
};

export type ResolveRefMemberContainer = (
    args: ResolveRefMemberContainerArgs,
) => RefMemberContainerResolution | null;

export type AutoCompleterOptions = {
    sourceObj?: DoenetSourceObject;
    rustResolverAdapter?: RustResolverAdapter;
    getAdditionalRefNames?: (offset: number) => string[];
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
    _rustResolverAdapter?: RustResolverAdapter;
    _getAdditionalRefNamesImpl?: (offset: number) => string[];
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
    /**
     * Aliased schema entries (e.g. `matrixRow`) keyed by their alias name.
     * Used for context-help lookup via parent `childContextHelp`. These are
     * not real elements; do not consult them for child/attribute validation.
     */
    schemaAliasedElementsByName: Record<string, AliasedElementSchema> = {};
    /**
     * Lower-cased index over `schemaAliasedElementsByName` so help lookups can
     * tolerate non-canonical author casing in the alias name. Built once in
     * `setSchema`; aliased maps are small.
     */
    schemaAliasedElementsByLowerName: Map<string, AliasedElementSchema> =
        new Map();
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
        options?: AutoCompleterOptions,
    ) {
        this.sourceObj = options?.sourceObj ?? new DoenetSourceObject();
        if (source != null) {
            // Adding a space at the end of the source so that a final "<"
            // will be parsed as a text "<" rather than an invalid element.
            this.sourceObj.setSource(source + " ");
        }
        this._rustResolverAdapter = options?.rustResolverAdapter;
        this._getAdditionalRefNamesImpl = options?.getAdditionalRefNames;
        if (schema) {
            this.setSchema(schema);
        }
    }

    /**
     * Return any additional ref names injected for this offset.
     */
    getAdditionalRefNames(offset: number): string[] {
        return this._getAdditionalRefNamesImpl?.(offset) ?? [];
    }

    /**
     * Test whether `name` is addressable from `offset`.
     * Returns `false` when no Rust resolver adapter is set.
     */
    isNameAddressable(offset: number, name: string): boolean {
        if (this._rustResolverAdapter) {
            return this._rustResolverAdapter.isNameAddressableFromOffset(
                offset,
                name,
            );
        }
        return false;
    }

    /**
     * Resolve the ref container for member completion from parsed path parts.
     *
     * `pathParts` includes the currently edited segment as its last item.
     * For example, in `$P.coords` this resolves to `P`, while in `$P.coords.`
     * it resolves to `coords`.
     */
    resolveRefMemberContainerAtOffset(
        offset: number,
        pathParts: string[],
        pathPartHasIndex?: boolean[],
    ): RefMemberContainerResolution {
        if (this._rustResolverAdapter) {
            const resolved =
                this._rustResolverAdapter.resolveRefMemberContainerAtOffset(
                    offset,
                    pathParts,
                    pathPartHasIndex,
                );
            if (resolved) {
                return resolved;
            }
        }
        const unresolvedPathParts =
            pathParts.length > 0 ? pathParts.slice(0, -1) : [];
        return {
            node: null,
            unresolvedPathParts,
            visibleDescendantNames: [],
        };
    }

    /**
     * Set the schema to be used for auto-completion. Optionally also pass an
     * `aliasedElements` map (e.g. `doenetSchema.aliasedElements`) so help
     * lookups can resolve parent-scoped child aliases. When `schema` is the
     * bundled `doenetSchema.elements` and no explicit alias map is provided,
     * the bundled `doenetSchema.aliasedElements` is used so alias-aware help
     * works automatically — no matter whether the schema is set via the
     * constructor or via a later `setSchema()` call. Pass `{}` explicitly to
     * opt out.
     */
    setSchema(
        schema: ElementSchema[],
        aliasedElements?: Record<string, AliasedElementSchema>,
    ) {
        this.schema = schema;
        this.schemaAliasedElementsByName =
            aliasedElements ??
            (schema === doenetSchema.elements
                ? (doenetSchema.aliasedElements as Record<
                      string,
                      AliasedElementSchema
                  >)
                : {});
        this.schemaAliasedElementsByLowerName = new Map(
            Object.entries(this.schemaAliasedElementsByName).map(([k, v]) => [
                k.toLowerCase(),
                v,
            ]),
        );
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
    getCompletionItems = (
        offset: number | RowCol,
        cachedContext?: CompletionContext,
    ) => getCompletionItems.call(this, offset, cachedContext);

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
     * Case-insensitive lookup among real schema elements. Returns the
     * canonical entry for an author-supplied tag name, regardless of casing.
     */
    findSchemaElement(name: string): ElementSchema | undefined {
        const upper = this.schemaLowerToUpper[name.toLowerCase()];
        return upper ? this.schemaElementsByName[upper] : undefined;
    }

    /**
     * Case-insensitive lookup among aliased help-only schema entries. Aliased
     * entries are resolved via a parent's `childContextHelp` and are not
     * valid authored elements; this exists solely for documentation lookup.
     */
    findAliasedSchemaElement(name: string): AliasedElementSchema | undefined {
        return (
            this.schemaAliasedElementsByName[name] ??
            this.schemaAliasedElementsByLowerName.get(name.toLowerCase())
        );
    }

    /**
     * Resolve the schema entry that supplies *help/documentation* for a child
     * element placed inside `parentName`. When the parent declares a
     * `childContextHelp` alias for the child (e.g. `<row>` inside `<matrix>`
     * → `matrixRow`), return the aliased entry; otherwise return the child's
     * own entry. Single source of truth for both autocomplete documentation
     * and the context-help panel.
     */
    resolveEffectiveSchemaElement(
        ownEntry: ElementSchema | undefined,
        parentName: string | undefined,
    ): ElementSchema | AliasedElementSchema | undefined {
        if (!ownEntry) return undefined;
        if (!parentName) return ownEntry;
        const parentEntry = this.findSchemaElement(parentName);
        const aliasName = parentEntry?.childContextHelp?.[ownEntry.name];
        if (!aliasName) return ownEntry;
        return this.findAliasedSchemaElement(aliasName) ?? ownEntry;
    }

    /**
     * Gets the attribute where offset is between its start and end position, if one exists.
     */
    _getAttributeContainsOffset(
        node: DastElement,
        offset: number,
    ): DastAttribute | null {
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
    _initializeSnippets() {
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

// Export resolver adapter for external use
export { RustResolverAdapter } from "./rust-resolver-adapter";
export type {
    RustResolverCore,
    RustResolverAdapterOptions,
} from "./rust-resolver-adapter";

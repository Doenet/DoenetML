import { DoenetSourceObject, RowCol } from "../doenet-source-object";
import { findAttributeContainingOffset } from "../doenet-source-object/methods/attribute-helpers";
import { doenetSchema } from "@doenet/static-assets/schema";
import type { ValidValueEntry } from "@doenet/static-assets/schema";
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

// Re-exported so consumers (notably `@doenet/lsp`'s context-help feature)
// can type a precomputed completion context they thread into
// `computeContextHelp` to avoid a redundant schema walk per RPC.
export { type CompletionContext };

/**
 * Per-attribute fields surfaced in autocomplete and the help panel.
 *
 * `values` is the validation set (plain strings, may include boolean aliases
 * like `"true"`/`"false"` injected by `valueForTrue`/`valueForFalse`).
 * `autocompleteValues` is the author-facing list with per-value descriptions —
 * boolean aliases are intentionally omitted so they don't pollute suggestions.
 */
export type SchemaAttribute = {
    name: string;
    description?: string;
    values?: string[];
    autocompleteValues?: ValidValueEntry[];
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

export type ProcessedSnippet = {
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
) => Promise<RefMemberContainerResolution | null>;

/**
 * Bundle of resolution + schema data the help layer needs to describe a
 * referent: which node the ref points at, where it lives in the source, and
 * the alias-aware schema entries that provide its summary and docs link.
 */
export type RefHelpInfo = {
    referent: DastElement;
    line: number | undefined;
    ownEntry: ElementSchema | undefined;
    effectiveEntry: ElementSchema | AliasedElementSchema | undefined;
};

/**
 * Repeat-introduced binding visible at a cursor offset: the `<repeat>` /
 * `<repeatForSequence>` ancestor that declares `valueName` or `indexName`,
 * plus which role the name plays. Pure-AST — no rust resolver needed.
 */
export type DerivedRepeatNameInfo = {
    owner: DastElement;
    role: "valueName" | "indexName";
    /** 1-indexed source line of the introducing repeat. */
    line: number | undefined;
};

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
    /**
     * Processed snippets indexed by their key (the snippet's unique identifier,
     * which is also the completion `label`). Used by the help layer to look up
     * a snippet's description and template text from a highlighted autocomplete
     * row.
     */
    snippetsByKey: Map<string, ProcessedSnippet> = new Map();

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
     * Attach a rust resolver adapter after construction.  The LSP uses this
     * to plug in the adapter once its worker is ready, without rebuilding
     * the AutoCompleter (which would otherwise force a swap with a fresh
     * `sourceObj` / schema setup).  Queries issued before this is called
     * fall back to the no-rust paths.
     */
    setRustResolverAdapter(adapter: RustResolverAdapter) {
        this._rustResolverAdapter = adapter;
        this._getAdditionalRefNamesImpl = (offset: number) =>
            adapter.getDerivedRepeatNames(offset);
    }

    /**
     * Test whether `name` is addressable from `offset`.
     * Returns `false` when no Rust resolver adapter is set.
     */
    async isNameAddressable(offset: number, name: string): Promise<boolean> {
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
    async resolveRefMemberContainerAtOffset(
        offset: number,
        pathParts: string[],
        pathPartHasIndex?: boolean[],
    ): Promise<RefMemberContainerResolution> {
        if (this._rustResolverAdapter) {
            const resolved =
                await this._rustResolverAdapter.resolveRefMemberContainerAtOffset(
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
     *
     * Note: the auto-load is keyed on **reference identity** to
     * `doenetSchema.elements`, not on deep equality. Callers that pass a copy
     * — e.g. `setSchema([...doenetSchema.elements])` to clone before
     * mutating — silently lose alias-awareness. Pass
     * `doenetSchema.aliasedElements` explicitly in that case.
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
     * Look up a bare ref `$name` at `offset` and return the data both the
     * autocomplete dropdown and the context-help panel need: the referent
     * node, the 1-indexed source line where it's defined, and the alias-aware
     * schema entries for help text. Returns `null` when the name doesn't
     * resolve from `offset`.
     *
     * Uses the AST-only parent-chain walk in `getReferentAtOffset`, so it
     * finds elements with a `name` attribute but does not see repeat-introduced
     * names (`valueName`/`indexName`). For those, see
     * `resolveDerivedRepeatNameForHelp`.
     */
    resolveRefNameForHelp(offset: number, name: string): RefHelpInfo | null {
        const referent = this.sourceObj.getReferentAtOffset(offset, name);
        if (!referent) return null;
        return this._buildRefHelpInfo(referent);
    }

    /**
     * Look up a bare ref `$name` at `offset` against repeat-introduced
     * bindings only. Walks the parent chain from `offset` and, for each
     * ancestor `<repeat>` / `<repeatForSequence>`, checks whether its
     * `valueName` or `indexName` attribute literal equals `name`.
     *
     * Returns `null` when no enclosing repeat binds `name`. Companion to
     * `resolveRefNameForHelp` — the help layer tries the named-element
     * path first (richer schema metadata) and falls through here for
     * repeat-introduced names that the runtime resolver would see but the
     * DAST-by-name walk misses.
     *
     * Pure AST — no rust resolver involved. Available as soon as the
     * editor has parsed the document, so help for `$i` inside a repeat
     * works during the cold-start window too.
     */
    resolveDerivedRepeatNameForHelp(
        offset: number,
        name: string,
    ): DerivedRepeatNameInfo | null {
        let current: DastElement | undefined =
            this.sourceObj.elementAtOffset(offset) ?? undefined;
        while (current) {
            const match = this.resolveDerivedRepeatNameOnElement(current, name);
            if (match) return match;
            const parent = this.sourceObj.getParent(current);
            current =
                parent && parent.type === "element"
                    ? (parent as DastElement)
                    : undefined;
        }
        return null;
    }

    /**
     * Check whether `element` itself introduces `name` as a `valueName` or
     * `indexName` binding. Returns `null` for non-repeat elements or when
     * neither attribute matches.
     *
     * Companion to `resolveDerivedRepeatNameForHelp` for cases where the
     * caller already has the candidate element — e.g. the resolver-returned
     * container for `$r[1].v`, where the runtime resolver augments
     * `visibleDescendantNames` with the repeat's `valueName`/`indexName`
     * (see `rust-resolver-adapter._resolveRefMemberContainer`) but the
     * named-descendant tree-walk in `resolveRefMemberDescendantHelp` misses
     * them because they're not in the `name=` attribute tree.
     */
    resolveDerivedRepeatNameOnElement(
        element: DastElement,
        name: string,
    ): DerivedRepeatNameInfo | null {
        if (element.name !== "repeat" && element.name !== "repeatForSequence") {
            return null;
        }
        for (const role of ["valueName", "indexName"] as const) {
            const attr = element.attributes[role];
            if (
                attr &&
                attr.children.length === 1 &&
                attr.children[0].type === "text" &&
                attr.children[0].value === name
            ) {
                const startOffset = element.position?.start.offset;
                const line =
                    startOffset != null &&
                    startOffset < this.sourceObj.source.length
                        ? this.sourceObj.offsetToRowCol(startOffset).line
                        : undefined;
                return { owner: element, role, line };
            }
        }
        return null;
    }

    /**
     * For a `$container.member` cursor whose container is already resolved,
     * decide whether `memberName` matches a uniquely-addressable named
     * descendant of `container`. Returns the help bundle when it does;
     * otherwise `null` so the caller can fall back to property lookup.
     *
     * Mirrors runtime ref-resolution precedence (`getMacroReferentAtOffset`):
     * a same-named descendant shadows a property on the container.
     */
    resolveRefMemberDescendantHelp(
        container: DastElement,
        memberName: string,
    ): RefHelpInfo | null {
        const descendant = this.sourceObj.getNamedDescendant(
            container,
            memberName,
        );
        if (!descendant) return null;
        return this._buildRefHelpInfo(descendant);
    }

    /**
     * Build the schema/line bundle the help panel needs from an
     * already-resolved referent node. Shared between the bare-ref path
     * (`resolveRefNameForHelp`) and the member-ref path that resolves a
     * named descendant of a container.
     */
    _buildRefHelpInfo(referent: DastElement): RefHelpInfo {
        // Recompute the line from the byte offset against the live source so
        // the displayed number always matches CodeMirror's (1-indexed) gutter.
        // Trusting `position.start.line` directly would surface stale or
        // synthetic line numbers (e.g. sugar transformations stamp placeholder
        // `{line:1, column:1}` positions on synthetic nodes — see
        // `parser/src/lezer-to-dast/gobble-function-arguments.ts`).
        const startOffset = referent.position?.start.offset;
        const line =
            startOffset != null && startOffset < this.sourceObj.source.length
                ? this.sourceObj.offsetToRowCol(startOffset).line
                : undefined;
        const normalized = this.normalizeElementName(referent.name);
        const ownEntry = this.schemaElementsByName[normalized];
        const parent = this.sourceObj.getParent(referent);
        const parentName = parent && "name" in parent ? parent.name : undefined;
        const effectiveEntry = this.resolveEffectiveSchemaElement(
            ownEntry,
            parentName,
        );
        return { referent, line, ownEntry, effectiveEntry };
    }

    /**
     * Gets the attribute where offset is between its start and end position, if one exists.
     */
    _getAttributeContainsOffset(
        node: DastElement,
        offset: number,
    ): DastAttribute | null {
        return findAttributeContainingOffset(
            Object.values(node.attributes),
            offset,
        );
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
        this.snippetsByKey.clear();

        Object.entries(COMPLETION_SNIPPETS).forEach(([key, snippet]) => {
            const rawSnippet = snippet.snippet ?? "";
            const trimmedSnippet = rawSnippet.trimStart();
            const trimmedCharacters = rawSnippet.length - trimmedSnippet.length;
            const normalizedElement = this.normalizeElementName(
                snippet.element,
            );
            if (normalizedElement === "UNKNOWN_NAME") {
                // Skip snippets whose element isn't in the active schema.
                // Tests intentionally supply reduced schemas, so unknown
                // here is normal — not a misconfiguration.
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
            this.snippetsByKey.set(key, processed);
        });
    }

    /**
     * Look up a processed snippet by its key (matches the completion `label`).
     * Returns `undefined` when the key isn't registered — for example when the
     * active schema doesn't include the snippet's root element.
     */
    findSnippet(key: string): ProcessedSnippet | undefined {
        return this.snippetsByKey.get(key);
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
    ResolverCore,
    RustResolverAdapterOptions,
} from "./rust-resolver-adapter";

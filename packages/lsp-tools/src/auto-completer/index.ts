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
import {
    COMPOSITE_WRAPPER_NAMES,
    getElementNameAttributeValue,
    type RustResolverAdapter,
} from "./rust-resolver-adapter";
import { isRepeatLikeElement } from "./repeat-elements";
import {
    collectModuleInstancesWithCopyOrExtend,
    getEffectiveModuleAttributes,
    type DeclaredModuleAttribute,
} from "./module-attributes";

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
 * Per-dimension entry shape mirrored from the schema generator's
 * `ArrayElementDescription` (see `static-assets/src/schema.ts`). `type` is
 * optional because an unwrapped array slot without `createComponentOfType`
 * has no type.
 */
export type ArrayElementDescription = {
    type?: string;
    isArray: boolean;
    numDimensions?: number;
};

/**
 * Per-property fields. `type`/`isArray` are help-only metadata.
 * `numDimensions`, `indexedArrayDescription`, and `indexAliases` are
 * carried only for array properties so the editor can chase coordinate
 * chains (`$vector.head.x`) through the alias table — see
 * `auto-completer/index-aliases.ts`.
 */
export type SchemaProperty = {
    name: string;
    description?: string;
    type?: string;
    isArray?: boolean;
    numDimensions?: number;
    indexedArrayDescription?: ArrayElementDescription[];
    indexAliases?: readonly (readonly string[])[];
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
 * are never themselves valid top-level/child elements, but they still carry
 * the children/attributes used to validate and complete what the author wrote
 * (e.g. `<row>` inside `<matrix>` accepts `<math>` children and the `MathList`
 * attribute set, not the tabular `<row>`'s; issue #1174).
 *
 * `children` / `acceptsStringChildren` are optional here for backward
 * compatibility with consumers that build aliased entries from older schema
 * snapshots and tests that only need help text. The schema generator
 * populates them on every emitted alias as of #1174.
 */
export type AliasedElementSchema = {
    name: string;
    summary?: string;
    docsSlug?: string | null;
    attributes: SchemaAttribute[];
    properties?: SchemaProperty[];
    children?: string[];
    /**
     * Populated for parity with `ElementSchema` and consumed by downstream
     * tools (e.g. doc generators); the LSP's validation/completion paths
     * don't read this field directly yet — they only consult `children`
     * and `attributes` when resolving an alias.
     */
    acceptsStringChildren?: boolean;
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
     * When the lookup partially resolved (i.e. `node` is null because of a
     * trailing unresolved segment), this is the deepest node that DID
     * resolve. Used by the help layer to perform an `indexAliases`
     * chase: e.g. for `$vector.head.x` the resolver returns `node: null`
     * with `unresolvedPathParts: ["head"]` and
     * `partiallyResolvedNode: <vector>`, and the help layer then checks
     * whether `head` is an array property of `<vector>` whose alias
     * table covers `x`. Unset (or `null`) when no node resolved.
     */
    partiallyResolvedNode?: DastElement | null;
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
 * Walk the subtree rooted at `node` and return the first descendant element
 * whose `name` attribute equals `target`, or `null` if none exists.
 */
function findNamedDescendant(
    node: DastElement,
    target: string,
): DastElement | null {
    for (const child of node.children) {
        if (child.type !== "element") continue;
        if (getElementNameAttributeValue(child) === target) return child;
        const inner = findNamedDescendant(child, target);
        if (inner) return inner;
    }
    return null;
}

/**
 * For composite wrappers (`<select>`, `<conditionalContent>`, …) whose
 * children are `<case>` / `<else>` / `<option>` branches, return the
 * first named descendant found by walking the wrapper subtrees — **but
 * only when every wrapper that contains `target` resolves it to the
 * same component type**. The help layer has no static way to know which
 * branch the runtime will pick (`<option>` is index-addressable but the
 * help call site doesn't carry the index; `<case>` is predicate-gated),
 * so when branches diverge in component type we'd be guessing at the
 * schema — return `null` and let the panel go blank instead.
 *
 * Returns `null` when `container` has no wrapper children, when no
 * wrapper contains `target`, or when matches across wrappers disagree
 * on element name.
 *
 * Used as a fallback when `getNamedDescendant` returns `null` because
 * two sibling branches each declared the same name. Parallels
 * `collectNamesFromCompositeChildren` in `rust-resolver-adapter.ts`,
 * which is what put `target` into `visibleDescendantNames` in the first
 * place (so this only runs when the resolver already affirmed the name
 * is reachable through a wrapper).
 */
function findDescendantViaCompositeWrappers(
    container: DastElement,
    target: string,
): DastElement | null {
    const matches: DastElement[] = [];
    for (const child of container.children) {
        if (child.type !== "element") continue;
        if (!COMPOSITE_WRAPPER_NAMES.has(child.name)) continue;
        const match = findNamedDescendant(child, target);
        if (match) matches.push(match);
    }
    if (matches.length === 0) return null;
    const firstName = matches[0].name;
    for (let i = 1; i < matches.length; i++) {
        if (matches[i].name !== firstName) return null;
    }
    return matches[0];
}

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

    /**
     * Per-instance allow-list of attributes declared by the `<module>`
     * a given `<module copy="$x" .../>` (or `extend=`) site resolves to
     * (issue #1154 out-of-scope extension).  Keyed by the DAST element of
     * the copy-site; the inner map is lowercased attribute name →
     * declared-attribute metadata (currently the child element's
     * component type, per #1189).
     *
     * Populated by `_refreshModuleInstanceAttributes()` once per source
     * revision; the validation and completion paths consult this map
     * synchronously to augment their canonical-schema decisions for the
     * specific instance.  Sites that don't resolve, target a non-`<module>`,
     * or hit a `<module>` without `<moduleAttributes>` are NOT in the map
     * (per scope-lock: canonical schema applies as-is in those cases).
     */
    _moduleInstanceAttributeAllowlist: Map<
        DastElement,
        Map<string, DeclaredModuleAttribute>
    > = new Map();

    /**
     * `_sourceRevision` snapshot from the rust adapter that the per-instance
     * allowlist was last computed against.  Starts at `-1` so the first
     * refresh always runs.  When the adapter's revision matches, the
     * refresh returns early — back-to-back validation + completion calls
     * between edits do at most one resolver round-trip per site total.
     */
    _moduleInstanceAllowlistSourceRevision = -1;

    /**
     * In-flight refresh promise so concurrent callers (e.g. validation and
     * completion awaited in parallel) join the same `Promise.all` batch
     * instead of each firing their own.  Cleared in a `finally` so the
     * next post-edit call starts a fresh round.  Sequential coalescing
     * still hinges on `_moduleInstanceAllowlistSourceRevision` above.
     */
    _moduleInstanceAllowlistRefreshInFlight: Promise<void> | null = null;

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
     * Classify an unresolved bare `$name` reference at `offset`. Delegates to
     * the Rust resolver (the runtime's own algorithm) so `notFound` /
     * `multiple` verdicts are authoritative. Returns `"indeterminate"` when no
     * resolver is attached (cold start, JS-only tests) so the help layer never
     * presents an incomplete-view miss as a definite "no referent".
     */
    async classifyBareReference(
        offset: number,
        name: string,
    ): Promise<"found" | "notFound" | "multiple" | "indeterminate"> {
        if (
            this._rustResolverAdapter &&
            typeof this._rustResolverAdapter.classifyBareReferenceFromOffset ===
                "function"
        ) {
            return this._rustResolverAdapter.classifyBareReferenceFromOffset(
                offset,
                name,
            );
        }
        return "indeterminate";
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
     * Rebuild `_moduleInstanceAttributeAllowlist` for every `<module copy=…>`
     * (or `extend=`) site in the current source.  Issued in parallel via
     * `Promise.all`, so a document with N module-copy sites pays one
     * resolver round-trip per site total — not per validation/completion
     * call.
     *
     * Coalesces by `_sourceRevision` from the rust adapter: when the source
     * hasn't changed since the last refresh, this returns immediately.  Two
     * back-to-back callers (validation then completion) thus do at most one
     * resolution per site between each edit, and rapid keystroke bursts
     * drain in one batch when the typing pauses.
     *
     * Disabled when the rust adapter is absent (cold start, tests without
     * WASM) — the allowlist is cleared, and validation/completion fall
     * through to canonical-only behavior identical to today.
     */
    async _refreshModuleInstanceAttributes(): Promise<void> {
        if (!this._rustResolverAdapter) {
            this._moduleInstanceAttributeAllowlist.clear();
            this._moduleInstanceAllowlistSourceRevision = -1;
            return;
        }
        const rev = this._rustResolverAdapter._sourceRevision;
        if (rev === this._moduleInstanceAllowlistSourceRevision) return;

        // Concurrent callers (validation + completion awaited in parallel)
        // would otherwise each issue a full `Promise.all` batch since the
        // revision check passes before either has finished writing.  Stash
        // the in-flight promise so they share one round-trip per site.
        if (this._moduleInstanceAllowlistRefreshInFlight) {
            return this._moduleInstanceAllowlistRefreshInFlight;
        }

        const adapter = this._rustResolverAdapter;
        const refresh = (async () => {
            // `rev` was captured before any await.  If an `updateSource`
            // lands during the `Promise.all` below, `adapter._sourceRevision`
            // will advance past `rev` and `this.sourceObj.dast` may be
            // re-parsed.  The entries we write here then reference the
            // OLD parse's DAST elements while consumers look up new-parse
            // refs and miss — falling back to canonical-only validation
            // for one cycle.  That's self-correcting: the next refresh
            // sees `_sourceRevision !== _moduleInstanceAllowlistSourceRevision`
            // (because we stamp the OLD `rev`, not the current one) and
            // re-runs against the new parse.  No wrong augmentation can
            // be produced — only briefly-missing augmentation.
            const instances = collectModuleInstancesWithCopyOrExtend(
                this.sourceObj.dast,
            );
            const entries = await Promise.all(
                instances.map(async (el) => {
                    const declared = await getEffectiveModuleAttributes(
                        el,
                        adapter,
                    );
                    return [el, declared] as const;
                }),
            );
            this._moduleInstanceAttributeAllowlist.clear();
            for (const [el, declared] of entries) {
                if (declared) {
                    this._moduleInstanceAttributeAllowlist.set(el, declared);
                }
            }
            this._moduleInstanceAllowlistSourceRevision = rev;
        })();
        this._moduleInstanceAllowlistRefreshInFlight = refresh.finally(() => {
            this._moduleInstanceAllowlistRefreshInFlight = null;
        });
        return this._moduleInstanceAllowlistRefreshInFlight;
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
        // Seed the attribute-name normalization map from both the canonical
        // elements and the aliased entries.  Without the alias contribution,
        // an attribute that exists only on an alias target (e.g. a
        // hypothetical `<row>` inside `<matrix>` carrying an attribute that
        // no canonical element declares) would be reported as
        // `UNKNOWN_NAME` by `normalizeAttributeName`, short-circuiting the
        // alias-aware checks in `isAllowedAttribute` /
        // `getAttributeAllowedValues` before they ever ran.  Canonical
        // entries are seeded last so that on a casing collision the
        // canonical capitalization wins (`Object.fromEntries` lets the
        // later entry overwrite the earlier one).
        this.schemaAttributesLowerToUpper = Object.fromEntries([
            ...Object.values(this.schemaAliasedElementsByName).flatMap((e) =>
                e.attributes.map((a) => [a.name.toLowerCase(), a.name]),
            ),
            ...this.schema.flatMap((e) =>
                e.attributes.map((a) => [a.name.toLowerCase(), a.name]),
            ),
        ]);
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
        explicit = false,
    ) => getCompletionItems.call(this, offset, cachedContext, explicit);

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
     * The search is case insensitive. When `parentName` is provided and
     * declares a `childContextHelp` alias for `elementName` (e.g. `<row>`
     * inside `<matrix>` → `matrixRow`), the alias target's children are
     * returned instead of the canonical entry's — so in-tag completions
     * for `<row>` inside `<matrix>` offer `<math>`, not `<cell>` (#1174).
     *
     * When the resolved alias entry omits `children` (allowed by
     * `AliasedElementSchema` for backward compatibility with consumers
     * that build aliases from older schema snapshots), fall back to the
     * canonical entry's children rather than returning `[]` — matching
     * the symmetric fallback in `isAllowedChild`.
     */
    _getAllowedChildren(elementName: string, parentName?: string): string[] {
        const effective = this._resolveEffectiveByName(elementName, parentName);
        if (effective?.children) {
            return effective.children;
        }
        const normalized = this.normalizeElementName(elementName);
        return this.schemaElementsByName[normalized]?.children || [];
    }

    /**
     * Convenience over `resolveEffectiveSchemaElement` that accepts an
     * element name (canonical or author-cased) rather than a pre-fetched
     * own entry. Returns the alias-aware effective entry: the alias when
     * the (grand)parent declares a `childContextHelp` redirect for this
     * element, otherwise the element's own canonical entry.
     *
     * Callers that need to branch on whether an alias actually applied
     * can compare `result.name` to the normalized input name: when they
     * differ, an alias took effect; when they match, this returned the
     * canonical passthrough. Returns `undefined` only when the element
     * name itself is unrecognized.
     */
    _resolveEffectiveByName(
        elementName: string,
        parentName?: string,
    ): ElementSchema | AliasedElementSchema | undefined {
        const normalized = this.normalizeElementName(elementName);
        if (normalized === "UNKNOWN_NAME") return undefined;
        const ownEntry = this.schemaElementsByName[normalized];
        return this.resolveEffectiveSchemaElement(ownEntry, parentName);
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
        if (!isRepeatLikeElement(element)) {
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
        if (descendant) return this._buildRefHelpInfo(descendant);

        // Composite-wrapper fallback: for `<select>` / `<conditionalContent>`
        // where multiple `<option>` / `<case>` / `<else>` branches each declare
        // a descendant with the same `name`, `getNamedDescendant` returns
        // `null` because the name is not uniquely addressable. The resolver
        // already included the name in `visibleDescendantNames` (gating this
        // call) via `collectNamesFromCompositeChildren`. The fallback walks
        // the wrapper subtrees and returns the first match — but only when
        // all matching branches resolve the name to the same component type,
        // since the help layer can't tell which branch the runtime will pick.
        // Heterogeneous branches yield `null` (panel blank) rather than wrong
        // help.
        const compositeMatch = findDescendantViaCompositeWrappers(
            container,
            memberName,
        );
        if (compositeMatch) return this._buildRefHelpInfo(compositeMatch);
        return null;
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
     * Gets whether the child is allowed inside the parent. This function
     * normalizes the name of the parent and child before checking. When
     * `grandparentName` is provided and declares a `childContextHelp` alias
     * for `parentName` (e.g. `<row>` inside `<matrix>` → `matrixRow`), the
     * check runs against the alias target's children — so `<math>` inside
     * `<row>` inside `<matrix>` is allowed (#1174).
     */
    isAllowedChild(
        parentName: string,
        childName: string,
        grandparentName?: string,
    ): boolean {
        const normalizedParent = this.normalizeElementName(parentName);
        const normalizedChild = this.normalizeElementName(childName);
        if (
            normalizedParent === "UNKNOWN_NAME" ||
            normalizedChild === "UNKNOWN_NAME"
        ) {
            return false;
        }
        if (grandparentName) {
            // Alias-aware path: when the grandparent redirects this
            // parent's child schema (e.g. `<matrix>` → `matrixRow`), use
            // the alias target's children rather than the canonical
            // parent's. Fall through to the canonical map when no alias
            // applies so the hot path stays a single Set lookup.
            const effective = this._resolveEffectiveByName(
                normalizedParent,
                grandparentName,
            );
            if (
                effective &&
                effective.name !== normalizedParent &&
                effective.children
            ) {
                return effective.children.includes(normalizedChild);
            }
        }
        return (
            this.parentChildMap.get(normalizedParent)?.has(normalizedChild) ||
            false
        );
    }

    /**
     * Checks whether the given attribute is allowed on the given element.
     * This function normalizes the name of the element and attribute before
     * checking. When `parentName` is provided and declares a
     * `childContextHelp` alias for `elementName` (e.g. `<row>` inside
     * `<matrix>` → `matrixRow`), the check runs against the alias target's
     * attribute set — so `unordered` on `<row>` inside `<matrix>` is allowed
     * even though it isn't an attribute of the tabular `<row>` (#1174).
     *
     * When `perInstanceAllowlist` is provided (currently only for
     * `<module copy="$x" .../>` sites whose target's `<moduleAttributes>`
     * declared `attributeName`), the check returns true if the lowercased
     * attribute name is in the allowlist OR the canonical/alias check
     * passes — union semantics, since canonical attributes like `hide` /
     * `name` remain valid regardless of what the target declared (#1154).
     */
    isAllowedAttribute(
        elementName: string,
        attributeName: string,
        parentName?: string,
        perInstanceAllowlist?: ReadonlyMap<string, DeclaredModuleAttribute>,
    ): boolean {
        // Check the per-instance allowlist against the raw (author-typed)
        // attribute name BEFORE normalizing — an author-declared name need
        // not exist anywhere else in the schema (e.g. `balloonShape`), in
        // which case `normalizeAttributeName` would yield `UNKNOWN_NAME`
        // and the early-return below would block it.  The allowlist is
        // keyed lowercased to match the runtime's case-insensitive lookup.
        if (
            perInstanceAllowlist &&
            perInstanceAllowlist.has(attributeName.toLowerCase())
        ) {
            return true;
        }
        const normalizedElement = this.normalizeElementName(elementName);
        const normalizedAttribute = this.normalizeAttributeName(attributeName);
        if (
            normalizedElement === "UNKNOWN_NAME" ||
            normalizedAttribute === "UNKNOWN_NAME"
        ) {
            return false;
        }
        if (parentName) {
            const effective = this._resolveEffectiveByName(
                normalizedElement,
                parentName,
            );
            if (effective && effective.name !== normalizedElement) {
                // Match case-insensitively so a canonical-cased attribute
                // (`unordered`) hits an alias entry that happens to have
                // declared a differently cased name. The canonical map
                // built in `setSchema` already normalizes via
                // `normalizeAttributeName`, so this only adds tolerance
                // for alias-side names.
                const lower = normalizedAttribute.toLowerCase();
                return effective.attributes.some(
                    (a) => a.name.toLowerCase() === lower,
                );
            }
        }
        return (
            this.nodeAttributeMap
                .get(normalizedElement)
                ?.has(normalizedAttribute) || false
        );
    }

    /**
     * Gets the schema for a given attribute of a given element. This function
     * normalizes the name of the element and attribute before checking.
     * When `parentName` is provided and declares a `childContextHelp` alias,
     * the attribute's enumerated-values metadata comes from the alias target
     * — closing the autocomplete-vs-help divergence noted in #1092 for the
     * value enumeration the same way #1174 closes it for the attribute set.
     */
    getAttributeAllowedValues(
        elementName: string,
        attributeName: string,
        parentName?: string,
    ) {
        const normalizedElement = this.normalizeElementName(elementName);
        const normalizedAttribute = this.normalizeAttributeName(attributeName);
        if (
            normalizedElement === "UNKNOWN_NAME" ||
            normalizedAttribute === "UNKNOWN_NAME"
        ) {
            return null;
        }
        if (parentName) {
            const effective = this._resolveEffectiveByName(
                normalizedElement,
                parentName,
            );
            if (effective && effective.name !== normalizedElement) {
                const lower = normalizedAttribute.toLowerCase();
                const aliasAttr = effective.attributes.find(
                    (a) => a.name.toLowerCase() === lower,
                );
                if (aliasAttr) {
                    return aliasAttr.values
                        ? {
                              correctCase: new Set(aliasAttr.values),
                              lowerCase: new Set(
                                  aliasAttr.values.map((v) => v.toLowerCase()),
                              ),
                          }
                        : null;
                }
                // The alias entry exists but doesn't declare this
                // attribute — the canonical lookup is meaningless here
                // (we're shadowing the canonical entry by alias).
                return null;
            }
        }
        return (
            this.nodeAttributeMap
                .get(normalizedElement)
                ?.get(normalizedAttribute) || null
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

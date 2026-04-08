import type { DastElement, DastNodes } from "@doenet/parser";
import type { DoenetSourceObject } from "../doenet-source-object";
import type {
    RefMemberContainerResolution,
    ResolveRefMemberContainer,
    ResolveRefMemberContainerArgs,
} from "./index";

/**
 * Wrapper elements whose children should be treated as direct children of
 * the composite for autocomplete purposes.  At runtime, sugar inserts these
 * wrappers and then strips them during replacement expansion.
 */
const COMPOSITE_WRAPPER_NAMES = new Set(["case", "else", "option"]);

/**
 * Walk all descendants of `root`, returning an array of `{ name, element }`
 * for every element with a `name` attribute.
 */
function collectAllNamedDescendants(
    root: DastElement,
): Array<{ name: string; element: DastElement }> {
    const result: Array<{ name: string; element: DastElement }> = [];
    function walk(node: DastNodes) {
        if (node.type === "element") {
            const nameAttr = node.attributes?.name;
            if (nameAttr) {
                // name attribute value is stored in children[0].value
                const nameVal =
                    nameAttr.children?.length === 1 &&
                    nameAttr.children[0].type === "text"
                        ? nameAttr.children[0].value
                        : undefined;
                if (nameVal) {
                    result.push({ name: nameVal, element: node });
                }
            }
            for (const child of node.children) {
                walk(child as DastNodes);
            }
        }
    }
    for (const child of root.children) {
        walk(child as DastNodes);
    }
    return result;
}

/**
 * Add only names that appear exactly once in the given descendant list.
 */
function addUniqueNamesFromDescendants(
    descendants: Array<{ name: string; element: DastElement }>,
    result: Set<string>,
): void {
    const counts = new Map<string, number>();
    for (const { name } of descendants) {
        counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    for (const [name, count] of counts) {
        if (count === 1) result.add(name);
    }
}

/**
 * Collect descendant names from a composite element (conditionalContent or
 * select) by walking through wrapper children (case/else/option)
 * transparently.
 *
 * A name is included if **at least one** wrapper child has it as a unique
 * descendant.  If a name appears multiple times within a single wrapper
 * (ambiguous within that wrapper), that wrapper does not contribute the name
 * — but another wrapper where it is unique still contributes it.
 *
 * Direct children of the composite that are NOT wrapper elements are also
 * walked (sugared cc without explicit case/else).
 */
function collectNamesFromCompositeChildren(
    composite: DastElement,
): Set<string> {
    const result = new Set<string>();

    for (const child of composite.children) {
        if (child.type !== "element") continue;

        if (COMPOSITE_WRAPPER_NAMES.has(child.name)) {
            // Walk inside the wrapper transparently
            addUniqueNamesFromDescendants(
                collectAllNamedDescendants(child),
                result,
            );
        } else {
            // Direct child of composite (not a wrapper) — collect its names
            // plus the child itself if named.
            const nameAttr = child.attributes?.name;
            if (nameAttr) {
                const nameVal =
                    nameAttr.children?.length === 1 &&
                    nameAttr.children[0].type === "text"
                        ? nameAttr.children[0].value
                        : undefined;
                if (nameVal) result.add(nameVal);
            }
            addUniqueNamesFromDescendants(
                collectAllNamedDescendants(child),
                result,
            );
        }
    }

    return result;
}

/**
 * Extract derived repeat names from `valueName`/`indexName` attributes on a
 * repeat or repeatForSequence element. Returns an empty array for other elements.
 */
function getDerivedRepeatNamesFromElement(el: DastElement): string[] {
    if (el.name !== "repeat" && el.name !== "repeatForSequence") return [];
    const names: string[] = [];
    for (const attrName of ["valueName", "indexName"]) {
        const attr = el.attributes[attrName];
        if (
            attr &&
            attr.children.length === 1 &&
            attr.children[0].type === "text"
        ) {
            names.push(attr.children[0].value);
        }
    }
    return names;
}

/**
 * Minimal interface matching the subset of PublicDoenetMLCore methods needed
 * for path resolution. Consumers provide an initialized WASM-backed instance;
 * lsp-tools does not depend on the WASM package directly.
 */
export interface RustResolverCore {
    set_source(dast: unknown, source: string): void;
    /**
     * Set runtime flags (as a JSON string). Must be called at least once
     * before `return_dast()`.  An empty object `"{}"` is sufficient for
     * pure path-resolution use-cases.
     */
    set_flags(flags: string): void;
    /**
     * Triggers Rust core initialization and returns the flat DAST.
     * The adapter uses the returned elements to build position-based index mappings.
     */
    return_dast(): {
        elements: Array<{
            data: { id: number };
            position?: { start: { offset?: number } };
        }>;
    };
    resolve_path(
        path: { path: Array<FlatPathPartForResolver> },
        origin: number,
        skip_parent_search: boolean,
    ): {
        nodeIdx: number;
        nodesInResolvedPath: number[];
        unresolvedPath: Array<{ name: string }> | null;
        originalPath: Array<{ name: string }>;
    };
}

/** Matches the Rust WASM FlatPathPart shape expected by resolve_path. */
interface FlatPathPartForResolver {
    type: "flatPathPart";
    name: string;
    index: Array<{ value: unknown[] }>;
}

export interface RustResolverAdapterOptions {
    /** An initialized PublicDoenetMLCore (or compatible) instance. */
    core?: RustResolverCore;
    /**
     * Optional set of component types that take an index. When provided, the
     * resolver suppresses descendant names for those elements unless the user
     * has already provided a bracket index, forcing member access through
     * `$name[n].`.
     */
    takesIndexComponentTypes?: ReadonlySet<string>;
}

/**
 * Adapter that bridges a Rust WASM resolver (PublicDoenetMLCore.resolve_path)
 * with the AutoCompleter's pluggable resolver seam.
 *
 * When constructed without a `core`, the adapter is disabled and its resolver
 * returns `null`. When a core is supplied, source is synced to the Rust side,
 * position-based index mappings are built, and the resolver calls
 * resolve_path() for each completion request.
 */
export class RustResolverAdapter {
    readonly _core: RustResolverCore | null = null;
    _sourceObj: DoenetSourceObject;
    _enabled = false;
    readonly _takesIndexComponentTypes: ReadonlySet<string> | null = null;

    /** Rust flat index → JS DAST element (matched by source position). */
    readonly _rustIndexToDastElement: Map<number, DastElement> = new Map();
    /** JS DAST element → Rust flat index. */
    readonly _dastElementToRustIndex: Map<DastElement, number> = new Map();
    _sourceRevision = 0;
    readonly _visibleDescendantNamesCache: Map<string, string[]> = new Map();

    constructor(
        sourceObj: DoenetSourceObject,
        options?: RustResolverAdapterOptions,
    ) {
        this._sourceObj = sourceObj;
        this._takesIndexComponentTypes =
            options?.takesIndexComponentTypes ?? null;
        if (options?.core) {
            this._core = options.core;
            this.syncSource();
        }
    }

    private componentTakesIndex(componentType: string): boolean {
        return this._takesIndexComponentTypes?.has(componentType) ?? false;
    }

    /**
     * Sync the DAST/source to the Rust core and rebuild index mappings.
     */
    private syncSource(): void {
        this._sourceRevision += 1;
        this._visibleDescendantNamesCache.clear();
        if (!this._core) {
            this._enabled = false;
            return;
        }
        // The Rust core panics on empty source (index-out-of-bounds on a
        // zero-length collection).  It also panics when the DAST contains
        // no elements (e.g. source is just "a" — only text nodes, zero
        // elements).  Skip the sync in both cases.
        if (!this._sourceObj.source.trim()) {
            this._enabled = false;
            return;
        }
        const hasElements = this._sourceObj.dast.children.some(
            (c) => c.type === "element",
        );
        if (!hasElements) {
            this._enabled = false;
            return;
        }
        try {
            this._core.set_source(this._sourceObj.dast, this._sourceObj.source);
            const flatDast = this._core.return_dast();
            this.buildMappings(flatDast);
            this._enabled = true;
        } catch (e) {
            console.warn("RustResolverAdapter: failed to sync source:", e);
            this._enabled = false;
        }
    }

    private getCachedVisibleDescendantNames(resolvedIdx: number) {
        const key = `${this._sourceRevision}:${resolvedIdx}`;
        return this._visibleDescendantNamesCache.get(key);
    }

    private setCachedVisibleDescendantNames(
        resolvedIdx: number,
        names: string[],
    ) {
        const key = `${this._sourceRevision}:${resolvedIdx}`;
        this._visibleDescendantNamesCache.set(key, names);
    }

    /**
     * Build bidirectional mappings between Rust flat indices and JS DAST
     * elements by matching on source position (start offset).
     */
    private buildMappings(flatDast: {
        elements: Array<{
            data: { id: number };
            position?: { start: { offset?: number } };
        }>;
    }): void {
        this._rustIndexToDastElement.clear();
        this._dastElementToRustIndex.clear();

        // Collect JS DAST elements keyed by start offset.
        const dastByStartOffset = new Map<number, DastElement>();
        const collectElements = (node: DastNodes) => {
            if (node.type === "element") {
                const off = node.position?.start?.offset;
                if (off != null) {
                    dastByStartOffset.set(off, node);
                }
                for (const child of node.children) {
                    collectElements(child as DastNodes);
                }
            }
        };
        for (const child of this._sourceObj.dast.children) {
            collectElements(child as DastNodes);
        }

        // Match flat DAST elements to JS DAST elements by start offset.
        for (const flatElm of flatDast.elements) {
            const startOffset = flatElm.position?.start?.offset;
            if (startOffset == null) continue;
            const id = flatElm.data?.id;
            if (id == null) continue;
            const dastElm = dastByStartOffset.get(startOffset);
            if (!dastElm) continue;
            this._rustIndexToDastElement.set(id, dastElm);
            this._dastElementToRustIndex.set(dastElm, id);
        }
    }

    /**
     * Resolve a ref-member container for AutoCompleter member completion.
     *
     * @param offset — The character offset in the source for scope resolution.
     * @param pathParts — The path segments (e.g. ["rep", "myMath", ""] for `$rep.myMath.`).
     * @param hasIndex — When true, indicates a bracket index was present in the path
     *                     (e.g. `$sel[1].`), enabling descendant access for takesIndex
     *                     elements. If false or undefined, takesIndex elements hide their
     *                     descendants unless accessed via index notation.
     * @returns The resolved node and visible descendant names, or null if resolution fails.
     */
    resolveRefMemberContainerAtOffset(
        offset: number,
        pathParts: string[],
        hasIndex?: boolean,
    ): RefMemberContainerResolution | null {
        return this._resolveRefMemberContainer({
            offset,
            pathParts,
            nodeIndex: this._sourceObj.getNodeIndexAtOffset(offset),
            hasIndex,
        });
    }

    /**
     * Create a resolver callback suitable for external callers that need
     * `ResolveRefMemberContainer` shape.
     */
    createResolver(): ResolveRefMemberContainer {
        return (args: ResolveRefMemberContainerArgs) =>
            this._resolveRefMemberContainer(args);
    }

    _resolveRefMemberContainer(
        args: ResolveRefMemberContainerArgs,
    ): RefMemberContainerResolution | null {
        if (!this._enabled || !this._core) return null;

        const { offset, pathParts, hasIndex } = args;
        if (pathParts.length === 0) return null;

        // Resolve up to but not including the last part (being edited).
        const lookupParts = pathParts.slice(0, -1);
        if (lookupParts.length === 0) return null;

        // Determine origin: the Rust index of the enclosing element.
        const originIndex = this.getOriginIndex(offset);
        if (originIndex == null) return null;

        const flatPath: FlatPathPartForResolver[] = lookupParts.map((name) => ({
            type: "flatPathPart" as const,
            name,
            index: [],
        }));

        try {
            const resolution = this._core.resolve_path(
                { path: flatPath },
                originIndex,
                false,
            );

            const resolvedNode = this._rustIndexToDastElement.get(
                resolution.nodeIdx,
            );
            if (!resolvedNode) return null;

            const unresolvedPathParts = (resolution.unresolvedPath ?? []).map(
                (p) => p.name,
            );

            // When there are unresolved parts, the path is invalid —
            // return null so the caller offers no completions.
            if (unresolvedPathParts.length > 0) {
                return {
                    node: null,
                    unresolvedPathParts,
                };
            }

            // When the resolved element takes an index, descendants
            // are only accessible via $name[n].member — suppress them
            // unless the user has already provided a bracket index.
            if (this.componentTakesIndex(resolvedNode.name) && !hasIndex) {
                return {
                    node: resolvedNode,
                    unresolvedPathParts: [],
                    visibleDescendantNames: [],
                };
            }

            // For composites (conditionalContent, and any
            // takesIndex composite with an index present), compute
            // visible descendants by walking through wrapper children
            // (case/else/option) transparently.
            if (
                resolvedNode.name === "conditionalContent" ||
                (hasIndex && this.componentTakesIndex(resolvedNode.name))
            ) {
                const names = collectNamesFromCompositeChildren(resolvedNode);
                // For repeat/repeatForSequence, also expose
                // valueName/indexName as member completions when
                // accessed with an index (e.g. $rep[1].v).
                const derivedRepeatNames =
                    getDerivedRepeatNamesFromElement(resolvedNode);
                return {
                    node: resolvedNode,
                    unresolvedPathParts: [],
                    visibleDescendantNames: [...names, ...derivedRepeatNames],
                };
            }

            // Determine which descendant names are actually visible
            // from the resolved node using the Rust name_map (which
            // respects ChildrenInvisibleToTheirGrandparents etc.).
            const resolvedIdx = resolution.nodeIdx;
            let visibleDescendantNames =
                this.getCachedVisibleDescendantNames(resolvedIdx);
            if (!visibleDescendantNames) {
                const allNames =
                    this._sourceObj.getUniqueDescendantNamesForNode(
                        resolvedNode,
                    );
                visibleDescendantNames = allNames.filter((name) => {
                    try {
                        const probe = this._core!.resolve_path(
                            {
                                path: [
                                    {
                                        type: "flatPathPart" as const,
                                        name,
                                        index: [],
                                    },
                                ],
                            },
                            resolvedIdx,
                            true,
                        );
                        // A fully-resolved path (no unresolved parts whose
                        // first segment equals the original name) means the
                        // name matched a visible descendant.
                        if (
                            probe.unresolvedPath &&
                            probe.unresolvedPath.length > 0
                        ) {
                            return false;
                        }
                        return true;
                    } catch {
                        return false;
                    }
                });
                this.setCachedVisibleDescendantNames(
                    resolvedIdx,
                    visibleDescendantNames,
                );
            }

            return {
                node: resolvedNode,
                unresolvedPathParts: [],
                visibleDescendantNames,
            };
        } catch {
            // Resolution error (NoReferent, NonUniqueReferent, etc.)
            return null;
        }
    }

    /**
     * Get the Rust flat index to use as the origin for resolve_path.
     * Uses the nearest enclosing element of the given offset, falling
     * back to a mapped top-level element when the cursor is at root level.
     */
    private getOriginIndex(offset: number): number | null {
        const containingElement = this._sourceObj.elementAtOffset(offset);
        if (containingElement) {
            const idx = this._dastElementToRustIndex.get(containingElement);
            if (idx != null) return idx;
        }
        return this.getRootOriginIndex();
    }

    /**
     * Pick a deterministic mapped index for root-level resolution.
     * Prefer top-level elements from the parsed DAST root; fall back to any
     * mapped element if top-level mappings are unavailable.
     */
    private getRootOriginIndex(): number | null {
        const topLevelIndices: number[] = [];
        for (const child of this._sourceObj.dast.children) {
            if (child.type !== "element") continue;
            const idx = this._dastElementToRustIndex.get(child);
            if (idx != null) {
                topLevelIndices.push(idx);
            }
        }
        if (topLevelIndices.length > 0) {
            return Math.min(...topLevelIndices);
        }

        const mappedIndices = [...this._rustIndexToDastElement.keys()];
        if (mappedIndices.length > 0) {
            return Math.min(...mappedIndices);
        }
        return null;
    }

    /**
     * Test whether `name` can be resolved from the cursor position at
     * `offset` using the Rust resolver (with full parent search).
     * This respects `ChildrenInvisibleToTheirGrandparents` etc.
     */
    isNameAddressableFromOffset(offset: number, name: string): boolean {
        if (!this._enabled || !this._core) return false;

        // Derived repeat names from valueName/indexName are introduced by
        // repeat runtime behavior and are always addressable from within the
        // repeat body. They are not affected by conditional/select sugar,
        // so this intentionally bypasses isHiddenBySugar().
        const derivedRepeatNames = this.getDerivedRepeatNames(offset);
        if (derivedRepeatNames.includes(name)) return true;

        // A $name reference typed at `offset` will become a child of the
        // element whose body contains the cursor.  resolve_path with
        // skip_parent_search=false searches from the origin's PARENT scope
        // upward, so to correctly probe the containing element's scope we
        // must resolve from one of its existing children rather than the
        // container itself.
        const containingElement = this._sourceObj.elementAtOffset(offset);
        let resolveFromIndex: number | null = null;

        if (containingElement) {
            // Find the first child element that has a Rust index.
            for (const child of containingElement.children) {
                if (child.type === "element") {
                    const ci = this._dastElementToRustIndex.get(child);
                    if (ci != null) {
                        resolveFromIndex = ci;
                        break;
                    }
                }
            }
            // If the container has no mapped child elements, fall back to the
            // container itself.  There are no named children to be hidden, so
            // the parent-scope walk is still correct.
            if (resolveFromIndex == null) {
                resolveFromIndex =
                    this._dastElementToRustIndex.get(containingElement) ?? null;
            }
        } else {
            // Root level — use the first top-level element (a child of the
            // document root).  resolve_path from it with skip_parent_search=
            // false searches root scope, which is what a reference at root
            // level would see.
            resolveFromIndex = this.getRootOriginIndex();
        }

        if (resolveFromIndex == null) return false;

        try {
            const resolution = this._core.resolve_path(
                {
                    path: [
                        {
                            type: "flatPathPart" as const,
                            name,
                            index: [],
                        },
                    ],
                },
                resolveFromIndex,
                false,
            );

            // Post-filter: check whether the resolved element is hidden
            // by sugar at runtime.  In raw DAST (no sugar),
            // conditionalContent and select children are direct children,
            // but at runtime sugar wraps them in <case>/<option>, making
            // deeper descendants invisible from outside the composite.
            if (this.isHiddenBySugar(resolution.nodeIdx, offset)) {
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check whether a resolved node at `rustIdx` would be hidden by
     * `conditionalContent` / `select` sugar when the cursor is at `offset`.
     *
     * In raw DAST, children of `<conditionalContent>` that are NOT wrapped
     * in explicit `<case>`/`<else>` are direct children.  At runtime,
     * `conditionalContentSugar` wraps them in `<case><group>…</group></case>`,
     * and `<case>` is in `CHILDREN_INVISIBLE_TO_THEIR_GRANDPARENTS`, so those
     * children become invisible from outside.  Explicit `<case name="…">`
     * children remain accessible because they ARE direct children of cc.
     *
     * The same pattern applies to `<select>` / `<option>` via `selectSugar`.
     */
    private isHiddenBySugar(rustIdx: number, cursorOffset: number): boolean {
        const resolvedElement = this._rustIndexToDastElement.get(rustIdx);
        if (!resolvedElement) return false;

        let parent = this._sourceObj.getParent(resolvedElement);

        while (parent && parent.type !== "root") {
            if (
                parent.type === "element" &&
                (parent.name === "conditionalContent" ||
                    parent.name === "select")
            ) {
                const start = parent.position?.start?.offset;
                const end = parent.position?.end?.offset;
                // Cursor is outside this composite element
                if (
                    start != null &&
                    end != null &&
                    (cursorOffset < start || cursorOffset >= end)
                ) {
                    // Only direct children that are wrapper elements
                    // (case/else/option) remain visible from outside — these
                    // are NOT re-wrapped by sugar.  Everything else (direct
                    // non-wrapper children that sugar will wrap, or deeper
                    // descendants already behind a wrapper barrier) is hidden.
                    const resolvedParent =
                        this._sourceObj.getParent(resolvedElement);
                    if (
                        !(
                            resolvedParent &&
                            resolvedParent.type === "element" &&
                            resolvedParent === parent &&
                            COMPOSITE_WRAPPER_NAMES.has(resolvedElement.name)
                        )
                    ) {
                        return true;
                    }
                }
            }
            parent = this._sourceObj.getParent(parent);
        }
        return false;
    }

    isEnabled(): boolean {
        return this._enabled;
    }

    /**
     * Return derived repeat names from `valueName`/`indexName` attributes of
     * enclosing `<repeat>` elements at the given offset. These names don't
     * exist in the raw DAST but are introduced by repeat sugar at runtime, so
     * they must be injected into the completion pipeline.
     */
    getDerivedRepeatNames(offset: number): string[] {
        const names: string[] = [];
        let current: DastElement | undefined =
            this._sourceObj.elementAtOffset(offset) ?? undefined;
        while (current) {
            names.push(...getDerivedRepeatNamesFromElement(current));
            const p = this._sourceObj.getParent(current);
            current =
                p && p.type === "element" ? (p as DastElement) : undefined;
        }
        return names;
    }

    /**
     * Update source and rebuild mappings. Call when the document changes.
     */
    updateSource(sourceObj: DoenetSourceObject): void {
        this._sourceObj = sourceObj;
        this.syncSource();
    }
}

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
 * walked (sugared cc without explicit case/else). Their own names are
 * included only when unique across direct sibling children.
 */
function collectNamesFromCompositeChildren(
    composite: DastElement,
): Set<string> {
    const result = new Set<string>();
    const directChildNameCounts = new Map<string, number>();

    for (const child of composite.children) {
        if (child.type !== "element") continue;
        if (COMPOSITE_WRAPPER_NAMES.has(child.name)) continue;

        const nameAttr = child.attributes?.name;
        const nameVal =
            nameAttr &&
            nameAttr.children?.length === 1 &&
            nameAttr.children[0].type === "text"
                ? nameAttr.children[0].value
                : undefined;
        if (nameVal) {
            directChildNameCounts.set(
                nameVal,
                (directChildNameCounts.get(nameVal) ?? 0) + 1,
            );
        }
    }

    for (const child of composite.children) {
        if (child.type !== "element") continue;

        if (COMPOSITE_WRAPPER_NAMES.has(child.name)) {
            // Walk inside the wrapper transparently
            addUniqueNamesFromDescendants(
                collectAllNamedDescendants(child),
                result,
            );
        } else {
            // Direct child of composite (not a wrapper): include its own name
            // only when unique among direct siblings, and always collect
            // unique descendant names from within the child subtree.
            const nameAttr = child.attributes?.name;
            const nameVal =
                nameAttr &&
                nameAttr.children?.length === 1 &&
                nameAttr.children[0].type === "text"
                    ? nameAttr.children[0].value
                    : undefined;
            if (nameVal && directChildNameCounts.get(nameVal) === 1) {
                result.add(nameVal);
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
    if (el.name !== "repeat" && el.name !== "repeatForSequence") {
        return [];
    }
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

/** Return the literal `name` attribute value for an element, if present. */
function getElementNameAttributeValue(el: DastElement): string | null {
    const nameAttr = el.attributes?.name;
    if (
        nameAttr &&
        nameAttr.children?.length === 1 &&
        nameAttr.children[0].type === "text"
    ) {
        return nameAttr.children[0].value;
    }
    return null;
}

/**
 * The subset of the DoenetML core API that {@link RustResolverAdapter} calls
 * to resolve paths.
 *
 * The real core lives in `@doenet/doenetml-worker`; in the language server it
 * runs in a sub-worker reached over a Comlink proxy.  This interface is the
 * structural contract that proxy satisfies — declaring it here lets
 * `@doenet/lsp-tools` call the core's real method names without taking a
 * build dependency on the (heavy) worker package.  Every method is async
 * because the Comlink proxy resolves results over `postMessage`.
 */
export interface ResolverCore {
    /** Load DoenetML `source` and its parsed `dast` into the core. */
    setSource(args: { source: string; dast: unknown }): Promise<void>;
    /**
     * Set runtime flags.  Must be called before `returnDast()`; an empty
     * flags object is sufficient for pure path-resolution use.
     */
    setFlags(args: { flags: Record<string, unknown> }): Promise<void>;
    /**
     * Trigger core initialization and return the flat DAST.  The adapter
     * matches the returned elements against the JS-side DAST by source
     * position to build its index mappings.
     */
    returnDast(): Promise<{
        elements: Array<{
            data: { id: number };
            position?: { start: { offset?: number } };
        }>;
    }>;
    /** Resolve `path` starting from `origin`, following core scoping rules. */
    resolvePath(args: {
        path: { path: Array<FlatPathPartForResolver> };
        origin: number;
        skipParentSearch: boolean;
    }): Promise<{
        nodeIdx: number;
        nodesInResolvedPath: number[];
        unresolvedPath: Array<{ name: string }> | null;
        originalPath: Array<{ name: string }>;
    }>;
}

/** Matches the Rust WASM FlatPathPart shape expected by resolve_path. */
interface FlatPathPartForResolver {
    type: "flatPathPart";
    name: string;
    index: Array<{ value: unknown[] }>;
}

export interface RustResolverAdapterOptions {
    /** The DoenetML core used for resolution (typically the Comlink-proxied worker core). */
    core?: ResolverCore;
    /**
     * Optional set of component types that take an index. When provided, the
     * resolver suppresses descendant names for those elements unless the user
     * has already provided a bracket index, forcing member access through
     * `$name[n].`.
     */
    takesIndexComponentTypes?: ReadonlySet<string>;
}

/**
 * Adapter that bridges the DoenetML core resolver ({@link ResolverCore})
 * with the AutoCompleter's pluggable resolver seam.
 *
 * When constructed without a `core`, the adapter is disabled and its resolver
 * returns `null`. When a core is supplied, source is synced to the core,
 * position-based index mappings are built, and the resolver calls
 * `resolvePath()` for each completion request.
 */
export class RustResolverAdapter {
    readonly _core: ResolverCore | null = null;
    _sourceObj: DoenetSourceObject;
    _enabled = false;
    readonly _takesIndexComponentTypes: ReadonlySet<string> | null = null;

    /** Rust flat index → JS DAST element (matched by source position). */
    readonly _rustIndexToDastElement: Map<number, DastElement> = new Map();
    /** JS DAST element → Rust flat index. */
    readonly _dastElementToRustIndex: Map<DastElement, number> = new Map();
    _sourceRevision = 0;
    readonly _visibleDescendantNamesCache: Map<string, string[]> = new Map();

    /**
     * Tail of the in-flight/queued sync chain.  `init` and `updateSource`
     * append a fresh `_syncSource` to this; query methods `await` it before
     * reading state.  Without this, a completion request can race a
     * fire-and-forget `updateSource` and resolve against stale rust source
     * or stale JS-side index mappings.
     */
    _isSyncing: Promise<void> = Promise.resolve();

    /**
     * Source text the most recently *executed* `_syncSource` decided to push
     * (or accept as already-current).  Used to dedup rapid-fire syncs:
     * fast typing chains many calls but only one actually pays the worker
     * round-trips; subsequent dequeued syncs see the same source and skip.
     */
    _lastSyncedSource: string | null = null;

    constructor(
        sourceObj: DoenetSourceObject,
        options?: RustResolverAdapterOptions,
    ) {
        this._sourceObj = sourceObj;
        this._takesIndexComponentTypes = options?.takesIndexComponentTypes
            ? new Set(options.takesIndexComponentTypes)
            : null;
        if (options?.core) {
            this._core = options.core;
        }
    }

    /**
     * Queue an initial sync of the current source to the rust core.  Returns
     * the tail of the sync chain so callers can await readiness, but awaiting
     * is no longer required for correctness — query methods await internally.
     */
    init(): Promise<void> {
        this._isSyncing = this._isSyncing.then(() => this._syncSource());
        return this._isSyncing;
    }

    _componentTakesIndex(componentType: string): boolean {
        return this._takesIndexComponentTypes?.has(componentType) ?? false;
    }

    /**
     * Sync the DAST/source to the Rust core and rebuild index mappings.
     *
     * Coalesces with the previous sync: if the source string is identical
     * to the one the last `_syncSource` saw, returns immediately rather than
     * paying three worker round-trips.  Rapid typing chains many enqueues
     * but only the first one to dequeue after each real source change pays
     * the cost.
     */
    async _syncSource(): Promise<void> {
        if (this._sourceObj.source === this._lastSyncedSource) {
            return;
        }
        this._lastSyncedSource = this._sourceObj.source;
        this._sourceRevision += 1;
        this._visibleDescendantNamesCache.clear();
        if (!this._core) {
            this._disableAdapterState();
            return;
        }
        // The Rust core panics on empty source (index-out-of-bounds on a
        // zero-length collection).  It also panics when the DAST contains
        // no elements (e.g. source is just "a" — only text nodes, zero
        // elements).  Skip the sync in both cases.
        if (!this._sourceObj.source.trim()) {
            this._disableAdapterState();
            return;
        }
        const hasElements = this._sourceObj.dast.children.some(
            (c) => c.type === "element",
        );
        if (!hasElements) {
            this._disableAdapterState();
            return;
        }
        try {
            await this._core.setSource({
                source: this._sourceObj.source,
                dast: this._sourceObj.dast,
            });
            // Empty flags are sufficient for path-resolution-only use.
            await this._core.setFlags({ flags: {} });
            const flatDast = await this._core.returnDast();
            this._buildMappings(flatDast);
            this._enabled = true;
        } catch (e) {
            console.warn("RustResolverAdapter: failed to sync source:", e);
            this._disableAdapterState();
        }
    }

    _getCachedVisibleDescendantNames(resolvedIdx: number) {
        const key = `${this._sourceRevision}:${resolvedIdx}`;
        return this._visibleDescendantNamesCache.get(key);
    }

    _setCachedVisibleDescendantNames(resolvedIdx: number, names: string[]) {
        const key = `${this._sourceRevision}:${resolvedIdx}`;
        this._visibleDescendantNamesCache.set(key, names);
    }

    _disableAdapterState() {
        this._enabled = false;
        this._rustIndexToDastElement.clear();
        this._dastElementToRustIndex.clear();
    }

    /**
     * Build bidirectional mappings between Rust flat indices and JS DAST
     * elements by matching on source position (start offset).
     */
    _buildMappings(flatDast: {
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
     * @param pathPartHasIndex — Per-path-part index flags aligned with `pathParts`.
     * @returns The resolved node and visible descendant names, or null if resolution fails.
     */
    async resolveRefMemberContainerAtOffset(
        offset: number,
        pathParts: string[],
        pathPartHasIndex?: boolean[],
    ): Promise<RefMemberContainerResolution | null> {
        return this._resolveRefMemberContainer({
            offset,
            pathParts,
            pathPartHasIndex,
            nodeIndex: this._sourceObj.getNodeIndexAtOffset(offset),
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

    async _resolveRefMemberContainer(
        args: ResolveRefMemberContainerArgs,
    ): Promise<RefMemberContainerResolution | null> {
        // Wait for any in-flight or queued source sync before reading state.
        // Without this, the JS-side mappings (_rustIndexToDastElement) and
        // rust-side source can diverge from the offset the caller passed in.
        await this._isSyncing;
        if (!this._enabled || !this._core) return null;

        const {
            offset,
            pathParts: rawPathParts,
            pathPartHasIndex: rawPathPartHasIndex,
        } = args;
        const { pathParts, pathPartHasIndex } = this._normalizePathParts(
            offset,
            rawPathParts,
            rawPathPartHasIndex,
        );
        if (pathParts.length === 0) return null;

        // Resolve up to but not including the last part (being edited).
        const lookupParts = pathParts.slice(0, -1);
        if (lookupParts.length === 0) return null;

        // Determine origin: the Rust index of the enclosing element.
        const originIndex = this._getOriginIndex(offset);
        if (originIndex == null) return null;

        const effectivePathPartHasIndex =
            pathPartHasIndex ?? lookupParts.map(() => false);

        const flatPath: FlatPathPartForResolver[] = lookupParts.map((name) => ({
            type: "flatPathPart" as const,
            name,
            index: [],
        }));

        try {
            const resolution = await this._core.resolvePath({
                path: { path: flatPath },
                origin: originIndex,
                skipParentSearch: false,
            });

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
                    visibleDescendantNames: [],
                };
            }

            // If any intermediate segment resolves through a takesIndex
            // component without an index (e.g. $rep.myMath.), block member
            // completions for that path. Indexed traversal must use
            // $rep[n].member.  Separately validate that non-takesIndex segments
            // do not have indices (false positives worse than false negatives).
            if (resolution.nodesInResolvedPath.length > 1) {
                // Rust includes the origin in nodesInResolvedPath, but when
                // the origin is also the first resolved segment it may not be
                // duplicated. Align to lookupParts by taking the trailing
                // nodes that correspond to the resolved path segments, then
                // exclude the final resolved node to inspect only intermediates.
                const alignedPathNodeIndices =
                    resolution.nodesInResolvedPath.slice(-lookupParts.length);
                const intermediatePathNodeIndices =
                    alignedPathNodeIndices.slice(0, -1);
                // Check each intermediate segment for proper index usage
                for (
                    let pathPartIndex = 0;
                    pathPartIndex < intermediatePathNodeIndices.length;
                    pathPartIndex++
                ) {
                    const pathNode = this._rustIndexToDastElement.get(
                        intermediatePathNodeIndices[pathPartIndex],
                    );
                    const segmentHasIndex =
                        effectivePathPartHasIndex[pathPartIndex] ?? false;
                    if (
                        pathNode &&
                        this._componentTakesIndex(pathNode.name) &&
                        !segmentHasIndex
                    ) {
                        return {
                            node: null,
                            unresolvedPathParts:
                                lookupParts.slice(pathPartIndex),
                            visibleDescendantNames: [],
                        };
                    }
                    // Inverse: a non-takesIndex segment must not have an
                    // index. If it does the path is invalid — false positives
                    // are worse than false negatives.
                    if (
                        pathNode &&
                        !this._componentTakesIndex(pathNode.name) &&
                        segmentHasIndex
                    ) {
                        return {
                            node: null,
                            unresolvedPathParts:
                                lookupParts.slice(pathPartIndex),
                            visibleDescendantNames: [],
                        };
                    }
                }
            }

            const resolvedPathPartIndex = lookupParts.length - 1;
            const resolvedPartHasIndex =
                effectivePathPartHasIndex[resolvedPathPartIndex] ?? false;

            // When the resolved element takes an index, descendants
            // are only accessible via $name[n].member — suppress them
            // unless the user has already provided a bracket index.
            if (
                this._componentTakesIndex(resolvedNode.name) &&
                !resolvedPartHasIndex
            ) {
                return {
                    node: resolvedNode,
                    unresolvedPathParts: [],
                    visibleDescendantNames: [],
                };
            }

            // Inverse: a non-takesIndex resolved element must not have an
            // index in its path segment — false positives are worse than
            // false negatives.
            if (
                !this._componentTakesIndex(resolvedNode.name) &&
                resolvedPartHasIndex
            ) {
                return {
                    node: null,
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
                (resolvedPartHasIndex &&
                    this._componentTakesIndex(resolvedNode.name))
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
                this._getCachedVisibleDescendantNames(resolvedIdx);
            if (!visibleDescendantNames) {
                const allNames =
                    this._sourceObj.getUniqueDescendantNamesForNode(
                        resolvedNode,
                    );
                const probeResults = await Promise.all(
                    allNames.map(async (name) => {
                        try {
                            const probe = await this._core!.resolvePath({
                                path: {
                                    path: [
                                        {
                                            type: "flatPathPart" as const,
                                            name,
                                            index: [],
                                        },
                                    ],
                                },
                                origin: resolvedIdx,
                                skipParentSearch: true,
                            });
                            // A fully-resolved path (no unresolved parts whose
                            // first segment equals the original name) means the
                            // name matched a visible descendant.
                            if (
                                probe.unresolvedPath &&
                                probe.unresolvedPath.length > 0
                            ) {
                                return false;
                            }
                            const probeElement =
                                this._rustIndexToDastElement.get(probe.nodeIdx);
                            const probeName = probeElement
                                ? getElementNameAttributeValue(probeElement)
                                : null;
                            if (probeName !== name) {
                                return false;
                            }
                            return true;
                        } catch {
                            return false;
                        }
                    }),
                );
                visibleDescendantNames = allNames.filter(
                    (_name, i) => probeResults[i],
                );
                this._setCachedVisibleDescendantNames(
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
    _getOriginIndex(offset: number): number | null {
        const containingElement = this._sourceObj.elementAtOffset(offset);
        if (containingElement) {
            const idx = this._dastElementToRustIndex.get(containingElement);
            if (idx != null) return idx;
        }
        return this._getRootOriginIndex();
    }

    /**
     * Normalize parsed ref path metadata before resolver lookup.
     *
     * Some parser/fallback paths can drop the final empty segment when the
     * cursor is immediately after a trailing dot (e.g. `$a.b.|` represented as
     * `pathParts = ["a", "b"]` instead of `["a", "b", ""]`). For member
     * completion, that final empty segment is semantically important because
     * resolution should treat `b` as the container being completed, not as the
     * currently edited token to skip.
     *
     * When the source confirms a trailing dot and the empty segment is missing,
     * append it and keep `pathPartHasIndex` aligned by appending `false`.
     */
    _normalizePathParts(
        offset: number,
        pathParts: string[],
        pathPartHasIndex?: boolean[],
    ): { pathParts: string[]; pathPartHasIndex?: boolean[] } {
        if (pathParts.length === 0) {
            return { pathParts, pathPartHasIndex };
        }

        const charBeforeCursor =
            offset > 0 ? this._sourceObj.source.charAt(offset - 1) : "";
        const endsWithTypedMemberDot = charBeforeCursor === ".";
        const alreadyHasTrailingEmpty = pathParts[pathParts.length - 1] === "";

        if (!endsWithTypedMemberDot || alreadyHasTrailingEmpty) {
            return { pathParts, pathPartHasIndex };
        }

        return {
            pathParts: [...pathParts, ""],
            pathPartHasIndex: pathPartHasIndex
                ? [...pathPartHasIndex, false]
                : pathPartHasIndex,
        };
    }

    /**
     * Pick a deterministic mapped index for root-level resolution.
     * Prefer top-level elements from the parsed DAST root (using the smallest
     * Rust ID for determinism); fall back to any mapped element if top-level
     * mappings are unavailable.
     */
    _getRootOriginIndex(): number | null {
        const topLevelIndices: number[] = [];
        for (const child of this._sourceObj.dast.children) {
            if (child.type !== "element") continue;
            const idx = this._dastElementToRustIndex.get(child);
            if (idx != null) {
                topLevelIndices.push(idx);
            }
        }
        if (topLevelIndices.length > 0) {
            // Use smallest index for deterministic root-level resolution
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
    async isNameAddressableFromOffset(
        offset: number,
        name: string,
    ): Promise<boolean> {
        // Wait for any in-flight or queued source sync before reading state.
        // See `_resolveRefMemberContainer` for the rationale.
        await this._isSyncing;
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
            resolveFromIndex = this._getRootOriginIndex();
        }

        if (resolveFromIndex == null) return false;

        try {
            const resolution = await this._core.resolvePath({
                path: {
                    path: [
                        {
                            type: "flatPathPart" as const,
                            name,
                            index: [],
                        },
                    ],
                },
                origin: resolveFromIndex,
                skipParentSearch: false,
            });

            const resolvedElement = this._rustIndexToDastElement.get(
                resolution.nodeIdx,
            );
            const resolvedName = resolvedElement
                ? getElementNameAttributeValue(resolvedElement)
                : null;
            if (resolvedName !== name) {
                return false;
            }

            // Post-filter: check whether the resolved element is hidden
            // by sugar at runtime.  In raw DAST (no sugar),
            // conditionalContent and select children are direct children,
            // but at runtime sugar wraps them in <case>/<option>, making
            // deeper descendants invisible from outside the composite.
            if (this._isHiddenBySugar(resolution.nodeIdx, offset)) {
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
    _isHiddenBySugar(rustIdx: number, cursorOffset: number): boolean {
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
     *
     * The new sync is appended to the internal `_isSyncing` chain rather
     * than running concurrently with whatever sync is already in flight.
     * Callers may fire-and-forget the returned Promise; subsequent query
     * methods will internally `await _isSyncing` and see a consistent state.
     */
    updateSource(sourceObj: DoenetSourceObject): Promise<void> {
        this._sourceObj = sourceObj;
        this._isSyncing = this._isSyncing.then(() => this._syncSource());
        return this._isSyncing;
    }
}

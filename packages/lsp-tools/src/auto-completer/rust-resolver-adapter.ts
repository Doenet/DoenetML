import type { DastElement, DastNodes } from "@doenet/parser";
import type { DoenetSourceObject } from "../doenet-source-object";
import { isRepeatLikeElement } from "./repeat-elements";
import { hasImplicitSingleIndex } from "./select-family";
import {
    branchContainerKind,
    branchDeclarations,
    countVisibleDeclarations,
    namesElement,
    namesSharedByBranchesIn,
    sharedBranchNames,
    unsharedBranchNames,
} from "./branch-declarations";
import type {
    RefMemberContainerResolution,
    ResolveRefMemberContainer,
    ResolveRefMemberContainerArgs,
} from "./index";

/**
 * Wrapper elements whose children `collectNamesFromCompositeChildren` walks
 * as if they were direct children of the composite. Branch containers
 * (`<conditionalContent>`, `<select>`) no longer go through that walk; see
 * `sharedBranchNames` in `branch-declarations.ts`.
 */
const COMPOSITE_WRAPPER_NAMES = new Set(["case", "else", "option"]);

/**
 * Return the literal `name` attribute value for an element, if present.
 *
 * Exported so callers in other modules (notably the help-side descendant
 * walk in `auto-completer/index.ts`) reuse the same single-text-child
 * extraction this file relies on, instead of re-inlining it.
 */
export function getElementNameAttributeValue(el: DastElement): string | null {
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
 * Map a thrown `resolvePath` error to a bare-reference classification.
 *
 * The Rust core throws the bare variant name as a string (`"NoReferent"` /
 * `"NonUniqueReferent"`); across a worker boundary it may instead arrive
 * wrapped in an object, so check the stringified message/value defensively.
 * Anything unrecognized stays `"indeterminate"` so callers never over-claim
 * a definite verdict the resolver didn't actually give.
 */
export function classifyResolutionError(
    e: unknown,
): "notFound" | "multiple" | "indeterminate" {
    const candidates = [
        typeof e === "string" ? e : undefined,
        (e as { message?: unknown } | null | undefined)?.message,
        (e as { value?: unknown } | null | undefined)?.value,
        (e as { name?: unknown } | null | undefined)?.name,
    ].filter((s): s is string => typeof s === "string");
    const haystack = (candidates.join(" ") || String(e ?? "")).toString();
    if (haystack.includes("NonUniqueReferent")) return "multiple";
    if (haystack.includes("NoReferent")) return "notFound";
    return "indeterminate";
}

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
            const nameVal = getElementNameAttributeValue(node);
            if (nameVal) {
                result.push({ name: nameVal, element: node });
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
 * Collect descendant names from a takesIndex composite other than a branch
 * container (a `<repeat>` after an index, `$rep[2].`), walking through any
 * wrapper children (case/else/option) transparently. A branch container
 * (`<conditionalContent>`, `<select>`) uses `sharedBranchNames` instead,
 * which keeps only the names every branch declares (issue #2455).
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

        const nameVal = getElementNameAttributeValue(child);
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
            const nameVal = getElementNameAttributeValue(child);
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

/** Whether `element` is written with `copy` or `extend`. */
function isWrittenAsCopyOrExtend(element: DastElement): boolean {
    return Object.keys(element.attributes).some((key) => {
        const lower = key.toLowerCase();
        return lower === "copy" || lower === "extend";
    });
}

/**
 * When the core resolves a path to the branch container `container` with
 * `names` left for it (`Ref::Branches`: `$x` or `$cc.x` for an `x` declared
 * in its branches), the declarations of the longest leading run of `names`
 * that every branch shares (`branchDeclarations`), one per branch, and how
 * many names that run is. `null` when not even the first name resolves
 * through the branches: `container` is not a branch container, no branch
 * declares it (a property of the container, `$cc.hidden`), or the branches
 * do not satisfy the every-branch, same-tag rule. The names after the run
 * are left as properties of its declarations only when no branch's
 * declaration has an element by the first of them; otherwise also `null`.
 *
 * With `indexed`, for a path after an index into a select's picks
 * (`$s[2].x`), `container` may be a `<select>` of any number of picks.
 * `namesIndexed` says which of `names` are written with an index
 * (`$s[1].x` for a select `s` in every branch).
 */
function resolveThroughBranches(
    container: DastElement,
    names: string[],
    indexed: boolean,
    namesIndexed: boolean[] = [],
): { declarations: DastElement[]; consumed: number } | null {
    if (!branchContainerKind(container, indexed)) return null;
    for (let consumed = names.length; consumed >= 1; consumed--) {
        const declarations = branchDeclarations(
            container,
            names.slice(0, consumed),
            indexed,
            namesIndexed.slice(0, consumed),
        );
        if (!Array.isArray(declarations)) continue;
        // The names after the run are properties of its declarations
        // (`$v.head` for a vector `v` in every branch) only when no
        // branch's declaration has an element by the next one; otherwise
        // a branch lacking it makes the path name nothing
        // (`doenet-w0183`), as the run time decides it (`reach` in
        // `branchDeclaration`, `typeChangeAtLoad.ts`).
        if (
            consumed < names.length &&
            declarations.some((declaration) =>
                namesElement(
                    declaration.children as DastNodes[],
                    names[consumed],
                ),
            )
        ) {
            return null;
        }
        return { declarations, consumed };
    }
    return null;
}

/**
 * Extract derived repeat names from `valueName`/`indexName` attributes on a
 * repeat or repeatForSequence element. Returns an empty array for other elements.
 */
function getDerivedRepeatNamesFromElement(el: DastElement): string[] {
    if (!isRepeatLikeElement(el)) {
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
     * Trigger core initialization and return the flat (post-expansion)
     * DAST.  Used to initialize the rust core.  When `returnNormalizedDastRoot`
     * is also provided, the adapter prefers the normalized DAST for its
     * index mappings (it contains every source element with the resolver-
     * known id, including reference-making composites like
     * `<module copy="$x">` that may be replaced with error entries in
     * the expanded flat DAST).
     */
    returnDast(): Promise<{
        elements: Array<{
            data?: { id?: number };
            position?: { start: { offset?: number } };
        }>;
    }>;
    /**
     * Return the pre-expansion normalized DAST: every source element
     * with its resolver-known id and source position, plus error nodes.
     * Optional for backward compatibility with pure-JS test mocks that
     * only implement `returnDast`; when present, the adapter uses this
     * as the authoritative source for its `_dastElementToRustIndex`
     * mapping so that reference-making elements like
     * `<module copy="$x">` are mapped even when their expansion errors
     * (which would replace them with id-less error entries in the
     * post-expansion flat DAST).
     */
    returnNormalizedDastRoot?(): Promise<{
        nodes: Array<{
            idx: number;
            name?: string;
            position?: { start?: { offset?: number } };
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
    /** `getBranchSharedNames`'s result, for the source it was computed on. */
    _branchSharedNames: { source: string; names: string[] } | null = null;

    /**
     * A promise that resolves once the most recently requested source sync
     * has finished.  `init` and `updateSource` each chain another
     * `_syncSource` onto it, and the query methods wait on it before reading
     * resolver state.  This serializes syncs and keeps a completion request
     * from reading a half-updated rust core or stale index mappings while an
     * `updateSource` is still running.
     */
    _pendingSync: Promise<void> = Promise.resolve();

    /**
     * The DoenetML source string currently loaded into the rust core (`null`
     * before the first sync).  `_syncSource` compares the latest source
     * against this and returns early when they are equal, so a burst of
     * keystrokes that each queue a sync only pays the worker round-trips once.
     */
    _coreSource: string | null = null;

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
        this._pendingSync = this._pendingSync.then(() => this._syncSource());
        return this._pendingSync;
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
        if (this._sourceObj.source === this._coreSource) {
            return;
        }
        this._coreSource = this._sourceObj.source;
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
            // `returnDast` triggers core initialization (required before
            // `resolvePath` can run).  Its post-expansion output is fine
            // for elements that survive expansion, but replaces composites
            // whose extension errored with id-less error entries — making
            // them invisible to position-based mapping.  When the core
            // exposes the pre-expansion normalized DAST, prefer that: it
            // includes EVERY source element with its resolver-known id,
            // so reference-making elements like `<module copy="$x">` are
            // mapped even when their expansion errors.
            const flatDast = await this._core.returnDast();
            const normalizedNodes = this._core.returnNormalizedDastRoot
                ? (await this._core.returnNormalizedDastRoot()).nodes
                : null;
            this._buildMappings(flatDast, normalizedNodes);
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
     * Build bidirectional mappings between Rust indices and JS DAST elements
     * by matching on source position (start offset).
     *
     * When `normalizedNodes` is provided (preferred), uses the pre-expansion
     * source-level DAST so reference-making elements like
     * `<module copy="$x">` are mapped even when their post-expansion entry
     * is an id-less error.  Otherwise falls back to the flat (post-expansion)
     * DAST — sufficient for pure-JS test mocks and for elements that survive
     * expansion.
     */
    _buildMappings(
        flatDast: {
            elements: Array<{
                data?: { id?: number };
                position?: { start: { offset?: number } };
            }>;
        },
        normalizedNodes: Array<{
            idx: number;
            name?: string;
            position?: { start?: { offset?: number } };
        }> | null,
    ): void {
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
                return;
            }
            if (node.type === "macro" || node.type === "function") {
                // An element a reference owns — written between its index
                // brackets (#1909) or as one of a function reference's
                // arguments — is a child of nothing, so the recursion above
                // misses it. The core does give it an idx, and without this the
                // editor cannot map that idx back to any markup, which is what
                // makes `$myList[<indexOf name="x"/>]` unaddressable.
                for (const pathPart of node.path) {
                    for (const propIndex of pathPart.index) {
                        for (const child of propIndex.value) {
                            collectElements(child as DastNodes);
                        }
                    }
                }
                if (node.type === "function" && node.input) {
                    for (const argument of node.input) {
                        for (const child of argument) {
                            collectElements(child as DastNodes);
                        }
                    }
                }
            }
        };
        for (const child of this._sourceObj.dast.children) {
            collectElements(child as DastNodes);
        }

        if (normalizedNodes) {
            // Normalized DAST: every source element has an `idx` and a
            // position.  Error nodes (no `name`) are skipped — their idx
            // wouldn't be a useful resolver origin anyway.
            for (const node of normalizedNodes) {
                if (node.name == null) continue;
                const startOffset = node.position?.start?.offset;
                if (startOffset == null) continue;
                const dastElm = dastByStartOffset.get(startOffset);
                if (!dastElm) continue;
                this._rustIndexToDastElement.set(node.idx, dastElm);
                this._dastElementToRustIndex.set(dastElm, node.idx);
            }
            return;
        }

        // Fallback: match flat (post-expansion) DAST elements to JS DAST
        // elements by start offset.  Used by pure-JS test mocks that
        // don't implement `returnNormalizedDastRoot`.
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

    /**
     * Resolve a bare-name path (`pathParts = names`, each segment a bare
     * name with no bracket index) starting from the Rust index of
     * `originDastElement`, and return the resolved JS DAST element.
     * Returns `null` on any resolution failure (adapter disabled, origin
     * not in the index map, core resolution returned unresolved parts,
     * resolved index not mapped back to a JS DAST element, empty `names`).
     *
     * "Bare path" means every segment is a plain identifier — e.g.
     * `["s", "m"]` for `$s.m`.  Bracket-bearing segments are the caller's
     * responsibility to filter out before calling; the shim itself doesn't
     * thread index values through (the runtime's takesIndex semantics under
     * a sectioning parent are subtle enough that "exact-match the simple
     * textual cases" stays the right rule — same posture PR #1185 took for
     * `numToSelect`).
     *
     * Thin specialization of `_core.resolvePath` reusing the same
     * `_rustIndexToDastElement` mapping used by member-completion resolution
     * at lines 477-480.  Intentionally does not run any of the
     * member-completion-specific work (descendant probing, takesIndex gating,
     * composite-wrapper walk) — this is the minimal "give me the node the
     * path points at" primitive consumed by per-instance `<module>` attribute
     * augmentation in `module-attributes.ts` (issue #1154).
     */
    async resolveBarePathAtOrigin(
        originDastElement: DastElement,
        names: string[],
    ): Promise<DastElement | null> {
        // Same sync-await contract as member-container resolution: without
        // this, the JS index mappings and the rust-side source can diverge
        // from the origin element the caller passed in (e.g. while
        // updateSource is still draining a burst of edits).
        await this._pendingSync;
        if (!this._enabled || !this._core) return null;
        if (names.length === 0 || names.some((n) => !n)) return null;

        // Direct map lookup: the resolver expects the reference-making
        // element itself as origin, so it can search from that element's
        // scope outward (siblings, then parent's siblings, …).  Thanks
        // to the normalized-DAST-backed mapping, even composites whose
        // expansion errors get mapped here.  Root fallback covers edge
        // cases (malformed source, pure-JS test mocks without a
        // normalized DAST).
        const originIndex =
            this._dastElementToRustIndex.get(originDastElement) ??
            this._getRootOriginIndex();
        if (originIndex == null) return null;

        const flatPath: FlatPathPartForResolver[] = names.map((name) => ({
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
            // A bare path has to resolve fully; any leftover parts mean
            // the path was wrong (e.g. resolved to a takesIndex container
            // without an index, or named a descendant the parent doesn't
            // expose).  Caller treats partial resolutions as "no target".
            if (
                resolution.unresolvedPath &&
                resolution.unresolvedPath.length > 0
            ) {
                return null;
            }
            return this._rustIndexToDastElement.get(resolution.nodeIdx) ?? null;
        } catch {
            // The Rust core throws `NoReferent` (and similar) for
            // unresolvable bare references (e.g. `<module copy="$missing"/>`).
            // That's the expected "no target" signal for the caller, not an
            // adapter-level error — null propagates the failure to
            // `getEffectiveModuleAttributes`, which treats it as "no
            // per-instance augmentation applies" (canonical schema decides).
            return null;
        }
    }

    async _resolveRefMemberContainer(
        args: ResolveRefMemberContainerArgs,
    ): Promise<RefMemberContainerResolution | null> {
        // Wait for the latest source sync to finish before reading state.
        // Otherwise the JS-side mappings (_rustIndexToDastElement) and the
        // rust-side source can diverge from the offset the caller passed in.
        await this._pendingSync;
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

        const originIndex = this._referenceOriginIndex(offset);
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

            const coreResolvedNode = this._rustIndexToDastElement.get(
                resolution.nodeIdx,
            );
            if (!coreResolvedNode) return null;
            let resolvedNode: DastElement = coreResolvedNode;

            const unresolvedPathParts = (resolution.unresolvedPath ?? []).map(
                (p) => p.name,
            );

            // The names after a branch container that the core left for it
            // (`Ref::Branches`, issue #2455): `$x.` for an `x` declared in
            // the branches of a `<conditionalContent>`, or `$cc.x.`. When
            // every branch declares them, they resolve to the active
            // branch's; any first branch's declaration stands for them all
            // (same tag), and the names below are those every branch's
            // declaration shares.
            let branchHop: {
                container: DastElement;
                names: string[];
                indexed: boolean;
                namesIndexed: boolean[];
            } | null = null;

            if (unresolvedPathParts.length > 0) {
                // When there are unresolved parts, the path is invalid for
                // descendant/property lookup — return `node: null` so the
                // caller offers no descendant completions / no property help.
                // Expose `partiallyResolvedNode` so the help layer can still
                // run an `indexAliases` chase for coordinate chains like
                // `$vector.head.x` (resolves to `<vector>` with `head`
                // unresolved as an array state-variable name).
                const unresolvedHere = {
                    node: null,
                    unresolvedPathParts,
                    partiallyResolvedNode: coreResolvedNode,
                    visibleDescendantNames: [],
                };
                if (!branchContainerKind(coreResolvedNode, true)) {
                    // The names the core left are properties of the node it
                    // resolved, read by the alias chase. Not when a name it
                    // resolved is written with an index it does not take
                    // (`$v[1].head.` for a plain vector `v`, runtime
                    // `doenet-w0180`), or reaches into a repeat without one
                    // (`$rep.v.head.`): the path names nothing, so no
                    // property is offered (issue #2479). Other components
                    // that take an index pass a name in them on without
                    // one (`$vl.v.head.x` for a `v` in a `<vectorList>`,
                    // or a `<shuffle>` or `<sort>`, is the coordinate).
                    const resolvedParts = lookupParts.slice(
                        0,
                        lookupParts.length - unresolvedPathParts.length,
                    );
                    const lastResolved = resolvedParts.length - 1;
                    const blocked =
                        this._firstBlockedSegment(
                            resolution.nodesInResolvedPath,
                            resolvedParts,
                            effectivePathPartHasIndex,
                            false,
                            isRepeatLikeElement,
                        ) ??
                        (lastResolved >= 0 &&
                        effectivePathPartHasIndex[lastResolved] &&
                        !this._componentTakesIndex(coreResolvedNode.name)
                            ? lastResolved
                            : null);
                    if (blocked != null) {
                        return {
                            node: null,
                            unresolvedPathParts: lookupParts.slice(blocked),
                            visibleDescendantNames: [],
                        };
                    }
                    return unresolvedHere;
                }
                // The last path part the core resolved (`cc` in `$cc.x`, `a`
                // in `$a.x`), `-1` for a bare `$x`. The container is that
                // part's node when the path names it (`$cc.x`); otherwise the
                // core reached it through the branches (`$x`, `$a.x`).
                const containerPartIndex =
                    lookupParts.length - unresolvedPathParts.length - 1;
                // The names the core resolved, alone: the node they name
                // and the nodes on the way. The container is named when
                // that node is the container itself (`$cc.x`), not when
                // the core reached it below that node (`$r.x` for an `x`
                // in a container in the repeat `r`, even one also named
                // `r`). Every node on the way is an intermediate.
                const namedPrefix =
                    containerPartIndex >= 0
                        ? await this._core.resolvePath({
                              path: {
                                  path: flatPath.slice(
                                      0,
                                      containerPartIndex + 1,
                                  ),
                              },
                              origin: originIndex,
                              skipParentSearch: false,
                          })
                        : null;
                if (
                    namedPrefix &&
                    ((namedPrefix.unresolvedPath?.length ?? 0) > 0 ||
                        !resolution.nodesInResolvedPath.includes(
                            namedPrefix.nodeIdx,
                        ))
                ) {
                    // Not the node the longer path went through: nothing
                    // here can be checked, so nothing is offered.
                    return {
                        node: null,
                        unresolvedPathParts,
                        visibleDescendantNames: [],
                    };
                }
                const containerNamed =
                    namedPrefix !== null &&
                    namedPrefix.nodeIdx === resolution.nodeIdx;
                const indexed =
                    containerNamed &&
                    (effectivePathPartHasIndex[containerPartIndex] ?? false);
                const namesIndexed = lookupParts
                    .slice(containerPartIndex + 1)
                    .map((_, i) =>
                        Boolean(
                            effectivePathPartHasIndex[
                                containerPartIndex + 1 + i
                            ],
                        ),
                    );
                const through = resolveThroughBranches(
                    coreResolvedNode,
                    unresolvedPathParts,
                    indexed,
                    namesIndexed,
                );
                if (!through) {
                    return unresolvedHere;
                }
                // Every resolved part is an intermediate here, the
                // container included when the path names it.
                const blocked = namedPrefix
                    ? this._firstBlockedSegment(
                          namedPrefix.nodesInResolvedPath,
                          lookupParts.slice(0, containerPartIndex + 1),
                          effectivePathPartHasIndex,
                          true,
                      )
                    : null;
                if (blocked != null) {
                    return {
                        node: null,
                        unresolvedPathParts: lookupParts.slice(blocked),
                        visibleDescendantNames: [],
                    };
                }
                // A hop at the first name (`$x.` for an `x` in the
                // branches) is a bare `$x`: it names nothing where the
                // cursor finds `x` declared more than once, or the
                // container is hidden by sugar (`_resolveBareName`).
                if (
                    containerPartIndex === -1 &&
                    (this._isAmbiguousFromCursor(
                        coreResolvedNode,
                        lookupParts[0],
                        offset,
                    ) ||
                        this._isHiddenBySugar(resolution.nodeIdx, offset))
                ) {
                    return {
                        node: null,
                        unresolvedPathParts,
                        visibleDescendantNames: [],
                    };
                }
                if (through.consumed < unresolvedPathParts.length) {
                    // The names left are properties of the declarations,
                    // read without an index: with an index on the last
                    // name of the run (`$v[1].head`), no property lookup
                    // is offered (runtime `doenet-w0180`).
                    if (namesIndexed[through.consumed - 1]) {
                        return {
                            node: null,
                            unresolvedPathParts: unresolvedPathParts.slice(
                                through.consumed,
                            ),
                            visibleDescendantNames: [],
                        };
                    }
                    return {
                        node: null,
                        unresolvedPathParts: unresolvedPathParts.slice(
                            through.consumed,
                        ),
                        partiallyResolvedNode: through.declarations[0],
                        visibleDescendantNames: [],
                    };
                }
                resolvedNode = through.declarations[0];
                branchHop = {
                    container: coreResolvedNode,
                    names: unresolvedPathParts,
                    indexed,
                    namesIndexed,
                };
            } else {
                // If any intermediate segment resolves through a takesIndex
                // component without an index (e.g. $rep.myMath.), block
                // member completions for that path. Indexed traversal must
                // use $rep[n].member.  Separately validate that
                // non-takesIndex segments do not have indices (false
                // positives worse than false negatives).
                const blocked = this._firstBlockedSegment(
                    resolution.nodesInResolvedPath,
                    lookupParts,
                    effectivePathPartHasIndex,
                    false,
                );
                if (blocked != null) {
                    return {
                        node: null,
                        unresolvedPathParts: lookupParts.slice(blocked),
                        visibleDescendantNames: [],
                    };
                }
            }

            const resolvedPathPartIndex = lookupParts.length - 1;
            const resolvedPartHasIndex =
                effectivePathPartHasIndex[resolvedPathPartIndex] ?? false;
            // Strict-rule shorthand from issue #1181: a select-family
            // container whose count attribute is absent or literal "1"
            // resolves `$s.t` like `$s[1].t`. Both the takesIndex-block
            // and the composite-children branches treat that as if the
            // bracket index were authored.
            const resolvedPartHasEffectiveIndex =
                resolvedPartHasIndex || hasImplicitSingleIndex(resolvedNode);

            // When the resolved element takes an index, descendants
            // are only accessible via $name[n].member — suppress them
            // unless the user has already provided a bracket index.
            if (
                this._componentTakesIndex(resolvedNode.name) &&
                !resolvedPartHasEffectiveIndex
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

            // A name the core left for a branch container: the names
            // below it are those every branch's declaration shares.
            if (branchHop) {
                return {
                    node: resolvedNode,
                    unresolvedPathParts: [],
                    visibleDescendantNames: sharedBranchNames(
                        branchHop.container,
                        branchHop.indexed,
                        branchHop.names,
                        branchHop.namesIndexed,
                    ),
                    hiddenMemberNames: unsharedBranchNames(
                        branchHop.container,
                        branchHop.indexed,
                        branchHop.names,
                        branchHop.namesIndexed,
                    ),
                };
            }

            // A branch container (a `<conditionalContent>`, a `<select>`
            // that picks one, or any `<select>` after an index into its
            // picks): the names every branch shares (issue #2455).
            if (
                branchContainerKind(resolvedNode, resolvedPartHasEffectiveIndex)
            ) {
                return {
                    node: resolvedNode,
                    unresolvedPathParts: [],
                    visibleDescendantNames: sharedBranchNames(
                        resolvedNode,
                        resolvedPartHasEffectiveIndex,
                    ),
                    hiddenMemberNames: unsharedBranchNames(
                        resolvedNode,
                        resolvedPartHasEffectiveIndex,
                    ),
                };
            }

            // For other takesIndex composites with an index present (a
            // repeat), the names in an instance (`$rep[2].x`): those named
            // once in it, and those every branch of a branch container in
            // it declares (issue #2479), as `$sec.` has them below. The core
            // resolves each from the composite, which keeps only those a
            // reference reaches.
            if (
                resolvedPartHasEffectiveIndex &&
                this._componentTakesIndex(resolvedNode.name)
            ) {
                const names = await this._probedDescendantNames(
                    resolution.nodeIdx,
                    [
                        ...collectNamesFromCompositeChildren(resolvedNode),
                        ...namesSharedByBranchesIn(resolvedNode),
                    ],
                    offset,
                );
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
            // Names every branch of a branch container below it declares
            // (`$sec.x` for an `x` in each case of a `<conditionalContent>`
            // in `sec`, issue #2455), which the unique-name walk drops for
            // being declared more than once, are candidates too.
            const visibleDescendantNames = await this._probedDescendantNames(
                resolution.nodeIdx,
                [
                    ...this._sourceObj.getUniqueDescendantNamesForNode(
                        resolvedNode,
                    ),
                    ...namesSharedByBranchesIn(resolvedNode),
                ],
                offset,
            );

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
     * The names among `candidates` that a reference from the node
     * `resolvedIdx` reaches below it, as the core resolves them: a name
     * that resolves to an element by it, or that the core leaves for a
     * branch container (`Ref::Branches`) whose branches every one declares
     * it with one tag, in a container not hidden by sugar at `offset`.
     * Cached per node until the source changes.
     */
    async _probedDescendantNames(
        resolvedIdx: number,
        candidates: string[],
        offset: number,
    ): Promise<string[]> {
        const cached = this._getCachedVisibleDescendantNames(resolvedIdx);
        if (cached) {
            return cached;
        }
        const allNames = [...new Set(candidates)];
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
                    const probeElement = this._rustIndexToDastElement.get(
                        probe.nodeIdx,
                    );
                    if (
                        probe.unresolvedPath &&
                        probe.unresolvedPath.length > 0
                    ) {
                        return (
                            probeElement != null &&
                            probe.unresolvedPath.length === 1 &&
                            probe.unresolvedPath[0].name === name &&
                            resolveThroughBranches(
                                probeElement,
                                [name],
                                false,
                            ) !== null &&
                            !this._isHiddenBySugar(probe.nodeIdx, offset)
                        );
                    }
                    // Otherwise a fully-resolved path means the name
                    // matched a visible descendant.
                    return (
                        probeElement != null &&
                        getElementNameAttributeValue(probeElement) === name
                    );
                } catch {
                    return false;
                }
            }),
        );
        const visible = allNames.filter((_name, i) => probeResults[i]);
        this._setCachedVisibleDescendantNames(resolvedIdx, visible);
        return visible;
    }

    /**
     * The index of the first path segment among `parts` that is used wrongly
     * as an intermediate, or `null` when none is: a takesIndex component
     * reached without an index (`$rep.myMath.` must be `$rep[n].myMath.`),
     * or a component that takes no index reached with one (false positives
     * are worse than false negatives).
     *
     * Select-family containers with a literal `numToSelect="1"` (or no
     * attribute) carry an implicit `[1]` per the strict rule in issue
     * #1181, so they pass the takesIndex-without-index check as if the
     * bracket were authored.
     *
     * `nodesInResolvedPath` is the core's; its trailing nodes are aligned
     * with `parts`. The last of `parts` is checked only with
     * `includeLast` — otherwise it is the node being completed, which the
     * caller checks itself.
     *
     * `blocksWithoutIndex` narrows which takesIndex components block when
     * reached without an index (all of them by default).
     */
    _firstBlockedSegment(
        nodesInResolvedPath: number[],
        parts: string[],
        pathPartHasIndex: boolean[],
        includeLast: boolean,
        blocksWithoutIndex: (pathNode: DastElement) => boolean = () => true,
    ): number | null {
        if (parts.length === 0) return null;
        if (!includeLast && nodesInResolvedPath.length <= 1) return null;
        // Rust includes the origin in nodesInResolvedPath, but when the
        // origin is also the first resolved segment it may not be
        // duplicated. Align to `parts` by taking the trailing nodes that
        // correspond to the resolved path segments.
        const alignedPathNodeIndices = nodesInResolvedPath.slice(-parts.length);
        const checkedPathNodeIndices = includeLast
            ? alignedPathNodeIndices
            : alignedPathNodeIndices.slice(0, -1);
        for (
            let pathPartIndex = 0;
            pathPartIndex < checkedPathNodeIndices.length;
            pathPartIndex++
        ) {
            const pathNode = this._rustIndexToDastElement.get(
                checkedPathNodeIndices[pathPartIndex],
            );
            if (!pathNode) continue;
            const segmentHasIndex = pathPartHasIndex[pathPartIndex] ?? false;
            const segmentHasEffectiveIndex =
                segmentHasIndex || hasImplicitSingleIndex(pathNode);
            const takesIndex = this._componentTakesIndex(pathNode.name);
            if (
                takesIndex &&
                !segmentHasEffectiveIndex &&
                blocksWithoutIndex(pathNode)
            ) {
                return pathPartIndex;
            }
            if (!takesIndex && segmentHasIndex) {
                return pathPartIndex;
            }
        }
        return null;
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
        // Wait for the latest source sync to finish before reading state.
        // See `_resolveRefMemberContainer` for the rationale.
        await this._pendingSync;
        if (!this._enabled || !this._core) return false;

        // Derived repeat names from valueName/indexName are introduced by
        // repeat runtime behavior and are always addressable from within the
        // repeat body. They are not affected by conditional/select sugar,
        // so this intentionally bypasses isHiddenBySugar().
        const derivedRepeatNames = this.getDerivedRepeatNames(offset);
        if (derivedRepeatNames.includes(name)) return true;

        return (await this._resolveBareName(offset, name)) !== null;
    }

    /**
     * Resolve the bare reference `$name` typed at `offset` to the element
     * it names, or `null` when it names none: the resolver finds no
     * referent or several, or the element is hidden by sugar
     * (`_isHiddenBySugar`).
     *
     * A name declared in the branches of a `<conditionalContent>` or a
     * one-pick `<select>` (issue #2455) resolves through the container
     * (`Ref::Branches`), to the active branch's declaration, when every
     * branch declares it with one tag (`branchDeclarations`); the first
     * branch's declaration is returned, standing for them all. Otherwise
     * the runtime reports it missing (`doenet-w0183`, `doenet-w0184`), and
     * it names none here.
     */
    async _resolveBareName(
        offset: number,
        name: string,
    ): Promise<DastElement | null> {
        if (!this._core) return null;
        const resolveFromIndex = this._referenceOriginIndex(offset);
        if (resolveFromIndex == null) return null;

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
            if (!resolvedElement) return null;

            const unresolved = resolution.unresolvedPath ?? [];
            if (unresolved.length > 0) {
                if (unresolved.length !== 1 || unresolved[0].name !== name) {
                    return null;
                }
                const through = resolveThroughBranches(
                    resolvedElement,
                    [name],
                    false,
                );
                if (!through) return null;
                // The container, like a declaration the core reaches
                // directly, may be hidden by sugar (beside a select's
                // options, or in a `<conditionalContent extend>`).
                return this._isAmbiguousFromCursor(
                    resolvedElement,
                    name,
                    offset,
                ) || this._isHiddenBySugar(resolution.nodeIdx, offset)
                    ? null
                    : through.declarations[0];
            }

            if (getElementNameAttributeValue(resolvedElement) !== name) {
                return null;
            }

            if (
                this._resolvedToOriginOrAncestor(
                    resolvedElement,
                    resolveFromIndex,
                ) &&
                this._isAmbiguousFromCursor(resolvedElement, name, offset)
            ) {
                return null;
            }

            // Post-filter: an element the resolver reaches directly but the
            // runtime does not (see `_isHiddenBySugar`).
            if (this._isHiddenBySugar(resolution.nodeIdx, offset)) {
                return null;
            }

            return resolvedElement;
        } catch {
            return null;
        }
    }

    /**
     * Whether `resolved`, which the core resolved `name` to from a resolve
     * origin, is that origin or one of its ancestors. The core resolves a
     * name that is ambiguous where it is found to the origin, or the
     * origin's ancestor, when that is one of its referents ("resolve back
     * to the child" in `search_parents`, `ref_resolve/resolve.rs`, as `$p`
     * inside one of two `<problem name="p">`s). A reference typed at the cursor is not
     * that origin (`_referenceOriginIndex` picks an existing element near
     * the cursor), so such a result needs `_isAmbiguousFromCursor`.
     */
    _resolvedToOriginOrAncestor(
        resolved: DastElement,
        originIdx: number,
    ): boolean {
        let node: DastElement | undefined =
            this._rustIndexToDastElement.get(originIdx);
        while (node) {
            if (node === resolved) return true;
            const parent = this._sourceObj.getParent(node);
            node =
                parent && parent.type === "element"
                    ? (parent as DastElement)
                    : undefined;
        }
        return false;
    }

    /**
     * Whether a reference `$name` at `offset` that the core resolved to
     * `resolved` (a declaration, or a branch container the name resolves
     * through) would be ambiguous: `name` is declared more than once where
     * the reference finds it, the nearest element holding both the cursor
     * and `resolved`. Undecided (`false`) when the cursor is inside
     * `resolved`, where the core rightly prefers it.
     *
     * Guards against the core's "resolve back to the child" tie-break (see
     * `_resolvedToOriginOrAncestor`), which applies when the origin is one
     * of the referents: the resolve origin is an element near the cursor,
     * not the reference itself, so the tie-break can pick a referent a
     * reference at the cursor would find ambiguous. A name declared in the
     * branches of a container is one declaration (`Ref::Branches`).
     */
    _isAmbiguousFromCursor(
        resolved: DastElement,
        name: string,
        offset: number,
    ): boolean {
        const cursorChain = new Set<unknown>();
        let node: DastElement | undefined =
            this._sourceObj.elementAtOffset(offset) ?? undefined;
        while (node) {
            cursorChain.add(node);
            const parent = this._sourceObj.getParent(node);
            node =
                parent && parent.type === "element"
                    ? (parent as DastElement)
                    : undefined;
        }
        if (cursorChain.has(resolved)) return false;
        let scope = this._sourceObj.getParent(resolved);
        while (scope && scope.type === "element" && !cursorChain.has(scope)) {
            scope = this._sourceObj.getParent(scope);
        }
        const nodes =
            scope && scope.type === "element"
                ? scope.children
                : this._sourceObj.dast.children;
        return countVisibleDeclarations(nodes as DastNodes[], name) > 1;
    }

    /**
     * The element a bare `$name` at `offset` names when it is declared in
     * the branches of a `<conditionalContent>` or a one-pick `<select>` and
     * resolves through the container (issue #2455): the first branch's
     * declaration, which shares its tag with the others. `null` for any
     * other name, which the AST-only `resolveRefNameForHelp` handles.
     *
     * Lets the autocomplete detail and the help panel describe such a
     * name, which the AST-only walk misses because it is declared more than
     * once.
     */
    async resolveBranchNameFromOffset(
        offset: number,
        name: string,
    ): Promise<DastElement | null> {
        await this._pendingSync;
        if (!this._enabled || !this._core) return null;
        const element = await this._resolveBareName(offset, name);
        if (!element) return null;
        // Only a declaration inside a branch container; a plain name is the
        // AST walk's to describe.
        let parent = this._sourceObj.getParent(element);
        while (parent && parent.type === "element") {
            if (branchContainerKind(parent)) return element;
            parent = this._sourceObj.getParent(parent);
        }
        return null;
    }

    /**
     * Candidate names for a bare `$` completion that the AST-only name walk
     * leaves out: names every branch of some `<conditionalContent>` or
     * one-pick `<select>` declares (`namesSharedByBranchesIn`), which that
     * walk drops for being declared more than once. Whether one resolves
     * from a given cursor is still decided by `isNameAddressableFromOffset`.
     */
    getBranchSharedNames(): string[] {
        if (
            this._branchSharedNames &&
            this._branchSharedNames.source === this._sourceObj.source
        ) {
            return this._branchSharedNames.names;
        }
        const names = namesSharedByBranchesIn(this._sourceObj.dast);
        this._branchSharedNames = { source: this._sourceObj.source, names };
        return names;
    }

    /**
     * Rust index to use as the resolve origin for a reference typed at
     * `offset`. A `$name` reference becomes a child of the element whose body
     * contains the cursor, and `resolve_path` with `skipParentSearch=false`
     * searches from the origin's PARENT scope upward — so we resolve from one
     * of the container's existing children rather than the container itself,
     * to correctly probe the container's own scope. At root level, use the
     * first top-level element. Returns null when nothing maps.
     */
    _referenceOriginIndex(offset: number): number | null {
        const containingElement = this._sourceObj.elementAtOffset(offset);
        if (!containingElement) {
            return this._getRootOriginIndex();
        }
        for (const child of containingElement.children) {
            if (child.type === "element") {
                const ci = this._dastElementToRustIndex.get(child);
                if (ci != null) return ci;
            }
        }
        // No mapped child elements — fall back to the container itself. It has
        // no named children to be hidden, so the parent-scope walk is still
        // correct.
        return this._dastElementToRustIndex.get(containingElement) ?? null;
    }

    /**
     * Classify a reference `$pathParts.join(".")` at `offset` using the Rust
     * resolver — the runtime's own algorithm, so its verdicts are
     * authoritative:
     *   - `"found"`        — the whole path resolves.
     *   - `"notFound"`     — resolver reports `NoReferent`.
     *   - `"multiple"`     — resolver reports `NonUniqueReferent`.
     *   - `"indeterminate"`— resolver unavailable, or an inconclusive case
     *     (partial path left unresolved, single name resolving to a different
     *     element or hidden by sugar, or an unrecognized error). Callers must
     *     not present these as definitive.
     *
     * Resolves the FULL path (unlike member-container resolution, which chops
     * the last segment), with empty bracket indices — matching how
     * `_resolveRefMemberContainer` builds its flat path. Picks its origin with
     * `_referenceOriginIndex`, like the other reference lookups, so the scope
     * probed matches what a reference typed at `offset` would actually see.
     */
    async classifyReferenceFromOffset(
        offset: number,
        pathParts: string[],
    ): Promise<"found" | "notFound" | "multiple" | "indeterminate"> {
        await this._pendingSync;
        if (!this._enabled || !this._core) return "indeterminate";
        if (pathParts.length === 0 || pathParts.some((p) => !p)) {
            return "indeterminate";
        }

        // A single bare name that's a repeat-introduced binding
        // (valueName/indexName) always resolves from within the repeat body.
        if (pathParts.length === 1) {
            const derivedRepeatNames = this.getDerivedRepeatNames(offset);
            if (derivedRepeatNames.includes(pathParts[0])) return "found";
        }

        const resolveFromIndex = this._referenceOriginIndex(offset);
        if (resolveFromIndex == null) return "indeterminate";

        const flatPath: FlatPathPartForResolver[] = pathParts.map((name) => ({
            type: "flatPathPart" as const,
            name,
            index: [],
        }));

        try {
            const resolution = await this._core.resolvePath({
                path: { path: flatPath },
                origin: resolveFromIndex,
                skipParentSearch: false,
            });
            // A partly-resolved path (e.g. a coordinate alias chain like
            // `$vector.head.x`, or a genuinely unreachable tail) is not a
            // clean verdict — stay non-committal.
            if (
                resolution.unresolvedPath &&
                resolution.unresolvedPath.length > 0
            ) {
                // Names the core left for a branch container that every
                // branch declares resolve to the active branch's
                // (issue #2455).
                const container = this._rustIndexToDastElement.get(
                    resolution.nodeIdx,
                );
                const unresolved = resolution.unresolvedPath.map((p) => p.name);
                const through = container
                    ? resolveThroughBranches(container, unresolved, false)
                    : null;
                if (!through || through.consumed !== unresolved.length) {
                    return "indeterminate";
                }
                // A hop at the first name is a bare `$x` (see
                // `_resolveBareName`).
                if (unresolved.length === pathParts.length) {
                    if (
                        this._isAmbiguousFromCursor(
                            container!,
                            pathParts[0],
                            offset,
                        )
                    ) {
                        return "multiple";
                    }
                    if (this._isHiddenBySugar(resolution.nodeIdx, offset)) {
                        return "indeterminate";
                    }
                }
                return "found";
            }
            // For a bare name, confirm the resolved element actually bears the
            // name and isn't sugar-hidden before claiming "found".
            if (pathParts.length === 1) {
                const resolvedElement = this._rustIndexToDastElement.get(
                    resolution.nodeIdx,
                );
                const resolvedName = resolvedElement
                    ? getElementNameAttributeValue(resolvedElement)
                    : null;
                if (
                    resolvedName !== pathParts[0] ||
                    this._isHiddenBySugar(resolution.nodeIdx, offset)
                ) {
                    return "indeterminate";
                }
            }
            return "found";
        } catch (e) {
            return classifyResolutionError(e);
        }
    }

    /**
     * Check whether a node at `rustIdx` the resolver reached directly
     * should be left out for a reference at `cursorOffset`: one inside a
     * `<conditionalContent>` or `<select>` the cursor is outside of, held
     * there by a child that is not one of its branches (`<case>`/`<else>`,
     * `<option>`).
     *
     * The resolver already keeps what a reference cannot see out of reach:
     * a name in a branch it resolves through the container
     * (`Ref::Branches`, see `_resolveBareName`), and a name in an option of
     * a `<select>` that picks several stays private. What is left is
     * content written beside the branches, which is not a branch:
     *
     * - a `<select>` child that is not an `<option>` (`selectSugar` wraps
     *   only text and references), and a `<conditionalContent>` child
     *   beside its `<case>`s (its sugar wraps the children only when there
     *   is no `<case>` or `<else>`). The runtime reports such a child as
     *   invalid (`doenet-w0107`), though a reference to a name in it still
     *   resolves; autocomplete does not steer the author to it.
     * - the children of a `<conditionalContent extend>`, which gets no
     *   sugar; the runtime reports them (`doenet-e0057`) and a reference
     *   to a name in them names nothing.
     *
     * A branch itself (`<case name="…">`) remains addressable.
     */
    _isHiddenBySugar(rustIdx: number, cursorOffset: number): boolean {
        const resolvedElement = this._rustIndexToDastElement.get(rustIdx);
        if (!resolvedElement) return false;

        let child: DastElement = resolvedElement;
        let parent = this._sourceObj.getParent(resolvedElement);

        while (parent && parent.type === "element") {
            const containerTag = parent.name.toLowerCase();
            if (
                containerTag === "conditionalcontent" ||
                containerTag === "select"
            ) {
                const start = parent.position?.start?.offset;
                const end = parent.position?.end?.offset;
                const cursorOutside =
                    start != null &&
                    end != null &&
                    (cursorOffset < start || cursorOffset >= end);
                // Branch tags are matched exactly, as the parser's sugar
                // and the core do (`branchesAndStrays`): an `<Else>` is
                // not a branch (`doenet-e0002`). The container tag is not,
                // so that a container written in another case hides more,
                // never less.
                const childTag = child.name;
                const childIsBranch =
                    containerTag === "select"
                        ? childTag === "option"
                        : childTag === "case" || childTag === "else";
                // A `<conditionalContent>` with no `<case>` or `<else>` is
                // sugared into one case holding all its children (unless it
                // is written with `extend`; one written with `copy` is
                // conservatively treated the same), and the resolver sees
                // the case.
                const sugaredIntoCase =
                    containerTag === "conditionalcontent" &&
                    !isWrittenAsCopyOrExtend(parent) &&
                    !parent.children.some(
                        (c) =>
                            c.type === "element" &&
                            (c.name === "case" || c.name === "else"),
                    );
                if (cursorOutside && !childIsBranch && !sugaredIntoCase) {
                    return true;
                }
            }
            child = parent;
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
     * The new sync is appended to the `_pendingSync` chain rather than run
     * concurrently with a sync that is still running.  Callers may
     * fire-and-forget the returned promise; the query methods `await
     * _pendingSync` themselves and so always see a consistent state.
     */
    updateSource(sourceObj: DoenetSourceObject): Promise<void> {
        this._sourceObj = sourceObj;
        this._pendingSync = this._pendingSync.then(() => this._syncSource());
        return this._pendingSync;
    }
}

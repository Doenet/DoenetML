import type { DastElement, DastNodes } from "@doenet/parser";
import type { DoenetSourceObject } from "../doenet-source-object";
import type {
    ResolveRefMemberContainer,
    ResolveRefMemberContainerArgs,
} from "./index";

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
}

/**
 * Adapter that bridges a Rust WASM resolver (PublicDoenetMLCore.resolve_path)
 * with the AutoCompleter's pluggable resolver seam.
 *
 * When constructed without a `core`, the adapter is disabled and its resolver
 * returns `null`, allowing the JS fallback to handle resolution. When a core
 * is supplied, source is synced to the Rust side, position-based index mappings
 * are built, and the resolver calls resolve_path() for each completion request.
 */
export class RustResolverAdapter {
    private core: RustResolverCore | null = null;
    private sourceObj: DoenetSourceObject;
    private enabled = false;

    /** Rust flat index → JS DAST element (matched by source position). */
    private rustIndexToDastElement: Map<number, DastElement> = new Map();
    /** JS DAST element → Rust flat index. */
    private dastElementToRustIndex: Map<DastElement, number> = new Map();

    constructor(
        sourceObj: DoenetSourceObject,
        options?: RustResolverAdapterOptions,
    ) {
        this.sourceObj = sourceObj;
        if (options?.core) {
            this.core = options.core;
            this.syncSource();
        }
    }

    /**
     * Sync the DAST/source to the Rust core and rebuild index mappings.
     */
    private syncSource(): void {
        if (!this.core) {
            this.enabled = false;
            return;
        }
        // The Rust core panics on empty source (index-out-of-bounds on a
        // zero-length collection).  It also panics when the DAST contains
        // no elements (e.g. source is just "a" — only text nodes, zero
        // elements).  Skip the sync in both cases.
        if (!this.sourceObj.source.trim()) {
            this.enabled = false;
            return;
        }
        const hasElements = this.sourceObj.dast.children.some(
            (c) => c.type === "element",
        );
        if (!hasElements) {
            this.enabled = false;
            return;
        }
        try {
            this.core.set_source(this.sourceObj.dast, this.sourceObj.source);
            const flatDast = this.core.return_dast();
            this.buildMappings(flatDast);
            this.enabled = true;
        } catch (e) {
            console.warn("RustResolverAdapter: failed to sync source:", e);
            this.enabled = false;
        }
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
        this.rustIndexToDastElement.clear();
        this.dastElementToRustIndex.clear();

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
        for (const child of this.sourceObj.dast.children) {
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
            this.rustIndexToDastElement.set(id, dastElm);
            this.dastElementToRustIndex.set(dastElm, id);
        }
    }

    /**
     * Create a resolver callback suitable for AutoCompleter's
     * `resolveRefMemberContainerAtOffset` option.
     */
    createResolver(): ResolveRefMemberContainer {
        return (args: ResolveRefMemberContainerArgs) => {
            if (!this.enabled || !this.core) return null;

            const { offset, pathParts } = args;
            if (pathParts.length === 0) return null;

            // Resolve up to but not including the last part (being edited).
            const lookupParts = pathParts.slice(0, -1);
            if (lookupParts.length === 0) return null;

            // Determine origin: the Rust index of the enclosing element.
            const originIndex = this.getOriginIndex(offset);
            if (originIndex == null) return null;

            const flatPath: FlatPathPartForResolver[] = lookupParts.map(
                (name) => ({
                    type: "flatPathPart" as const,
                    name,
                    index: [],
                }),
            );

            try {
                const resolution = this.core.resolve_path(
                    { path: flatPath },
                    originIndex,
                    false,
                );

                const resolvedNode = this.rustIndexToDastElement.get(
                    resolution.nodeIdx,
                );
                if (!resolvedNode) return null;

                const unresolvedPathParts = (
                    resolution.unresolvedPath ?? []
                ).map((p) => p.name);

                if (unresolvedPathParts.length > 0) {
                    return { node: null, unresolvedPathParts };
                }

                // Determine which descendant names are actually visible
                // from the resolved node using the Rust name_map (which
                // respects ChildrenInvisibleToTheirGrandparents etc.).
                const resolvedIdx = resolution.nodeIdx;
                const allNames =
                    this.sourceObj.getUniqueDescendantNamesForNode(
                        resolvedNode,
                    );
                const visibleDescendantNames = allNames.filter((name) => {
                    try {
                        const probe = this.core!.resolve_path(
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

                return {
                    node: resolvedNode,
                    unresolvedPathParts: [],
                    visibleDescendantNames,
                };
            } catch {
                // Resolution error (NoReferent, NonUniqueReferent, etc.)
                return null;
            }
        };
    }

    /**
     * Get the Rust flat index to use as the origin for resolve_path.
     * Uses the nearest enclosing element of the given offset, falling
     * back to a mapped top-level element when the cursor is at root level.
     */
    private getOriginIndex(offset: number): number | null {
        const containingElement = this.sourceObj.elementAtOffset(offset);
        if (containingElement) {
            const idx = this.dastElementToRustIndex.get(containingElement);
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
        for (const child of this.sourceObj.dast.children) {
            if (child.type !== "element") continue;
            const idx = this.dastElementToRustIndex.get(child);
            if (idx != null) {
                topLevelIndices.push(idx);
            }
        }
        if (topLevelIndices.length > 0) {
            return Math.min(...topLevelIndices);
        }

        const mappedIndices = [...this.rustIndexToDastElement.keys()];
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
        if (!this.enabled || !this.core) return true; // fallback: allow

        // A $name reference typed at `offset` will become a child of the
        // element whose body contains the cursor.  resolve_path with
        // skip_parent_search=false searches from the origin's PARENT scope
        // upward, so to correctly probe the containing element's scope we
        // must resolve from one of its existing children rather than the
        // container itself.
        const containingElement = this.sourceObj.elementAtOffset(offset);
        let resolveFromIndex: number | null = null;

        if (containingElement) {
            // Find the first child element that has a Rust index.
            for (const child of containingElement.children) {
                if (child.type === "element") {
                    const ci = this.dastElementToRustIndex.get(child);
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
                    this.dastElementToRustIndex.get(containingElement) ?? null;
            }
        } else {
            // Root level — use the first top-level element (a child of the
            // document root).  resolve_path from it with skip_parent_search=
            // false searches root scope, which is what a reference at root
            // level would see.
            resolveFromIndex = this.getRootOriginIndex();
        }

        if (resolveFromIndex == null) return true;

        try {
            this.core.resolve_path(
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
            return true;
        } catch {
            return false;
        }
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Update source and rebuild mappings. Call when the document changes.
     */
    updateSource(sourceObj: DoenetSourceObject): void {
        this.sourceObj = sourceObj;
        this.syncSource();
    }
}

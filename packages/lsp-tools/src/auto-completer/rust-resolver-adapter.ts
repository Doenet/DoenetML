import type { DastElementV6, DastNodesV6 } from "@doenet/parser";
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
    private rustIndexToDastElement: Map<number, DastElementV6> = new Map();
    /** JS DAST element → Rust flat index. */
    private dastElementToRustIndex: Map<DastElementV6, number> = new Map();

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
        const dastByStartOffset = new Map<number, DastElementV6>();
        const collectElements = (node: DastNodesV6) => {
            if (node.type === "element") {
                const off = node.position?.start?.offset;
                if (off != null) {
                    dastByStartOffset.set(off, node);
                }
                for (const child of node.children) {
                    collectElements(child as DastNodesV6);
                }
            }
        };
        for (const child of this.sourceObj.dast.children) {
            collectElements(child as DastNodesV6);
        }

        // Match flat DAST elements to JS DAST elements by start offset.
        for (const flatElm of flatDast.elements) {
            const startOffset = flatElm.position?.start?.offset;
            if (startOffset == null) continue;
            const dastElm = dastByStartOffset.get(startOffset);
            if (!dastElm) continue;
            this.rustIndexToDastElement.set(flatElm.data.id, dastElm);
            this.dastElementToRustIndex.set(dastElm, flatElm.data.id);
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

                return {
                    node: unresolvedPathParts.length > 0 ? null : resolvedNode,
                    unresolvedPathParts,
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
     * back to 0 when the cursor is at root level.
     */
    private getOriginIndex(offset: number): number | null {
        const containingElement = this.sourceObj.elementAtOffset(offset);
        if (containingElement) {
            const idx = this.dastElementToRustIndex.get(containingElement);
            if (idx != null) return idx;
        }
        // Root level — use first element if available.
        if (this.rustIndexToDastElement.size > 0) {
            return 0;
        }
        return null;
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

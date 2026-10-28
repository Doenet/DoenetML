/**
 * The cells core's component table and cells, read the way the bridge needs
 * them: as typed-array views over the core's wasm memory (ADR 0001), re-viewed
 * whenever memory grows or a rebuild replaces the arrays.
 *
 * The same columns `packages/cells-viewer/src/components.ts` reads; that viewer
 * is a separate renderer of the same core, kept for comparison (ADR 0020).
 */
import type { Core } from "@doenet/cells-core/pkg/cells_wasm.js";

/** The `0xffffffff` the core writes for "no component", "no name", "no node". */
export const NONE = 0xffffffff;
/** Set on a child-list entry that is text (a string id), not a component. */
export const TEXT_BIT = 0x80000000;

export type Child = { component: number } | { text: string };

type Columns = {
    componentType: Uint8Array;
    name: Uint32Array;
    parent: Uint32Array;
    propBase: Uint32Array;
    propCells: Uint32Array;
    childStart: Uint32Array;
    childCount: Uint32Array;
    childList: Uint32Array;
    node: Uint32Array;
    scope: Uint32Array;
    stringOffsets: Uint32Array;
    stringBytes: Uint8Array;
    cells: Float64Array;
};

export class CellsTable {
    core: Core;
    memory: WebAssembly.Memory;
    typeTags: string[];
    /** Per component type, the index of each prop in its table. */
    _propIndex: Map<string, number>[];
    /** Literal attributes per DAST node (attribute names as written). */
    nodeAttrs: Record<string, Record<string, string>>;
    _cols: Columns;
    _decoder = new TextDecoder();
    _strings = new Map<number, string>();

    constructor(core: Core, memory: WebAssembly.Memory) {
        this.core = core;
        this.memory = memory;
        this.typeTags = JSON.parse(core.type_tags());
        const typeProps: string[][] = JSON.parse(core.type_props());
        this._propIndex = typeProps.map(
            (names) => new Map(names.map((n, i) => [n, i])),
        );
        this.nodeAttrs = JSON.parse(core.node_attrs_json());
        this._cols = this._view();
    }

    _view(): Columns {
        const { core, memory } = this;
        const n = core.n_components();
        const u32 = (ptr: number, len: number) =>
            new Uint32Array(memory.buffer, ptr, len);
        return {
            componentType: new Uint8Array(
                memory.buffer,
                core.comp_type_ptr(),
                n,
            ),
            name: u32(core.comp_name_ptr(), n),
            parent: u32(core.comp_parent_ptr(), n),
            propBase: u32(core.comp_prop_base_ptr(), n),
            propCells: u32(core.prop_cells_ptr(), core.prop_cells_len()),
            childStart: u32(core.comp_child_start_ptr(), n),
            childCount: u32(core.comp_child_count_ptr(), n),
            childList: u32(core.child_list_ptr(), core.child_list_len()),
            node: u32(core.comp_node_ptr(), n),
            scope: u32(core.comp_scope_ptr(), n),
            stringOffsets: u32(core.string_offsets_ptr(), core.n_strings() + 1),
            stringBytes: new Uint8Array(
                memory.buffer,
                core.string_bytes_ptr(),
                core.string_bytes_len(),
            ),
            cells: new Float64Array(
                memory.buffer,
                core.cells_ptr(),
                core.cells_len(),
            ),
        };
    }

    /** The columns, re-viewed when wasm memory grew (which detaches every
     * view), the core moved its cells, or interned text grew the strings. */
    get cols(): Columns {
        const c = this._cols;
        const core = this.core;
        if (
            c.cells.buffer !== this.memory.buffer ||
            c.cells.byteOffset !== core.cells_ptr() ||
            c.cells.length !== core.cells_len() ||
            c.stringOffsets.length !== core.n_strings() + 1 ||
            c.stringBytes.byteOffset !== core.string_bytes_ptr()
        ) {
            this._cols = this._view();
        }
        return this._cols;
    }

    /** After a rebuild every component and cell index is new. String ids
     * are stable, so the decoded strings stay. */
    reload() {
        this._cols = this._view();
    }

    get length(): number {
        return this.cols.componentType.length;
    }

    root(): number {
        return this.core.root();
    }

    componentType(c: number): string {
        return this.typeTags[this.cols.componentType[c]];
    }

    /** The tag the author wrote (`subsection` for a `section`), or the
     * component type for a component the compile made. */
    tag(c: number): string {
        return this.core.component_tag(c) ?? this.componentType(c);
    }

    parent(c: number): number | null {
        const p = this.cols.parent[c];
        return p === NONE ? null : p;
    }

    node(c: number): number {
        return this.cols.node[c];
    }

    scope(c: number): number {
        return this.cols.scope[c];
    }

    string(id: number): string {
        let s = this._strings.get(id);
        if (s === undefined) {
            const { stringOffsets: o, stringBytes: b } = this.cols;
            s = this._decoder.decode(b.subarray(o[id], o[id + 1]));
            this._strings.set(id, s);
        }
        return s;
    }

    /** The cell of prop `name` on component `c`, or undefined when its
     * type has no such prop. */
    cell(c: number, name: string): number | undefined {
        const { componentType, propBase, propCells } = this.cols;
        const i = this._propIndex[componentType[c]].get(name);
        return i === undefined ? undefined : propCells[propBase[c] + i];
    }

    value(cell: number): number {
        return this.cols.cells[cell];
    }

    children(c: number): Child[] {
        const { childStart, childCount, childList } = this.cols;
        const out: Child[] = [];
        for (let i = 0; i < childCount[c]; i++) {
            const e = childList[childStart[c] + i];
            out.push(
                e & TEXT_BIT
                    ? { text: this.string(e & ~TEXT_BIT) }
                    : { component: e },
            );
        }
        return out;
    }

    /** A literal attribute of the element `c` was made from (names ignore
     * case), or null. A copy and a component the compile made have none. */
    attr(c: number, name: string): string | null {
        const n = this.cols.node[c];
        if (n === NONE) return null;
        const attrs = this.nodeAttrs[n];
        if (!attrs) return null;
        if (name in attrs) return attrs[name];
        const lower = name.toLowerCase();
        for (const k in attrs) if (k.toLowerCase() === lower) return attrs[k];
        return null;
    }
}

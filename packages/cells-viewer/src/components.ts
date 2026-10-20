// Columnar component table, read straight from the core's arrays (ADR 0001
// extended: the renderer reads components the same way it reads cells).
// The typed arrays are views over wasm memory.

import { SHAPES, type PrimUse, type Shape } from "./generated/shapes";

export interface ComponentColumns {
    root: number;
    nCells: number;
    nEssential: number;
    typeTags: string[];
    typeProps: string[][];
    componentType: Uint8Array;
    name: Uint32Array;
    parent: Uint32Array;
    propBase: Uint32Array;
    propCells: Uint32Array;
    childStart: Uint32Array;
    childCount: Uint32Array;
    childList: Uint32Array;
    /** stable identity across rebuilds: DAST node (NONE if synthesized) and scope */
    node: Uint32Array;
    scope: Uint32Array;
    stringOffsets: Uint32Array;
    stringBytes: Uint8Array;
    /** Each component's view shape: an index into its type's `SHAPES`
     * (ADR 0016), or `NO_SHAPE`. */
    shape: Uint8Array;
    /** Literal attributes per DAST node: presentation (style numbers,
     * decimals, widths), read once per build. */
    nodeAttrs: Record<string, Record<string, string>>;
}

export const NONE = 0xffffffff;
/** A component its type's shapes do not draw. */
export const NO_SHAPE = 255;
export const TEXT_BIT = 0x80000000;

export type Child = { c: number } | { t: string };

export class ComponentTable {
    private decoder = new TextDecoder();
    private strCache = new Map<number, string>();
    private propIndex: Map<string, number>[];
    private ids: string[] | null = null;
    private byIds: Map<string, number> | null = null;
    private _cols: ComponentColumns;
    /**
     * @param reload re-reads the columns from the core. The views detach
     * when wasm memory grows (parsing typed math, interning text), which
     * leaves their buffer with no bytes, so the table re-reads them on the
     * next access after that.
     */
    constructor(
        cols: ComponentColumns,
        private reload?: () => ComponentColumns,
    ) {
        this._cols = cols;
        this.propIndex = cols.typeProps.map(
            (names) => new Map(names.map((n, i) => [n, i])),
        );
    }
    get cols(): ComponentColumns {
        if (this._cols.componentType.buffer.byteLength === 0 && this.reload) {
            this._cols = this.reload();
        }
        return this._cols;
    }

    get root() {
        return this.cols.root;
    }
    get length() {
        return this.cols.componentType.length;
    }
    get nCells() {
        return this.cols.nCells;
    }
    get nEssential() {
        return this.cols.nEssential;
    }

    string(id: number): string {
        let s = this.strCache.get(id);
        if (s === undefined) {
            const { stringOffsets: o, stringBytes: b } = this.cols;
            s = this.decoder.decode(b.subarray(o[id], o[id + 1]));
            this.strCache.set(id, s);
        }
        return s;
    }

    componentType(c: number): string {
        return this.cols.typeTags[this.cols.componentType[c]];
    }

    name(c: number): string | null {
        const s = this.cols.name[c];
        return s === NONE ? null : this.string(s).trim();
    }

    parent(c: number): number | null {
        const p = this.cols.parent[c];
        return p === NONE ? null : p;
    }

    /** Cell index of prop `name` on component `c`. */
    cell(c: number, name: string): number {
        const i = this.propIndex[this.cols.componentType[c]].get(name);
        if (i === undefined)
            throw new Error(
                `component ${c} (${this.componentType(c)}) has no prop ${name}`,
            );
        return this.cols.propCells[this.cols.propBase[c] + i];
    }

    /** Cells of every prop of component `c`: its type table's, in order,
     * then two per point of its list (a polygon's vertices), up to the next
     * component's (ADR 0016). */
    props(c: number): number[] {
        const { propBase, propCells } = this.cols;
        const end =
            c + 1 < propBase.length ? propBase[c + 1] : propCells.length;
        return Array.from(propCells.subarray(propBase[c], end));
    }

    /** The view shape component `c` is drawn with (ADR 0016), which the
     * core chose; null for one the viewer draws its own way. */
    shape(c: number): Shape | null {
        const i = this.cols.shape[c];
        if (i === NO_SHAPE) return null;
        return SHAPES[this.componentType(c)]?.[i] ?? null;
    }

    /** The cells a shape's primitive binds on component `c`, in its
     * slots' order. */
    primCells(c: number, use: PrimUse): number[] {
        const base = this.cols.propBase[c];
        return use.at.map((i) => this.cols.propCells[base + i]);
    }

    /** The DAST node the component was made from, or NONE for a
     * synthesized one. */
    node(c: number): number {
        return this.cols.node[c];
    }

    /** A literal attribute of the element the component was made from
     * (attribute names ignore case), or null. Copies have no element. */
    attr(c: number, name: string): string | null {
        const n = this.cols.node[c];
        if (n === NONE) return null;
        const attrs = this.cols.nodeAttrs[n];
        if (!attrs) return null;
        if (name in attrs) return attrs[name];
        const lower = name.toLowerCase();
        for (const k in attrs) if (k.toLowerCase() === lower) return attrs[k];
        return null;
    }

    /** The component's identity across rebuilds: its DAST node and scope,
     * or for a component the build made (a `$ref` copy, a collected copy)
     * its parent's identity and its position there. A rebuild renumbers
     * components; their identities stay. */
    id(c: number): string {
        this.indexIds();
        return this.ids![c];
    }

    /** The component with identity `id` in this table, if it has one. */
    byId(id: string): number | undefined {
        this.indexIds();
        return this.byIds!.get(id);
    }

    private indexIds() {
        if (this.ids) return;
        const n = this.length;
        const ids: string[] = new Array(n);
        const byIds = new Map<string, number>();
        const { node, scope, childStart, childCount, childList } = this.cols;
        const stack: [number, string][] = [[this.root, "root"]];
        while (stack.length) {
            const [c, at] = stack.pop()!;
            const id = node[c] === NONE ? at : `${node[c]}:${scope[c]}`;
            ids[c] = id;
            byIds.set(id, c);
            for (let i = 0; i < childCount[c]; i++) {
                const e = childList[childStart[c] + i];
                if (!(e & TEXT_BIT)) stack.push([e, `${id}/${i}`]);
            }
        }
        // Components outside the tree (a branch interface's stand-ins).
        for (let c = 0; c < n; c++) ids[c] ??= `#${c}`;
        this.ids = ids;
        this.byIds = byIds;
    }

    /** A key that identifies the component across rebuilds. Synthesized
     * components (copies made by `$ref` children or collects) have no DAST
     * node, so they are keyed by their position under the parent instead. */
    key(c: number, positionInParent: number): string {
        const n = this.cols.node[c];
        return n === NONE
            ? `#${positionInParent}`
            : `${n}:${this.cols.scope[c]}`;
    }

    children(c: number): Child[] {
        const { childStart, childCount, childList } = this.cols;
        const s = childStart[c],
            n = childCount[c];
        const out: Child[] = new Array(n);
        for (let i = 0; i < n; i++) {
            const e = childList[s + i];
            out[i] =
                e & TEXT_BIT ? { t: this.string(e & ~TEXT_BIT) } : { c: e };
        }
        return out;
    }

    /** The literal text a component holds, its descendants' included: an
     * accessible name from a `<label>` or `<shortDescription>`. Values a
     * reference shows are not text here. */
    textOf(c: number): string {
        let out = "";
        for (const ch of this.children(c))
            out += "t" in ch ? ch.t : this.textOf(ch.c);
        return out;
    }

    /** The string table grows when text is interned (`CellStore.requestText`)
     * and may move when wasm memory does: re-view it when the core's table
     * is not the one viewed. Ids are stable, so the cache stays. */
    syncStrings(core: any, memory: WebAssembly.Memory) {
        const n = core.n_strings();
        const { stringOffsets: o, stringBytes: b } = this.cols;
        if (
            o.buffer === memory.buffer &&
            o.byteOffset === core.string_offsets_ptr() &&
            o.length === n + 1 &&
            b.byteOffset === core.string_bytes_ptr() &&
            b.length === core.string_bytes_len()
        )
            return;
        this.cols.stringOffsets = new Uint32Array(
            memory.buffer,
            core.string_offsets_ptr(),
            n + 1,
        );
        this.cols.stringBytes = new Uint8Array(
            memory.buffer,
            core.string_bytes_ptr(),
            core.string_bytes_len(),
        );
    }

    /** First component with this name, for tests and tooling. */
    byName(name: string): number | null {
        for (let c = 0; c < this.length; c++)
            if (this.name(c) === name) return c;
        return null;
    }
}

/** Build the columns from a loaded wasm core, as views over its memory. */
export function columnsFromCore(
    core: any,
    memory: WebAssembly.Memory,
): ComponentColumns {
    const n = core.n_components();
    const u32 = (ptr: number, len: number) =>
        new Uint32Array(memory.buffer, ptr, len);
    const u8 = (ptr: number, len: number) =>
        new Uint8Array(memory.buffer, ptr, len);
    const nStrings = core.n_strings();
    const cols: ComponentColumns = {
        root: core.root(),
        nCells: core.cells_len(),
        nEssential: core.n_essential(),
        typeTags: JSON.parse(core.type_tags()),
        typeProps: JSON.parse(core.type_props()),
        componentType: u8(core.comp_type_ptr(), n),
        name: u32(core.comp_name_ptr(), n),
        parent: u32(core.comp_parent_ptr(), n),
        propBase: u32(core.comp_prop_base_ptr(), n),
        propCells: u32(core.prop_cells_ptr(), core.prop_cells_len()),
        childStart: u32(core.comp_child_start_ptr(), n),
        childCount: u32(core.comp_child_count_ptr(), n),
        childList: u32(core.child_list_ptr(), core.child_list_len()),
        node: u32(core.comp_node_ptr(), n),
        scope: u32(core.comp_scope_ptr(), n),
        shape: u8(core.comp_shape_ptr(), n),
        stringOffsets: u32(core.string_offsets_ptr(), nStrings + 1),
        stringBytes: u8(core.string_bytes_ptr(), core.string_bytes_len()),
        nodeAttrs: JSON.parse(core.node_attrs_json()),
    };
    return cols;
}

/// <reference types="vite/client" />
/**
 * The cells bridge (ADR 0020): the cells core seen through the interface the
 * prototype's renderers share with the other cores. It turns the component
 * table and each tick's changed cells into flat DAST and per-element updates,
 * and each renderer action into requests or a core action.
 *
 * Element ids follow stable component identity (DAST node and scope), kept for
 * the life of the document, so a rebuild (ADR 0004) reaches the renderer as
 * updates rather than as a new document.
 */
import type { Core } from "@doenet/cells-core/pkg/cells_wasm.js";
import type {
    ActionResponse,
    DastError,
    DastWarning,
    FlatDastElement,
    FlatDastElementContent,
    FlatDastElementUpdate,
} from "@doenet/doenetml-worker-rust";
import { CONTRACTS, OMITTED, Reads, TRANSPARENT } from "./contracts";
import { resolveRendererAction } from "./actions";
import { CellsTable, NONE } from "./table";

/** One entry of the core's diagnostics list (ADR 0013). */
type Diagnostic = {
    kind: "error" | "warning" | "info" | "accessibility";
    code: string;
    message: string;
    node?: number;
};

type Element = FlatDastElement | (DastError & { data: { id: number } });

/** An update as the prototype's store applies it: the Rust core's fields,
 * changed props, and a whole element the renderer has not seen. */
export type ElementUpdate = FlatDastElementUpdate & {
    changedState?: Record<string, unknown>;
    newFlatDastElement?: Element;
};

/** Where a tick's time went in the worker, in ms: the core's tick, and the
 * bridge turning its changed cells into updates. */
export type TickTiming = { core: number; bridge: number };

/** Where a load's time went in the worker, in ms. */
export type LoadTiming = {
    /** The DAST encoded for the core. */
    encode: number;
    /** The core's load: compile and builds (ADR 0015). */
    core: number;
    /** The bridge: element ids, then the first flat DAST. */
    bridge: number;
};

/** How many ticks' timings are kept, the latest. */
const TICK_TIMINGS_KEPT = 1000;

/** Whether two prop values (JSON data: numbers, strings, booleans, null,
 * arrays and plain objects) are equal. */
function sameValue(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    // NaN is a value a prop holds, and it does not change.
    if (typeof a === "number" && typeof b === "number") {
        return Number.isNaN(a) && Number.isNaN(b);
    }
    if (typeof a !== "object" || typeof b !== "object" || !a || !b) {
        return false;
    }
    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!sameValue(a[i], b[i])) return false;
        }
        return true;
    }
    if (Array.isArray(b)) return false;
    const ka = Object.keys(a);
    if (ka.length !== Object.keys(b).length) return false;
    for (const k of ka) {
        if (!sameValue((a as any)[k], (b as any)[k])) return false;
    }
    return true;
}

export type RendererAction = {
    component: string;
    actionName: string;
    componentIdx: number;
    args?: Record<string, any>;
};

export class CellsBridge {
    /** Check every cell a contract reads against the core's outputs (ADR
     * 0019), every request against its interactive cells (ADR 0018), and
     * throw on a renderer action the table does not know. On in
     * development and tests, off in a production build. */
    static strict: boolean = import.meta.env?.DEV ?? false;

    core: Core;
    table: CellsTable;
    diagnostics: Diagnostic[];

    /** Element id by stable component key, for the life of the document. */
    _idByKey = new Map<string, number>();
    /** This build's component of each element id, and the reverse. */
    _componentById = new Map<number, number>();
    _idByComponent = new Map<number, number>();
    /** Whether each element is inside a graph (it takes its in-graph props). */
    _inGraph = new Map<number, boolean>();
    /** The elements as last sent, by id. */
    _sent = new Map<number, Element>();
    /** The cells each element read, and for each cell the elements that
     * read it. */
    _deps = new Map<number, number[]>();
    _readers = new Map<number, Set<number>>();
    /** The elements each element's props name (a division's title). */
    _refs = new Map<number, number[]>();
    _outputs: Set<number> | null = null;
    _interactive: Set<number> | null = null;
    /** For the benchmark (ADR 0020's comparison): the load's timing, and
     * the latest ticks', read with `takeTimings`. */
    loadTiming: LoadTiming = { encode: NaN, core: NaN, bridge: 0 };
    _tickTimings: TickTiming[] = [];
    _flatDastTimed = false;

    constructor(core: Core, memory: WebAssembly.Memory) {
        this.core = core;
        this.table = new CellsTable(core, memory);
        this.diagnostics = JSON.parse(core.diagnostics_json());
        this._assignIds();
    }

    /** The document as flat DAST, every element the renderer can reach. */
    flatDast() {
        const start = performance.now();
        this.table.sync();
        const root = this.table.root();
        this._computeTree(root, false);
        const elements: Element[] = [];
        for (const [id, element] of this._sent) elements[id] = element;
        const warnings: DastWarning[] = this.diagnostics
            .filter((d) => d.kind === "warning" || d.kind === "info")
            .map((d) => ({ type: "warning", message: d.message }));
        if (!this._flatDastTimed) {
            this._flatDastTimed = true;
            this.loadTiming.bridge += performance.now() - start;
        }
        return {
            type: "root" as const,
            children: [
                { id: this._idByComponent.get(root)!, annotation: "original" },
            ] as FlatDastElementContent[],
            elements: elements as FlatDastElement[],
            warnings,
        };
    }

    /** Carry out a renderer action and return the updates it caused. */
    dispatch(action: RendererAction): ActionResponse {
        this.table.sync();
        const c = this._componentById.get(action.componentIdx);
        if (c === undefined) {
            console.warn(
                `the cells bridge: no element ${action.componentIdx} for ${action.component}.${action.actionName}`,
            );
            return { payload: {} };
        }
        const effect = resolveRendererAction(
            this.table,
            c,
            action.actionName,
            action.args ?? {},
        );
        if (effect === null) {
            const message = `the cells bridge has no renderer action ${this.table.componentType(c)}.${action.actionName}`;
            if (CellsBridge.strict) throw Error(message);
            console.warn(message);
            return { payload: {} };
        }
        let changed: Uint32Array;
        const start = performance.now();
        switch (effect.kind) {
            case "none":
                return { payload: {} };
            case "request":
            case "points": {
                if (CellsBridge.strict) this._checkInteractive(effect.pairs);
                const cells = Uint32Array.from(effect.pairs, (p) => p[0]);
                const values = Float64Array.from(effect.pairs, (p) => p[1]);
                changed =
                    effect.kind === "points"
                        ? this.core.request_points(cells, values)
                        : this.core.request(cells, values);
                break;
            }
            case "submit":
                changed = this.core.submit(effect.answer);
                break;
            case "trigger":
                changed = this.core.trigger(effect.component);
                break;
        }
        const ticked = performance.now();
        const payload = this._afterTick(changed);
        this._tickTimings.push({
            core: ticked - start,
            bridge: performance.now() - ticked,
        });
        if (this._tickTimings.length > TICK_TIMINGS_KEPT) {
            this._tickTimings.shift();
        }
        return { payload };
    }

    /** The load's timing and the ticks' since the last call, which are
     * then forgotten. */
    takeTimings(): { load: LoadTiming; ticks: TickTiming[] } {
        const ticks = this._tickTimings;
        this._tickTimings = [];
        return { load: this.loadTiming, ticks };
    }

    /** The element id of the component a name path (`p.q`, `r[2].x`)
     * names, or -1. */
    resolveName(name: string): number {
        const c = this.core.resolve_path(name);
        return this._idByComponent.get(c) ?? -1;
    }

    /** Submit every answer, one tick each. */
    submitAllAnswers(): ActionResponse {
        const payload: Record<number, ElementUpdate> = {};
        for (let c = 0; c < this.table.length; c++) {
            if (this.table.componentType(c) !== "answer") continue;
            Object.assign(payload, this._afterTick(this.core.submit(c)));
        }
        return { payload };
    }

    /** The updates a tick caused: the elements that read a changed cell,
     * or after a rebuild every element, recomputed and compared with what
     * was sent. */
    _afterTick(changed: Uint32Array): Record<number, ElementUpdate> {
        const error = this.core.last_rebuild_error();
        if (error) console.error("the cells core's rebuild failed:", error);
        // The elements this tick recomputes, as they were sent before it.
        const before = new Map<number, Element | undefined>();
        const rebuilt = this.core.last_rebuilt();
        if (rebuilt) {
            // Every element is recomputed: what was sent is the before.
            for (const [id, element] of this._sent) before.set(id, element);
            this.table.reload();
            this._outputs = null;
            this._interactive = null;
            this._componentById.clear();
            this._idByComponent.clear();
            this._readers.clear();
            this._deps.clear();
            this._refs.clear();
            this._sent.clear();
            this._assignIds();
            this._computeTree(this.table.root(), false);
        } else {
            this.table.sync();
            this._before = before;
            const affected = new Set<number>();
            for (const cell of changed) {
                for (const id of this._readers.get(cell) ?? []) {
                    affected.add(id);
                }
            }
            for (const id of affected) {
                const c = this._componentById.get(id);
                if (c === undefined) continue;
                const element = this._compute(c, this._inGraph.get(id)!);
                // An element now reachable for the first time (a case that
                // became active) has never been computed.
                this._computeMissing(element, this._inGraph.get(id)!);
            }
            this._before = null;
        }
        return this._diff(before, rebuilt);
    }

    /** What each element recomputed this tick was before it, kept while a
     * tick recomputes; null otherwise. */
    _before: Map<number, Element | undefined> | null = null;

    _diff(
        before: Map<number, Element | undefined>,
        rebuilt: boolean,
    ): Record<number, ElementUpdate> {
        const updates: Record<number, ElementUpdate> = {};
        // A rebuild recomputes every element sent, new ones included;
        // another tick, those it recorded in `before`.
        const candidates = rebuilt ? this._sent.keys() : before.keys();
        for (const id of candidates) {
            const element = this._sent.get(id);
            if (element === undefined) continue;
            const old = before.get(id);
            if (old === element) continue;
            if (
                old === undefined ||
                old.type !== element.type ||
                old.type === "error" ||
                old.name !== (element as FlatDastElement).name
            ) {
                updates[id] = {
                    type: "elementUpdate",
                    newFlatDastElement: element,
                };
                continue;
            }
            const next = element as FlatDastElement;
            const update: ElementUpdate = { type: "elementUpdate" };
            let any = false;
            const oldProps = (old.data as any).props ?? {};
            const newProps = (next.data as any).props ?? {};
            for (const key of Object.keys(newProps)) {
                if (!sameValue(oldProps[key], newProps[key])) {
                    (update.changedState ??= {})[key] = newProps[key];
                    any = true;
                }
            }
            if (!sameValue(old.children, next.children)) {
                update.newChildren = next.children;
                any = true;
            }
            if (any) updates[id] = update;
        }
        return updates;
    }

    /** Give every component reachable from the root an element id, by its
     * stable key: a new key gets a new id, a known one keeps its own. */
    _assignIds() {
        const visit = (c: number, key: string) => {
            let id = this._idByKey.get(key);
            if (id === undefined) {
                id = this._idByKey.size;
                this._idByKey.set(key, id);
            }
            this._componentById.set(id, c);
            this._idByComponent.set(c, id);
            // A component the compile made has no DAST node: it is keyed by
            // its parent's key, its type and its place among such siblings.
            const made = new Map<string, number>();
            for (const child of this.table.children(c)) {
                if (!("component" in child)) continue;
                const k = child.component;
                const node = this.table.node(k);
                let childKey: string;
                if (node === NONE) {
                    const type = this.table.componentType(k);
                    const n = made.get(type) ?? 0;
                    made.set(type, n + 1);
                    childKey = `${key}/${type}#${n}`;
                } else {
                    childKey = `${node}:${this.table.scope(k)}`;
                }
                visit(k, childKey);
            }
        };
        const root = this.table.root();
        visit(root, `${this.table.node(root)}:${this.table.scope(root)}`);
    }

    /** Compute an element and every element under it. */
    _computeTree(c: number, inGraph: boolean) {
        const element = this._compute(c, inGraph);
        for (const id of this._under(element)) {
            const k = this._componentById.get(id);
            if (k !== undefined) {
                this._computeTree(k, this._childInGraph(c, inGraph));
            }
        }
    }

    /** Compute the elements under `element` the renderer has not been sent. */
    _computeMissing(element: Element, inGraph: boolean) {
        const c = this._componentById.get(element.data.id)!;
        for (const id of this._under(element)) {
            if (this._sent.has(id)) continue;
            const k = this._componentById.get(id);
            if (k !== undefined) {
                this._computeTree(k, this._childInGraph(c, inGraph));
            }
        }
    }

    /** The elements an element shows: its children, and those its props
     * name (a division's title). */
    _under(element: Element): number[] {
        if (element.type !== "element") return [];
        const ids = element.children.flatMap((child) =>
            typeof child === "string" ? [] : [child.id],
        );
        return [...ids, ...(this._refs.get(element.data.id) ?? [])];
    }

    _childInGraph(c: number, inGraph: boolean): boolean {
        return (
            inGraph || CONTRACTS[this.table.componentType(c)]?.graph === true
        );
    }

    /** One element: its name, props and children, and the cells they read. */
    _compute(c: number, inGraph: boolean): Element {
        const id = this._idByComponent.get(c)!;
        const type = this.table.componentType(c);
        const reads = new Reads(
            this.table,
            (k) => this._idByComponent.get(k)!,
            CellsBridge.strict ? (cell) => this._checkOutput(cell) : null,
        );
        let element: Element;
        if (type === "_error") {
            const node = this.table.node(c);
            const diagnostic = this.diagnostics.find(
                (d) => d.kind === "error" && d.node === node,
            );
            element = {
                type: "error",
                message: diagnostic?.message ?? "error",
                data: { id },
            } as Element;
        } else {
            const contract = CONTRACTS[type];
            const props = contract?.props?.(reads, c, inGraph) ?? {};
            const children: FlatDastElementContent[] = [];
            this._children(reads, c, children, c);
            element = {
                type: "element",
                name: contract?.name?.(this.table, c) ?? this.table.tag(c),
                attributes: {},
                children,
                data: { id, props } as FlatDastElement["data"],
            };
        }
        if (this._before && !this._before.has(id)) {
            this._before.set(id, this._sent.get(id));
        }
        this._setDeps(id, reads.deps);
        this._refs.set(
            id,
            [...reads.refs].map((k) => this._idByComponent.get(k)!),
        );
        this._inGraph.set(id, inGraph);
        this._sent.set(id, element);
        return element;
    }

    /** The children `c` shows, into `out`: text, and an element per child
     * component, with a component that stands as its children spliced in
     * and one with no view (or hidden) left out. `owner` is the element
     * whose contract may exclude a child. */
    _children(
        reads: Reads,
        c: number,
        out: FlatDastElementContent[],
        owner: number,
    ) {
        const contract = CONTRACTS[this.table.componentType(owner)];
        for (const child of this.table.children(c)) {
            if (!("component" in child)) {
                out.push(child.text);
                continue;
            }
            const k = child.component;
            const type = this.table.componentType(k);
            if (OMITTED.has(type)) continue;
            if (contract?.excludeChild?.(this.table, owner, k)) continue;
            const hide = this.table.cell(k, "hide");
            if (hide !== undefined) {
                const v = reads.cell(hide);
                if (v !== 0 && !Number.isNaN(v)) continue;
            }
            if (type === "case" && reads.num(k, "active") !== 1) continue;
            if (TRANSPARENT.has(type)) {
                this._children(reads, k, out, owner);
                continue;
            }
            out.push({
                id: this._idByComponent.get(k)!,
                annotation: "original",
            });
        }
    }

    _setDeps(id: number, deps: Set<number>) {
        for (const cell of this._deps.get(id) ?? []) {
            this._readers.get(cell)?.delete(id);
        }
        const list = [...deps];
        this._deps.set(id, list);
        for (const cell of list) {
            let readers = this._readers.get(cell);
            if (!readers) this._readers.set(cell, (readers = new Set()));
            readers.add(id);
        }
    }

    _checkOutput(cell: number) {
        this._outputs ??= new Set(this.core.output_cells());
        if (this._outputs.has(cell)) return;
        throw Error(
            `the cells bridge read cell ${cell} (${this._describe(cell)}), ` +
                "which no component definition marks rendered, or of a " +
                "component the core does not count as rendered (ADR 0019)",
        );
    }

    _checkInteractive(pairs: [number, number][]) {
        this._interactive ??= new Set(this.core.interactive_cells());
        for (const [cell] of pairs) {
            if (this._interactive.has(cell)) continue;
            throw Error(
                `the cells bridge requested cell ${cell} (${this._describe(cell)}), ` +
                    "which no component definition marks interactive (ADR 0018)",
            );
        }
    }

    /** The props a cell is, as `type.prop` (a list prop's as
     * `type.list[i]`), for an error message. */
    _describe(cell: number): string {
        this.table.sync();
        const names: string[] = [];
        const typeProps: string[][] = JSON.parse(this.core.type_props());
        for (let c = 0; c < this.table.length; c++) {
            const type = this.table.componentType(c);
            for (const prop of typeProps[this.table.cols.componentType[c]]) {
                if (this.table.cell(c, prop) === cell) {
                    names.push(`${type}.${prop}`);
                }
            }
            this.table.listCells(c).forEach((k, i) => {
                if (k === cell) names.push(`${type}.list[${i}]`);
            });
        }
        return names.join(", ") || "no prop";
    }
}

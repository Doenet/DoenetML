// The renderer-side counterpart of the cell-addressed interface (ADR 0001):
// a Float64Array view over the core's cells (wasm memory on this thread,
// zero-copy), per-cell-index subscriptions, and cell-addressed requests.
import init, { Core } from "@doenet/cells-core/pkg/cells_wasm.js";
import { ComponentTable, columnsFromCore } from "./components";
import { measure, measureCoreSpans } from "./trace";

export interface LoadTimings {
    fetch: number;
    wasmInit: number;
    core: {
        deserialize: number;
        build: number;
        schedule: number;
        initial_compute: number;
        passes: number;
        structural_depth: number;
    };
    coreTotal: number;
    /** building the component table (views over wasm memory) */
    componentTable: number;
    firstRender: number;
}

export interface TickSample {
    /** ms inside Core.request (inversion + recompute) */
    core: number;
    /** the tick changed a repeat's count and rebuilt the document */
    rebuilt: boolean;
    /** ms from request start until the changed cells are available to the renderer */
    roundTrip: number;
    /** ms from request start until the tick's synchronous work is done: the
     * per-cell listeners and the tick-end listeners, where the JSXGraph
     * boards redraw. `sync - roundTrip` is the boards' share. */
    sync: number;
    /** ms from request start until the React commit for that request */
    commit: number;
    /** ms from request start until the next animation frame */
    frame: number;
    /** ms from request start until a task after that frame's callbacks, which
     * runs once the browser has painted it: unlike `frame`, this includes the
     * style, layout and paint cost of the tick's own DOM changes */
    paint: number;
    changed: number;
}

type Listener = () => void;

let wasmMemory: WebAssembly.Memory | null = null;
let wasmReady: Promise<WebAssembly.Memory> | null = null;

declare global {
    interface Window {
        /** The core's wasm, compiled by the built page's head before its
         * scripts arrived (`vite.config.ts`); absent on the dev server, or
         * when that compile failed, and the wasm is fetched here instead. */
        __cellsWasm?: Promise<WebAssembly.Module | undefined>;
    }
}

/** Fetch (or take from the head's compile), compile and instantiate the
 * core's wasm, once per page: the step `wasm init`. Called at boot
 * (`dev/main.tsx`) so it runs alongside the page's render and the
 * document's fetch and parse; `loadDocument` waits for it. */
export function preloadCore(): Promise<WebAssembly.Memory> {
    return (wasmReady ??= (async () => {
        const t = performance.now();
        const compiled = await window.__cellsWasm;
        const out = await init(
            compiled ? { module_or_path: compiled } : undefined,
        );
        wasmMemory = out.memory;
        measure("wasm init", t, { precompiled: compiled ? 1 : 0 });
        return out.memory;
    })());
}

/** One entry of the core's diagnostics list (`diagnostics_json`,
 * `diagnose_json`): see ADR 0013. */
export type Diagnostic = {
    kind: "error" | "warning" | "info" | "accessibility";
    level?: 1 | 2;
    code: string;
    message: string;
    /** The DAST node the finding is about; absent for the whole document. */
    node?: number;
    args?: Record<string, string>;
};

export class CellStore {
    comps: ComponentTable;
    private core: Core;
    private view: Float64Array;
    private listeners: (Set<Listener> | undefined)[];
    private anyListeners = new Set<Listener>();
    private structureListeners = new Set<Listener>();
    private tickEndListeners = new Set<Listener>();
    /** Incremented when a tick rebuilt the document; the renderer re-reads the table. */
    structureVersion = 0;
    samples: TickSample[] = [];
    /** Incremented on every applied tick; lets a component re-render per tick. */
    version = 0;
    /** performance.now() of the first React commit after construction. */
    firstCommitAt: number | null = null;
    private pendingCommit: { start: number; sample: TickSample } | null = null;

    /** What the load reported about the elements it stamped (ADR 0013);
     * an `_error` component's DAST node names its entry. */
    diagnostics: Diagnostic[];

    constructor(
        core: Core,
        comps: ComponentTable,
        diagnostics: Diagnostic[] = [],
    ) {
        this.core = core;
        this.comps = comps;
        this.diagnostics = diagnostics;
        this.view = this.makeView();
        this.listeners = new Array(comps.nCells);
    }

    private makeView() {
        return new Float64Array(
            wasmMemory!.buffer,
            this.core.cells_ptr(),
            this.core.cells_len(),
        );
    }

    /** The cell array may be reallocated (wasm memory growth, a rebuild),
     * so the view is checked per read. */
    cells(): Float64Array {
        if (
            this.view.buffer !== wasmMemory!.buffer ||
            this.view.byteOffset !== this.core.cells_ptr() ||
            this.view.length !== this.core.cells_len()
        )
            this.view = this.makeView();
        return this.view;
    }

    get(cell: number): number {
        return this.cells()[cell];
    }

    subscribe(cell: number, fn: Listener): () => void {
        (this.listeners[cell] ??= new Set()).add(fn);
        return () => this.listeners[cell]?.delete(fn);
    }

    subscribeAny(fn: Listener): () => void {
        this.anyListeners.add(fn);
        return () => this.anyListeners.delete(fn);
    }

    subscribeStructure(fn: Listener): () => void {
        this.structureListeners.add(fn);
        return () => this.structureListeners.delete(fn);
    }

    /** Called once per applied tick, after every per-cell listener: a
     * renderer that batches its drawing redraws here, once per tick. */
    subscribeTickEnd(fn: Listener): () => void {
        this.tickEndListeners.add(fn);
        return () => this.tickEndListeners.delete(fn);
    }

    setEvaluator(name: string) {
        this.core.set_evaluator(name);
    }

    /** Infix text of an expression handle. */
    exprText(cell: number): string {
        return this.core.expr_text(cell);
    }

    /** Whether a cell is state the core keeps (`essential`), a constant
     * (`fixed`), or computed (`derived`). */
    cellClass(cell: number): "essential" | "fixed" | "derived" {
        return this.core.cell_class(cell) as "essential" | "fixed" | "derived";
    }

    /** Parse what a student typed into the core's math engine: the value
     * to request on a mathInput's `expr`. Throws on text that does not
     * parse. */
    parseMath(text: string): number {
        return this.core.parse_math(text);
    }

    /** Cell-addressed write. Listeners fire before this returns. */
    request(pairs: [number, number][]): void {
        this.send(pairs, false);
    }

    /** Write text to a text cell (a textInput's `value`): the text is
     * interned in the core's string table and its id requested. */
    requestText(cell: number, text: string): void {
        const id = this.core.intern(text);
        this.request([[cell, id]]);
    }

    /** Points dragged together: `[xCell, yCell, x, y]` per point. The core
     * keeps them a translation apart if one of them is constrained. */
    requestPoints(points: [number, number, number, number][]): void {
        this.send(
            points.flatMap(
                ([cx, cy, x, y]) =>
                    [
                        [cx, x],
                        [cy, y],
                    ] as [number, number][],
            ),
            true,
        );
    }

    /** Submit an answer: its live responses become its submitted ones and
     * credit recomputes, as one tick (`Core::submit`). */
    submit(answer: number): void {
        this.tick(() => this.core.submit(answer));
    }

    private send(pairs: [number, number][], points: boolean): void {
        const cells = new Uint32Array(pairs.map((p) => p[0]));
        const values = new Float64Array(pairs.map((p) => p[1]));
        this.tick(() =>
            points
                ? this.core.request_points(cells, values)
                : this.core.request(cells, values),
        );
    }

    /** One tick: `run` asks the core and returns the changed cells. */
    private tick(run: () => Uint32Array): void {
        const start = performance.now();
        const sample: TickSample = {
            core: NaN,
            rebuilt: false,
            roundTrip: NaN,
            sync: NaN,
            commit: NaN,
            frame: NaN,
            paint: NaN,
            changed: 0,
        };
        this.samples.push(sample);
        const changed = run();
        sample.core = performance.now() - start;
        const rebuilt = this.core.last_rebuilt();
        const err = this.core.last_rebuild_error();
        if (err) console.error("rebuild failed:", err);
        sample.roundTrip = performance.now() - start;
        sample.changed = changed.length;
        sample.rebuilt = rebuilt;
        this.pendingCommit = { start, sample };
        this.version++;
        requestAnimationFrame(() => {
            sample.frame = performance.now() - start;
            const ch = new MessageChannel();
            ch.port1.onmessage = () =>
                (sample.paint = performance.now() - start);
            ch.port2.postMessage(null);
        });
        if (rebuilt) {
            // Every cell index and component index is new: replace the table,
            // drop per-cell subscriptions (their components re-subscribe) and
            // tell the renderer to update from the root.
            this.comps = new ComponentTable(
                columnsFromCore(this.core, wasmMemory!),
                () => columnsFromCore(this.core, wasmMemory!),
            );
            this.listeners = new Array(this.comps.nCells);
            this.structureVersion++;
            for (const fn of this.structureListeners) fn();
        } else {
            // A tick that interned text grew the string table.
            this.comps.syncStrings(this.core, wasmMemory!);
            for (let i = 0; i < changed.length; i++) {
                const set = this.listeners[changed[i]];
                if (set) for (const fn of set) fn();
            }
        }
        for (const fn of this.tickEndListeners) fn();
        sample.sync = performance.now() - start;
        for (const fn of this.anyListeners) fn();
    }

    /** Called by the renderer after React commits a tick's updates. */
    markCommit() {
        this.firstCommitAt ??= performance.now();
        if (this.pendingCommit) {
            this.pendingCommit.sample.commit =
                performance.now() - this.pendingCommit.start;
            this.pendingCommit = null;
        }
    }
}

/** `bytes` is either DAST JSON (UTF-8) or the binary CDST wire format. */
export async function loadDocument(
    bytes: Uint8Array,
    evaluator: string,
    timings: Partial<LoadTimings>,
): Promise<CellStore> {
    let t = performance.now();
    const firstInit = wasmMemory === null;
    const memory = await preloadCore();
    timings.wasmInit = performance.now() - t;
    // Only the first load on a page waits for the wasm: what its fetch and
    // compile, started at boot, had left to do.
    if (firstInit) measure("core/wasm init", t);
    t = performance.now();
    const core = new Core(bytes);
    measure("core/new Core", t, { bytes: bytes.length });
    measureCoreSpans("core/new Core", t, core.load_trace_json());
    core.set_evaluator(evaluator);
    timings.coreTotal = performance.now() - t;
    const diagnostics = JSON.parse(core.diagnostics_json()) as Diagnostic[];
    for (const d of diagnostics)
        if (d.kind !== "error")
            console.warn(`${d.kind} ${d.code}: ${d.message}`);
    timings.core = JSON.parse(core.load_timings_json());
    t = performance.now();
    // Views over wasm memory: the component layer never grows after load,
    // but the cell array may be reallocated, so cells are re-viewed per read.
    const comps = new ComponentTable(columnsFromCore(core, memory), () =>
        columnsFromCore(core, memory),
    );
    timings.componentTable = performance.now() - t;
    measure("core/component table", t, { components: comps.length });
    return new CellStore(core, comps, diagnostics);
}

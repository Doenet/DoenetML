// The renderer-side counterpart of the cell-addressed interface (ADR 0001):
// a Float64Array view over the core's cells, per-cell-index subscriptions,
// and cell-addressed requests. Three backends differ only in where the core
// runs and how changed cells reach this thread:
//  - main:       wasm on the main thread; zero-copy view over wasm memory
//  - worker-sab: wasm in a worker; changed cells copied into a SharedArrayBuffer
//  - worker-msg: wasm in a worker; changed indices and values posted per tick
import init, { Core } from "./wasm/cells_wasm.js";
import { openCore, reportRebuild } from "./open-core";
import type { FromWorker, ToWorker, WorkerMode } from "./worker";
import { ComponentTable, columnsFromCore, type ComponentColumns } from "./components";

export type BackendKind = "main" | "worker-sab" | "worker-msg";

export interface LoadTimings {
  backend: BackendKind;
  fetch: number;
  /** worker spawn (worker backends only) */
  workerSpawn: number;
  wasmInit: number;
  core: { deserialize: number; build: number; schedule: number; initial_compute: number; passes: number; structural_depth: number };
  coreTotal: number;
  /** building the component table views (main) or copying the columns out (worker) */
  manifest: number;
  /** constructing the ComponentTable on the main thread */
  manifestTransfer: number;
  firstRender: number;
}

export interface TickSample {
  /** ms inside Core.request (inversion + recompute), measured where the core runs */
  core: number;
  /** the tick changed a repeat's count and rebuilt the document */
  rebuilt: boolean;
  /** ms from request start until the changed cells are available on the main thread */
  roundTrip: number;
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

/** What one request produced. After a rebuild, `columns` is the new
 * component table and every cell index the renderer held is stale. */
export interface TickResult {
  changed: Uint32Array;
  rebuilt: boolean;
  columns?: ComponentColumns;
}

interface Backend {
  cells(): Float64Array;
  /** Infix text of an expression handle, when the core is on this thread. */
  exprText?(cell: number): string;
  /** Resolves once the main-thread cell view is up to date. With `points`,
   * the cells are `x0, y0, x1, y1, ...` of points dragged together (one
   * point group, ADR 0006). */
  request(cells: Uint32Array, values: Float64Array, onCore: (ms: number) => void, points?: boolean): Promise<TickResult> | TickResult;
  setEvaluator(name: string): void;
}

let wasmMemory: WebAssembly.Memory | null = null;

class MainBackend implements Backend {
  private view: Float64Array;
  constructor(private core: Core) {
    this.view = this.make();
  }
  private make() {
    return new Float64Array(wasmMemory!.buffer, this.core.cells_ptr(), this.core.cells_len());
  }
  cells() {
    if (this.view.buffer !== wasmMemory!.buffer || this.view.byteOffset !== this.core.cells_ptr() || this.view.length !== this.core.cells_len()) this.view = this.make();
    return this.view;
  }
  request(cells: Uint32Array, values: Float64Array, onCore: (ms: number) => void, points = false): TickResult {
    const t = performance.now();
    const changed = points ? this.core.request_points(cells, values) : this.core.request(cells, values);
    onCore(performance.now() - t);
    const rebuilt = this.core.last_rebuilt();
    reportRebuild(this.core);
    return { changed, rebuilt, columns: rebuilt ? columnsFromCore(this.core, wasmMemory!, false) : undefined };
  }
  setEvaluator(name: string) {
    this.core.set_evaluator(name);
  }
  exprText(cell: number) {
    return this.core.expr_text(cell);
  }
}

class WorkerBackend implements Backend {
  private view: Float64Array;
  private nextId = 1;
  private pending = new Map<number, { resolve: (c: TickResult) => void; onCore: (ms: number) => void }>();
  constructor(private worker: Worker, view: Float64Array) {
    this.view = view;
    worker.onmessage = (e: MessageEvent<FromWorker>) => {
      const m = e.data;
      if (m.type !== "tick") return;
      if (m.rebuilt) {
        // The cell array was replaced wholesale: new shared buffer or full copy.
        this.view = m.sab ? new Float64Array(m.sab) : m.cells!;
      } else if (m.values) {
        for (let i = 0; i < m.changed.length; i++) this.view[m.changed[i]] = m.values[i];
      }
      const p = this.pending.get(m.id);
      if (p) {
        this.pending.delete(m.id);
        p.onCore(m.coreMs);
        p.resolve({ changed: m.changed, rebuilt: m.rebuilt, columns: m.columns });
      }
    };
  }
  cells() {
    return this.view;
  }
  request(cells: Uint32Array, values: Float64Array, onCore: (ms: number) => void, points = false) {
    const id = this.nextId++;
    return new Promise<TickResult>((resolve) => {
      this.pending.set(id, { resolve, onCore });
      this.worker.postMessage({ type: "request", id, cells, values, points } satisfies ToWorker, [cells.buffer, values.buffer]);
    });
  }
  setEvaluator(name: string) {
    this.worker.postMessage({ type: "setEvaluator", name } satisfies ToWorker);
  }
}

export class CellStore {
  comps: ComponentTable;
  backend: Backend;
  kind: BackendKind;
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

  constructor(backend: Backend, comps: ComponentTable, kind: BackendKind) {
    this.backend = backend;
    this.comps = comps;
    this.kind = kind;
    this.listeners = new Array(comps.nCells);
  }

  cells(): Float64Array {
    return this.backend.cells();
  }

  get(cell: number): number {
    return this.backend.cells()[cell];
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
    this.backend.setEvaluator(name);
  }

  exprText(cell: number): string | null {
    return this.backend.exprText?.(cell) ?? null;
  }

  /** Cell-addressed write. Listeners fire once the changed cells are readable here. */
  request(pairs: [number, number][]): void {
    this.send(pairs, false);
  }

  /** Points dragged together: `[xCell, yCell, x, y]` per point. The core
   * keeps them a translation apart if one of them is constrained. */
  requestPoints(points: [number, number, number, number][]): void {
    this.send(points.flatMap(([cx, cy, x, y]) => [[cx, x], [cy, y]] as [number, number][]), true);
  }

  private send(pairs: [number, number][], points: boolean): void {
    const start = performance.now();
    const cells = new Uint32Array(pairs.map((p) => p[0]));
    const values = new Float64Array(pairs.map((p) => p[1]));
    const sample: TickSample = { core: NaN, rebuilt: false, roundTrip: NaN, commit: NaN, frame: NaN, paint: NaN, changed: 0 };
    this.samples.push(sample);
    const apply = ({ changed, rebuilt, columns }: TickResult) => {
      sample.roundTrip = performance.now() - start;
      sample.changed = changed.length;
      sample.rebuilt = rebuilt;
      this.pendingCommit = { start, sample };
      this.version++;
      requestAnimationFrame(() => {
        sample.frame = performance.now() - start;
        const ch = new MessageChannel();
        ch.port1.onmessage = () => (sample.paint = performance.now() - start);
        ch.port2.postMessage(null);
      });
      if (rebuilt) {
        // Every cell index and component index is new: replace the table,
        // drop per-cell subscriptions (their components re-subscribe) and
        // tell the renderer to update from the root.
        this.comps = new ComponentTable(columns!);
        this.listeners = new Array(this.comps.nCells);
        this.structureVersion++;
        for (const fn of this.structureListeners) fn();
      } else {
        for (let i = 0; i < changed.length; i++) {
          const set = this.listeners[changed[i]];
          if (set) for (const fn of set) fn();
        }
      }
      for (const fn of this.tickEndListeners) fn();
      for (const fn of this.anyListeners) fn();
    };
    const r = this.backend.request(cells, values, (ms) => (sample.core = ms), points);
    if (r instanceof Promise) r.then(apply);
    else apply(r);
  }

  /** Called by the renderer after React commits a tick's updates. */
  markCommit() {
    this.firstCommitAt ??= performance.now();
    if (this.pendingCommit) {
      this.pendingCommit.sample.commit = performance.now() - this.pendingCommit.start;
      this.pendingCommit = null;
    }
  }
}

/** `bytes` is either DAST JSON (UTF-8) or the binary CDST wire format. */
export async function loadDocument(bytes: Uint8Array, kind: BackendKind, evaluator: string, timings: Partial<LoadTimings>): Promise<CellStore> {
  timings.backend = kind;
  if (kind === "main") {
    let t = performance.now();
    if (!wasmMemory) wasmMemory = (await init()).memory;
    timings.wasmInit = performance.now() - t;
    timings.workerSpawn = 0;
    const { core, ms } = openCore(bytes, evaluator);
    timings.coreTotal = ms;
    timings.core = JSON.parse(core.load_timings_json());
    t = performance.now();
    // Views over wasm memory: the component layer never grows after load,
    // but the cell array may be reallocated, so cells are re-viewed per read.
    const cols = columnsFromCore(core, wasmMemory, false);
    timings.manifest = performance.now() - t;
    t = performance.now();
    const comps = new ComponentTable(cols);
    timings.manifestTransfer = performance.now() - t;
    return new CellStore(new MainBackend(core), comps, kind);
  }

  const mode: WorkerMode = kind === "worker-sab" ? "sab" : "msg";
  if (mode === "sab" && typeof SharedArrayBuffer === "undefined") {
    throw new Error("SharedArrayBuffer unavailable: the page needs COOP/COEP headers");
  }
  let t = performance.now();
  const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
  const loaded = await new Promise<Extract<FromWorker, { type: "loaded" }>>((resolve, reject) => {
    worker.onmessage = (e: MessageEvent<FromWorker>) => {
      if (e.data.type === "loaded") resolve(e.data);
      else if (e.data.type === "error") reject(new Error(e.data.message));
    };
    worker.postMessage({ type: "load", bytes, mode, evaluator } satisfies ToWorker, [bytes.buffer as ArrayBuffer]);
  });
  const total = performance.now() - t;
  timings.wasmInit = loaded.wasmInit;
  timings.coreTotal = loaded.coreTotal;
  timings.core = JSON.parse(loaded.coreTimings);
  timings.manifest = loaded.columnsMs;
  // Everything in the round trip not accounted for by the worker's own stages:
  // spawning, module load, the document transfer in, and the columns out.
  timings.workerSpawn = total - loaded.wasmInit - loaded.coreTotal - loaded.columnsMs;
  t = performance.now();
  const comps = new ComponentTable(loaded.columns);
  timings.manifestTransfer = performance.now() - t;
  const view = loaded.sab ? new Float64Array(loaded.sab) : loaded.cells!;
  return new CellStore(new WorkerBackend(worker, view), comps, kind);
}

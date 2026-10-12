// Web Worker that owns the wasm core. Two transport modes for the read path:
//  - "sab": cells live in a SharedArrayBuffer the main thread reads directly;
//           after each tick the worker copies only the changed cells into it.
//  - "msg": after each tick the worker posts the changed indices and values,
//           and the main thread applies them to its own copy.
// Requests always travel by postMessage (cell-addressed, see ADR 0001).
// Component columns are copied out once at load.
import init, { Core } from "./wasm/cells_wasm.js";
import { columnBuffers, columnsFromCore, type ComponentColumns } from "./components";
import { openCore, reportRebuild } from "./open-core";

export type WorkerMode = "sab" | "msg";

export type ToWorker =
  | { type: "load"; bytes: Uint8Array; mode: WorkerMode; evaluator: string }
  | { type: "request"; id: number; cells: Uint32Array; values: Float64Array; points?: boolean }
  | { type: "setEvaluator"; name: string };

export type FromWorker =
  | { type: "loaded"; columns: ComponentColumns; coreTimings: string; wasmInit: number; coreTotal: number; columnsMs: number; sab?: SharedArrayBuffer; cells?: Float64Array }
  | { type: "tick"; id: number; changed: Uint32Array; values?: Float64Array; coreMs: number; dropped: number; rebuilt: boolean; columns?: ComponentColumns; sab?: SharedArrayBuffer; cells?: Float64Array }
  | { type: "error"; message: string };

let core: Core | null = null;
let memory: WebAssembly.Memory | null = null;
let mode: WorkerMode = "sab";
let shared: Float64Array | null = null;

function view(): Float64Array {
  return new Float64Array(memory!.buffer, core!.cells_ptr(), core!.cells_len());
}

/** Post a message carrying the whole cell array, as a fresh shared buffer
 * or a copy by mode, with the component columns' buffers transferred. */
function postFull(base: object, columns: ComponentColumns, transfer: Transferable[] = []) {
  if (mode === "sab") {
    const sab = new SharedArrayBuffer(core!.cells_len() * 8);
    shared = new Float64Array(sab);
    shared.set(view());
    (self as any).postMessage({ ...base, sab }, [...transfer, ...columnBuffers(columns)]);
  } else {
    const cells = view().slice();
    (self as any).postMessage({ ...base, cells }, [...transfer, cells.buffer, ...columnBuffers(columns)]);
  }
}

self.onmessage = async (e: MessageEvent<ToWorker>) => {
  const m = e.data;
  try {
    if (m.type === "load") {
      mode = m.mode;
      let t = performance.now();
      if (!memory) memory = (await init()).memory;
      const wasmInit = performance.now() - t;
      const opened = openCore(m.bytes, m.evaluator);
      core = opened.core;
      const coreTotal = opened.ms;
      t = performance.now();
      const columns = columnsFromCore(core, memory, true);
      const columnsMs = performance.now() - t;
      postFull({ type: "loaded", columns, coreTimings: core.load_timings_json(), wasmInit, coreTotal, columnsMs }, columns);
    } else if (m.type === "request") {
      const t = performance.now();
      const changed = m.points ? core!.request_points(m.cells, m.values) : core!.request(m.cells, m.values);
      const coreMs = performance.now() - t;
      reportRebuild(core!);
      const v = view();
      if (core!.last_rebuilt()) {
        // Everything is new: post the columns again and a fresh cell array.
        const columns = columnsFromCore(core!, memory!, true);
        postFull({ type: "tick", id: m.id, changed, coreMs, dropped: core!.last_dropped(), rebuilt: true, columns }, columns, [changed.buffer]);
      } else if (mode === "sab") {
        for (let i = 0; i < changed.length; i++) shared![changed[i]] = v[changed[i]];
        (self as any).postMessage({ type: "tick", id: m.id, changed, coreMs, dropped: core!.last_dropped(), rebuilt: false }, [changed.buffer]);
      } else {
        const values = new Float64Array(changed.length);
        for (let i = 0; i < changed.length; i++) values[i] = v[changed[i]];
        (self as any).postMessage({ type: "tick", id: m.id, changed, values, coreMs, dropped: core!.last_dropped(), rebuilt: false }, [changed.buffer, values.buffer]);
      }
    } else if (m.type === "setEvaluator") {
      core!.set_evaluator(m.name);
    }
  } catch (err) {
    (self as any).postMessage({ type: "error", message: String(err) });
  }
};

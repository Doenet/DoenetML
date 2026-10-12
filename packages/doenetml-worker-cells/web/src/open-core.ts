// Opening a core and reporting on it, shared by the main-thread backend
// (core.ts) and the worker (worker.ts). The worker cannot import core.ts,
// nor core.ts the worker, without running the other's module code.
import { Core } from "./wasm/cells_wasm.js";

/** Load a document into a new core with the given evaluator, printing its
 * authoring warnings; `ms` is the time the load took. */
export function openCore(bytes: Uint8Array, evaluator: string): { core: Core; ms: number } {
  const t = performance.now();
  const core = new Core(bytes);
  core.set_evaluator(evaluator);
  const ms = performance.now() - t;
  for (const w of JSON.parse(core.warnings_json()) as string[]) console.warn(w);
  return { core, ms };
}

/** Print the error of a rebuild the last request triggered, if it failed. */
export function reportRebuild(core: Core) {
  const err = core.last_rebuild_error();
  if (err) console.error("rebuild failed:", err);
}

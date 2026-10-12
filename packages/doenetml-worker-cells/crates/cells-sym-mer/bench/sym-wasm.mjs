// Plan 5: the symbolic fixtures' ticks in wasm (Node), engines A and R,
// with the same interactions and method as examples/sym_tick.rs.
//
// Build the package first (engine R is a feature of cells-wasm):
//   (cd crates/cells-wasm && wasm-pack build --target nodejs --release \
//      --out-dir ../../target/wasm-sym --out-name cells_wasm -- --features engine-r)
//   node crates/cells-sym-mer/bench/sym-wasm.mjs [spec ...]

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const { Core } = createRequire(import.meta.url)(resolve(repo, "target/wasm-sym/cells_wasm.js"));

const DEFAULT = ["answers-10", "answers-100", "answers-1000", "answers-10000", "curves-10", "curves-100", "curves-1000", "symchain-10", "symchain-100", "symchain-1000", "symchain-10000"];
const specs = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT;

// The k-th correct answer, as cells-docgen's `correct_answer`.
function correctAnswer(i) {
  const k = (i % 7) + 1;
  return [`(x+${k})^2`, `${k}x^2-${k + 1}x+1`, `sin(x)^2+${k}`, `(x-${k})(x+${k})`][i % 4];
}

function interactions(spec, core) {
  const [shape, size] = spec.split("-");
  const n = Number(size);
  const cell = (name, prop) => core.prop_cells(core.resolve_path(name), prop)[0];
  const one = (c, v) => [Uint32Array.of(c), Float64Array.of(v)];
  if (shape === "answers") {
    const k = n >> 1;
    const expr = cell(`mi${k}`, "expr"), submitted = cell(`a${k}`, "submitted");
    return [
      ["keystroke", (i) => one(expr, core.parse_math(`x^2+${i}x+1`)), true],
      ["submit", (i) => {
        const text = i % 2 === 0 ? correctAnswer(k) : `${correctAnswer(k)}+${i}`;
        core.request(...one(expr, core.parse_math(text)));
        return one(submitted, core.cell_value(expr));
      }, false],
    ];
  }
  if (shape === "curves") {
    const a = cell("a", "value"), b0 = cell("b0", "value");
    return [
      ["drag a", (i) => one(a, 1 + (i % 100) * 0.01), false],
      ["drag b0", (i) => one(b0, (i % 100) * 0.01), false],
    ];
  }
  const mi = cell("mi", "expr"), t = cell("t", "value");
  return [
    ["keystroke", (i) => one(mi, core.parse_math(`x^2+${i}`)), true],
    ["drag t", (i) => one(t, 1 + i * 1e-4), false],
  ];
}

const rows = [];
for (const spec of specs) {
  const bytes = readFileSync(resolve(repo, `fixtures/${spec}.cdast`));
  for (const engine of ["A", "R"]) {
    const t0 = performance.now();
    const base = Core.with_engine(bytes, engine);
    const load = performance.now() - t0;
    base.free();
    const row = { spec, engine, load_ms: load };
    let line = `${spec.padEnd(16)} ${engine} load ${load.toFixed(1).padStart(8)} ms`;
    for (const evaluator of ["full", "dirty-closure"]) {
      const core = Core.with_engine(bytes, engine);
      core.set_evaluator(evaluator);
      for (const [what, make, timedSetup] of interactions(spec, core)) {
        const reps = spec.endsWith("-10000") || spec === "curves-1000" ? 20 : 200;
        let total = 0, runs = 0;
        for (let i = 0; i < reps; i++) {
          const t = performance.now();
          const req = make(i);
          const start = timedSetup ? t : performance.now();
          const r0 = core.sym_runs();
          core.request(...req);
          total += performance.now() - start;
          runs += core.sym_runs() - r0;
        }
        row[`${evaluator}:${what}`] = { ms: total / reps, sym_runs: runs / reps };
        if (evaluator === "full") line += ` | ${what}: ${(total / reps).toFixed(3).padStart(8)} ms`;
      }
      core.free();
    }
    console.log(line);
    rows.push(row);
  }
}
const out = process.env.SYM_WASM_OUT ?? resolve(repo, "results/raw/plan5-tick-wasm.json");
writeFileSync(out, JSON.stringify(rows, null, 1));
console.error(`wrote ${out}`);

// Run the Rust harness built for wasm32-wasip1 under node: the evaluators
// as the browser would run them, compiled by V8 (Liftoff, then TurboFan).
//   node wasi.mjs opbench.wasm [args...]
import { readFileSync } from "node:fs";
import { WASI } from "node:wasi";
const wasi = new WASI({
    version: "preview1",
    args: ["opbench", ...process.argv.slice(3)],
    env: process.env,
    preopens: { ".": "." },
});
const mod = await WebAssembly.compile(readFileSync(process.argv[2]));
const inst = await WebAssembly.instantiate(mod, wasi.getImportObject());
wasi.start(inst);

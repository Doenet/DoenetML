// Shrink the built wasm with binaryen's wasm-opt: `npm run build:rust` runs
// this after wasm-pack, whose own wasm-opt is off (crates/cells-wasm/
// Cargo.toml says why). The optimizer is the `binaryen` npm package, so
// every machine runs the same version without a download, and the wasm's
// `target_features` section tells it which features the output may use.
// `-O` keeps the core's speed; the name section (half a megabyte of
// function names, for stack traces) goes with it, as `-g` is not given.
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const wasm = resolve(here, "../pkg/cells_wasm_bg.wasm");
const require = createRequire(import.meta.url);
const wasmOpt = resolve(
    dirname(require.resolve("binaryen/package.json")),
    "bin/wasm-opt",
);

const before = statSync(wasm).size;
execFileSync(process.execPath, [wasmOpt, "-O", wasm, "-o", wasm], {
    stdio: "inherit",
});
const after = statSync(wasm).size;
console.log(
    `wasm-opt: ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB`,
);

// The wasm linear memory a load needs: for each fixture, in a fresh
// process, how much the memory grew while `new Core(bytes)` ran. Linear
// memory never shrinks, so this is the load's high-water mark as a page
// keeps it, which a native counting allocator only approximates.
//
// Usage: node scripts/wasm-memory.mjs [--pkg <dir>] <fixture>...
// `--pkg` defaults to this package's `pkg/` (`npm run build`); a fixture is
// a name in `fixtures/` (its `.cdast`, else its `.json`) or a file path.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

if (args[0] === "--child") {
    const [, pkg, file] = args;
    const mod = await import(pathToFileURL(resolve(pkg, "cells_wasm.js")));
    const wasm = await mod.default({
        module_or_path: readFileSync(resolve(pkg, "cells_wasm_bg.wasm")),
    });
    const before = wasm.memory.buffer.byteLength;
    new mod.Core(new Uint8Array(readFileSync(file)));
    console.log(wasm.memory.buffer.byteLength - before);
} else {
    let pkg = resolve(here, "../pkg");
    if (args[0] === "--pkg") {
        pkg = resolve(args[1]);
        args.splice(0, 2);
    }
    for (const name of args) {
        const file =
            [".cdast", ".json"]
                .map((ext) => resolve(here, "../fixtures", name + ext))
                .find(existsSync) ?? resolve(name);
        const grew = execFileSync(process.execPath, [
            fileURLToPath(import.meta.url),
            "--child",
            pkg,
            file,
        ]);
        const mb = (Number(grew) / 2 ** 20).toFixed(2);
        console.log(`${name.padEnd(20)} ${mb.padStart(8)} MiB`);
    }
}

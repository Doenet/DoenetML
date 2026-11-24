import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * The environment variable that names a different resolver WASM file, for a
 * host that keeps it somewhere other than beside this package's code.
 */
export const RESOLVER_WASM_ENV = "DOENET_HEADLESS_RESOLVER_WASM";

/**
 * Read the resolver WASM (`lib_doenetml_worker_bg.wasm`) the JavaScript core
 * resolves references through.
 *
 * The build copies it beside the bundled code in `dist/`, so the published
 * package finds it relative to this module with no configuration, in plain
 * Node, without a bundler and without inlining ~MBs of base64 into the code.
 * `DOENET_HEADLESS_RESOLVER_WASM` names another file instead; the package's
 * own tests, which run from `src/`, use it to point at the build in the
 * repository.
 */
export async function readResolverWasm(): Promise<Uint8Array> {
    const override = process.env[RESOLVER_WASM_ENV];
    const location = override
        ? override
        : fileURLToPath(
              new URL(
                  /* @vite-ignore */ "./lib_doenetml_worker_bg.wasm",
                  import.meta.url,
              ),
          );
    try {
        return await readFile(location);
    } catch (e) {
        throw Error(
            `Could not read the DoenetML resolver WASM at ${location}` +
                (override ? ` (from ${RESOLVER_WASM_ENV})` : "") +
                `: ${e instanceof Error ? e.message : String(e)}`,
        );
    }
}

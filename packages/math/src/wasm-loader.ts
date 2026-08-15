/**
 * Browser/node loader for the math-expressions WASM core.
 *
 * This module supplies the WASM to `math-expressions-js-compat` through its
 * `setWasmModule` injection point. That entry point is new in the current
 * upstream revision; before it existed we had to *alias* the compat package's
 * node-only `lib/_wasm.ts` to this file from `vite.config.ts`, which meant a
 * build-tool rule stood between the library and its own loader. The injection
 * API replaces that: compat is now imported as an ordinary package, and the
 * only bundler configuration left is resolving the submodule's paths.
 *
 * The bytes are inlined (see `scripts/build-wasm.mjs`), so instantiation never
 * touches the network. Two entry points, because the realms differ:
 *
 *   - `initMathWasmSync()` — synchronous compile. Valid in a Web Worker and in
 *     node. This is what keeps the legacy `me.fromText(x).equals(y)` API
 *     synchronous with no `await` anywhere, which is the whole reason inlining
 *     is worth its bundle cost.
 *   - `initMathWasm()` — async compile, for the main thread, where browsers
 *     refuse to compile a module this size synchronously.
 *
 * Both are idempotent and share one promise/instance: wasm-bindgen's `init`
 * only guards *completed* initializations, so concurrent in-flight callers
 * would otherwise instantiate twice and corrupt the module-level instance. That
 * is the same hazard `CoreWorker.ts` documents for the DoenetML core (#1466).
 */
import * as glue from "math-expressions-wasm-glue";
// The barrel's own export. This used to have to come from the leaf `lib/_wasm`
// instead: `Context._assumptionsHandle` was an eager `new wasm.Assumptions()`,
// which touched the WASM while the barrel's module body was still evaluating,
// so importing from the barrel forced the load before injection could happen and
// it silently lost the race to compat's node fallback. The handle is a lazy
// getter now, so nothing here loads the WASM until a method is actually called.
import { setWasmModule } from "math-expressions-js-compat";
import type { WasmModule } from "math-expressions-rs-wasm";
import { WASM_BASE64, WASM_BYTE_LENGTH } from "./generated/wasm-bytes";

let initialized = false;
let initPromise: Promise<void> | null = null;

function decodeWasm(): Uint8Array {
    if (!WASM_BASE64) {
        throw new Error(
            "@doenet/math: the WASM core was not inlined into this build. " +
                "scripts/build-wasm.mjs did not run, or produced no bytes. " +
                "Rebuild the package.",
        );
    }
    // `Buffer` where it exists (node) — it decodes natively and avoids a
    // multi-megabyte charCodeAt loop; `atob` everywhere else.
    const maybeBuffer = (globalThis as { Buffer?: typeof Buffer }).Buffer;
    if (maybeBuffer) {
        const buf = maybeBuffer.from(WASM_BASE64, "base64");
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    }
    const binary = atob(WASM_BASE64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/**
 * Whether synchronous instantiation is permitted here. Browsers cap
 * synchronous `WebAssembly.Module` compilation on the main thread; workers and
 * node have no such limit.
 */
export function canInitSync(): boolean {
    const g = globalThis as {
        window?: unknown;
        process?: { versions?: { node?: string } };
    };
    // node — including jsdom-backed test environments, which define `window`
    // but compile WASM through node and have no size cap.
    if (g.process?.versions?.node) {
        return true;
    }
    // In a browser, only the main thread has `window`; worker realms do not.
    return typeof g.window === "undefined";
}

/** Instantiate synchronously. Throws on the browser main thread. */
export function initMathWasmSync(): void {
    if (initialized) {
        return;
    }
    if (!canInitSync()) {
        throw new Error(
            "@doenet/math: refusing to compile a " +
                `${(WASM_BYTE_LENGTH / 1024 / 1024).toFixed(1)} MiB WASM module ` +
                "synchronously on the browser main thread. Await initMathWasm() " +
                "during app startup instead.",
        );
    }
    glue.initSync({ module: decodeWasm() });
    initialized = true;
}

/** Instantiate asynchronously. Safe in every realm; required on the main thread. */
export async function initMathWasm(): Promise<void> {
    if (initialized) {
        return;
    }
    if (!initPromise) {
        // Clear the cached promise on failure so a later caller can retry rather
        // than every future caller inheriting one rejected promise forever.
        initPromise = (async () => {
            await glue.default({ module_or_path: decodeWasm() });
            initialized = true;
        })().catch((e) => {
            initPromise = null;
            throw e;
        });
    }
    return initPromise;
}

export function isMathWasmInitialized(): boolean {
    return initialized;
}

/**
 * The compat layer calls free functions on the injected module (`wasm.parse_text`,
 * `new wasm.Assumptions()`, …) — it has no notion of an uninitialized engine.
 * Rather than require every consumer to remember an init step, instantiate
 * eagerly wherever that is legal. On the browser main thread it is not, so
 * callers there must `await initMathWasm()` before first use; until they do,
 * the guard below turns the otherwise cryptic `null pointer passed to rust`
 * failure into an actionable message.
 */
if (canInitSync() && WASM_BASE64) {
    initMathWasmSync();
}

const guarded = new Proxy(glue as unknown as WasmModule, {
    get(target, prop, receiver) {
        if (!initialized) {
            // Two different failures reach here, and naming the wrong one
            // sends the reader to the wrong place. Missing bytes means the
            // package was built without `build:wasm`, and it happens in every
            // realm — including the worker and node, where the main thread's
            // `await` is not the answer.
            throw new Error(
                WASM_BASE64
                    ? "@doenet/math: the WASM core is not initialized yet. On the " +
                          "browser main thread, `await initMathWasm()` during startup " +
                          `before using math expressions (tried to access "${String(prop)}").`
                    : "@doenet/math: the WASM core was not inlined into this build. " +
                          "Run `npm run build -w packages/math` (its `build:wasm` step " +
                          "compiles the Rust core) and rebuild anything that bundles it " +
                          `(tried to access "${String(prop)}").`,
            );
        }
        return Reflect.get(target, prop, receiver);
    },
});

/**
 * Hand the compat layer our `web`-target module, unconditionally and at import
 * time — before anything can parse. Injecting the *guard* rather than `glue`
 * itself matters on the browser main thread, where initialization is necessarily
 * async: without an injection the compat layer would fall through to its node
 * loader and fail with a message about calling `setWasmModule`, which we already
 * did. The guard reports the real problem instead (init has not finished yet).
 */
setWasmModule(guarded);

// `guarded` is deliberately not exported. Nothing imports it — the compat layer
// receives it through `setWasmModule` above, and this module is not in the
// package's `exports` map — while exporting it made the emitted `.d.ts` say
// `import { WasmModule } from '../../../vendor/math-expressions/.../src-js/index.ts'`,
// putting a second submodule source file into every consumer's type program.
// See the note in `./engine-rust` for why that is worth avoiding.

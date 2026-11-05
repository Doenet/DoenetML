import { afterEach, describe, expect, it, vi } from "vitest";

// Unit coverage for the two ways `initMathEngine` can bring the math engine up,
// and for the single-flight around the second.
//
// `math-expressions` is externalized, so which module satisfies it is decided by
// whoever installed the library: in this repository it is `@doenet/math`, which
// exports `initMathWasm` for the core it inlined; for a consumer it is the
// published package, which has neither that export nor an initializer of its
// own, and the fallback has to instantiate the `--target web` glue and hand it
// to upstream's `setWasmModule`. Only the first of those two is reachable from
// anything that runs in this repository, which is why the second is driven here
// against stand-ins for both modules rather than left to a consumer to discover.

const GLUE_SPECIFIER = "math-expressions/wasm-web/math_expressions_wasm.js";

/**
 * Load a fresh copy of the module under test against the given stand-ins.
 * Fresh, because the fallback caches its in-flight promise at module scope and
 * every test here is about that cache.
 */
async function loadWith(options: {
    /** Named exports of whatever satisfied the `math-expressions` peer. */
    peer: Record<string, unknown>;
    /** What `glue.default()` does. Defaults to resolving. */
    glueInit?: () => Promise<unknown>;
}) {
    const glueInit = vi.fn(options.glueInit ?? (() => Promise.resolve()));
    const glue = { default: glueInit, marker: "web-glue" };

    vi.resetModules();
    // Both names spelled out, `undefined` where the stand-in does not have
    // them: vitest's mocked namespace *throws* on reading an export the factory
    // omitted, where a real namespace object just answers `undefined` — which
    // is the condition `initMathEngine` branches on.
    vi.doMock("math-expressions", () => ({
        initMathWasm: undefined,
        setWasmModule: undefined,
        ...options.peer,
    }));
    vi.doMock(GLUE_SPECIFIER, () => glue);

    const { initMathEngine } = await import("./mathWasm");
    return { initMathEngine, glueInit, glue };
}

afterEach(() => {
    vi.doUnmock("math-expressions");
    vi.doUnmock(GLUE_SPECIFIER);
    vi.resetModules();
});

describe("initMathEngine", () => {
    it("uses the seam's own initializer when the peer has one", async () => {
        const initMathWasm = vi.fn(() => Promise.resolve());
        const setWasmModule = vi.fn();
        const { initMathEngine, glueInit } = await loadWith({
            peer: { initMathWasm, setWasmModule },
        });

        await initMathEngine();

        expect(initMathWasm).toHaveBeenCalledTimes(1);
        // The web glue is the consumer's path and must stay untouched here:
        // against `@doenet/math` that subpath is a stub that throws.
        expect(glueInit).not.toHaveBeenCalled();
        expect(setWasmModule).not.toHaveBeenCalled();
    });

    it("instantiates the published package's web glue and injects it", async () => {
        const setWasmModule = vi.fn();
        const { initMathEngine, glueInit, glue } = await loadWith({
            peer: { setWasmModule },
        });

        await initMathEngine();

        expect(glueInit).toHaveBeenCalledTimes(1);
        // No argument, so the glue falls back to the `new URL(..., import.meta.url)`
        // pattern a bundler rewrites to the asset it emitted.
        expect(glueInit).toHaveBeenCalledWith();
        expect(setWasmModule).toHaveBeenCalledTimes(1);
        expect(setWasmModule).toHaveBeenCalledWith(glue);
    });

    it("instantiates once for concurrent callers", async () => {
        const setWasmModule = vi.fn();
        const { initMathEngine, glueInit } = await loadWith({
            peer: { setWasmModule },
        });

        await Promise.all([
            initMathEngine(),
            initMathEngine(),
            initMathEngine(),
        ]);

        // The whole reason the fallback caches a promise: wasm-bindgen's own
        // guard only covers *completed* initializations, so three callers would
        // otherwise compile the core three times and the last would replace the
        // module the first had already injected.
        expect(glueInit).toHaveBeenCalledTimes(1);
        expect(setWasmModule).toHaveBeenCalledTimes(1);
    });

    it("says what to install when the peer has neither entry point", async () => {
        const { initMathEngine, glueInit } = await loadWith({
            peer: { somethingElse: true },
        });

        // Both names, because the message's job is to tell whoever installed
        // the wrong thing which two exports were looked for — and a pointer to
        // `peerDependencies` rather than a version, so that bumping the range
        // cannot leave this message behind saying something else.
        await expect(initMathEngine()).rejects.toThrow(/initMathWasm/);
        await expect(initMathEngine()).rejects.toThrow(/setWasmModule/);
        await expect(initMathEngine()).rejects.toThrow(/peerDependencies/);
        expect(glueInit).not.toHaveBeenCalled();
    });

    it("lets a later caller retry after a failed instantiation", async () => {
        const setWasmModule = vi.fn();
        let attempt = 0;
        const { initMathEngine, glueInit } = await loadWith({
            peer: { setWasmModule },
            glueInit: () =>
                ++attempt === 1
                    ? Promise.reject(new Error("compile failed"))
                    : Promise.resolve(),
        });

        await expect(initMathEngine()).rejects.toThrow("compile failed");
        await expect(initMathEngine()).resolves.toBeUndefined();

        expect(glueInit).toHaveBeenCalledTimes(2);
        expect(setWasmModule).toHaveBeenCalledTimes(1);
    });
});

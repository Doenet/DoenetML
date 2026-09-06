import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Focused regression coverage for the Rust-backend opt-in flag added in
 * Phase 4 (see prefigureRuntime.ts). This intentionally does not attempt to
 * exercise the full service/Pyodide/Rust race end-to-end (the Pyodide path
 * is loaded via a CDN `import(url)` at runtime, which is impractical to
 * drive deterministically in a unit test) — instead it covers:
 *
 * 1. Flag disabled (the default): `warmupPrefigureRustInBackground()` is a
 *    true no-op (never touches the Rust module), and `buildPrefigureDiagram`
 *    never considers the Rust module even if it happens to be ready.
 * 2. Flag enabled: `warmupPrefigureRustInBackground()` initializes the Rust
 *    module, and once ready, `buildPrefigureDiagram` prefers it (via the
 *    already-ready fast path) over hitting the network service at all.
 */

const initPrefigure = vi.fn();
const compilePrefigure = vi.fn();

vi.mock("@doenet/prefigure-rust", () => ({
    initPrefigure: (...args: unknown[]) => initPrefigure(...args),
    compilePrefigure: (...args: unknown[]) => compilePrefigure(...args),
}));

async function loadRuntimeWithFlag(rustEnabled: boolean) {
    vi.resetModules();
    initPrefigure.mockReset();
    compilePrefigure.mockReset();

    vi.doMock("./prefigureConfig", () => ({
        PREFIGURE_BUILD_ENDPOINT: "https://example.invalid/build",
        PREFIGURE_INDEX_URL: "",
        PREFIGURE_MODULE_URL: "https://example.invalid/prefigure.js",
        PREFIGURE_RUST_ENABLED: rustEnabled,
    }));

    return import("./prefigureRuntime");
}

describe("prefigure Rust backend flag", () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        vi.doUnmock("./prefigureConfig");
    });

    it("is a no-op when PREFIGURE_RUST_ENABLED is false", async () => {
        const { warmupPrefigureRustInBackground } =
            await loadRuntimeWithFlag(false);

        warmupPrefigureRustInBackground();
        // Flush any microtasks a real warmup would have used.
        await Promise.resolve();
        await Promise.resolve();

        expect(initPrefigure).not.toHaveBeenCalled();
    });

    it("does not use the Rust module in buildPrefigureDiagram when disabled, even after warmup", async () => {
        const { warmupPrefigureRustInBackground, buildPrefigureDiagram } =
            await loadRuntimeWithFlag(false);

        warmupPrefigureRustInBackground();
        await Promise.resolve();
        await Promise.resolve();

        expect(initPrefigure).not.toHaveBeenCalled();

        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => ({ svg: "<svg service/>", annotationsXml: "" }),
        });

        const controller = new AbortController();
        const result = await buildPrefigureDiagram(
            "<diagram/>",
            controller.signal,
        );

        expect(result.svg).toBe("<svg service/>");
        expect(compilePrefigure).not.toHaveBeenCalled();
    });

    it("initializes and is used by buildPrefigureDiagram when enabled", async () => {
        const { warmupPrefigureRustInBackground, buildPrefigureDiagram } =
            await loadRuntimeWithFlag(true);

        initPrefigure.mockResolvedValue(undefined);
        compilePrefigure.mockResolvedValue({
            svg: "<svg rust/>",
            annotationsXml: "<annotations/>",
        });

        warmupPrefigureRustInBackground();
        // Let the warmup's async init resolve (a macrotask tick to be safe,
        // since the init chain crosses a real Promise from the mocked module).
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(initPrefigure).toHaveBeenCalledTimes(1);

        // fetch should never be needed: the Rust module is already warm, so
        // buildPrefigureDiagram takes the ready-module fast path.
        const controller = new AbortController();
        const result = await buildPrefigureDiagram(
            "<diagram/>",
            controller.signal,
        );

        expect(result.svg).toBe("<svg rust/>");
        expect(result.annotationsXml).toBe("<annotations/>");
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });
});

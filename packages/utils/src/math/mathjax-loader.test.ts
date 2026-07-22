import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    DEFAULT_MATHJAX_SRC,
    isMathJaxEngine,
    loadMathJax,
} from "./mathjax-loader";

/**
 * These tests exercise the coexistence decisions of `loadMathJax` against a
 * minimal stub of the tiny DOM surface the loader touches, so they run in the
 * default (node) Vitest environment without jsdom.
 */

type FakeScript = {
    type: string;
    src: string;
    async: boolean;
    setAttribute: (name: string, value: string) => void;
    hasAttribute: (name: string) => boolean;
    addEventListener: (name: string, cb: (event?: unknown) => void) => void;
    _attrs: Record<string, string>;
    _fire: (name: string) => void;
};

function makeScript(src = ""): FakeScript {
    const attrs: Record<string, string> = {};
    const listeners: Record<string, (event?: unknown) => void> = {};
    return {
        type: "",
        src,
        async: false,
        setAttribute(name, value) {
            attrs[name] = value;
        },
        hasAttribute(name) {
            return name in attrs;
        },
        addEventListener(name, cb) {
            listeners[name] = cb;
        },
        _attrs: attrs,
        _fire(name) {
            listeners[name]?.();
        },
    };
}

let appendedScripts: FakeScript[];
let domScripts: FakeScript[];

function installFakeDom() {
    appendedScripts = [];
    domScripts = [];
    const fakeDocument = {
        createElement: (_tag: string) => makeScript(),
        head: {
            appendChild: (script: FakeScript) => {
                appendedScripts.push(script);
                domScripts.push(script);
            },
        },
        querySelectorAll: (_selector: string) =>
            domScripts.filter((script) => script.src),
    };
    const fakeWindow: Record<string, unknown> = {
        setTimeout: (fn: () => void, ms?: number) =>
            globalThis.setTimeout(fn, ms),
    };
    (globalThis as any).window = fakeWindow;
    (globalThis as any).document = fakeDocument;
    return { fakeWindow, fakeDocument };
}

/**
 * A stand-in for a fully loaded MathJax engine. `startup` is a *function* with
 * a `.promise` attached — the real shape MathJax 4 exposes (MathJax 3 used a
 * plain object). Using the function shape here keeps the suite honest: a mock
 * with an object `startup` hid the bug where `isMathJaxEngine` rejected every
 * MathJax 4 host engine.
 */
function makeEngine() {
    const startup: any = () => {};
    startup.promise = Promise.resolve();
    return {
        version: "4.1.3",
        startup,
        typesetPromise: () => Promise.resolve(),
        typesetClear: () => {},
    };
}

afterEach(() => {
    delete (globalThis as any).window;
    delete (globalThis as any).document;
});

describe("isMathJaxEngine", () => {
    it("recognizes a loaded engine but not a plain config object", () => {
        expect(isMathJaxEngine(makeEngine())).toBe(true);
        expect(isMathJaxEngine(undefined)).toBe(false);
        expect(isMathJaxEngine({ tex: { tags: "ams" } })).toBe(false);
        // A config may carry a `startup` option, but no `startup.promise`.
        expect(isMathJaxEngine({ startup: { typeset: false } })).toBe(false);
    });

    it("recognizes both MathJax 4 (function startup) and MathJax 3 (object startup)", () => {
        // MathJax 4: `startup` is a callable function with `.promise` attached.
        const v4Startup: any = () => {};
        v4Startup.promise = Promise.resolve();
        expect(isMathJaxEngine({ startup: v4Startup })).toBe(true);

        // MathJax 3: `startup` is a plain object with `.promise`.
        expect(
            isMathJaxEngine({ startup: { promise: Promise.resolve() } }),
        ).toBe(true);

        // A bare function with no thenable `.promise` is still not an engine.
        expect(isMathJaxEngine({ startup: () => {} })).toBe(false);
    });
});

describe("loadMathJax", () => {
    beforeEach(() => {
        installFakeDom();
    });

    it("reuses an existing live engine without injecting a script or touching window.MathJax", async () => {
        const engine = makeEngine();
        const win = (globalThis as any).window;
        win.MathJax = engine;

        const result = await loadMathJax({ config: { tex: {} } });

        expect(result).toBe(engine);
        expect(win.MathJax).toBe(engine); // never overwritten
        expect(appendedScripts).toHaveLength(0); // no second copy loaded
    });

    it("waits for an already-present (deferred) MathJax script instead of injecting its own", async () => {
        const win = (globalThis as any).window;
        // A deferred host script is in the DOM but has not executed yet.
        domScripts.push(
            makeScript("https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js"),
        );

        const promise = loadMathJax({ config: { tex: {} } });

        // Synchronously, the loader must not inject its own script nor stage a
        // config onto window.MathJax — the host owns MathJax.
        expect(appendedScripts).toHaveLength(0);
        expect(win.MathJax).toBeUndefined();

        // The host script eventually executes and installs the engine.
        const engine = makeEngine();
        win.MathJax = engine;

        await expect(promise).resolves.toBe(engine);
    });

    it("injects its own script and stages config when no MathJax is present", async () => {
        const win = (globalThis as any).window;

        const promise = loadMathJax({ config: { tex: { tags: "ams" } } });

        expect(appendedScripts).toHaveLength(1);
        const injected = appendedScripts[0];
        expect(injected.src).toBe(DEFAULT_MATHJAX_SRC);
        expect(injected._attrs["data-doenet-mathjax"]).toBe("true");
        // Config staged because window.MathJax was unclaimed.
        expect(win.MathJax).toEqual({ tex: { tags: "ams" } });

        // Simulate the script loading and replacing window.MathJax with the engine.
        const engine = makeEngine();
        win.MathJax = engine;
        injected._fire("load");

        await expect(promise).resolves.toBe(engine);
    });

    it("honors a custom src and does not clobber a host-staged config", async () => {
        const win = (globalThis as any).window;
        const hostConfig = { tex: { macros: {} } };
        win.MathJax = hostConfig; // host staged a config but no script yet

        const customSrc = "https://example.test/mathjax@4/tex-chtml.js";
        const promise = loadMathJax({ config: { tex: {} }, src: customSrc });

        expect(appendedScripts).toHaveLength(1);
        expect(appendedScripts[0].src).toBe(customSrc);
        expect(win.MathJax).toBe(hostConfig); // not overwritten

        const engine = makeEngine();
        win.MathJax = engine;
        appendedScripts[0]._fire("load");
        await expect(promise).resolves.toBe(engine);
    });

    it("memoizes a single promise across calls (one MathJax per realm)", async () => {
        const first = loadMathJax();
        const second = loadMathJax();
        expect(second).toBe(first);
        // Only one script injected despite two calls.
        expect(appendedScripts).toHaveLength(1);

        const engine = makeEngine();
        (globalThis as any).window.MathJax = engine;
        appendedScripts[0]._fire("load");
        await expect(first).resolves.toBe(engine);
    });

    it("waits when useExistingMathjax is set even with no script present", async () => {
        const win = (globalThis as any).window;

        const promise = loadMathJax({ useExistingMathJax: true });

        // No script injected — we are waiting for the host to provide MathJax.
        expect(appendedScripts).toHaveLength(0);

        const engine = makeEngine();
        win.MathJax = engine;
        await expect(promise).resolves.toBe(engine);
    });

    it("rejects when the injected script fails to load", async () => {
        const promise = loadMathJax({ config: { tex: {} } });
        expect(appendedScripts).toHaveLength(1);

        // The browser fires an `error` event when the script URL fails to load.
        appendedScripts[0]._fire("error");

        await expect(promise).rejects.toThrow(/failed to load MathJax/);
    });

    it("falls back to loading its own copy after the timeout when a promised host MathJax never appears", async () => {
        vi.useFakeTimers();
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
            const win = (globalThis as any).window;
            const promise = loadMathJax({
                useExistingMathJax: true,
                timeoutMs: 1000,
                config: { tex: { tags: "ams" } },
            });
            // Waiting on the host — nothing injected yet.
            expect(appendedScripts).toHaveLength(0);

            // Drive the poll loop past the deadline; the host never provides one.
            await vi.advanceTimersByTimeAsync(1100);

            // Instead of failing, the loader injects — and takes over with — its
            // own copy, staging the config even though we had been waiting.
            expect(appendedScripts).toHaveLength(1);
            expect(appendedScripts[0]._attrs["data-doenet-mathjax"]).toBe(
                "true",
            );
            expect(win.MathJax).toEqual({ tex: { tags: "ams" } });
            expect(warnSpy).toHaveBeenCalled();

            // Our own script loads and installs the engine.
            const engine = makeEngine();
            win.MathJax = engine;
            appendedScripts[0]._fire("load");
            await expect(promise).resolves.toBe(engine);
        } finally {
            warnSpy.mockRestore();
            vi.useRealTimers();
        }
    });

    it("force-clobbers a host global it could not recognize as an engine", async () => {
        vi.useFakeTimers();
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
            const win = (globalThis as any).window;
            // A host script is present, and window.MathJax holds a value the
            // loader never recognizes as a live engine (the failure mode a
            // mis-detected MathJax 4 engine produced).
            domScripts.push(
                makeScript(
                    "https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js",
                ),
            );
            win.MathJax = { unrecognized: true };

            const promise = loadMathJax({
                config: { tex: { tags: "ams" } },
                timeoutMs: 1000,
            });
            expect(appendedScripts).toHaveLength(0); // waiting on the host script

            await vi.advanceTimersByTimeAsync(1100);

            // Fallback overwrites the stale global and loads our own.
            expect(appendedScripts).toHaveLength(1);
            expect(win.MathJax).toEqual({ tex: { tags: "ams" } });

            const engine = makeEngine();
            win.MathJax = engine;
            appendedScripts[0]._fire("load");
            await expect(promise).resolves.toBe(engine);
        } finally {
            warnSpy.mockRestore();
            vi.useRealTimers();
        }
    });

    it("clears the memo when an attempt rejects, so a later call retries instead of reusing the failure", async () => {
        const win = (globalThis as any).window;

        const first = loadMathJax({ config: { tex: {} } });
        expect(appendedScripts).toHaveLength(1);
        // Our own injected script fails to load (e.g. offline CDN).
        appendedScripts[0]._fire("error");
        await expect(first).rejects.toThrow(/failed to load MathJax/);

        // The rejected promise must not be memoized: a fresh call retries.
        const second = loadMathJax({ config: { tex: {} } });
        expect(second).not.toBe(first);
        expect(appendedScripts).toHaveLength(2);

        const engine = makeEngine();
        win.MathJax = engine;
        appendedScripts[1]._fire("load");
        await expect(second).resolves.toBe(engine);
    });
});

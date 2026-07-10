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

/** A stand-in for a fully loaded MathJax engine. */
function makeEngine() {
    return {
        version: "4.1.3",
        startup: { promise: Promise.resolve() },
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

    it("rejects after the timeout when a promised host MathJax never appears", async () => {
        vi.useFakeTimers();
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
            const promise = loadMathJax({
                useExistingMathJax: true,
                timeoutMs: 1000,
            });
            // Attach the rejection handler before advancing so the rejection is
            // never observed as unhandled.
            const assertion = expect(promise).rejects.toThrow(/timed out/);

            // Drive the poll loop past the deadline; MathJax never shows up.
            await vi.advanceTimersByTimeAsync(1100);

            await assertion;
            expect(appendedScripts).toHaveLength(0); // never injected our own
            expect(warnSpy).toHaveBeenCalled();
        } finally {
            warnSpy.mockRestore();
            vi.useRealTimers();
        }
    });
});

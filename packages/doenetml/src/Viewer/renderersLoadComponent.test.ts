import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    isTransientDynamicImportError,
    RendererLoadFailed,
    renderersLoadComponent,
} from "./renderersLoadComponent";

// `importRendererWithRetry` uses `setTimeout` for exponential backoff. We
// drive the clock manually with fake timers so the tests don't have to wait
// the real 100/200/400 ms.
beforeEach(() => {
    vi.useFakeTimers();
    // Silence the warn/error spam these tests intentionally trigger.
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

/**
 * Run all pending microtasks and timers until quiescent. `vi.runAllTimersAsync`
 * advances each scheduled timer, awaiting microtasks between them — which is
 * exactly what we need for an `async` function that awaits a `setTimeout`
 * promise between retries.
 */
async function flush() {
    await vi.runAllTimersAsync();
}

describe("isTransientDynamicImportError", () => {
    it("matches Chrome/Firefox phrasing", () => {
        expect(
            isTransientDynamicImportError(
                new Error(
                    "Failed to fetch dynamically imported module: http://localhost/x.tsx",
                ),
            ),
        ).toBe(true);
    });

    it("matches Safari phrasing", () => {
        expect(
            isTransientDynamicImportError(
                new Error("Importing a module script failed."),
            ),
        ).toBe(true);
    });

    it("matches Firefox alternate phrasing", () => {
        expect(
            isTransientDynamicImportError(
                new Error("error loading dynamically imported module"),
            ),
        ).toBe(true);
    });

    it("rejects unrelated errors (SyntaxError, TypeError, etc.)", () => {
        expect(
            isTransientDynamicImportError(
                new SyntaxError("Unexpected token '<'"),
            ),
        ).toBe(false);
        expect(
            isTransientDynamicImportError(new TypeError("foo is undefined")),
        ).toBe(false);
        expect(isTransientDynamicImportError("nope")).toBe(false);
    });
});

describe("renderersLoadComponent", () => {
    it("resolves a single successful loader to its module's default export", async () => {
        const Component = function Foo() {};
        const loader = vi.fn(() => Promise.resolve({ default: Component }));

        const promise = renderersLoadComponent([loader], ["foo"]);
        await flush();
        const result = await promise;

        expect(loader).toHaveBeenCalledTimes(1);
        expect(result.failedRenderers).toEqual([]);
        expect(result.rendererClasses).toEqual({ foo: Component });
    });

    it("retries up to 3 times on transient errors, then succeeds", async () => {
        const Component = function Foo() {};
        const transient = () =>
            Promise.reject(
                new Error("Failed to fetch dynamically imported module: foo"),
            );
        const loader = vi
            .fn()
            .mockImplementationOnce(transient)
            .mockImplementationOnce(transient)
            .mockImplementationOnce(() =>
                Promise.resolve({ default: Component }),
            );

        const promise = renderersLoadComponent([loader], ["foo"]);
        await flush();
        const result = await promise;

        expect(loader).toHaveBeenCalledTimes(3);
        expect(result.failedRenderers).toEqual([]);
        expect(result.rendererClasses.foo).toBe(Component);
    });

    it("substitutes RendererLoadFailed and reports the name when all retries fail with transient errors", async () => {
        const loader = vi.fn(() =>
            Promise.reject(
                new Error("Failed to fetch dynamically imported module: foo"),
            ),
        );

        const promise = renderersLoadComponent([loader], ["foo"]);
        await flush();
        const result = await promise;

        // Initial attempt + 3 retries = 4 calls.
        expect(loader).toHaveBeenCalledTimes(4);
        expect(result.failedRenderers).toEqual(["foo"]);
        expect(result.rendererClasses.foo).toBe(RendererLoadFailed);
    });

    it("does NOT retry on a non-transient error", async () => {
        const loader = vi.fn(() =>
            Promise.reject(new SyntaxError("Unexpected token '<'")),
        );

        const promise = renderersLoadComponent([loader], ["foo"]);
        await flush();
        const result = await promise;

        expect(loader).toHaveBeenCalledTimes(1);
        expect(result.failedRenderers).toEqual(["foo"]);
        expect(result.rendererClasses.foo).toBe(RendererLoadFailed);
    });

    it("settles loaders in parallel: one failure does not block the others", async () => {
        const A = function A() {};
        const B = function B() {};
        const loaderA = vi.fn(() => Promise.resolve({ default: A }));
        const loaderFail = vi.fn(() =>
            Promise.reject(
                new Error("Failed to fetch dynamically imported module: fail"),
            ),
        );
        const loaderB = vi.fn(() => Promise.resolve({ default: B }));

        const promise = renderersLoadComponent(
            [loaderA, loaderFail, loaderB],
            ["a", "fail", "b"],
        );
        await flush();
        const result = await promise;

        expect(result.rendererClasses.a).toBe(A);
        expect(result.rendererClasses.b).toBe(B);
        expect(result.rendererClasses.fail).toBe(RendererLoadFailed);
        expect(result.failedRenderers).toEqual(["fail"]);
    });

    it("reports failedRenderers in loader-input order, not resolution-timing order", async () => {
        // Even though the second loader rejects synchronously and the first
        // rejects only after a delay, `failedRenderers` should match the
        // order the names were passed in. (Derivation is from the post-await
        // `settled` array rather than push-from-handler.)
        const slowFail = () =>
            new Promise((_, reject) =>
                setTimeout(
                    () =>
                        reject(
                            new Error(
                                "Failed to fetch dynamically imported module: slow",
                            ),
                        ),
                    50,
                ),
            );
        const fastFail = () =>
            Promise.reject(
                new Error("Failed to fetch dynamically imported module: fast"),
            );

        const promise = renderersLoadComponent(
            [slowFail, fastFail],
            ["slow", "fast"],
        );
        await flush();
        const result = await promise;

        expect(result.failedRenderers).toEqual(["slow", "fast"]);
    });

    it("never surfaces an unhandled rejection while loaders are still in flight", async () => {
        // Regression guard for #1190: with pre-started promises, the late
        // rejection from a slow-failing loader would fire before the loop
        // attached its handler to it. The factory + Promise.all path should
        // attach handlers up front, so no unhandled rejection escapes.
        const unhandled: unknown[] = [];
        const onUnhandled = (event: PromiseRejectionEvent | unknown) => {
            unhandled.push(event);
        };
        // Node and browsers expose different shapes; cover both.
        if (typeof process !== "undefined") {
            process.on("unhandledRejection", onUnhandled);
        }

        try {
            const A = function A() {};
            const slowOk = () =>
                new Promise<{ default: typeof A }>((resolve) =>
                    setTimeout(() => resolve({ default: A }), 1000),
                );
            const fastFail = () =>
                Promise.reject(
                    new Error(
                        "Failed to fetch dynamically imported module: fail",
                    ),
                );

            const promise = renderersLoadComponent(
                [slowOk, fastFail],
                ["a", "fail"],
            );
            await flush();
            const result = await promise;

            expect(result.rendererClasses.a).toBe(A);
            expect(result.rendererClasses.fail).toBe(RendererLoadFailed);
            // Flush one more microtask turn to give any unhandled rejection
            // a chance to surface.
            await Promise.resolve();
            expect(unhandled).toEqual([]);
        } finally {
            if (typeof process !== "undefined") {
                process.off("unhandledRejection", onUnhandled);
            }
        }
    });
});

import { afterEach, describe, expect, it, vi } from "vitest";

// The real module creates a blob URL out of the whole core worker bundle at
// import time. Nothing here runs a conversion, so that megabyte-scale side
// effect is not wanted; `src/index` imports it purely for that effect.
vi.mock("../src/index-inline-worker", () => ({}));

import { DoenetMLToPretext, doenetMLToPretext } from "../src/index";

/**
 * A stand-in for the platform `Worker`. Comlink only ever calls
 * `addEventListener`/`postMessage` on it during `wrap`, so nothing more is
 * needed to watch how the converter treats the worker's lifetime.
 */
class FakeWorker {
    static created: FakeWorker[] = [];
    terminateCount = 0;
    constructor() {
        FakeWorker.created.push(this);
    }
    terminate() {
        this.terminateCount++;
    }
    addEventListener() {}
    removeEventListener() {}
    postMessage() {}
}

function withFakeWorker<T>(body: () => T): T {
    const realWorker = (globalThis as any).Worker;
    (globalThis as any).Worker = FakeWorker;
    try {
        return body();
    } finally {
        (globalThis as any).Worker = realWorker;
    }
}

afterEach(() => {
    FakeWorker.created = [];
    vi.restoreAllMocks();
});

describe("core worker lifetime", () => {
    it("dispose terminates the worker the converter booted", () => {
        const converter = new DoenetMLToPretext();
        withFakeWorker(() => {
            converter._worker = converter._createWrappedCoreWorker();
        });

        expect(FakeWorker.created).toHaveLength(1);
        expect(FakeWorker.created[0].terminateCount).toBe(0);

        converter.dispose();

        expect(FakeWorker.created[0].terminateCount).toBe(1);
        expect(converter._worker).toBe(null);
        expect(converter._rawWorker).toBe(null);
    });

    it("dispose is safe with no worker, and safe twice", () => {
        const converter = new DoenetMLToPretext();
        expect(() => converter.dispose()).not.toThrow();

        withFakeWorker(() => {
            converter._worker = converter._createWrappedCoreWorker();
        });
        converter.dispose();
        converter.dispose();

        // The second call must not terminate a worker it no longer owns —
        // by then the handle may well have been reused by a fresh boot.
        expect(FakeWorker.created[0].terminateCount).toBe(1);
    });

    it("doenetMLToPretext disposes the converter it owns", async () => {
        const dispose = vi.spyOn(DoenetMLToPretext.prototype, "dispose");
        vi.spyOn(DoenetMLToPretext.prototype, "convert").mockResolvedValue(
            "<pretext />",
        );

        await expect(doenetMLToPretext("<p>hi</p>")).resolves.toBe(
            "<pretext />",
        );

        // Each call makes its own converter, so a missing `dispose` here leaks
        // one core worker per converted document — which is how
        // `pretext-export.test.ts` came to hold ~50 of them at once.
        expect(dispose).toHaveBeenCalledTimes(1);
    });

    it("doenetMLToPretext disposes even when the conversion throws", async () => {
        const dispose = vi.spyOn(DoenetMLToPretext.prototype, "dispose");
        vi.spyOn(DoenetMLToPretext.prototype, "convert").mockRejectedValue(
            new Error("conversion blew up"),
        );

        await expect(doenetMLToPretext("<p>hi</p>")).rejects.toThrow(
            "conversion blew up",
        );

        expect(dispose).toHaveBeenCalledTimes(1);
    });
});

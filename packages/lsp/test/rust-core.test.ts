/**
 * Unit tests for `getRustCore` — the rust-core sub-worker spawn + boot probe.
 *
 * A bad `doenetWorkerUrl` does not make `new Worker` reject, and Comlink RPCs
 * against a worker that never came up hang forever; `getRustCore` guards
 * against both. `Worker` and `comlink` are stubbed so these paths can be
 * exercised without a real browser worker.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => {
    const releaseProxy = Symbol("comlink.releaseProxy");
    return {
        releaseProxy,
        state: {
            // Default: the boot probe never settles (a test drives the
            // outcome via the worker `error` event or a timeout instead).
            setFlags: (() =>
                new Promise<void>(() => {})) as () => Promise<void>,
            releaseProxyCalls: 0,
        },
    };
});

vi.mock("comlink", () => ({
    releaseProxy: hoisted.releaseProxy,
    wrap: () => ({
        setFlags: () => hoisted.state.setFlags(),
        [hoisted.releaseProxy]: () => {
            hoisted.state.releaseProxyCalls += 1;
        },
    }),
}));

import { getRustCore } from "../src/rust-core";

/** Minimal stand-in for a browser `Worker` that tests can drive. */
class FakeWorker {
    static instances: FakeWorker[] = [];
    static throwOnConstruct = false;

    terminated = false;
    private errorListeners: ((event: { message?: string }) => void)[] = [];

    constructor(public url: string | URL) {
        if (FakeWorker.throwOnConstruct) {
            throw new Error("invalid worker URL");
        }
        FakeWorker.instances.push(this);
    }

    addEventListener(type: string, listener: (event: any) => void) {
        if (type === "error") {
            this.errorListeners.push(listener);
        }
    }

    terminate() {
        this.terminated = true;
    }

    emitError(message: string) {
        for (const listener of this.errorListeners) {
            listener({ message });
        }
    }
}

describe("getRustCore", () => {
    beforeEach(() => {
        FakeWorker.instances = [];
        FakeWorker.throwOnConstruct = false;
        hoisted.state.setFlags = () => new Promise<void>(() => {});
        hoisted.state.releaseProxyCalls = 0;
        vi.stubGlobal("Worker", FakeWorker);
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("returns null when no worker URL is provided", async () => {
        expect(await getRustCore(undefined)).toBeNull();
        expect(FakeWorker.instances).toHaveLength(0);
    });

    it("returns null when the Worker constructor throws", async () => {
        FakeWorker.throwOnConstruct = true;
        expect(await getRustCore("blob:bad")).toBeNull();
    });

    it("returns the core once the boot probe resolves", async () => {
        hoisted.state.setFlags = () => Promise.resolve();

        const spawned = await getRustCore("blob:ok");
        expect(spawned).not.toBeNull();

        // `terminate` releases the Comlink proxy and the worker thread.
        spawned!.terminate();
        expect(FakeWorker.instances[0].terminated).toBe(true);
        expect(hoisted.state.releaseProxyCalls).toBe(1);
    });

    it("returns null and terminates the worker when the boot probe rejects", async () => {
        hoisted.state.setFlags = () => Promise.reject(new Error("rpc failed"));

        expect(await getRustCore("blob:bad")).toBeNull();
        expect(FakeWorker.instances[0].terminated).toBe(true);
    });

    it("returns null and terminates the worker on a worker error event", async () => {
        // The probe RPC never settles; only the worker `error` event does.
        const pending = getRustCore("blob:err");
        FakeWorker.instances[0].emitError("script load failed");

        expect(await pending).toBeNull();
        expect(FakeWorker.instances[0].terminated).toBe(true);
    });

    it("returns null and terminates the worker when the boot times out", async () => {
        vi.useFakeTimers();
        const pending = getRustCore("blob:hang");
        await vi.advanceTimersByTimeAsync(30_000);

        expect(await pending).toBeNull();
        expect(FakeWorker.instances[0].terminated).toBe(true);
    });
});

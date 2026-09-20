import { describe, expect, it, vi } from "vitest";

import { installFacadeRenderQueue } from "./facadeRenderQueue";

type Globals = {
    renderDoenetViewerToContainer?: (...args: unknown[]) => unknown;
    renderDoenetEditorToContainer?: (...args: unknown[]) => unknown;
};

describe("installFacadeRenderQueue", () => {
    it("installs marked stubs on empty globals", () => {
        const w: Globals = {};
        installFacadeRenderQueue(w);
        expect(typeof w.renderDoenetViewerToContainer).toBe("function");
        expect(typeof w.renderDoenetEditorToContainer).toBe("function");
        // The marker the iframe wrapper's readiness poll keys off.
        expect(
            (w.renderDoenetViewerToContainer as any).__doenetPendingRenderStub,
        ).toBe(true);
        expect(
            (w.renderDoenetEditorToContainer as any).__doenetPendingRenderStub,
        ).toBe(true);
    });

    it("queues viewer calls and replays them in order through the real function", () => {
        const w: Globals = {};
        const flush = installFacadeRenderQueue(w);
        const containerA = { id: "a" };
        const containerB = { id: "b" };
        w.renderDoenetViewerToContainer!(containerA, "<p>one</p>");
        w.renderDoenetViewerToContainer!(containerB, "<p>two</p>", {
            flags: {},
        });

        const real = vi.fn();
        w.renderDoenetViewerToContainer = real; // what the eager chunk does
        flush();

        expect(real.mock.calls).toEqual([
            [containerA, "<p>one</p>"],
            [containerB, "<p>two</p>", { flags: {} }],
        ]);
        // A second flush replays nothing (the queue drained).
        flush();
        expect(real).toHaveBeenCalledTimes(2);
    });

    it("returns an editor handle whose queued method calls replay on the real handle", () => {
        const w: Globals = {};
        const flush = installFacadeRenderQueue(w);
        const handle = w.renderDoenetEditorToContainer!({ id: "e" }) as {
            openDiagnosticsTab: (tab: string) => void;
            closeDiagnosticsPanel: () => void;
            updateRenderedView: () => void;
        };
        handle.openDiagnosticsTab("errors");
        handle.updateRenderedView();

        const realHandle = {
            openDiagnosticsTab: vi.fn(),
            closeDiagnosticsPanel: vi.fn(),
            updateRenderedView: vi.fn(),
        };
        const realRender = vi.fn(() => realHandle);
        w.renderDoenetEditorToContainer = realRender;
        flush();

        expect(realRender).toHaveBeenCalledWith({ id: "e" });
        expect(realHandle.openDiagnosticsTab).toHaveBeenCalledWith("errors");
        expect(realHandle.updateRenderedView).toHaveBeenCalledTimes(1);

        // After the flush, the handle handed out pre-flush forwards directly.
        handle.closeDiagnosticsPanel();
        expect(realHandle.closeDiagnosticsPanel).toHaveBeenCalledTimes(1);
    });

    it("leaves an already-installed function alone", () => {
        const existing = vi.fn();
        const w: Globals = { renderDoenetViewerToContainer: existing };
        const flush = installFacadeRenderQueue(w);
        expect(w.renderDoenetViewerToContainer).toBe(existing);
        w.renderDoenetViewerToContainer!("direct");
        expect(existing).toHaveBeenCalledWith("direct");
        // Flushing replays nothing through it either.
        flush();
        expect(existing).toHaveBeenCalledTimes(1);
    });

    it("does not re-enter its own stub if nothing replaced it by flush time", () => {
        const w: Globals = {};
        const flush = installFacadeRenderQueue(w);
        w.renderDoenetViewerToContainer!({ id: "a" });
        flush(); // global still holds the stub — must not recurse
        // The queued call is still waiting for a real function.
        const real = vi.fn();
        w.renderDoenetViewerToContainer = real;
        flush();
        expect(real).toHaveBeenCalledTimes(1);
    });

    it("replays the rest of the queue when one queued call throws, rethrowing asynchronously", () => {
        vi.useFakeTimers();
        try {
            const w: Globals = {};
            const flush = installFacadeRenderQueue(w);
            w.renderDoenetViewerToContainer!("bad");
            w.renderDoenetViewerToContainer!("good");
            const rendered: unknown[] = [];
            w.renderDoenetViewerToContainer = (...args: unknown[]) => {
                if (args[0] === "bad") {
                    throw new Error("no container");
                }
                rendered.push(args[0]);
            };
            // The flush itself must not throw (it runs inside the facade's
            // module evaluation), and the throwing call must not take the
            // queued calls after it down with it.
            expect(() => flush()).not.toThrow();
            expect(rendered).toEqual(["good"]);
            // The error still surfaces as an uncaught (async) error, as it
            // would have from the host's own onload handler.
            expect(() => vi.runAllTimers()).toThrow("no container");
        } finally {
            vi.useRealTimers();
        }
    });

    it("drains queued viewer calls in order through a foreign replacement's drain hook", () => {
        // The two-concurrent-copies hand-off: another copy's eager chunk
        // settles first, installFirstCopyGlobal replaces this copy's stub
        // and invokes the stub's drain hook with its own function.
        const w: Globals = {};
        const flush = installFacadeRenderQueue(w);
        const stub = w.renderDoenetViewerToContainer as any;
        expect(typeof stub.__doenetDrainQueuedRenderCalls).toBe("function");
        w.renderDoenetViewerToContainer!({ id: "a" }, "<p>one</p>");
        w.renderDoenetViewerToContainer!({ id: "b" }, "<p>two</p>");

        const foreign = vi.fn();
        w.renderDoenetViewerToContainer = foreign;
        stub.__doenetDrainQueuedRenderCalls(foreign);

        expect(foreign.mock.calls).toEqual([
            [{ id: "a" }, "<p>one</p>"],
            [{ id: "b" }, "<p>two</p>"],
        ]);
        // The owner's own flush then finds an empty queue: nothing
        // double-replays.
        flush();
        expect(foreign).toHaveBeenCalledTimes(2);
    });

    it("drains the editor queue through the hook, forwarding handle methods, and keeps a pre-captured stub handle working", () => {
        const w: Globals = {};
        const flush = installFacadeRenderQueue(w);
        const stub = w.renderDoenetEditorToContainer as any;
        const handle = w.renderDoenetEditorToContainer!({ id: "e" }) as {
            openDiagnosticsTab: (tab: string) => void;
            closeDiagnosticsPanel: () => void;
            updateRenderedView: () => void;
        };
        handle.openDiagnosticsTab("errors");
        handle.updateRenderedView();

        const realHandle = {
            openDiagnosticsTab: vi.fn(),
            closeDiagnosticsPanel: vi.fn(),
            updateRenderedView: vi.fn(),
        };
        const foreign = vi.fn(() => realHandle);
        w.renderDoenetEditorToContainer = foreign;
        stub.__doenetDrainQueuedRenderCalls(foreign);

        expect(foreign).toHaveBeenCalledWith({ id: "e" });
        expect(realHandle.openDiagnosticsTab).toHaveBeenCalledWith("errors");
        expect(realHandle.updateRenderedView).toHaveBeenCalledTimes(1);

        // The handle the stub handed out before the drain forwards directly
        // to the real handle afterwards.
        handle.closeDiagnosticsPanel();
        expect(realHandle.closeDiagnosticsPanel).toHaveBeenCalledTimes(1);

        // The owner's flush replays nothing after the cross-drain.
        flush();
        expect(foreign).toHaveBeenCalledTimes(1);
    });

    it("isolates drain-hook errors per call, rethrowing asynchronously", () => {
        vi.useFakeTimers();
        try {
            const w: Globals = {};
            installFacadeRenderQueue(w);
            const stub = w.renderDoenetViewerToContainer as any;
            w.renderDoenetViewerToContainer!("bad");
            w.renderDoenetViewerToContainer!("good");
            const rendered: unknown[] = [];
            const foreign = (...args: unknown[]) => {
                if (args[0] === "bad") {
                    throw new Error("no container");
                }
                rendered.push(args[0]);
            };
            w.renderDoenetViewerToContainer = foreign;
            expect(() =>
                stub.__doenetDrainQueuedRenderCalls(foreign),
            ).not.toThrow();
            expect(rendered).toEqual(["good"]);
            expect(() => vi.runAllTimers()).toThrow("no container");
        } finally {
            vi.useRealTimers();
        }
    });

    it("drains an empty queue to a no-op", () => {
        const w: Globals = {};
        installFacadeRenderQueue(w);
        const viewerStub = w.renderDoenetViewerToContainer as any;
        const editorStub = w.renderDoenetEditorToContainer as any;
        const foreign = vi.fn();
        expect(() =>
            viewerStub.__doenetDrainQueuedRenderCalls(foreign),
        ).not.toThrow();
        expect(() =>
            editorStub.__doenetDrainQueuedRenderCalls(foreign),
        ).not.toThrow();
        expect(foreign).not.toHaveBeenCalled();
    });

    it("pre-creates doenetGlobalConfig so onload-time writes have a target", () => {
        const w: Globals & { doenetGlobalConfig?: object } = {};
        installFacadeRenderQueue(w);
        expect(w.doenetGlobalConfig).toEqual({});
        // What a PreTeXt-style host does at onload; global-config.ts later
        // adopts this same object, so the write must land and persist.
        (w.doenetGlobalConfig as any).coreBootMaxAttempts = 1;
        expect((w.doenetGlobalConfig as any).coreBootMaxAttempts).toBe(1);
    });

    it("leaves an existing doenetGlobalConfig object alone", () => {
        const existing = { coreBootMaxAttempts: 3 };
        const w: Globals & { doenetGlobalConfig?: object } = {
            doenetGlobalConfig: existing,
        };
        installFacadeRenderQueue(w);
        expect(w.doenetGlobalConfig).toBe(existing);
    });

    it("round-trips through its own source, as the build injects it", () => {
        const install = (0, eval)(
            `(${installFacadeRenderQueue.toString()})`,
        ) as typeof installFacadeRenderQueue;
        const w: Globals = {};
        const flush = install(w);
        w.renderDoenetViewerToContainer!("queued-arg");
        const real = vi.fn();
        w.renderDoenetViewerToContainer = real;
        flush();
        expect(real).toHaveBeenCalledWith("queued-arg");
    });

    it("round-trips the drain hook through its own source too", () => {
        const install = (0, eval)(
            `(${installFacadeRenderQueue.toString()})`,
        ) as typeof installFacadeRenderQueue;
        const w: Globals = {};
        const flush = install(w);
        const stub = w.renderDoenetViewerToContainer as any;
        w.renderDoenetViewerToContainer!("queued-arg");
        const foreign = vi.fn();
        w.renderDoenetViewerToContainer = foreign;
        stub.__doenetDrainQueuedRenderCalls(foreign);
        expect(foreign).toHaveBeenCalledWith("queued-arg");
        flush();
        expect(foreign).toHaveBeenCalledTimes(1);
    });
});

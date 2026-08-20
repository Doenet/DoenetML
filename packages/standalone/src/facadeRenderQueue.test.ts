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
});

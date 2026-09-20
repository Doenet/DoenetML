import { describe, expect, it, vi } from "vitest";

import { installFacadeRenderQueue } from "./facadeRenderQueue";
import { installFirstCopyGlobal } from "./installFirstCopyGlobal";

describe("installFirstCopyGlobal", () => {
    it("installs onto an absent global", () => {
        const w: Record<string, unknown> = {};
        const real = vi.fn();
        expect(
            installFirstCopyGlobal(w, "renderDoenetViewerToContainer", real),
        ).toBe(true);
        expect(w.renderDoenetViewerToContainer).toBe(real);
    });

    it("installs over a non-function value", () => {
        const w: Record<string, unknown> = {
            getDoenetStylePalettes: "not a function",
        };
        const real = vi.fn();
        expect(installFirstCopyGlobal(w, "getDoenetStylePalettes", real)).toBe(
            true,
        );
        expect(w.getDoenetStylePalettes).toBe(real);
    });

    it("replaces a pending facade stub (the stub-flush hand-off)", () => {
        // The marker installFacadeRenderQueue puts on its queueing stubs;
        // replacing the stub is how the facade's flush finds the real
        // function to replay queued calls through.
        const stub = Object.assign(vi.fn(), {
            __doenetPendingRenderStub: true,
        });
        const w: Record<string, unknown> = {
            renderDoenetEditorToContainer: stub,
        };
        const real = vi.fn();
        expect(
            installFirstCopyGlobal(w, "renderDoenetEditorToContainer", real),
        ).toBe(true);
        expect(w.renderDoenetEditorToContainer).toBe(real);
    });

    it("leaves a real function (no stub marker) alone — first copy wins", () => {
        const firstCopy = vi.fn();
        const w: Record<string, unknown> = {
            renderDoenetViewerToContainer: firstCopy,
        };
        const secondCopy = vi.fn();
        expect(
            installFirstCopyGlobal(
                w,
                "renderDoenetViewerToContainer",
                secondCopy,
            ),
        ).toBe(false);
        expect(w.renderDoenetViewerToContainer).toBe(firstCopy);
    });

    it("invokes a replaced stub's drain hook with the new function, after installing it", () => {
        // The order matters: a queued call that re-reads the global during
        // its replay must see the real function, so the drain runs after the
        // assignment. Recorded by capturing what the global holds at drain
        // time.
        const seen: { drainedWith: unknown; globalAtDrain: unknown }[] = [];
        const w: Record<string, unknown> = {};
        const stub = Object.assign(vi.fn(), {
            __doenetPendingRenderStub: true,
            __doenetDrainQueuedRenderCalls: (real: unknown) => {
                seen.push({
                    drainedWith: real,
                    globalAtDrain: w.renderDoenetViewerToContainer,
                });
            },
        });
        w.renderDoenetViewerToContainer = stub;
        const real = vi.fn();
        expect(
            installFirstCopyGlobal(w, "renderDoenetViewerToContainer", real),
        ).toBe(true);
        expect(seen).toEqual([{ drainedWith: real, globalAtDrain: real }]);
    });

    it("replaces a stub carrying no drain hook without draining anything", () => {
        // A stub from a release that predates the drain hook: replaced all
        // the same, and its own facade's flush delivers its queue.
        const stub = Object.assign(vi.fn(), {
            __doenetPendingRenderStub: true,
            __doenetDrainQueuedRenderCalls: "not a function",
        });
        const w: Record<string, unknown> = {
            renderDoenetViewerToContainer: stub,
        };
        const real = vi.fn();
        expect(
            installFirstCopyGlobal(w, "renderDoenetViewerToContainer", real),
        ).toBe(true);
        expect(w.renderDoenetViewerToContainer).toBe(real);
        expect(real).not.toHaveBeenCalled();
    });

    it("does not drain a real function it leaves in place", () => {
        // First copy wins: a non-stub occupant is untouched, drain hook and
        // all.
        const drain = vi.fn();
        const firstCopy = Object.assign(vi.fn(), {
            __doenetDrainQueuedRenderCalls: drain,
        });
        const w: Record<string, unknown> = {
            renderDoenetViewerToContainer: firstCopy,
        };
        expect(
            installFirstCopyGlobal(w, "renderDoenetViewerToContainer", vi.fn()),
        ).toBe(false);
        expect(w.renderDoenetViewerToContainer).toBe(firstCopy);
        expect(drain).not.toHaveBeenCalled();
    });

    it("drains a real facade stub's queued calls through the replacement (the concurrent-copies hand-off)", () => {
        // End-to-end across the two modules, as it happens when two
        // code-split copies load concurrently and the second copy's eager
        // chunk settles first: copy 1's prologue installed the stubs and
        // queued a host's onload render call; copy 2's entry replaces the
        // stub and the queued call replays through copy 2's function, so a
        // failure of copy 1's own chunk cannot strand it. Copy 1's flush
        // then replays nothing.
        const w: Record<string, unknown> = {};
        const copy1Flush = installFacadeRenderQueue(
            w as Parameters<typeof installFacadeRenderQueue>[0],
        );
        (w.renderDoenetViewerToContainer as (...a: unknown[]) => unknown)(
            { id: "applet" },
            "<p>doc</p>",
        );

        const copy2Render = vi.fn();
        expect(
            installFirstCopyGlobal(
                w,
                "renderDoenetViewerToContainer",
                copy2Render,
            ),
        ).toBe(true);
        expect(copy2Render.mock.calls).toEqual([
            [{ id: "applet" }, "<p>doc</p>"],
        ]);

        copy1Flush();
        expect(copy2Render).toHaveBeenCalledTimes(1);
    });

    it("treats only an exact `true` marker as a pending stub", () => {
        // A function that happens to carry a truthy-but-not-true property of
        // the same name is not the facade's stub; first copy still wins.
        const notAStub = Object.assign(vi.fn(), {
            __doenetPendingRenderStub: "yes",
        });
        const w: Record<string, unknown> = {
            renderDoenetViewerToContainer: notAStub,
        };
        expect(
            installFirstCopyGlobal(w, "renderDoenetViewerToContainer", vi.fn()),
        ).toBe(false);
        expect(w.renderDoenetViewerToContainer).toBe(notAStub);
    });
});

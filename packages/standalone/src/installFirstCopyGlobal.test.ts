import { describe, expect, it, vi } from "vitest";

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

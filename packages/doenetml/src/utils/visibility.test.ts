import { describe, expect, it } from "vitest";
import { isEntryOnPage } from "./visibility";

function makeEntry({
    isIntersecting,
    width,
    height,
    clientRectCount,
}: {
    isIntersecting: boolean;
    width: number;
    height: number;
    clientRectCount: number;
}): IntersectionObserverEntry {
    return {
        isIntersecting,
        boundingClientRect: { width, height },
        target: {
            getClientRects: () => ({ length: clientRectCount }),
        },
    } as unknown as IntersectionObserverEntry;
}

describe("isEntryOnPage", () => {
    it("is true for an intersecting entry", () => {
        expect(
            isEntryOnPage(
                makeEntry({
                    isIntersecting: true,
                    width: 600,
                    height: 400,
                    clientRectCount: 1,
                }),
            ),
        ).toBe(true);
    });

    it("is false for a non-intersecting entry with area", () => {
        expect(
            isEntryOnPage(
                makeEntry({
                    isIntersecting: false,
                    width: 600,
                    height: 400,
                    clientRectCount: 1,
                }),
            ),
        ).toBe(false);
    });

    it("is true for a zero-height target that still generates layout boxes", () => {
        // Branded Chrome 149 can report a zero-height target inside an iframe
        // as non-intersecting even with a huge rootMargin. While hidden,
        // DocViewer renders nothing, so the observed wrapper is zero-height —
        // trusting the report would deadlock the viewer as permanently hidden.
        expect(
            isEntryOnPage(
                makeEntry({
                    isIntersecting: false,
                    width: 600,
                    height: 0,
                    clientRectCount: 1,
                }),
            ),
        ).toBe(true);
    });

    it("is true for a zero-width target that still generates layout boxes", () => {
        // Either dimension collapsing to zero yields the same zero-area report.
        expect(
            isEntryOnPage(
                makeEntry({
                    isIntersecting: false,
                    width: 0,
                    height: 400,
                    clientRectCount: 1,
                }),
            ),
        ).toBe(true);
    });

    it("is false for a display:none target (zero area, no layout boxes)", () => {
        expect(
            isEntryOnPage(
                makeEntry({
                    isIntersecting: false,
                    width: 0,
                    height: 0,
                    clientRectCount: 0,
                }),
            ),
        ).toBe(false);
    });
});

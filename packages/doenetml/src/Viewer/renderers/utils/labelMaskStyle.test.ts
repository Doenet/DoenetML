import { describe, expect, it, vi } from "vitest";
import {
    attachLabelHoverHighlight,
    computeLabelMaskCssStyle,
} from "./labelMaskStyle";

/** Pull the numeric `z-index: N` out of a mask css style string. */
function zIndexOf(cssStyle: string): number {
    const match = cssStyle.match(/z-index:\s*(\d+)/);
    expect(match, `z-index in "${cssStyle}"`).not.toBe(null);
    return Number(match![1]);
}

describe("computeLabelMaskCssStyle", () => {
    it("defaults the background to var(--canvas) so it is dark-mode aware", () => {
        const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
            layer: 0,
        });
        expect(cssStyle).toContain("background-color: var(--canvas)");
        expect(highlightCssStyle).toContain("background-color: var(--canvas)");
    });

    it("honors an explicit backgroundColor over the default", () => {
        const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
            layer: 0,
            backgroundColor: "rgb(1, 2, 3)",
        });
        expect(cssStyle).toContain("background-color: rgb(1, 2, 3)");
        expect(highlightCssStyle).toContain("background-color: rgb(1, 2, 3)");
        expect(cssStyle).not.toContain("var(--canvas)");
    });

    it("treats a falsy (empty-string) backgroundColor as unset", () => {
        const { cssStyle } = computeLabelMaskCssStyle({
            layer: 0,
            backgroundColor: "",
        });
        expect(cssStyle).toContain("background-color: var(--canvas)");
    });

    it("never produces a transparent background", () => {
        const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
            layer: 3,
        });
        expect(cssStyle).not.toContain("transparent");
        expect(highlightCssStyle).not.toContain("transparent");
    });

    it("raises the z-index and darkens the border on highlight", () => {
        const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
            layer: 0,
        });
        // Highlighted label sits above non-highlighted siblings.
        expect(zIndexOf(highlightCssStyle)).toBeGreaterThan(zIndexOf(cssStyle));
        // Border alpha increases from 0.3 (base) to 0.8 (highlight).
        expect(cssStyle).toContain("rgba(128, 128, 128, 0.3)");
        expect(highlightCssStyle).toContain("rgba(128, 128, 128, 0.8)");
    });

    it("orders z-index by layer within each of the base and highlight bands", () => {
        const low = computeLabelMaskCssStyle({ layer: 0 });
        const high = computeLabelMaskCssStyle({ layer: 5 });
        expect(zIndexOf(high.cssStyle)).toBeGreaterThan(zIndexOf(low.cssStyle));
        expect(zIndexOf(high.highlightCssStyle)).toBeGreaterThan(
            zIndexOf(low.highlightCssStyle),
        );
        // A highlighted label always outranks a non-highlighted one, even a
        // non-highlighted label on a higher layer.
        expect(zIndexOf(low.highlightCssStyle)).toBeGreaterThan(
            zIndexOf(high.cssStyle),
        );
    });
});

describe("attachLabelHoverHighlight", () => {
    function makeHarness() {
        const handlers: Record<string, () => void> = {};
        const label = {
            visProp: {} as Record<string, any>,
            needsUpdate: false,
            update: vi.fn(),
        };
        const hoverTargetJXG = {
            on: (event: string, fn: () => void) => {
                handlers[event] = fn;
            },
        };
        const board = { updateRenderer: vi.fn() };
        return { handlers, label, hoverTargetJXG, board };
    }

    it("applies the highlight style on over and the base style on out", () => {
        const { handlers, label, hoverTargetJXG, board } = makeHarness();
        const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
            layer: 0,
        });

        attachLabelHoverHighlight({
            hoverTargetJXG,
            getLabelJXG: () => label,
            cssStyle,
            highlightCssStyle,
            board,
        });

        handlers.over();
        expect(label.visProp.cssstyle).toBe(highlightCssStyle);
        expect(board.updateRenderer).toHaveBeenCalled();

        handlers.out();
        expect(label.visProp.cssstyle).toBe(cssStyle);
    });

    it("prefers the label's live highlightcssstyle so layer changes are reflected on hover", () => {
        const { handlers, label, hoverTargetJXG, board } = makeHarness();
        const stale = computeLabelMaskCssStyle({ layer: 0 });
        const fresh = computeLabelMaskCssStyle({ layer: 7 });

        attachLabelHoverHighlight({
            hoverTargetJXG,
            getLabelJXG: () => label,
            cssStyle: stale.cssStyle,
            highlightCssStyle: stale.highlightCssStyle,
            board,
        });

        // Simulate the update path (syncLabelMaskCssStyle) refreshing the
        // label's highlight style after a runtime layer change.
        label.visProp.highlightcssstyle = fresh.highlightCssStyle;

        handlers.over();
        expect(label.visProp.cssstyle).toBe(fresh.highlightCssStyle);
        expect(label.visProp.cssstyle).not.toBe(stale.highlightCssStyle);
    });

    it("does nothing when the label does not yet exist", () => {
        const { handlers, hoverTargetJXG, board } = makeHarness();
        const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
            layer: 0,
        });

        attachLabelHoverHighlight({
            hoverTargetJXG,
            getLabelJXG: () => null,
            cssStyle,
            highlightCssStyle,
            board,
        });

        expect(() => handlers.over()).not.toThrow();
        expect(board.updateRenderer).not.toHaveBeenCalled();
    });
});

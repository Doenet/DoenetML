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

    it("has no visible border in the base style; only the hover style is bordered", () => {
        const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
            layer: 0,
        });
        // Un-hovered labels show no border, so they look identical whether or
        // not masking is enabled (until they overlap something). The base
        // style explicitly resets `border`, since JSXGraph applies css
        // additively and would otherwise leave a prior hover border stuck.
        expect(cssStyle).toContain("border: none");
        expect(cssStyle).not.toContain("solid");
        // The hover style gains a visible border as a "draggable" cue...
        expect(highlightCssStyle).toContain("rgba(128, 128, 128, 0.8)");
        // ...and sits above non-hovered siblings.
        expect(zIndexOf(highlightCssStyle)).toBeGreaterThan(zIndexOf(cssStyle));
    });

    it("orders z-index by layer within each of the base and hover bands", () => {
        const low = computeLabelMaskCssStyle({ layer: 0 });
        const high = computeLabelMaskCssStyle({ layer: 5 });
        expect(zIndexOf(high.cssStyle)).toBeGreaterThan(zIndexOf(low.cssStyle));
        expect(zIndexOf(high.highlightCssStyle)).toBeGreaterThan(
            zIndexOf(low.highlightCssStyle),
        );
        // A hovered label always outranks a non-hovered one, even a
        // non-hovered label on a higher layer.
        expect(zIndexOf(low.highlightCssStyle)).toBeGreaterThan(
            zIndexOf(high.cssStyle),
        );
    });

    describe("when masking is disabled (maskLabel=false)", () => {
        it("uses a transparent background with no border or z-index", () => {
            const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
                layer: 2,
                masked: false,
            });
            expect(cssStyle).toContain("background-color: transparent");
            expect(cssStyle).not.toContain("border");
            expect(cssStyle).not.toContain("z-index");
            // Base and hover are identical, so hovering the labeled object
            // leaves the label unchanged.
            expect(highlightCssStyle).toBe(cssStyle);
        });

        it("still honors an explicit backgroundColor", () => {
            const { cssStyle } = computeLabelMaskCssStyle({
                layer: 0,
                backgroundColor: "rgb(4, 5, 6)",
                masked: false,
            });
            expect(cssStyle).toContain("background-color: rgb(4, 5, 6)");
            expect(cssStyle).not.toContain("transparent");
            expect(cssStyle).not.toContain("border");
        });
    });
});

describe("attachLabelHoverHighlight", () => {
    function makeHarness({
        isDraggable = true,
    }: { isDraggable?: boolean } = {}) {
        const objectHandlers: Record<string, () => void> = {};
        const labelHandlers: Record<string, () => void> = {};
        const label = {
            visProp: {} as Record<string, any>,
            needsUpdate: false,
            update: vi.fn(),
            on: (event: string, fn: () => void) => {
                labelHandlers[event] = fn;
            },
        };
        const hoverTargetJXG = {
            isDraggable,
            on: (event: string, fn: () => void) => {
                objectHandlers[event] = fn;
            },
        };
        const board = { updateRenderer: vi.fn() };
        return { objectHandlers, labelHandlers, label, hoverTargetJXG, board };
    }

    it("shows the highlight on over and restores the base on out", () => {
        const { objectHandlers, label, hoverTargetJXG, board } = makeHarness();
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

        objectHandlers.over();
        expect(label.visProp.cssstyle).toBe(highlightCssStyle);
        expect(label.visProp.labelMaskHovered).toBe(true);
        expect(board.updateRenderer).toHaveBeenCalled();

        objectHandlers.out();
        expect(label.visProp.cssstyle).toBe(cssStyle);
        expect(label.visProp.labelMaskHovered).toBe(false);
    });

    it("does not show a border when the object is not draggable", () => {
        const { objectHandlers, label, hoverTargetJXG, board } = makeHarness({
            isDraggable: false,
        });
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

        objectHandlers.over();
        expect(label.visProp.cssstyle).not.toBe(highlightCssStyle);
        expect(label.visProp.labelMaskHovered).toBe(false);
    });

    it("does not light the border when only the label (not the object) is hovered", () => {
        const { objectHandlers, labelHandlers, label, hoverTargetJXG, board } =
            makeHarness();
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

        // The helper wires only the object's over/out; hovering the label
        // itself is never observed and must not show the border.
        expect(labelHandlers.over).toBeUndefined();
        expect(label.visProp.cssstyle).not.toBe(highlightCssStyle);
    });

    it("prefers the label's live highlightcssstyle so layer changes are reflected on hover", () => {
        const { objectHandlers, label, hoverTargetJXG, board } = makeHarness();
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

        objectHandlers.over();
        expect(label.visProp.cssstyle).toBe(fresh.highlightCssStyle);
        expect(label.visProp.cssstyle).not.toBe(stale.highlightCssStyle);
    });

    it("does nothing when the label does not yet exist", () => {
        const { objectHandlers, hoverTargetJXG, board } = makeHarness();
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

        expect(() => objectHandlers.over()).not.toThrow();
        expect(board.updateRenderer).not.toHaveBeenCalled();
    });
});

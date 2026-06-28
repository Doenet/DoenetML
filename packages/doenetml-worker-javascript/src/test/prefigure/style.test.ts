import { describe, expect, it } from "vitest";
import { styleAttributes } from "../../utils/prefigure/style";

describe("PreFigure style attributes", () => {
    it("uses hatch pattern urls for hex fill colors and omits fill-opacity", () => {
        const attrs = styleAttributes({
            selectedStyle: {
                fillColor: "#abcd",
                fillStyle: "diagonal",
                fillOpacity: 0.3,
            },
            diagnostics: [],
            warningPrefix: "test",
        });

        expect(attrs).toContain('fill="url(#doenet-hatch-diagonal-abcd)"');
        expect(attrs).not.toContain('fill-opacity="0.3"');
    });

    it("preserves 8-digit hex colors in hatch pattern ids", () => {
        const attrs = styleAttributes({
            selectedStyle: {
                fillColor: "#11223344",
                fillStyle: "crosshatch",
            },
            diagnostics: [],
            warningPrefix: "test",
        });

        expect(attrs).toContain(
            'fill="url(#doenet-hatch-crosshatch-11223344)"',
        );
    });

    it("falls back to plain fills when the color is not hex", () => {
        const attrs = styleAttributes({
            selectedStyle: {
                fillColorWord: "blue",
                fillStyle: "horizontal",
                fillOpacity: 0.3,
            },
            diagnostics: [],
            warningPrefix: "test",
        });

        expect(attrs).toContain('fill="blue"');
        expect(attrs).toContain('fill-opacity="0.3"');
    });
});

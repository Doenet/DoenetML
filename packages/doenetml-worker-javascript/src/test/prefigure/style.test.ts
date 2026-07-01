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

        expect(attrs).toContain(
            'fill="url(#doenet-hatch-diagonal-2361626364)"',
        );
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
            'fill="url(#doenet-hatch-crosshatch-233131323233333434)"',
        );
    });

    it("uses hatch pattern urls for named fill colors too", () => {
        const attrs = styleAttributes({
            selectedStyle: {
                fillColorWord: "blue",
                fillStyle: "horizontal",
                fillOpacity: 0.3,
            },
            diagnostics: [],
            warningPrefix: "test",
        });

        expect(attrs).toContain(
            'fill="url(#doenet-hatch-horizontal-626c7565)"',
        );
        expect(attrs).not.toContain('fill-opacity="0.3"');
    });
});

import { describe, expect, it } from "vitest";
import { styleAttributes } from "../../utils/prefigure/style";
import type { DiagnosticRecord } from "@doenet/utils";

describe("PreFigure style attributes", () => {
    it.each([
        ["horizontal", "horizontal"],
        ["vertical", "vertical"],
        ["diagonal", "diagonal"],
        ["backdiagonal", "backdiagonal"],
        ["dots", "dot"],
        ["diamonds", "diamond"],
    ])(
        "emits fill-pattern for supported fillStyle value %s",
        (fillStyle, expectedPattern) => {
            const diagnostics: DiagnosticRecord[] = [];
            const attrs = styleAttributes({
                selectedStyle: {
                    fillColor: "#abcd",
                    fillStyle,
                    lineOpacity: 0.7,
                    fillOpacity: 0.3,
                    fillPatternOpacity: 0.8,
                },
                diagnostics,
                warningPrefix: "test",
            });

            expect(attrs).toContain(`fill-pattern="${expectedPattern}"`);
            expect(attrs).toContain('fill="#abcd"');
            expect(attrs).toContain('stroke-opacity="0.7"');
            expect(attrs).toContain('fill-opacity="0.8"');
            expect(attrs).not.toContain('fill-opacity="0.3"');
            expect(attrs.join(" ")).not.toContain("url(#");
            expect(diagnostics).toHaveLength(0);
        },
    );

    it("warns and falls back to solid fill for unsupported fillStyle value", () => {
        const diagnostics: DiagnosticRecord[] = [];
        const attrs = styleAttributes({
            selectedStyle: {
                fillColor: "#abcd",
                fillStyle: "crosshatch",
                fillOpacity: 0.3,
            },
            diagnostics,
            warningPrefix: "test",
        });

        expect(attrs).toContain('fill="#abcd"');
        expect(attrs).toContain('fill-opacity="0.3"');
        expect(attrs.join(" ")).not.toContain("fill-pattern");
        expect(diagnostics).toHaveLength(1);
        expect(diagnostics[0].type).toBe("warning");
        expect(diagnostics[0].message).toContain(
            `fill style 'crosshatch' is unsupported by PreFigure; falling back to a solid fill.`,
        );
    });

    it("keeps solid fills warning-free", () => {
        const diagnostics: DiagnosticRecord[] = [];
        const attrs = styleAttributes({
            selectedStyle: {
                fillColorWord: "blue",
                fillStyle: "solid",
                lineOpacity: 0.7,
                fillOpacity: 0.3,
                fillPatternOpacity: 0.8,
            },
            diagnostics,
            warningPrefix: "test",
        });

        expect(attrs).toContain('fill="blue"');
        expect(attrs).toContain('stroke-opacity="0.7"');
        expect(attrs).toContain('fill-opacity="0.3"');
        expect(attrs).not.toContain('fill-pattern="solid"');
        expect(attrs).not.toContain('fill-opacity="0.8"');
        expect(diagnostics).toHaveLength(0);
    });
});

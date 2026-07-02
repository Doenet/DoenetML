import { describe, expect, it } from "vitest";
import { styleAttributes } from "../../utils/prefigure/style";
import type { DiagnosticRecord } from "@doenet/utils";

describe("PreFigure style attributes", () => {
    it.each(["dots", "diagonal"])(
        "falls back to solid fills for non-solid fillStyle value %s",
        (fillStyle) => {
            const diagnostics: DiagnosticRecord[] = [];
            const attrs = styleAttributes({
                selectedStyle: {
                    fillColor: "#abcd",
                    fillStyle,
                    fillOpacity: 0.3,
                    fillPatternOpacity: 0.8,
                },
                diagnostics,
                warningPrefix: "test",
            });

            expect(attrs).toContain('fill="#abcd"');
            expect(attrs).toContain('fill-opacity="0.3"');
            expect(attrs.join(" ")).not.toContain("url(#");
            expect(diagnostics).toHaveLength(1);
            expect(diagnostics[0].type).toBe("warning");
            expect(diagnostics[0].message).toContain(
                `fill style '${fillStyle}' is unsupported by PreFigure; falling back to a solid fill.`,
            );
        },
    );

    it("keeps solid fills warning-free", () => {
        const diagnostics: DiagnosticRecord[] = [];
        const attrs = styleAttributes({
            selectedStyle: {
                fillColorWord: "blue",
                fillStyle: "solid",
                fillOpacity: 0.3,
            },
            diagnostics,
            warningPrefix: "test",
        });

        expect(attrs).toContain('fill="blue"');
        expect(attrs).toContain('fill-opacity="0.3"');
        expect(diagnostics).toHaveLength(0);
    });
});

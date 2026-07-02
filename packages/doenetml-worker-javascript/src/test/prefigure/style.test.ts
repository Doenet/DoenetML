import { describe, expect, it } from "vitest";
import { styleAttributes } from "../../utils/prefigure/style";
import type { DiagnosticRecord } from "@doenet/utils";

describe("PreFigure style attributes", () => {
    it.each([
        ["dots", "dots"],
        ["diagonal", "diagonal"],
        ["crosshatch", "dots"],
        ["diagonalcrosshatch", "diamonds"],
    ])(
        "preserves patterned fillStyle value %s as pattern %s",
        (fillStyle, expectedPattern) => {
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
            const joinedAttrs = attrs.join(" ");

            expect(joinedAttrs).toContain(
                `fill="url(#doenet-hatch-${expectedPattern}-2361626364)"`,
            );
            expect(attrs).toContain('fill-opacity="0.8"');
            expect(diagnostics).toHaveLength(0);
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

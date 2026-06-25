import { describe, expect, it } from "vitest";
import {
    contrastAccessibilityDiagnosticsForStyleDefinitions,
    normalizeStyleDefinitionsValues,
    type RawStyleDefinitions,
} from "../src/style";

const POS = { start: { line: 1, column: 1, offset: 0 } };

function diagnose(defs: RawStyleDefinitions) {
    return contrastAccessibilityDiagnosticsForStyleDefinitions(
        normalizeStyleDefinitionsValues(defs),
    );
}

describe("contrast diagnostics — light mode (regression)", () => {
    it("flags low-contrast light-mode text", () => {
        const diags = diagnose({
            1: { textColor: { style: "#ff9900", position: POS } },
        });
        expect(diags.length).toBe(1);
        expect(diags[0].message).toMatch(/insufficient contrast/);
        expect(diags[0].message).not.toMatch(/dark mode/);
    });

    it("does not flag good-contrast light-mode text", () => {
        const diags = diagnose({
            1: { textColor: { style: "#111111", position: POS } },
        });
        expect(diags.length).toBe(0);
    });
});

describe("contrast diagnostics — dark mode", () => {
    it("flags an author-supplied dark-mode text color that fails on the dark canvas", () => {
        // Near-black dark-mode text is unreadable on #121212.
        const diags = diagnose({
            1: {
                textColor: { style: "#111111", position: POS },
                textColorDarkMode: { style: "#111111", position: POS },
            },
        });
        const darkDiags = diags.filter((d) =>
            d.message.includes("(dark mode)"),
        );
        expect(darkDiags.length).toBe(1);
        expect(darkDiags[0].message).toMatch(/text color.*dark mode/);
    });

    it("does not flag an accessible author-supplied dark-mode text color", () => {
        const diags = diagnose({
            1: {
                textColor: { style: "#111111", position: POS },
                textColorDarkMode: { style: "#eeeeee", position: POS },
            },
        });
        expect(
            diags.filter((d) => d.message.includes("(dark mode)")).length,
        ).toBe(0);
    });

    it("flags an author-supplied dark-mode line color that fails", () => {
        const diags = diagnose({
            1: {
                lineColor: { style: "#648FFF", position: POS },
                lineColorDarkMode: { style: "#101010", position: POS },
                lineOpacity: { style: 0.7, position: POS },
            },
        });
        const darkDiags = diags.filter((d) =>
            d.message.includes("(dark mode)"),
        );
        expect(darkDiags.length).toBe(1);
        expect(darkDiags[0].message).toMatch(/line color.*dark mode/);
    });

    it("does not flag a bright dark-mode line color", () => {
        const diags = diagnose({
            1: {
                lineColor: { style: "#648FFF", position: POS },
                lineColorDarkMode: { style: "#648FFF", position: POS },
                lineOpacity: { style: 0.7, position: POS },
            },
        });
        expect(
            diags.filter((d) => d.message.includes("(dark mode)")).length,
        ).toBe(0);
    });
});

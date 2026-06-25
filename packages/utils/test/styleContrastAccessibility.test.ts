import { describe, expect, it } from "vitest";
import {
    contrastAccessibilityDiagnosticsForStyleDefinitions,
    normalizeStyleDefinitionsValues,
    normalizeStyleDefinitionValues,
    addMissingChildStyleColorFields,
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

describe("derived dark-mode combination diagnostics", () => {
    function deriveAndDiagnose(def: RawStyleDefinitions[string]) {
        const styleDef = normalizeStyleDefinitionValues(def);
        addMissingChildStyleColorFields(styleDef);
        return contrastAccessibilityDiagnosticsForStyleDefinitions({
            1: styleDef,
        });
    }

    it("flags an accessible light pair that derives to an inaccessible dark pair, and suggests a fix under the squiggled attribute", () => {
        // navy text on silver is accessible in light mode (~7.6:1), but the
        // independent lightness inversion (#8080ff on #404040) drops below AA.
        const diags = deriveAndDiagnose({
            textColor: { style: "#000080", position: POS },
            backgroundColor: { style: "#c0c0c0", position: POS },
        });
        const derived = diags.filter((d) =>
            d.message.includes("derived dark-mode"),
        );
        expect(derived.length).toBe(1);
        expect(derived[0].message).toMatch(/insufficient contrast/);

        // The two colors share a position, so the squiggle resolves to
        // backgroundColor and the fix targets backgroundColorDarkMode.
        const match = derived[0].message.match(
            /for example (\w+)="(#[0-9a-fA-F]+)"/,
        );
        expect(match).not.toBeNull();
        const [, attribute, suggestedColor] = match!;
        expect(attribute).toBe("backgroundColorDarkMode");

        // The suggested value must actually clear AA: pinning it should silence
        // the derived-combination diagnostic.
        const fixed = deriveAndDiagnose({
            textColor: { style: "#000080", position: POS },
            backgroundColor: { style: "#c0c0c0", position: POS },
            backgroundColorDarkMode: { style: suggestedColor, position: POS },
        });
        expect(
            fixed.filter((d) => d.message.includes("derived dark-mode")).length,
        ).toBe(0);
    });

    it("targets textColorDarkMode when the squiggle is under textColor", () => {
        const earlier = { start: { line: 1, column: 1, offset: 0 } };
        const later = { start: { line: 2, column: 1, offset: 40 } };
        const diags = deriveAndDiagnose({
            backgroundColor: { style: "#c0c0c0", position: earlier },
            textColor: { style: "#000080", position: later },
        });
        const derived = diags.filter((d) =>
            d.message.includes("derived dark-mode"),
        );
        expect(derived.length).toBe(1);
        expect(derived[0].message).toMatch(/for example textColorDarkMode="#/);
    });

    it("does not flag a derived dark pair that stays accessible", () => {
        const diags = deriveAndDiagnose({
            textColor: { style: "black", position: POS },
            backgroundColor: { style: "white", position: POS },
        });
        expect(
            diags.filter((d) => d.message.includes("derived dark-mode")).length,
        ).toBe(0);
    });

    it("does not flag an intentionally low-contrast light pair", () => {
        const diags = deriveAndDiagnose({
            textColor: { style: "#888888", position: POS },
            backgroundColor: { style: "#999999", position: POS },
        });
        expect(
            diags.filter((d) => d.message.includes("derived dark-mode")).length,
        ).toBe(0);
    });
});

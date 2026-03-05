import { describe, expect, it } from "vitest";
import { colorValueToWord, resolveColorWord } from "../src/style/colorWords";

describe("color words", () => {
    it("maps standard hex values for canonical colors to canonical names", () => {
        const standardHexByCanonicalName: Record<string, string> = {
            black: "#000000",
            white: "#ffffff",
            gray: "#808080",
            red: "#ff0000",
            orange: "#ffa500",
            yellow: "#ffff00",
            green: "#008000",
            cyan: "#00ffff",
            blue: "#0000ff",
            purple: "#800080",
            pink: "#ffc0cb",
            brown: "#a52a2a",
        };

        for (const [canonicalName, standardHex] of Object.entries(
            standardHexByCanonicalName,
        )) {
            expect(colorValueToWord(standardHex)).eq(canonicalName);
        }
    });

    it("maps light and dark variant hex values to base canonical names", () => {
        const variantHexByCanonicalName: Record<string, string[]> = {
            red: ["#f08080", "#8b0000"],
            orange: ["#ffa07a", "#ff8c00"],
            yellow: ["#ffffe0", "#bdb76b"],
            green: ["#90ee90", "#006400"],
            cyan: ["#e0ffff", "#008b8b"],
            blue: ["#add8e6", "#00008b"],
            purple: ["#dda0dd", "#8b008b"],
            pink: ["#ffb6c1", "#ff1493"],
            brown: ["#deb887", "#8b4513"],
            gray: ["#d3d3d3", "#696969"],
        };

        for (const [canonicalName, variantHexes] of Object.entries(
            variantHexByCanonicalName,
        )) {
            for (const variantHex of variantHexes) {
                expect(colorValueToWord(variantHex)).eq(canonicalName);
            }
        }
    });

    it("maps project custom palette hex values to base canonical names", () => {
        const customHexByCanonicalName: Record<string, string> = {
            gray: "#757575",
            red: "#D4042D",
            orange: "#F19143",
            green: "#2ca02c",
            blue: "#648FFF",
            purple: "#644CD6",
        };

        for (const [canonicalName, customHex] of Object.entries(
            customHexByCanonicalName,
        )) {
            expect(colorValueToWord(customHex)).eq(canonicalName);
        }
    });

    it("maps missing HTML 4.01 colors to closest canonical names", () => {
        const html4MissingHexByCanonicalName: Record<string, string[]> = {
            gray: ["#c0c0c0"],
            red: ["#800000"],
            green: ["#00ff00", "#808000", "#008080"],
            cyan: ["#00ffff"],
            blue: ["#000080"],
            purple: ["#ff00ff"],
        };

        for (const [canonicalName, htmlHexes] of Object.entries(
            html4MissingHexByCanonicalName,
        )) {
            for (const htmlHex of htmlHexes) {
                expect(colorValueToWord(htmlHex)).eq(canonicalName);
            }
        }
    });

    it("maps hotpink to pink", () => {
        expect(colorValueToWord("#ff69b4")).eq("pink");
    });

    it("maps yellowgreen to green", () => {
        expect(colorValueToWord("#9acd32")).eq("green");
    });

    it("preserves valid css named colors", () => {
        expect(colorValueToWord("LightGoldenRodYellow")).eq(
            "LightGoldenRodYellow",
        );
        expect(colorValueToWord("rebeccapurple")).eq("rebeccapurple");
        expect(colorValueToWord("transparent")).eq("transparent");
    });

    it("maps non-named values to nearest canonical word", () => {
        expect(colorValueToWord("#648FFF")).eq("blue");
        expect(colorValueToWord("rgb(0,0,255)")).eq("blue");
        expect(colorValueToWord("#800080")).eq("purple");
        expect(colorValueToWord("rgb(128,0,128)")).eq("purple");
        expect(colorValueToWord("rgb(212,4,45)")).eq("red");
        expect(colorValueToWord("rgb(200,200,200)")).eq("gray");
    });

    it("provides localization hook metadata", () => {
        const resolved = resolveColorWord("#648FFF", {
            translate: (key, englishWord) =>
                key === "color.blue" ? "azul" : englishWord,
        });

        expect(resolved.source).eq("nearest-palette");
        expect(resolved.key).eq("color.blue");
        expect(resolved.englishWord).eq("blue");
        expect(resolved.localizedWord).eq("azul");
    });

    it("falls back gracefully for invalid colors", () => {
        expect(colorValueToWord("not-a-valid-color")).eq("not-a-valid-color");
        expect(
            colorValueToWord("not-a-valid-color", { invalidFallback: "empty" }),
        ).eq("");
    });
});

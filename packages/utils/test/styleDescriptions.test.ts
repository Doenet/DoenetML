import { describe, expect, it } from "vitest";

import {
    createTranslator,
    createTranslatorFromLocaleData,
    type Translator,
} from "@doenet/i18n";
import {
    describeBorder,
    describeClosedShape,
    describeColor,
    describeFill,
    describeMarker,
    describeRegion,
    describeStrokedShape,
    describeText,
    noBackgroundWord,
    type NounSpec,
} from "../src/style/styleDescriptions";

/**
 * The English these descriptions produce is load-bearing: some sixty worker
 * test files assert it verbatim, and authors interpolate it into their prose.
 * The tables below are golden files — a diff here is a change to published
 * content, not an implementation detail.
 *
 * Note that `@doenet/i18n` resolves to its *build* output here, as every
 * cross-package import in this repo does. After editing a catalog, run
 * `npm run build -w @doenet/i18n` or these tests will still see the old words.
 */
const en: Translator = createTranslator([], {});

/** Spanish comes from the bundled catalog, exactly as the worker gets it. */
const es: Translator = createTranslatorFromLocaleData(
    { locale: "es", resources: {} },
    "es",
);

const line: NounSpec = { key: "line" };
const circle: NounSpec = { key: "circle" };

describe("stroked shapes", () => {
    const cases: [string, Record<string, string>, string, string][] = [
        [
            "width, dash pattern and color",
            {
                lineWidthWord: "thick",
                lineStyleWord: "dashed",
                colorWord: "blue",
            },
            "thick dashed blue",
            "thick dashed blue line",
        ],
        [
            "no dash pattern",
            { lineWidthWord: "thick", lineStyleWord: "", colorWord: "red" },
            "thick red",
            "thick red line",
        ],
        [
            "no width",
            { lineWidthWord: "", lineStyleWord: "dotted", colorWord: "green" },
            "dotted green",
            "dotted green line",
        ],
        [
            "color alone",
            { lineWidthWord: "", lineStyleWord: "", colorWord: "purple" },
            "purple",
            "purple line",
        ],
        [
            "an authored word passes through",
            { lineWidthWord: "", lineStyleWord: "", colorWord: "chartreuse" },
            "chartreuse",
            "chartreuse line",
        ],
    ];

    for (const [name, words, description, withNoun] of cases) {
        it(name, () => {
            expect(
                describeStrokedShape(en, words, {
                    noun: line,
                    withNoun: false,
                }),
            ).toBe(description);
            expect(
                describeStrokedShape(en, words, { noun: line, withNoun: true }),
            ).toBe(withNoun);
        });
    }

    it("describes nothing when the style names nothing", () => {
        const nothing = { lineWidthWord: "", lineStyleWord: "", colorWord: "" };
        expect(
            describeStrokedShape(en, nothing, {
                noun: line,
                withNoun: false,
            }),
        ).toBe("");
        // The noun alone, with no space where the adjectives would have been.
        expect(
            describeStrokedShape(en, nothing, { noun: line, withNoun: true }),
        ).toBe("line");
    });
});

describe("closed shapes", () => {
    const blueOutline = {
        lineWidthWord: "thick",
        lineStyleWord: "",
        colorWord: "blue",
    };

    it("describes an unfilled shape by its border", () => {
        expect(
            describeClosedShape(en, blueOutline, {
                filled: false,
                noun: circle,
                withNoun: false,
            }),
        ).toBe("thick blue");
        expect(
            describeClosedShape(en, blueOutline, {
                filled: false,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("thick blue circle");
    });

    it("omits the border clause when the border repeats the fill", () => {
        const words = {
            ...blueOutline,
            lineWidthWord: "",
            fillColorWord: "blue",
            fillStyleWord: "",
        };
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("filled blue circle");
    });

    it("names a border that only differs in width", () => {
        const words = {
            ...blueOutline,
            fillColorWord: "blue",
            fillStyleWord: "",
        };
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: false,
            }),
        ).toBe("filled blue with thick border");
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("filled blue circle with a thick border");
    });

    it("names a border of a different color", () => {
        const words = {
            ...blueOutline,
            colorWord: "red",
            fillColorWord: "blue",
            fillStyleWord: "",
        };
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: false,
            }),
        ).toBe("filled blue with thick red border");
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("filled blue circle with a thick red border");
    });

    it("switches the connective once a fill pattern is mentioned", () => {
        const words = {
            ...blueOutline,
            colorWord: "red",
            fillColorWord: "blue",
            fillStyleWord: "diamonds",
        };
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: false,
            }),
        ).toBe("filled blue with diamonds and thick red border");
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("filled blue circle with diamonds and a thick red border");
    });

    it("names a shape by its side count", () => {
        const regularPolygon: NounSpec = {
            key: "regular-polygon",
            numSides: 5,
        };
        expect(
            describeClosedShape(
                en,
                { ...blueOutline, fillColorWord: "blue", fillStyleWord: "" },
                { filled: false, noun: regularPolygon, withNoun: true },
            ),
        ).toBe("thick blue 5-sided regular polygon");
        expect(
            describeClosedShape(
                en,
                { ...blueOutline, fillColorWord: "red", fillStyleWord: "dots" },
                { filled: true, noun: regularPolygon, withNoun: true },
            ),
        ).toBe(
            "filled red 5-sided regular polygon with dots and a thick blue border",
        );
    });

    it("formats a large side count by the locale's number rules", () => {
        // The side count is handed over as a real number, so Fluent formats it
        // with `Intl` — the package's number-formatting policy. It is the one
        // place a description is not character-for-character what the
        // pre-catalog concatenation produced, which said "1000-sided".
        const bigPolygon: NounSpec = {
            key: "regular-polygon",
            numSides: 1000,
        };
        expect(
            describeStrokedShape(
                en,
                { colorWord: "red" },
                { noun: bigPolygon, withNoun: true },
            ),
        ).toBe("red 1,000-sided regular polygon");
    });
});

describe("the other descriptions", () => {
    it("describes a border on its own", () => {
        expect(
            describeBorder(en, {
                lineWidthWord: "thin",
                lineStyleWord: "dotted",
                colorWord: "brown",
            }),
        ).toBe("thin dotted brown");
    });

    it("describes a fill on its own", () => {
        expect(
            describeFill(
                en,
                { fillColorWord: "pink", fillStyleWord: "" },
                { filled: true },
            ),
        ).toBe("pink");
        expect(
            describeFill(
                en,
                { fillColorWord: "pink", fillStyleWord: "vertical lines" },
                { filled: true },
            ),
        ).toBe("pink vertical lines");
        expect(
            describeFill(en, { fillColorWord: "pink" }, { filled: false }),
        ).toBe("unfilled");
    });

    it("describes a point by its marker shape", () => {
        const words = { markerColorWord: "orange", markerStyleWord: "square" };
        expect(describeMarker(en, words, { withNoun: false })).toBe("orange");
        expect(describeMarker(en, words, { withNoun: true })).toBe(
            "orange square",
        );
    });

    it("describes a region by its fill color", () => {
        const noun: NounSpec = { key: "region" };
        expect(
            describeRegion(
                en,
                { fillColorWord: "cyan" },
                {
                    noun,
                    withNoun: false,
                },
            ),
        ).toBe("cyan");
        expect(
            describeRegion(
                en,
                { fillColorWord: "cyan" },
                {
                    noun,
                    withNoun: true,
                },
            ),
        ).toBe("cyan region");
    });

    it("describes text with and without a background", () => {
        expect(describeText(en, { color: "black" })).toBe("black");
        expect(describeText(en, { color: "black", background: "yellow" })).toBe(
            "black with a yellow background",
        );
        expect(noBackgroundWord(en)).toBe("none");
        expect(describeColor(en, "gray", "text")).toBe("gray");
    });
});

describe("Spanish", () => {
    it("puts the noun first and agrees with its gender", () => {
        const words = {
            lineWidthWord: "thick",
            lineStyleWord: "dashed",
            colorWord: "red",
        };
        expect(
            describeStrokedShape(es, words, { noun: line, withNoun: true }),
        ).toBe("línea discontinua gruesa roja");
        expect(
            describeStrokedShape(es, words, {
                noun: { key: "vector" },
                withNoun: true,
            }),
        ).toBe("vector discontinuo grueso rojo");
    });

    it("agrees even when the noun itself is not said", () => {
        const words = {
            lineWidthWord: "thin",
            lineStyleWord: "",
            colorWord: "white",
        };
        expect(
            describeStrokedShape(es, words, { noun: line, withNoun: false }),
        ).toBe("delgada blanca");
        expect(
            describeStrokedShape(es, words, {
                noun: { key: "point" },
                withNoun: false,
            }),
        ).toBe("delgado blanco");
    });

    it("agrees a border with the word for border, not with the shape", () => {
        expect(
            describeClosedShape(
                es,
                {
                    lineWidthWord: "thick",
                    lineStyleWord: "",
                    colorWord: "red",
                    fillColorWord: "blue",
                    fillStyleWord: "",
                },
                { filled: true, noun: { key: "region" }, withNoun: true },
            ),
        ).toBe("región azul rellena con un borde grueso rojo");
    });

    it("names a regular polygon by its side count", () => {
        // The noun splits: the adjectives stay beside "polígono regular", and
        // "de 7 lados" closes the phrase behind them. Filled, the complement
        // moves back up against the noun instead — "relleno de 7 lados" would
        // read as *what the shape is filled with*.
        const regularPolygon: NounSpec = {
            key: "regular-polygon",
            numSides: 7,
        };
        expect(
            describeClosedShape(
                es,
                { lineWidthWord: "thick", lineStyleWord: "", colorWord: "red" },
                { filled: false, noun: regularPolygon, withNoun: true },
            ),
        ).toBe("polígono regular grueso rojo de 7 lados");
        expect(
            describeClosedShape(
                es,
                {
                    lineWidthWord: "",
                    lineStyleWord: "",
                    colorWord: "red",
                    fillColorWord: "blue",
                    fillStyleWord: "dots",
                },
                { filled: true, noun: regularPolygon, withNoun: true },
            ),
        ).toBe(
            "polígono regular de 7 lados azul relleno con puntos y un borde rojo",
        );
        // Without the noun there is nothing to split around.
        expect(
            describeClosedShape(
                es,
                { lineWidthWord: "", lineStyleWord: "", colorWord: "green" },
                { filled: false, noun: regularPolygon, withNoun: false },
            ),
        ).toBe("verde");
    });

    it("translates the remaining descriptions", () => {
        expect(
            describeMarker(
                es,
                { markerColorWord: "black", markerStyleWord: "triangle" },
                { withNoun: true },
            ),
        ).toBe("triángulo negro");
        expect(
            describeFill(es, { fillColorWord: "yellow" }, { filled: false }),
        ).toBe("sin relleno");
        expect(
            describeFill(
                es,
                { fillColorWord: "yellow", fillStyleWord: "dots" },
                { filled: true },
            ),
        ).toBe("puntos de color amarillo");
        expect(noBackgroundWord(es)).toBe("ninguno");
        expect(
            describeText(es, {
                color: describeColor(es, "black", "text"),
                background: describeColor(es, "white", "background"),
            }),
        ).toBe("negro con un fondo blanco");
    });

    it("leaves an authored word alone", () => {
        expect(
            describeStrokedShape(
                es,
                {
                    lineWidthWord: "",
                    lineStyleWord: "",
                    colorWord: "rebeccapurple",
                },
                { noun: line, withNoun: true },
            ),
        ).toBe("línea rebeccapurple");
    });
});

describe("a partly translated locale", () => {
    // A translation is allowed to lag: every key it does not define falls
    // through to English. The split noun is the case where that matters, since
    // English never selects the `-tail` variants for itself — it keeps them so
    // that a locale which translates `noun-regular-polygon` but not the
    // messages composing it still gets its complement placed rather than
    // dropped.
    // Fluent is whitespace-sensitive, so the source starts at column zero.
    const de = createTranslator(["de"], {
        de: `
noun-regular-polygon =
    { $part ->
        [tail] mit { $numSides } Seiten
       *[head] regelmäßiges Vieleck
    }
`,
    });

    const polygon: NounSpec = { key: "regular-polygon", numSides: 5 };

    it("keeps the noun's complement in the unfilled description", () => {
        expect(
            describeStrokedShape(
                de,
                { lineWidthWord: "thick", colorWord: "red" },
                { noun: polygon, withNoun: true },
            ),
        ).toBe("thick red regelmäßiges Vieleck mit 5 Seiten");
    });

    it("keeps it in the filled description too", () => {
        expect(
            describeClosedShape(
                de,
                {
                    colorWord: "red",
                    fillColorWord: "blue",
                    fillStyleWord: "dots",
                },
                { filled: true, noun: polygon, withNoun: true },
            ),
        ).toBe(
            "filled blue regelmäßiges Vieleck mit 5 Seiten with dots and a red border",
        );
    });
});

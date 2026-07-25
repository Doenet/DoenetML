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
        expect(
            describeStrokedShape(
                en,
                { lineWidthWord: "", lineStyleWord: "", colorWord: "" },
                { noun: line, withNoun: false },
            ),
        ).toBe("");
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
        expect(
            describeClosedShape(
                en,
                { ...blueOutline, fillColorWord: "blue", fillStyleWord: "" },
                {
                    filled: false,
                    noun: { key: "regular-polygon", numSides: 5 },
                    withNoun: true,
                },
            ),
        ).toBe("thick blue 5-sided regular polygon");
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
        expect(
            describeClosedShape(
                es,
                { lineWidthWord: "", lineStyleWord: "", colorWord: "green" },
                {
                    filled: false,
                    noun: { key: "regular-polygon", numSides: 7 },
                    withNoun: true,
                },
            ),
        ).toBe("polígono regular de 7 lados verde");
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
